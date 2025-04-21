import { redirect } from '@sveltejs/kit';
import type { Task } from '$lib/server/db/schemas/task';
import type { Exam } from '$lib/server/db/schemas/exam';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { db } from '$lib/server/db';
import { activity, activityEvent, schedule, term } from '$lib/server/db/schema';
import { and, eq, getTableColumns } from 'drizzle-orm';
import type { Actions } from './$types';
import { message } from 'sveltekit-superforms';
import { generateActivitySchedule } from '$lib/utils';

type CourseInformation = { courseName: string; color: string };
type Schedule = {
	schedule: {
		classes: {
			id: string;
			startDateTime: Date;
			endDateTime: Date;
			courseId: string;
			courseName: string;
			courseClassName: string;
			location: string;
			color: string;
		}[];
		tasks: (Task & CourseInformation)[];
		exams: (Exam & CourseInformation)[];
		activities: {
			id: string;
			startDateTime: Date;
			endDateTime: Date;
			activityId: string;
			activityName: string;
			color: string;
		}[];
	};
};

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user || !event.locals.profile) return redirect(302, '/login');

	const response = await event.fetch(`/api/schedule?termId=${event.params.id}`, {
		method: 'GET'
	});

	const { schedule: userSchedule } = (await response.json()) as Schedule;

	const activityWhere = and(
		eq(activity.termId, event.params.id),
		eq(term.userId, event.locals.user.id)
	);
	const activities = await db
		.select(getTableColumns(activity))
		.from(activity)
		.innerJoin(term, eq(term.id, activity.termId))
		.where(activityWhere);

	return { activities, form: await superValidate(zod(formSchema)), schedule: userSchedule };
};

export const actions: Actions = {
	default: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return message(form, 'Invalid form');

		const { activityId, ...restOfFormData } = form.data;
		const startTime = restOfFormData.startTime.toTimeString().split(' ')[0];
		const endTime = restOfFormData.endTime.toTimeString().split(' ')[0];

		const [createdActivityEvent] = await db
			.insert(activityEvent)
			.values({ activityId, startTime, endTime })
			.returning();

		if (!form.data.repeatsWeekly) {
			await db.insert(schedule).values({
				startDateTime: form.data.startTime,
				endDateTime: form.data.endTime,
				eventId: createdActivityEvent.id,
				eventType: 'ACTIVITY'
			});
			return;
		}
		const activeTermWhere = and(eq(term.id, event.params.id), eq(term.userId, userId));
		const [activeTerm] = await db.select().from(term).where(activeTermWhere).limit(1);

		if (!activeTerm) return message(form, 'Invalid term');

		const activitySchedule = generateActivitySchedule(
			form.data.startTime,
			form.data.endTime,
			activeTerm.classEndDate
		).map((scheduleWithoutActivityId) => ({
			...scheduleWithoutActivityId,
			eventId: createdActivityEvent.id,
			eventType: 'ACTIVITY' as const
		}));

		await db.insert(schedule).values(activitySchedule);
	}
};
