import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { count, desc, eq } from 'drizzle-orm';
import { course, term } from '$lib/server/db/schema';
import { and } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) return redirect(302, '/login');

	const where = and(eq(term.userId, event.locals.user.id));
	const orderBy = desc(course.updatedAt);

	const [courses, [total]] = await Promise.all([
		db
			.select()
			.from(course)
			.innerJoin(term, eq(term.id, course.termId))
			.where(where)
			.orderBy(orderBy),
		db
			.select({ count: count() })
			.from(course)
			.innerJoin(term, eq(term.id, course.termId))
			.where(where)
	]);

	const coursesWithoutTerms = courses.map(({ course }) => course);

	return { courses: coursesWithoutTerms, total: total.count };
};
