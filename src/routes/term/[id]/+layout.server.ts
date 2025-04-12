import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { course, term } from '$lib/server/db/schema';
import { and, asc, desc, eq } from 'drizzle-orm';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user || !event.locals.profile) return redirect(302, '/login');

	const { id: userId, username } = event.locals.user;
	const { displayName } = event.locals.profile;

	const termsWhere = eq(term.userId, userId);
	const termsOrderBy = desc(term.createdAt);
	const terms = await db.select().from(term).where(termsWhere).orderBy(termsOrderBy);

	const activeTerm = terms.find((term) => term.id === event.params.id);
	if (!activeTerm) return redirect(302, '/term');

	const favoritesWhere = and(eq(course.favorite, true), eq(course.termId, activeTerm.id));
	const favorites = await db.select().from(course).where(favoritesWhere).orderBy(asc(course.name));

	return { terms, activeTerm, favorites, user: { username, name: displayName, avatar: '/' } };
};
