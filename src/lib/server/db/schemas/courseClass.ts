import { pgEnum, pgTable, smallint, text, time, timestamp } from 'drizzle-orm/pg-core';
import { ulid } from 'ulidx';
import { course } from './course';

const courseClassRecurrences = ['WEEKLY', 'BIWEEKLY'] as const;
export const courseClassRecurrence = pgEnum('course_class_recurrence', courseClassRecurrences);

export const courseClass = pgTable('course_class', {
	id: text().primaryKey().$defaultFn(ulid),
	courseId: text()
		.notNull()
		.references(() => course.id),
	name: text().notNull(),
	location: text().notNull(),
	startTime: time().notNull(),
	endTime: time().notNull(),
	dayOfWeek: smallint().notNull(),
	recurrence: courseClassRecurrence().notNull(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date())
});

export type CourseClass = typeof courseClass.$inferSelect;
