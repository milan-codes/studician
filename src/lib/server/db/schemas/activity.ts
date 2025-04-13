import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { ulid } from 'ulidx';
import { term } from './term';

export const activity = pgTable('activity', {
	id: text().primaryKey().$defaultFn(ulid),
	termId: text()
		.notNull()
		.references(() => term.id),
	name: text().notNull(),
	description: text(),
	color: text().notNull(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date())
});

export type Activity = typeof activity.$inferSelect;
