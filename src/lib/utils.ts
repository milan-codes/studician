import { type ClassValue, clsx } from 'clsx';
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
	lengthInMinutes: number,
	recurrence: 'WEEKLY' | 'BIWEEKLY'
) {
	const courseClasses: { startTime: Date; endTime: Date }[] = [];
	const [hours, minutes] = startTime.split(':').map(Number);

	const currentDate = new Date(termStart);
	currentDate.setHours(hours, minutes, 0, 0);

	while (currentDate.getDay() !== dayOfWeek) currentDate.setDate(currentDate.getDate() + 1);

	const recurrenceStep = recurrence === 'WEEKLY' ? 7 : 14;

	while (currentDate <= termEnd) {
		const endDateTime = new Date(currentDate);
		endDateTime.setMinutes(endDateTime.getMinutes() + lengthInMinutes);

		courseClasses.push({
			startTime: new Date(currentDate),
			endTime: endDateTime
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
			startTime: new Date(currentStart),
			endTime: new Date(currentEnd)
		});

		currentStart.setDate(currentStart.getDate() + 7);
		currentEnd.setDate(currentEnd.getDate() + 7);
	}

	return result;
}
