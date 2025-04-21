import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { db } from '$lib/server/db';
import { user as userTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { hash, verify } from '@node-rs/argon2';

export const load: PageServerLoad = async (event) => {
	const userId = event.locals.user?.id;
	if (!userId) return redirect(302, '/login');

	return { form: await superValidate(zod(formSchema)) };
};

export const actions: Actions = {
	default: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return message(form, 'Invalid form');
		const { currentPassword, newPassword, newPasswordConfirm } = form.data;

		const accountWhere = eq(userTable.id, userId);
		const [user] = await db
			.select({ password: userTable.password })
			.from(userTable)
			.where(accountWhere)
			.limit(1);

		if (!user.password) return redirect(302, '/login');

		const isValidPassword = await verify(user.password, currentPassword);

		if (!isValidPassword) return message(form, 'Incorrect password', { status: 422 });

		if (newPassword !== newPasswordConfirm)
			return message(form, 'New passwords do not match', { status: 422 });

		const newPasswordHashed = await hash(newPassword);

		await db.update(userTable).set({ password: newPasswordHashed }).where(accountWhere);
	}
};
