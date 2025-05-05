import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import {
	activity,
	course,
	schedule,
	exam,
	task,
	term,
	courseClass,
	activityEvent
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
		date ? sql`${schedule.startDateTime}::date = ${selectedDate}::date` : undefined,
		eq(schedule.eventType, 'CLASS'),
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

	const activitiesWhere = and(
		date ? sql`${schedule.startDateTime}::date = ${selectedDate}::date` : undefined,
		eq(schedule.eventType, 'ACTIVITY'),
		eq(activity.termId, termId),
		eq(term.userId, event.locals.user.id)
	);

	const [classes, tasks, exams, activities] = await Promise.all([
		db
			.select({
				id: schedule.id,
				startDateTime: schedule.startDateTime,
				endDateTime: schedule.endDateTime,
				courseId: course.id,
				courseName: course.name,
				courseClassName: courseClass.name,
				location: courseClass.location,
				color: course.color
			})
			.from(schedule)
			.innerJoin(courseClass, eq(courseClass.id, schedule.eventId))
			.innerJoin(course, eq(course.id, courseClass.courseId))
			.innerJoin(term, eq(term.id, course.termId))
			.where(classesWhere)
			.orderBy(asc(schedule.startDateTime), asc(course.name)),
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
				id: schedule.id,
				startDateTime: schedule.startDateTime,
				endDateTime: schedule.endDateTime,
				activityId: activity.id,
				activityName: activity.name,
				color: activity.color
			})
			.from(schedule)
			.innerJoin(activityEvent, eq(activityEvent.id, schedule.eventId))
			.innerJoin(activity, eq(activity.id, activityEvent.activityId))
			.innerJoin(term, eq(term.id, activity.termId))
			.where(activitiesWhere)
			.orderBy(asc(schedule.startDateTime), asc(activity.name))
	]);

	const mergedSchedule = {
		classes,
		tasks,
		exams,
		activities
	};

	return json({ schedule: mergedSchedule });
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
		const scheduleWhere = eq(schedule.id, id);
		await db
			.update(schedule)
			.set({ startDateTime: new Date(start), endDateTime: new Date(end) })
			.where(scheduleWhere);
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
		const scheduleWhere = eq(schedule.id, id);
		await db
			.update(schedule)
			.set({ startDateTime: new Date(start), endDateTime: new Date(end) })
			.where(scheduleWhere);
	}

	return new Response(null, { status: 204 });
};
