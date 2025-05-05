import { z } from 'zod';

export const formSchema = z.object({
	usernameOrEmail: z.string().trim().min(1, { message: 'Username or email cannot be empty' }),
	password: z.string().trim().min(1, { message: 'Password cannot be empty' })
});

export type FormSchema = typeof formSchema;
