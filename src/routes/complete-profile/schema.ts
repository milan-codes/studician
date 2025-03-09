import { z } from 'zod';

export const formSchema = z.object({
	displayName: z
		.string()
		.trim()
		.max(30, { message: 'Display name cannot be longer than 30 characters' }),
	bio: z.string().trim().max(150, { message: 'Bio cannot be longer than 150 characters' })
});
export type FormSchema = typeof formSchema;
