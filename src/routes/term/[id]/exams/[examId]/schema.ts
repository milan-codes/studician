import { z } from 'zod';

export const formSchema = z.object({
    courseId: z.string().trim().min(1, { message: 'The course cannot be empty' }),
    name: z.string().trim().min(1, { message: 'The name of the exam cannot be empty' }),
    description: z.string().optional(),
    date: z.date({ required_error: 'Date cannot be empty' }),
    length: z
        .number({ invalid_type_error: 'Length must be a number' })
        .int({ message: 'Length must be an integer' })
        .min(1, { message: 'Length can only be a positive integer' }),
});

export type FormSchema = typeof formSchema