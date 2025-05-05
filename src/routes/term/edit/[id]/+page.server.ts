import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { and, eq, getTableColumns, inArray, or } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import type { Actions } from './$types';
import { message } from 'sveltekit-superforms';
import {
	activity,
	activityEvent,
	course,
	courseClass,
	exam,
	note,
	notification,
	schedule,
	task,
	term,
	term as termTable
} from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user || !event.locals.profile) return redirect(302, '/login');

	const termWhere = and(
		eq(termTable.id, event.params.id),
		eq(termTable.userId, event.locals.user.id)
	);
	const [term] = await db.select().from(termTable).where(termWhere).limit(1);

	if (!term) return redirect(302, '/term');

	return { form: await superValidate(term, zod(formSchema)) };
};

export const actions: Actions = {
	update: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return message(form, 'Invalid form');

		const { id } = event.params;

		const termWhere = and(eq(termTable.id, id), eq(termTable.userId, userId));
		await db.update(termTable).set(form.data).where(termWhere);

		return redirect(302, `/term`);
	},
	delete: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');

		const { id } = event.params;

		await db.transaction(async (tx) => {
			const examWhere = and(eq(termTable.userId, userId), eq(course.termId, id));
			const examsToDelete = await tx
				.select(getTableColumns(exam))
				.from(exam)
				.innerJoin(course, eq(course.id, exam.courseId))
				.innerJoin(term, eq(term.id, course.termId))
				.where(examWhere);
			const examIdsToDelete = examsToDelete.map(({ id }) => id);

			const taskWhere = and(eq(termTable.userId, userId), eq(course.termId, id));
			const tasksToDelete = await tx
				.select(getTableColumns(task))
				.from(task)
				.innerJoin(course, eq(course.id, task.courseId))
				.innerJoin(term, eq(term.id, course.termId))
				.where(taskWhere);
			const taskIdsToDelete = tasksToDelete.map(({ id }) => id);

			const noteWhere = and(eq(termTable.userId, userId), eq(course.termId, id));
			const notesToDelete = await tx
				.select(getTableColumns(note))
				.from(note)
				.innerJoin(course, eq(course.id, note.courseId))
				.innerJoin(term, eq(term.id, course.termId))
				.where(noteWhere);
			const noteIdsToDelete = notesToDelete.map(({ id }) => id);

			const courseWhere = and(eq(termTable.userId, userId), eq(course.termId, id));
			const coursesToDelete = await tx
				.select(getTableColumns(course))
				.from(course)
				.innerJoin(term, eq(term.id, course.termId))
				.where(courseWhere);
			const courseIdsToDelete = coursesToDelete.map(({ id }) => id);

			const courseClassWhere = and(eq(termTable.userId, userId), eq(course.termId, id));
			const courseClasssToDelete = await tx
				.select(getTableColumns(courseClass))
				.from(courseClass)
				.innerJoin(course, eq(course.id, courseClass.courseId))
				.innerJoin(term, eq(term.id, course.termId))
				.where(courseClassWhere);
			const courseClassIdsToDelete = courseClasssToDelete.map(({ id }) => id);

			const activityWhere = and(eq(termTable.userId, userId), eq(activity.termId, id));
			const activitysToDelete = await tx
				.select(getTableColumns(activity))
				.from(activity)
				.innerJoin(term, eq(term.id, activity.termId))
				.where(activityWhere);
			const activityIdsToDelete = activitysToDelete.map(({ id }) => id);

			const activityEventWhere = and(eq(termTable.userId, userId), eq(activity.termId, id));
			const activityEventsToDelete = await tx
				.select(getTableColumns(activityEvent))
				.from(activityEvent)
				.innerJoin(activity, eq(activity.id, activityEvent.activityId))
				.innerJoin(term, eq(term.id, activity.termId))
				.where(activityEventWhere);
			const activityEventIdsToDelete = activityEventsToDelete.map(({ id }) => id);

			const notificationDeleteWhere = or(
				inArray(notification.resourceId, examIdsToDelete),
				inArray(notification.resourceId, taskIdsToDelete)
			);
			await tx.delete(notification).where(notificationDeleteWhere);

			const examDeleteWhere = inArray(exam.id, examIdsToDelete);
			await tx.delete(exam).where(examDeleteWhere);

			const taskDeleteWhere = inArray(task.id, taskIdsToDelete);
			await tx.delete(task).where(taskDeleteWhere);

			const noteDeleteWhere = inArray(note.id, noteIdsToDelete);
			await tx.delete(note).where(noteDeleteWhere);

			const scheduleDeleteWhere = or(
				inArray(schedule.eventId, courseClassIdsToDelete),
				inArray(schedule.eventId, activityEventIdsToDelete)
			);
			await tx.delete(schedule).where(scheduleDeleteWhere);

			const courseClassDeleteWhere = inArray(courseClass.id, courseClassIdsToDelete);
			await tx.delete(courseClass).where(courseClassDeleteWhere);

			const courseDeleteWhere = inArray(course.id, courseIdsToDelete);
			await tx.delete(course).where(courseDeleteWhere);

			const activityEventDeleteWhere = inArray(activityEvent.id, activityEventIdsToDelete);
			await tx.delete(activityEvent).where(activityEventDeleteWhere);

			const activityDeleteWhere = inArray(activity.id, activityIdsToDelete);
			await tx.delete(activity).where(activityDeleteWhere);

			const termDeleteWhere = and(eq(termTable.id, id), eq(termTable.userId, userId));
			await tx.delete(term).where(termDeleteWhere);
		});

		return redirect(302, `/term`);
	}
};
