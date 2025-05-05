import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { db } from '$lib/server/db';
import { profile as profileTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const userId = event.locals.user?.id;
	if (!userId) return redirect(302, '/login');

	const profileWhere = eq(profileTable.userId, userId);
	const [profile] = await db.select().from(profileTable).where(profileWhere);

	const parsedProfile = profile
		? { ...profile, displayName: profile.displayName ?? undefined }
		: undefined;

	return { form: await superValidate(parsedProfile, zod(formSchema)) };
};

export const actions: Actions = {
	default: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return message(form, 'Invalid form');
		const { displayName } = form.data;

		const profileWhere = eq(profileTable.userId, userId);
		await db
			.update(profileTable)
			.set({
				userId,
				displayName: displayName ? displayName : null
			})
			.where(profileWhere);
	}
};
