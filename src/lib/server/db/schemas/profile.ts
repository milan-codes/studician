import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { ulid } from 'ulidx';
import { user } from './user';

export const profile = pgTable('profile', {
	id: text('id').primaryKey().$defaultFn(ulid),
	userId: text('user_id')
		.notNull()
		.unique()
		.references(() => user.id),
	displayName: text('display_name'),
	bio: text('bio'),
	verified: boolean().notNull().default(false),
	complete: boolean('profile_complete').notNull().default(false),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date())
});

export type Profile = typeof profile.$inferSelect;
