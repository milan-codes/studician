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
