import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { and, eq, inArray, lte } from 'drizzle-orm';
import { exam, term } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { getTableColumns } from 'drizzle-orm';
import { notification, task } from '$lib/server/db/schema';
import { course } from '$lib/server/db/schema';
import type { Actions } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) return redirect(302, '/login');

	const notificationsWhere = and(
		eq(notification.read, false),
		lte(notification.deliverAt, new Date()),
		eq(course.termId, event.params.id),
		eq(term.userId, event.locals.user.id)
	);

	const [taskNotifications, examNotifications] = await Promise.all([
		db
			.select({
				...getTableColumns(task),
				color: course.color,
				deliverAt: notification.deliverAt,
				type: notification.resourceType
			})
			.from(notification)
			.innerJoin(task, eq(task.id, notification.resourceId))
			.innerJoin(course, eq(course.id, task.courseId))
			.innerJoin(term, eq(term.id, course.termId))
			.where(notificationsWhere),
		db
			.select({
				...getTableColumns(exam),
				color: course.color,
				deliverAt: notification.deliverAt,
				type: notification.resourceType
			})
			.from(notification)
			.innerJoin(exam, eq(exam.id, notification.resourceId))
			.innerJoin(course, eq(course.id, exam.courseId))
			.innerJoin(term, eq(term.id, course.termId))
			.where(notificationsWhere)
	]);

	const notifications = [...taskNotifications, ...examNotifications];

	return { notifications };
};

export const actions: Actions = {
	default: async (event) => {
		const { id: termId } = event.params;
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');

		const notificationsWhere = and(
			eq(notification.read, false),
			lte(notification.deliverAt, new Date()),
			eq(course.termId, termId),
			eq(term.userId, userId)
		);
		const [unreadTaskNotifications, unreadExamNotifications] = await Promise.all([
			db
				.select({ id: notification.id })
				.from(notification)
				.innerJoin(task, eq(task.id, notification.resourceId))
				.innerJoin(course, eq(course.id, task.courseId))
				.innerJoin(term, eq(term.id, course.termId))
				.where(notificationsWhere),
			db
				.select({ id: notification.id })
				.from(notification)
				.innerJoin(exam, eq(exam.id, notification.resourceId))
				.innerJoin(course, eq(course.id, exam.courseId))
				.innerJoin(term, eq(term.id, course.termId))
				.where(notificationsWhere)
		]);

		const unreadIds = [
			...unreadTaskNotifications.map((unreadTaskNotification) => unreadTaskNotification.id),
			...unreadExamNotifications.map((unreadExamNotification) => unreadExamNotification.id)
		];

		await db.update(notification).set({ read: true }).where(inArray(notification.id, unreadIds));
	}
};
