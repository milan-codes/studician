import { verify } from '@node-rs/argon2';
import { redirect } from '@sveltejs/kit';
import { eq, or } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { formSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { user as userTable } from '$lib/server/db/schemas/user';
import { profile as profileTable } from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user && event.locals.profile?.complete) return redirect(302, '/profile');
	else if (event.locals.user && !event.locals.profile?.complete)
		return redirect(302, '/complete-profile');
	return { form: await superValidate(zod(formSchema)) };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return message(form, 'Invalid form');
		const { usernameOrEmail, password } = form.data;

		const [userWithProfile] = await db
			.select()
			.from(userTable)
			.leftJoin(profileTable, eq(userTable.id, profileTable.userId))
			.where(or(eq(userTable.username, usernameOrEmail), eq(userTable.email, usernameOrEmail)));
		if (!userWithProfile) return message(form, 'Incorrect username or password', { status: 422 });

		const validPassword = await verify(userWithProfile.user.password, password);
		if (!validPassword) return message(form, 'Incorrect username or password', { status: 422 });

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, userWithProfile.user.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		if (userWithProfile.profile?.complete) return redirect(302, '/term');
		else return redirect(302, '/complete-profile');
	}
};
