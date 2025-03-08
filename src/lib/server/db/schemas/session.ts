import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { ulid } from 'ulidx';
import { user } from './user';

export const session = pgTable('session', {
	id: text('id').primaryKey().$defaultFn(ulid),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export type Session = typeof session.$inferSelect;
