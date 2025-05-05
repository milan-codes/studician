import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { count, desc, eq } from 'drizzle-orm';
import { term } from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) return redirect(302, '/login');

	const where = eq(term.userId, event.locals.user.id);
	const orderBy = desc(term.createdAt);

	const [terms, [total]] = await Promise.all([
		db.select().from(term).where(where).orderBy(orderBy),
		db.select({ count: count() }).from(term).where(where)
	]);

	return { terms, total: total.count };
};
