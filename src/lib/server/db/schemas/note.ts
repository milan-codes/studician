import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { ulid } from 'ulidx';
import { course } from './course';

export const note = pgTable('note', {
    id: text().primaryKey().$defaultFn(ulid),
    courseId: text()
        .notNull()
        .references(() => course.id),
    name: text().notNull(),
    description: text(),
    content: text().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
        .notNull()
        .defaultNow()
        .$onUpdateFn(() => new Date())
});

export type Note = typeof note.$inferSelect;
