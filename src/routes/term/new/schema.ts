import { z } from 'zod';

export const formSchema = z.object({
	startDate: z.date(),
	classEndDate: z.date(),
	examPeriodEndDate: z.date()
});

export type FormSchema = typeof formSchema;
