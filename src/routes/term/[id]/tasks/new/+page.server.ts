import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { redirect } from '@sveltejs/kit';
import { and, getTableColumns } from 'drizzle-orm';
import { eq } from 'drizzle-orm';
import { course, notification, task, term } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import type { Actions } from './$types';
import { message } from 'sveltekit-superforms';
import { getDateNDaysAgo } from '$lib/utils';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) return redirect(302, '/login');

	const where = and(eq(term.userId, event.locals.user.id));

	const courses = await db
		.select({ ...getTableColumns(course) })
		.from(course)
		.innerJoin(term, eq(term.id, course.termId))
		.where(where);

	return { form: await superValidate(zod(formSchema)), courses };
};

export const actions: Actions = {
	default: async (event) => {
		const { id: termId } = event.params;
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return message(form, 'Invalid form');

		await db.transaction(async (tx) => {
			const [addedTask] = await tx
				.insert(task)
				.values({ status: 'TODO', ...form.data })
				.returning();

			await tx
				.insert(notification)
				.values({
					resourceId: addedTask.id,
					resourceType: 'TASK',
					deliverAt: getDateNDaysAgo(3, addedTask.dueDate)
				});
		});

		return redirect(302, `/term/${termId}/tasks`);
	}
};
