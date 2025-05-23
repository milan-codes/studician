import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { db } from '$lib/server/db';
import { profile as profileTable } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	return { form: await superValidate(zod(formSchema)) };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return message(form, 'Invalid form');
		const { displayName } = form.data;
		const userId = event.locals.user?.id;

		if (!userId) return redirect(302, '/login');

		await db.insert(profileTable).values({
			userId,
			displayName: displayName ? displayName : null,
			complete: true
		});

		return redirect(307, '/term');
	}
};
