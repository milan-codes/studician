import { z } from 'zod';

export const formSchema = z.object({
    courseId: z.string().trim().min(1, { message: 'The course cannot be empty' }),
    name: z.string().trim().min(1, { message: 'The name of the exam cannot be empty' }),
    description: z.string().optional(),
    content: z.string().trim().min(1, { message: 'The contents of the note cannot be empty' }),
});

export type FormSchema = typeof formSchema