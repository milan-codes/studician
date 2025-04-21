import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import {
	courseClass as courseClassTable,
	course as courseTable,
	exam as examTable,
	note as noteTable,
	schedule as scheduleTable,
	task as taskTable,
	term as termTable
} from '$lib/server/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
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
	update: async (event) => {
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
	},
	delete: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');

		const { courseId } = event.params;

		await db.transaction(async (tx) => {
			const taskWhere = eq(taskTable.courseId, courseId);
			const examWhere = eq(examTable.courseId, courseId);
			const noteWhere = eq(noteTable.courseId, courseId);
			const courseClassWhere = eq(courseClassTable.courseId, courseId);

			await Promise.all([
				tx.delete(taskTable).where(taskWhere),
				tx.delete(examTable).where(examWhere),
				tx.delete(noteTable).where(noteWhere)
			]);

			const deletedCourseClasses = await tx
				.delete(courseClassTable)
				.where(courseClassWhere)
				.returning({ id: courseClassTable.id });

			const deletedCourseClassIds = deletedCourseClasses.map(
				(deletedCourseClass) => deletedCourseClass.id
			);
			const scheduleWhere = inArray(scheduleTable.eventId, deletedCourseClassIds);
			await tx.delete(scheduleTable).where(scheduleWhere);

			const courseWhere = eq(courseTable.id, courseId);
			await tx.delete(courseTable).where(courseWhere);
		});
	}
};
