import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { formSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { db } from '$lib/server/db';
import * as auth from '$lib/server/auth';
import { eq } from 'drizzle-orm';
import { hash } from '@node-rs/argon2';
import { user as userTable } from '$lib/server/db/schemas/user';

export const load: PageServerLoad = async () => {
	return { form: await superValidate(zod(formSchema)) };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return message(form, 'Invalid form');
		const { email, username, password } = form.data;

		const [emailFound] = await db
			.select()
			.from(userTable)
			.where(eq(userTable.email, email))
			.limit(1);

		if (emailFound) return message(form, 'A user with this email already exists', { status: 422 });

		const [usernameFound] = await db
			.select()
			.from(userTable)
			.where(eq(userTable.username, username))
			.limit(1);

		if (usernameFound)
			return message(form, 'A user with this username already exists', { status: 422 });

		const passwordHash = await hash(password);

		const [user] = await db
			.insert(userTable)
			.values({ email, username, password: passwordHash })
			.returning();

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, user.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(307, '/complete-profile');
	}
};
