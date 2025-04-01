import { z } from 'zod';

export const formSchema = z.object({
    courseId: z.string().trim().min(1, { message: 'The course cannot be empty' }),
    name: z.string().trim().min(1, { message: 'The name of the task cannot be empty' }),
    description: z.string().optional(),
    dueDate: z.date({ required_error: 'Due date cannot be empty' }),
    estimatedLength: z
        .number({ invalid_type_error: 'Estimated length must be a number' })
        .int({ message: 'Estimated length must be an integer' })
        .min(1, { message: 'Estimated length can only be a positive integer' }),
});

export type FormSchema = typeof formSchema