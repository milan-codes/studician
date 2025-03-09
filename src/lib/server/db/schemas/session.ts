import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { ulid } from 'ulidx';
import { user } from './user';

export const session = pgTable('session', {
	id: text().primaryKey().$defaultFn(ulid),
	userId: text()
		.notNull()
		.references(() => user.id),
	createdAt: timestamp().notNull().defaultNow(),
	expiresAt: timestamp({ withTimezone: true, mode: 'date' }).notNull()
});

export type Session = typeof session.$inferSelect;
