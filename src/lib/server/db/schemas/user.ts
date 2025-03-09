import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { ulid } from 'ulidx';

export const user = pgTable('user', {
	id: text().primaryKey().$defaultFn(ulid),
	age: integer(),
	email: text().notNull().unique(),
	username: text().notNull().unique(),
	password: text().notNull(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date())
});

export type User = typeof user.$inferSelect;
