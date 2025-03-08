import { z } from "zod";
 
export const formSchema = z.object({
 username: z.string().trim().min(1, { message: 'Username cannot be empty' }),
 password: z.string().trim().min(1, { message: 'Password cannot be empty' })
});
 
export type FormSchema = typeof formSchema;