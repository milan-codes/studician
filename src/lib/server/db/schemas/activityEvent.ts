import { pgTable, text, time, timestamp } from 'drizzle-orm/pg-core';
import { ulid } from 'ulidx';
import { activity } from './activity';

export const activityEvent = pgTable('activity_event', {
	id: text().primaryKey().$defaultFn(ulid),
	activityId: text()
		.notNull()
		.references(() => activity.id),
	startTime: time().notNull(),
	endTime: time().notNull(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date())
});

export type ActivityEvent = typeof activityEvent.$inferSelect;
