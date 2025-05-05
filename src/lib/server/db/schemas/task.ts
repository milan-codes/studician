import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { ulid } from 'ulidx';
import { course } from './course';

const status = ['TODO', 'DONE'] as const;

export const taskStatus = pgEnum('status', status);

export const task = pgTable('task', {
    id: text().primaryKey().$defaultFn(ulid),
    courseId: text()
        .notNull()
        .references(() => course.id),
    name: text().notNull(),
    description: text(),
    dueDate: timestamp().notNull(),
    estimatedLength: integer().notNull(),
    status: taskStatus().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
        .notNull()
        .defaultNow()
        .$onUpdateFn(() => new Date())
});

export type Task = typeof task.$inferSelect;
