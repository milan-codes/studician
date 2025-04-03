import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { ulid } from 'ulidx';
import { course } from './course';

export const exam = pgTable('exam', {
    id: text().primaryKey().$defaultFn(ulid),
    courseId: text()
        .notNull()
        .references(() => course.id),
    name: text().notNull(),
    description: text(),
    date: timestamp().notNull(),
    length: integer().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
        .notNull()
        .defaultNow()
        .$onUpdateFn(() => new Date())
});

export type Exam = typeof exam.$inferSelect;
