import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { Task } from '$lib/server/db/schemas/task';
import type { Exam } from '$lib/server/db/schemas/exam';

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
	};
};

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user || !event.locals.profile) return redirect(302, '/login');

	const response = await event.fetch(
		`/api/schedule?date=${new Date().toDateString()}&termId=${event.params.id}`,
		{
			method: 'GET'
		}
	);

	const { schedule } = (await response.json()) as Schedule;

	return { schedule };
};
