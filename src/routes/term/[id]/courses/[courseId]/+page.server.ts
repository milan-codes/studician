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
import type { Schedule } from '$lib/server/db/schemas/schedule';
import { generateCourseSchedule } from '$lib/utils';

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

	const courseClassesWhere = eq(courseClassTable.courseId, course.id);
	const courseClasses = await db.select().from(courseClassTable).where(courseClassesWhere);

	const coursesWithClasses = {
		...courseWithoutNullValues,
		classes: courseClasses.map((courseClass) => ({
			...courseClass,
			dayOfWeek: courseClass.dayOfWeek.toString()
		}))
	};

	return { form: await superValidate(coursesWithClasses, zod(formSchema)) };
};

export const actions: Actions = {
	update: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return message(form, 'Invalid form');

		const { id: termId, courseId } = event.params;

		const { classes, ...formData } = form.data;

		const parsedCourse = {
			...formData,
			description: formData.description ? formData.description : null
		};

		await db.transaction(async (tx) => {
			const previousCourseClassesWhere = eq(courseClassTable.courseId, courseId);
			const previousCourseClasses = await tx
				.select({ id: courseClassTable.id })
				.from(courseClassTable)
				.where(previousCourseClassesWhere);
			const previousCourseClassIds = previousCourseClasses.map(
				(previousCourseClass) => previousCourseClass.id
			);

			const scheduleWhere = inArray(scheduleTable.eventId, previousCourseClassIds);
			await tx.delete(scheduleTable).where(scheduleWhere);

			const courseClassWhere = eq(courseClassTable.courseId, courseId);
			await tx.delete(courseClassTable).where(courseClassWhere);

			const parsedClasses = classes.map((parsedClass) => ({
				...parsedClass,
				courseId,
				dayOfWeek: +parsedClass.dayOfWeek
			}));

			const courseClasses = await tx.insert(courseClassTable).values(parsedClasses).returning();

			const activeTermWhere = eq(termTable.id, termId);
			const [activeTerm] = await tx.select().from(termTable).where(activeTermWhere).limit(1);

			const schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>[] = [];
			for (const courseClass of courseClasses) {
				const courseSchedule = generateCourseSchedule(
					activeTerm.startDate,
					activeTerm.classEndDate,
					courseClass.dayOfWeek,
					courseClass.startTime,
					courseClass.endTime,
					courseClass.recurrence
				);
				const scheduleWithCourseData = courseSchedule.map((courseEvent) => ({
					eventId: courseClass.id,
					eventType: 'CLASS' as const,
					...courseEvent
				}));
				schedule.push(...scheduleWithCourseData);
			}

			await tx.insert(scheduleTable).values(schedule);

			const courseWhere = and(eq(courseTable.id, courseId), eq(courseTable.termId, termId));
			await tx.update(courseTable).set(parsedCourse).where(courseWhere);
		});

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
