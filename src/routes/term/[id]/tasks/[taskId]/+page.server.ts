import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { course as courseTable } from '$lib/server/db/schema';
import { and, eq, getTableColumns } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import type { Actions } from './$types';
import { message } from 'sveltekit-superforms';
import { task as taskTable } from '$lib/server/db/schema';
import { term as termTable } from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user || !event.locals.profile) return redirect(302, '/login');

	const taskWhere = and(
		eq(taskTable.id, event.params.taskId),
		eq(courseTable.termId, event.params.id)
	);
	const [task] = await db
		.select({ ...getTableColumns(taskTable) })
		.from(taskTable)
		.innerJoin(courseTable, eq(courseTable.id, taskTable.courseId))
		.where(taskWhere)
		.limit(1);

	if (!task) return redirect(302, `/term/${event.params.id}/tasks`);

	const courseWhere = and(eq(termTable.userId, event.locals.user.id));

	const courses = await db
		.select({ ...getTableColumns(courseTable) })
		.from(courseTable)
		.innerJoin(termTable, eq(termTable.id, courseTable.termId))
		.where(courseWhere);

	const taskWithoutNullValues = {
		...task,
		description: task.description ?? undefined
	};

	return { form: await superValidate(taskWithoutNullValues, zod(formSchema)), courses };
};

export const actions: Actions = {
	update: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return message(form, 'Invalid form');

		const { id: termId, taskId } = event.params;

		const parsedTask = {
			...form.data,
			description: form.data.description ? form.data.description : null
		};

		const where = and(eq(taskTable.id, taskId));
		await db.update(taskTable).set(parsedTask).where(where);

		return redirect(302, `/term/${termId}/tasks`);
	},
	delete: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');

		const { taskId } = event.params;

		const where = eq(taskTable.id, taskId);
		await db.delete(taskTable).where(where);
	}
};
