import { type ClassValue, clsx } from 'clsx';
import humanizeDuration from 'humanize-duration';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(
	date: Date,
	locale = 'en-US',
	options?: Intl.DateTimeFormatOptions
): string {
	const defaultOptions: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	};

	return date.toLocaleDateString(locale, options ?? defaultOptions);
}

export const formatTime = (date: string | Date | null) => {
	const timeOptions = {
		hour: '2-digit',
		minute: '2-digit'
	} as const;
	if (typeof date === 'string') return new Date(date).toLocaleTimeString(undefined, timeOptions);
	return date ? date.toLocaleTimeString(undefined, timeOptions) : '';
};

export function generateCourseSchedule(
	termStart: Date,
	termEnd: Date,
	dayOfWeek: number,
	startTime: string,
	endTime: string,
	recurrence: 'WEEKLY' | 'BIWEEKLY'
) {
	const courseClasses: { startDateTime: Date; endDateTime: Date }[] = [];
	const [startHours, startMinutes] = startTime.split(':').map(Number);
	const [endHours, endMinutes] = endTime.split(':').map(Number);

	const currentDate = new Date(termStart);
	currentDate.setHours(startHours, startMinutes, 0, 0);

	while (currentDate.getDay() !== dayOfWeek) currentDate.setDate(currentDate.getDate() + 1);

	const recurrenceStep = recurrence === 'WEEKLY' ? 7 : 14;

	while (currentDate <= termEnd) {
		const endDateTime = new Date(currentDate);
		endDateTime.setHours(endHours, endMinutes);

		courseClasses.push({
			startDateTime: new Date(currentDate),
			endDateTime
		});

		currentDate.setDate(currentDate.getDate() + recurrenceStep);
	}

	return courseClasses;
}

export function generateActivitySchedule(startTime: Date, endTime: Date, until: Date) {
	const result = [];

	const currentStart = new Date(startTime);
	const currentEnd = new Date(endTime);

	while (currentStart <= until) {
		result.push({
			startDateTime: new Date(currentStart),
			endDateTime: new Date(currentEnd)
		});

		currentStart.setDate(currentStart.getDate() + 7);
		currentEnd.setDate(currentEnd.getDate() + 7);
	}

	return result;
}

export function getDateNDaysAgo(n: number, date?: Date, setToMidnight?: boolean): Date {
	const baseDate = date ? new Date(date) : new Date();
	const pastDate = new Date(baseDate);
	pastDate.setDate(baseDate.getDate() - n);
	if (setToMidnight) pastDate.setHours(0, 0, 0, 0);
	return pastDate;
}

export const getTimeElapsed = (startDate: Date, endDate: Date | null) => {
	const start = new Date(startDate);
	const end = endDate ? new Date(endDate) : new Date();
	start.setSeconds(0, 0);
	end.setSeconds(0, 0);
	return Math.abs(end.getTime() - start.getTime());
};

export const getHumanizedTimeElapsed = (
	startDate: Date,
	endDate: Date | null,
	options?: humanizeDuration.Options
) => {
	const timeElapsed = getTimeElapsed(startDate, endDate);
	const humanizeDurationOptions = options ?? {
		language: 'en',
		round: true,
		units: ['d']
	};
	return humanizeDuration(timeElapsed, humanizeDurationOptions);
};
