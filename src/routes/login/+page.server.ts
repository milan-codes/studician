import { verify } from '@node-rs/argon2';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { formSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { user as userTable } from '$lib/server/db/schemas/user';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/profile');
	}
	return { form: await superValidate(zod(formSchema)) };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return message(form, 'Invalid form');
		const { username, password } = form.data;

		const [user] = await db.select().from(userTable).where(eq(userTable.username, username));
		if (!user) return message(form, 'Incorrect username or password', { status: 422 });

		const validPassword = await verify(user.password, password);
		if (!validPassword) return message(form, 'Incorrect username or password', { status: 422 });

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, user.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/profile');
	}
};
