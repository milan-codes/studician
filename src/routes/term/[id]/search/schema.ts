import { z } from 'zod';

export const formSchema = z.object({
	query: z.string().trim().min(1, { message: 'The query cannot be empty' })
});

export type FormSchema = typeof formSchema;
