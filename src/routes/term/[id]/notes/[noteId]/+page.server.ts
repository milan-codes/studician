import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { course, course as courseTable } from '$lib/server/db/schema';
import { and, eq, getTableColumns } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import type { Actions } from './$types';
import { message } from 'sveltekit-superforms';
import { note as noteTable } from '$lib/server/db/schema';
import { term as termTable } from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user || !event.locals.profile) return redirect(302, '/login');

	const noteWhere = and(
		eq(noteTable.id, event.params.noteId),
		eq(courseTable.termId, event.params.id)
	);
	const [note] = await db
		.select({ ...getTableColumns(noteTable) })
		.from(noteTable)
		.innerJoin(courseTable, eq(courseTable.id, noteTable.courseId))
		.where(noteWhere)
		.limit(1);

	if (!note) return redirect(302, `/term/${event.params.id}/notes`);

	const courseWhere = and(
		eq(course.termId, event.params.id),
		eq(termTable.userId, event.locals.user.id)
	);

	const courses = await db
		.select({ ...getTableColumns(courseTable) })
		.from(courseTable)
		.innerJoin(termTable, eq(termTable.id, courseTable.termId))
		.where(courseWhere);

	const noteWithoutNullValues = {
		...note,
		description: note.description ?? undefined
	};

	return { form: await superValidate(noteWithoutNullValues, zod(formSchema)), courses };
};

export const actions: Actions = {
	update: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return message(form, 'Invalid form');

		const { id: termId, noteId } = event.params;

		const parsedNote = {
			...form.data,
			description: form.data.description ? form.data.description : null
		};

		const where = and(eq(noteTable.id, noteId));
		await db.update(noteTable).set(parsedNote).where(where);

		return redirect(302, `/term/${termId}/notes`);
	},
	delete: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');

		const { noteId } = event.params;

		const where = eq(noteTable.id, noteId);
		await db.delete(noteTable).where(where);
	}
};
