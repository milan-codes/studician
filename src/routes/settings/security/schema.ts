import { z } from 'zod';

export const formSchema = z
	.object({
		currentPassword: z.string(),
		newPassword: z.string().min(8, { message: 'Password must be atleast 8 characters' }),
		newPasswordConfirm: z.string().min(8, { message: 'Password must be atleast 8 characters' })
	})
	.refine((data) => data.currentPassword !== data.newPassword, {
		message: 'New password cannot be the same as old password',
		path: ['newPassword']
	})
	.refine((data) => data.newPassword === data.newPasswordConfirm, {
		message: 'New passwords must match',
		path: ['newPasswordConfirm']
	});
export type FormSchema = typeof formSchema;
