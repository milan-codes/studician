import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user || !event.locals.profile) return redirect(302, '/login');

	const { id: userId, username } = event.locals.user;
	const { displayName } = event.locals.profile;

	return { user: { username, name: displayName, avatar: '/' } };
};
