import { verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/profile');
	}
	return { form: await superValidate(zod(formSchema)) };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return fail(400, { form });
		const { username, password } = form.data;

		const [user] = await db.select().from(table.user).where(eq(table.user.username, username));
		if (!user) return fail(400, { message: 'Incorrect username or password' });

		const validPassword = await verify(user.password, password);
		if (!validPassword) return fail(400, { message: 'Incorrect username or password' });

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, user.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/profile');
	}
};
