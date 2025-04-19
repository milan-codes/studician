import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import {
	activity,
	activitySchedule,
	course,
	courseSchedule,
	exam,
	task,
	term
} from '$lib/server/db/schema';
import { and, asc, eq, getTableColumns, sql } from 'drizzle-orm';

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
	if (!termId) return json({ message: 'Bad request' }, { status: 400 });

	const selectedDate = date;

	const classesWhere = and(
		date ? sql`${courseSchedule.startTime}::date = ${selectedDate}::date` : undefined,
		eq(course.termId, termId),
		eq(term.userId, event.locals.user.id)
	);

	const tasksWhere = and(
		date ? sql`${task.dueDate}::date = ${selectedDate}::date` : undefined,
		eq(course.termId, termId),
		eq(term.userId, event.locals.user.id)
	);

	const examsWhere = and(
		date ? sql`${exam.date}::date = ${selectedDate}::date` : undefined,
		eq(course.termId, termId),
		eq(term.userId, event.locals.user.id)
	);

	const activityScheduleWhere = and(
		date ? sql`${activitySchedule.startTime}::date = ${selectedDate}::date` : undefined,
		eq(activity.termId, termId),
		eq(term.userId, event.locals.user.id)
	);

	const [classes, tasks, exams, activities] = await Promise.all([
		db
			.select({ ...getTableColumns(courseSchedule), courseName: course.name, color: course.color })
			.from(courseSchedule)
			.innerJoin(course, eq(course.id, courseSchedule.courseId))
			.innerJoin(term, eq(term.id, course.termId))
			.where(classesWhere)
			.orderBy(asc(courseSchedule.startTime), asc(course.name)),
		db
			.select({ ...getTableColumns(task), courseName: course.name, color: course.color })
			.from(task)
			.innerJoin(course, eq(course.id, task.courseId))
			.innerJoin(term, eq(term.id, course.termId))
			.where(tasksWhere)
			.orderBy(asc(task.dueDate), asc(task.name)),
		db
			.select({ ...getTableColumns(exam), courseName: course.name, color: course.color })
			.from(exam)
			.innerJoin(course, eq(course.id, exam.courseId))
			.innerJoin(term, eq(term.id, course.termId))
			.where(examsWhere)
			.orderBy(asc(exam.date), asc(exam.name)),
		db
			.select({
				...getTableColumns(activitySchedule),
				activityName: activity.name,
				color: activity.color
			})
			.from(activitySchedule)
			.innerJoin(activity, eq(activity.id, activitySchedule.activityId))
			.innerJoin(term, eq(term.id, activity.termId))
			.where(activityScheduleWhere)
			.orderBy(asc(activitySchedule.startTime), asc(activity.name))
	]);

	const schedule = {
		classes,
		tasks,
		exams,
		activities
	};

	return json({ schedule });
};

export const PUT: RequestHandler = async (event) => {
	const { id, start, end, type } = await event.request.json();

	if (!id) return json({ message: 'Id is required' }, { status: 400 });
	if (typeof id !== 'string') return json({ message: 'Id must be a string' }, { status: 400 });

	if (!start) return json({ message: 'Start is required' }, { status: 400 });
	if (typeof start !== 'string')
		return json({ message: 'Start must be a valid date string' }, { status: 400 });

	if (!end) return json({ message: 'End is required' }, { status: 400 });
	if (typeof end !== 'string')
		return json({ message: 'End must be a valid date string' }, { status: 400 });

	if (!type) return json({ message: 'Type is required' }, { status: 400 });
	if (type !== 'class' && type !== 'task' && type !== 'exam' && type !== 'activity')
		return json({ message: 'Type must be either class, task, exam or activity' }, { status: 400 });

	if (type === 'class') {
		const courseScheduleWhere = eq(courseSchedule.id, id);
		await db
			.update(courseSchedule)
			.set({ startTime: new Date(start), endTime: new Date(end) })
			.where(courseScheduleWhere);
	} else if (type === 'task') {
		const taskWhere = eq(task.id, id);
		await db
			.update(task)
			.set({ dueDate: new Date(start) })
			.where(taskWhere);
	} else if (type === 'exam') {
		const examWhere = eq(exam.id, id);
		await db
			.update(exam)
			.set({ date: new Date(start) })
			.where(examWhere);
	} else {
		const activityScheduleWhere = eq(activitySchedule.id, id);
		await db
			.update(activitySchedule)
			.set({ startTime: new Date(start), endTime: new Date(end) })
			.where(activityScheduleWhere);
	}

	return new Response(null, { status: 204 });
};
