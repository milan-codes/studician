import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { ulid } from 'ulidx';
import { user } from './user';

export const profile = pgTable('profile', {
	id: text().primaryKey().$defaultFn(ulid),
	userId: text()
		.notNull()
		.unique()
		.references(() => user.id),
	displayName: text(),
	complete: boolean().notNull().default(false),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date())
});

export type Profile = typeof profile.$inferSelect;
