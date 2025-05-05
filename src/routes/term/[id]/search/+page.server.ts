import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { kebabCase, sentenceCase } from 'change-case';
import { and, eq, getTableColumns, ilike, sql } from 'drizzle-orm';
import { activity, course, exam, task, term } from '$lib/server/db/schema';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async (event) => {
	const userId = event.locals.user?.id;
	if (!userId) return redirect(302, '/login');

	const query = event.url.searchParams.get('q');
	const parsedQuery = sentenceCase(query ?? '');

	const courseWhere = and(
		eq(course.termId, event.params.id),
		ilike(course.name, `%${parsedQuery}%`),
		eq(term.userId, userId)
	);
	const taskWhere = and(
		eq(course.termId, event.params.id),
		ilike(task.name, `%${parsedQuery}%`),
		eq(term.userId, userId)
	);
	const examWhere = and(
		eq(course.termId, event.params.id),
		ilike(exam.name, `%${parsedQuery}%`),
		eq(term.userId, userId)
	);
	const activityWhere = and(
		eq(activity.termId, event.params.id),
		ilike(activity.name, `%${parsedQuery}%`),
		eq(term.userId, userId)
	);

	const [courses, tasks, exams, activities] = parsedQuery
		? await Promise.all([
				db
					.select({ ...getTableColumns(course), type: sql<string>`'course'` })
					.from(course)
					.innerJoin(term, eq(term.id, course.termId))
					.where(courseWhere),
				db
					.select({ ...getTableColumns(task), color: course.color, type: sql<string>`'task'` })
					.from(task)
					.innerJoin(course, eq(course.id, task.courseId))
					.innerJoin(term, eq(term.id, course.termId))
					.where(taskWhere),
				db
					.select({ ...getTableColumns(exam), color: course.color, type: sql<string>`'exam'` })
					.from(exam)
					.innerJoin(course, eq(course.id, exam.courseId))
					.innerJoin(term, eq(term.id, course.termId))
					.where(examWhere),
				db
					.select({ ...getTableColumns(activity), type: sql<string>`'activity'` })
					.from(activity)
					.innerJoin(term, eq(term.id, activity.termId))
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
