import { z } from 'zod';

export const formSchema = z.object({
	email: z
		.string()
		.trim()
		.email({ message: 'Email must be a valid email address' })
		.min(1, { message: 'Email cannot be empty' }),
	username: z
		.string()
		.trim()
		.min(1, { message: 'Username cannot be empty' })
		.max(30, { message: 'Username cannot be longer than 30 characters' }),
	password: z
		.string()
		.trim()
		.min(1, { message: 'Password cannot be empty' })
		.max(30, 'Password cannot be longer than 30 characters')
});

export type FormSchema = typeof formSchema;
