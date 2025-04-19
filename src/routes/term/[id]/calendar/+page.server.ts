import { redirect } from '@sveltejs/kit';
import type { CourseSchedule } from '$lib/server/db/schemas/courseSchedule';
import type { Task } from '$lib/server/db/schemas/task';
import type { Exam } from '$lib/server/db/schemas/exam';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { db } from '$lib/server/db';
import { activity, activitySchedule, term } from '$lib/server/db/schema';
import { and, eq, getTableColumns } from 'drizzle-orm';
import type { Actions } from './$types';
import { message } from 'sveltekit-superforms';
import type { ActivitySchedule } from '$lib/server/db/schemas/activitySchedule';
import { generateActivitySchedule } from '$lib/utils';

type CourseInformation = { courseName: string; color: string };
type ActivityInformation = { activityName: string; color: string };
type Schedule = {
	schedule: {
		classes: (CourseSchedule & CourseInformation)[];
		tasks: (Task & CourseInformation)[];
		exams: (Exam & CourseInformation)[];
		activities: (ActivitySchedule & ActivityInformation)[];
	};
};

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user || !event.locals.profile) return redirect(302, '/login');

	const response = await event.fetch(`/api/schedule?termId=${event.params.id}`, {
		method: 'GET'
	});

	const { schedule } = (await response.json()) as Schedule;

	const activityWhere = and(
		eq(activity.termId, event.params.id),
		eq(term.userId, event.locals.user.id)
	);
	const activities = await db
		.select(getTableColumns(activity))
		.from(activity)
		.innerJoin(term, eq(term.id, activity.termId))
		.where(activityWhere);

	return { activities, form: await superValidate(zod(formSchema)), schedule };
};

export const actions: Actions = {
	default: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return message(form, 'Invalid form');

		if (!form.data.repeatsWeekly) return await db.insert(activitySchedule).values(form.data);

		const activeTermWhere = and(eq(term.id, event.params.id), eq(term.userId, userId));
		const [activeTerm] = await db.select().from(term).where(activeTermWhere).limit(1);

		if (!activeTerm) return message(form, 'Invalid term');

		const schedule = generateActivitySchedule(
			form.data.startTime,
			form.data.endTime,
			activeTerm.classEndDate
		).map((scheduleWithoutActivityId) => ({
			...scheduleWithoutActivityId,
			activityId: form.data.activityId
		}));

		await db.insert(activitySchedule).values(schedule);
	}
};
