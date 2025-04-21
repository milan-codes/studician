import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { redirect } from '@sveltejs/kit';
import { and, getTableColumns } from 'drizzle-orm';
import { eq } from 'drizzle-orm';
import { course, note, term } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import type { Actions } from './$types';
import { message } from 'sveltekit-superforms';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) return redirect(302, '/login');

	const where = and(eq(course.termId, event.params.id), eq(term.userId, event.locals.user.id));

	const courses = await db
		.select({ ...getTableColumns(course) })
		.from(course)
		.innerJoin(term, eq(term.id, course.termId))
		.where(where);

	return { form: await superValidate(zod(formSchema)), courses };
};

export const actions: Actions = {
	default: async (event) => {
		const { id: termId } = event.params;
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return message(form, 'Invalid form');

		await db.insert(note).values(form.data);

		return redirect(302, `/term/${termId}/notes`);
	}
};
