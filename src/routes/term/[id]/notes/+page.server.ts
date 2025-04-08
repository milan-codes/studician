import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { and, eq } from "drizzle-orm";
import { term } from "$lib/server/db/schema";
import { db } from "$lib/server/db";
import { getTableColumns } from "drizzle-orm";
import { note } from "$lib/server/db/schema";
import { course } from "$lib/server/db/schema";

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) return redirect(302, '/login');

    const where = and(eq(term.userId, event.locals.user.id));

    const notes = await db
        .select({ ...getTableColumns(note), color: course.color })
        .from(note)
        .innerJoin(course, eq(course.id, note.courseId))
        .innerJoin(term, eq(term.id, course.termId))
        .where(where);

    return { notes };
};