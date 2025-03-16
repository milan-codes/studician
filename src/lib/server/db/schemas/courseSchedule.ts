import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { ulid } from 'ulidx';
import { course } from './course';

export const courseSchedule = pgTable('course_schedule', {
	id: text().primaryKey().$defaultFn(ulid),
	courseId: text()
		.notNull()
		.references(() => course.id),
	name: text().notNull(),
	location: text().notNull(),
	startTime: timestamp().notNull(),
	endTime: timestamp().notNull(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date())
});

export type CourseSchedule = typeof courseSchedule.$inferSelect;
