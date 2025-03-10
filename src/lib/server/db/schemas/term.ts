import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { ulid } from 'ulidx';
import { user } from './user';

export const term = pgTable('term', {
	id: text().primaryKey().$defaultFn(ulid),
	userId: text()
		.notNull()
		.references(() => user.id),
	startDate: timestamp().notNull().defaultNow(),
	classEndDate: timestamp().notNull(),
	examPeriodEndDate: timestamp().notNull(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date())
});

export type Term = typeof term.$inferSelect;
