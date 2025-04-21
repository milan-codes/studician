import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { ulid } from 'ulidx';

const scheduleEventTypes = ['ACTIVITY', 'CLASS'] as const;
export const scheduleEventType = pgEnum('event_type', scheduleEventTypes);

export const schedule = pgTable('schedule', {
	id: text().primaryKey().$defaultFn(ulid),
	eventId: text().notNull(),
	eventType: scheduleEventType().notNull(),
	startDateTime: timestamp().notNull(),
	endDateTime: timestamp().notNull(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date())
});

export type Schedule = typeof schedule.$inferSelect;
