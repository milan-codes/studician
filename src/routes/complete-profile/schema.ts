import { z } from 'zod';

export const formSchema = z.object({
	displayName: z
		.string()
		.trim()
		.max(30, { message: 'Display name cannot be longer than 30 characters' })
});
export type FormSchema = typeof formSchema;
