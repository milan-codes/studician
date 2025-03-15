import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { term } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user) return redirect(302, '/login');
	else if (!event.locals.profile?.complete) return redirect(302, '/complete-profile');

	const { id: userId, username } = event.locals.user;
	const { displayName } = event.locals.profile;

	const termsWhere = eq(term.userId, userId);
	const termsOrderBy = desc(term.createdAt);
	const terms = await db.select().from(term).where(termsWhere).orderBy(termsOrderBy);

	const activeTerm = terms.find((term) => term.id === event.params.id);
	if (!activeTerm) return redirect(302, '/term');

	return { terms, activeTerm, user: { username, name: displayName, avatar: '/' } };
};
