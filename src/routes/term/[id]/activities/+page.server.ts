import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { count, desc, eq } from 'drizzle-orm';
import { activity, term } from '$lib/server/db/schema';
import { and, getTableColumns } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) return redirect(302, '/login');

	const where = and(eq(activity.termId, event.params.id), eq(term.userId, event.locals.user.id));
	const orderBy = desc(activity.updatedAt);

	const [activities, [total]] = await Promise.all([
		db
			.select({ ...getTableColumns(activity) })
			.from(activity)
			.innerJoin(term, eq(term.id, activity.termId))
			.where(where)
			.orderBy(orderBy),
		db
			.select({ count: count() })
			.from(activity)
			.innerJoin(term, eq(term.id, activity.termId))
			.where(where)
	]);

	return { activities, total: total.count };
};
