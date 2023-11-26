'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FormFields } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  emailOrUsername: z.string().min(1, {
    message: 'Email or username is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
});

type FormData = z.infer<typeof formSchema>;

const UserLoginForm = () => {
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailOrUsername: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (formData: FormData) => {
    console.log(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {loginFormFields.map((formField, index) => (
          <FormField
            key={index}
            control={form.control}
            name={formField.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{formField.label}</FormLabel>
                <FormControl>
                  <Input type={formField.type} placeholder={formField.placeholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button className="w-full">Log in</Button>
      </form>
    </Form>
  );
};

const loginFormFields: UserLoginFormFields[] = [
  {
    name: 'emailOrUsername',
    label: 'Email or username',
    placeholder: 'example@example.com',
    type: 'text',
  },
  {
    name: 'password',
    label: 'Password',
    placeholder: '********',
    type: 'password',
  },
];

type UserLoginFormFields = Omit<FormFields, 'name'> & {
  name: keyof FormData;
};

export default UserLoginForm;
