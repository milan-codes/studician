import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { db } from '$lib/server/db';
import { user as userTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const userId = event.locals.user?.id;
	if (!userId) return redirect(302, '/login');

	const accountWhere = eq(userTable.id, userId);
	const [account] = await db
		.select({ email: userTable.email, username: userTable.username })
		.from(userTable)
		.where(accountWhere);

	return { form: await superValidate(account, zod(formSchema)) };
};

export const actions: Actions = {
	default: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return message(form, 'Invalid form');
		const { email, username } = form.data;

		const accountWhere = eq(userTable.id, userId);

		const [emailFound] = await db
			.select()
			.from(userTable)
			.where(eq(userTable.email, email))
			.limit(1);

		if (emailFound && emailFound.email !== email)
			return message(form, 'A user with this email already exists', { status: 422 });
		else await db.update(userTable).set({ email }).where(accountWhere);

		const [userFound] = await db
			.select()
			.from(userTable)
			.where(eq(userTable.username, username))
			.limit(1);

		if (userFound && userFound.username !== username)
			return message(form, 'A user with this username already exists', { status: 422 });
		else await db.update(userTable).set({ username }).where(accountWhere);
	}
};
