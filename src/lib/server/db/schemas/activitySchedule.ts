import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { ulid } from 'ulidx';
import { activity } from './activity';

export const activitySchedule = pgTable('activity_schedule', {
	id: text().primaryKey().$defaultFn(ulid),
	activityId: text()
		.notNull()
		.references(() => activity.id),
	startTime: timestamp().notNull(),
	endTime: timestamp().notNull(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date())
});

export type ActivitySchedule = typeof activitySchedule.$inferSelect;
