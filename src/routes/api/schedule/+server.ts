import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { course, courseSchedule, exam, task, term } from '$lib/server/db/schema';
import { and, eq, getTableColumns, sql } from 'drizzle-orm';

export const GET: RequestHandler = async (event) => {
	if (!event.locals.user)
		return json({ message: 'You must be authorized to access this resource' }, { status: 401 });
	if (!event.locals.profile)
		return json(
			{ message: 'You must complete your profile to access this resource' },
			{ status: 403 }
		);

	const date = event.url.searchParams.get('date');
	const termId = event.url.searchParams.get('termId');
	if (!date || !termId) return json({ message: 'Bad request' }, { status: 400 });

	const selectedDate = date;

	const classesWhere = and(
		sql`${courseSchedule.startTime}::date = ${selectedDate}::date`,
		eq(course.termId, termId),
		eq(term.userId, event.locals.user.id)
	);

	const tasksWhere = and(
		sql`${task.dueDate}::date = ${selectedDate}::date`,
		eq(course.termId, termId),
		eq(term.userId, event.locals.user.id)
	);

	const examsWhere = and(
		sql`${exam.date}::date = ${selectedDate}::date`,
		eq(course.termId, termId),
		eq(term.userId, event.locals.user.id)
	);

	const [classes, tasks, exams] = await Promise.all([
		db
			.select({ ...getTableColumns(courseSchedule), courseName: course.name, color: course.color })
			.from(courseSchedule)
			.innerJoin(course, eq(course.id, courseSchedule.courseId))
			.innerJoin(term, eq(term.id, course.termId))
			.where(classesWhere),
		db
			.select({ ...getTableColumns(task), courseName: course.name, color: course.color })
			.from(task)
			.innerJoin(course, eq(course.id, task.courseId))
			.innerJoin(term, eq(term.id, course.termId))
			.where(tasksWhere),
		db
			.select({ ...getTableColumns(exam), courseName: course.name, color: course.color })
			.from(exam)
			.innerJoin(course, eq(course.id, exam.courseId))
			.innerJoin(term, eq(term.id, course.termId))
			.where(examsWhere)
	]);

	const schedule = {
		classes,
		tasks,
		exams
	};

	return json({ schedule });
};
