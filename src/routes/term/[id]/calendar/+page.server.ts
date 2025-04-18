import { redirect } from '@sveltejs/kit';
import type { CourseSchedule } from '$lib/server/db/schemas/courseSchedule';
import type { Task } from '$lib/server/db/schemas/task';
import type { Exam } from '$lib/server/db/schemas/exam';
import type { PageServerLoad } from './$types';

type CourseInformation = { courseName: string; color: string };
type Schedule = {
	schedule: {
		classes: (CourseSchedule & CourseInformation)[];
		tasks: (Task & CourseInformation)[];
		exams: (Exam & CourseInformation)[];
	};
};

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user || !event.locals.profile) return redirect(302, '/login');

	const response = await event.fetch(`/api/schedule?termId=${event.params.id}`, {
		method: 'GET'
	});

	const { schedule } = (await response.json()) as Schedule;

	return { schedule };
};
