import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { course as courseTable } from '$lib/server/db/schema';
import { and, eq, getTableColumns } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import type { Actions } from './$types';
import { message } from 'sveltekit-superforms';
import { exam as examTable } from '$lib/server/db/schema';
import { term as termTable } from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user || !event.locals.profile) return redirect(302, '/login');

	const examWhere = and(
		eq(examTable.id, event.params.examId),
		eq(courseTable.termId, event.params.id)
	);
	const [exam] = await db
		.select({ ...getTableColumns(examTable) })
		.from(examTable)
		.innerJoin(courseTable, eq(courseTable.id, examTable.courseId))
		.where(examWhere)
		.limit(1);

	if (!exam) return redirect(302, `/term/${event.params.id}/exams`);

	const courseWhere = and(eq(termTable.userId, event.locals.user.id));

	const courses = await db
		.select({ ...getTableColumns(courseTable) })
		.from(courseTable)
		.innerJoin(termTable, eq(termTable.id, courseTable.termId))
		.where(courseWhere);

	const examWithoutNullValues = {
		...exam,
		description: exam.description ?? undefined
	};

	return { form: await superValidate(examWithoutNullValues, zod(formSchema)), courses };
};

export const actions: Actions = {
	update: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return message(form, 'Invalid form');

		const { id: termId, examId } = event.params;

		const parsedExam = {
			...form.data,
			description: form.data.description ? form.data.description : null
		};

		const where = and(eq(examTable.id, examId));
		await db.update(examTable).set(parsedExam).where(where);

		return redirect(302, `/term/${termId}/exams`);
	},
	delete: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');

		const { examId } = event.params;

		const where = eq(examTable.id, examId);
		await db.delete(examTable).where(where);
	}
};
