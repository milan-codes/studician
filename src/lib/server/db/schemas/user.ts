import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { ulid } from 'ulidx';

export const user = pgTable('user', {
	id: text('id').primaryKey().$defaultFn(ulid),
	age: integer('age'),
	email: text('email').notNull().unique(),
	username: text('username').notNull().unique(),
	password: text('password').notNull(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date())
});

export type User = typeof user.$inferSelect;
