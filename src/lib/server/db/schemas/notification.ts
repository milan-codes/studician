import { boolean, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { ulid } from 'ulidx';

const types = ['TASK', 'EXAM'] as const;

export const notificationType = pgEnum('notification_type', types);

export const notification = pgTable('notification', {
	id: text().primaryKey().$defaultFn(ulid),
	resourceId: text().notNull(),
	resourceType: notificationType().notNull(),
	read: boolean().notNull().default(false),
	deliverAt: timestamp().notNull(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date())
});

export type Notification = typeof notification.$inferSelect;
