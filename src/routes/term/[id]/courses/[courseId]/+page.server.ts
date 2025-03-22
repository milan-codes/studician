import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { course as courseTable, term as termTable } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import type { Actions } from './$types';
import { message } from 'sveltekit-superforms';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user || !event.locals.profile) return redirect(302, '/login');
	const { user } = event.locals;

	const where = and(eq(courseTable.id, event.params.courseId), eq(termTable.userId, user.id));
	const [courseWithTerm] = await db
		.select()
		.from(courseTable)
		.innerJoin(termTable, eq(termTable.id, courseTable.termId))
		.where(where)
		.limit(1);

	if (!courseWithTerm) return redirect(302, `/term/${event.params.id}/courses`);

	const { course } = courseWithTerm;
	const courseWithoutNullValues = {
		...course,
		description: course.description ?? undefined
	};

	return { form: await superValidate(courseWithoutNullValues, zod(formSchema)) };
};

export const actions: Actions = {
	default: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return message(form, 'Invalid form');

		const { id: termId, courseId } = event.params;

		const parsedCourse = {
			...form.data,
			description: form.data.description ? form.data.description : null
		};

		const where = and(eq(courseTable.id, courseId), eq(courseTable.termId, termId));
		await db.update(courseTable).set(parsedCourse).where(where);

		return redirect(302, `/term/${termId}/courses`);
	}
};
