import { json, redirect, type Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
	} else {
		const { session, user, profile } = await auth.validateSessionToken(sessionToken);
		if (session) auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		else auth.deleteSessionTokenCookie(event);

		event.locals.user = user;
		event.locals.session = session;
		event.locals.profile = profile;
	}

	const { pathname } = event.url;
	const { user, profile } = event.locals;

	if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
		if (user && profile?.complete) return redirect(302, '/profile');
		else if (user && !profile?.complete) return redirect(302, '/complete-profile');
	} else if (pathname.startsWith('/complete-profle')) {
		if (!user) return redirect(302, '/login');
		else if (profile?.complete) return redirect(302, '/term');
	} else if (pathname.startsWith('/profile') || pathname.startsWith('/term')) {
		if (!user) return redirect(302, '/login');
		else if (!profile?.complete) return redirect(302, '/complete-profile');
	} else if (pathname.startsWith('/api')) {
		if (!user) return json({ message: 'You must be authorized to access this resource' }, { status: 401 })
	}

	return resolve(event);
};

export const handle: Handle = handleAuth;
