import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { db } from '$lib/server/db';
import {
	courseSchedule as courseScheduleTable,
	course as courseTable,
	term as termTable
} from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { generateCourseSchedule } from '$lib/utils';
import type { CourseSchedule } from '$lib/server/db/schemas/courseSchedule';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) return redirect(302, '/login');
	else if (!event.locals.profile?.complete) return redirect(302, '/complete-profile');
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

			const where = eq(termTable.id, termId);
			const [activeTerm] = await tx.select().from(termTable).where(where).limit(1);

			const schedule: Omit<CourseSchedule, 'id' | 'createdAt' | 'updatedAt'>[] = [];
			for (const courseClass of classes) {
				const courseSchedule = generateCourseSchedule(
					activeTerm.startDate,
					activeTerm.classEndDate,
					+courseClass.dayOfWeek,
					courseClass.time,
					courseClass.length,
					courseClass.recurrence
				);
				const scheduleWithCourseData = courseSchedule.map((courseEvent) => ({
					courseId: course.id,
					name: courseClass.name,
					location: courseClass.location,
					...courseEvent
				}));
				schedule.push(...scheduleWithCourseData);
			}

			await tx.insert(courseScheduleTable).values(schedule);
		});

		return redirect(302, `/term/${termId}/courses`);
	}
};
