import { z } from 'zod';

export const formSchema = z.object({
	activityId: z.string().trim().min(1, { message: 'The activity cannot be empty' }),
	startTime: z.date({ required_error: 'Start time cannot be empty' }),
	endTime: z.date({ required_error: 'End time cannot be empty' }),
	repeatsWeekly: z.boolean()
});

export type FormSchema = typeof formSchema;
