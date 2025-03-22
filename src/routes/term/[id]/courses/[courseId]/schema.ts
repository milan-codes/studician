import { z } from 'zod';

export const formSchema = z.object({
	name: z.string().trim().min(1, { message: 'The name of the course cannot be empty' }),
	description: z.string().optional(),
	color: z.string().trim().min(1, { message: 'The color cannot be empty' })
});

export type FormSchema = typeof formSchema;
