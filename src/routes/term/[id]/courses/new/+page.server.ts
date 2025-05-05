import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { db } from '$lib/server/db';
import {
	courseClass as courseClassTable,
	course as courseTable,
	schedule as scheduleTable,
	term as termTable
} from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { generateCourseSchedule } from '$lib/utils';
import type { Schedule } from '$lib/server/db/schemas/schedule';

export const load: PageServerLoad = async () => {
	return { form: await superValidate(zod(formSchema)) };
};

export const actions: Actions = {
	default: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return message(form, 'Invalid form');

		const { id: termId } = event.params;
		const { classes, ...formData } = form.data;

		await db.transaction(async (tx) => {
			const [course] = await tx
				.insert(courseTable)
				.values({ termId, ...formData })
				.returning();

			const parsedClasses = classes.map((parsedClass) => ({
				...parsedClass,
				courseId: course.id,
				dayOfWeek: +parsedClass.dayOfWeek
			}));

			const courseClasses = await tx.insert(courseClassTable).values(parsedClasses).returning();

			const where = eq(termTable.id, termId);
			const [activeTerm] = await tx.select().from(termTable).where(where).limit(1);

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
		});

		return redirect(302, `/term/${termId}/courses`);
	}
};
