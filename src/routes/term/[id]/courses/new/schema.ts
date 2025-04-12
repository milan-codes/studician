import { z } from 'zod';

export const formSchema = z.object({
	name: z.string().trim().min(1, { message: 'The name of the course cannot be empty' }),
	description: z.string().optional(),
	color: z.string().trim().min(1, { message: 'The color cannot be empty' }),
	favorite: z.boolean(),
	classes: z.array(
		z.object({
			name: z.string().trim().min(1, { message: 'Name cannot be empty' }),
			dayOfWeek: z.string().trim().length(1, { message: 'Day of week must be between 0 and 6' }),
			time: z.string().trim().min(1, { message: 'Time cannot be empty' }),
			length: z
				.number({ invalid_type_error: 'Length cannot be empty' })
				.min(1, { message: 'Length must be a positive number' }),
			location: z.string().trim().min(1, { message: 'Location cannot be empty' }),
			recurrence: z.enum(['WEEKLY', 'BIWEEKLY'])
		})
	)
});

export type FormSchema = typeof formSchema;
