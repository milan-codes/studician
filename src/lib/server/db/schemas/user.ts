import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { ulid } from 'ulidx';

export const user = pgTable('user', {
	id: text('id').primaryKey().$defaultFn(ulid),
	age: integer('age'),
	email: text('email').notNull().unique(),
	username: text('username').notNull().unique(),
	password: text('password').notNull()
});

export type User = typeof user.$inferSelect;
