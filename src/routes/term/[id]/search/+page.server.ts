import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { kebabCase, sentenceCase } from 'change-case';
import { eq, getTableColumns, ilike, sql } from 'drizzle-orm';
import { activity, course, exam, task } from '$lib/server/db/schema';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async (event) => {
	const query = event.url.searchParams.get('q');
	const parsedQuery = sentenceCase(query ?? '');

	const courseWhere = ilike(course.name, `%${parsedQuery}%`);
	const taskWhere = ilike(task.name, `%${parsedQuery}%`);
	const examWhere = ilike(exam.name, `%${parsedQuery}%`);
	const activityWhere = ilike(activity.name, `%${parsedQuery}%`);

	const [courses, tasks, exams, activities] = parsedQuery
		? await Promise.all([
				db
					.select({ ...getTableColumns(course), type: sql<string>`'course'` })
					.from(course)
					.where(courseWhere),
				db
					.select({ ...getTableColumns(task), color: course.color, type: sql<string>`'task'` })
					.from(task)
					.where(taskWhere)
					.innerJoin(course, eq(course.id, task.courseId)),
				db
					.select({ ...getTableColumns(exam), color: course.color, type: sql<string>`'exam'` })
					.from(exam)
					.where(examWhere)
					.innerJoin(course, eq(course.id, exam.courseId)),
				db
					.select({ ...getTableColumns(activity), type: sql<string>`'activity'` })
					.from(activity)
					.where(activityWhere)
			])
		: [[], [], [], []];

	const results = [...courses, ...tasks, ...exams, ...activities];

	return {
		form: await superValidate(parsedQuery ? { query: parsedQuery } : undefined, zod(formSchema)),
		results
	};
};

export const actions: Actions = {
	default: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return message(form, 'Invalid form');

		const { id: termId } = event.params;
		const parsedQuery = kebabCase(form.data.query);

		return redirect(302, `/term/${termId}/search?q=${parsedQuery}`);
	}
};
