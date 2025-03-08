import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { ulid } from 'ulidx';

export const user = pgTable('user', {
	id: text('id').primaryKey().$defaultFn(ulid),
	age: integer('age'),
	email: text('email').notNull().unique(),
	username: text('username').notNull().unique(),
	password: text('password').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
