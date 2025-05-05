import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import {
	activityEvent as activityEventTable,
	activity as activityTable,
	schedule as scheduleTable,
	term as termTable
} from '$lib/server/db/schema';
import { and, eq, getTableColumns, inArray } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import type { Actions } from './$types';
import { message } from 'sveltekit-superforms';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user || !event.locals.profile) return redirect(302, '/login');
	const { user } = event.locals;

	const where = and(eq(activityTable.id, event.params.activityId), eq(termTable.userId, user.id));
	const [activity] = await db
		.select({ ...getTableColumns(activityTable) })
		.from(activityTable)
		.innerJoin(termTable, eq(termTable.id, activityTable.termId))
		.where(where)
		.limit(1);

	if (!activity) return redirect(302, `/term/${event.params.id}/activities`);

	const activityWithoutNullValues = {
		...activity,
		description: activity.description ?? undefined
	};

	return { form: await superValidate(activityWithoutNullValues, zod(formSchema)) };
};

export const actions: Actions = {
	update: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return message(form, 'Invalid form');

		const { id: termId, activityId } = event.params;

		const parsedActivity = {
			...form.data,
			description: form.data.description ? form.data.description : null
		};

		const where = and(eq(activityTable.id, activityId), eq(activityTable.termId, termId));
		await db.update(activityTable).set(parsedActivity).where(where);

		return redirect(302, `/term/${termId}/activities`);
	},
	delete: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');

		const { activityId } = event.params;

		await db.transaction(async (tx) => {
			const activityEventWhere = eq(activityEventTable.activityId, activityId);
			const deletedActivityEvents = await tx
				.delete(activityEventTable)
				.where(activityEventWhere)
				.returning({ id: activityTable.id });
			const deletedActivityEventIds = deletedActivityEvents.map(
				(deletedActivityEvent) => deletedActivityEvent.id
			);

			const scheduleWhere = inArray(scheduleTable.eventId, deletedActivityEventIds);
			await tx.delete(scheduleTable).where(scheduleWhere);

			const activityWhere = eq(activityTable.id, activityId);
			await tx.delete(activityTable).where(activityWhere);
		});
	}
};
