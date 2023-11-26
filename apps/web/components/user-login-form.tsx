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
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { setCookie } from 'cookies-next';
import { api } from '@/lib/utils';

const formSchema = z.object({
  emailOrUsername: z.string().min(1, {
    message: 'Email or username is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
});

type FormData = z.infer<typeof formSchema>;

const login = async (formData: FormData) => {
  const response = await fetch(`${api}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  const data = await response.json();

  if (response.status !== 201) {
    throw new Error(data.message);
  }
  setCookie('token', data.token, {
    maxAge: 60 * 60,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

const UserLoginForm = () => {
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailOrUsername: '',
      password: '',
    },
  });

  const { mutate: submitForm, isPending } = useMutation({
    mutationFn: async (formData: FormData) => await login(formData),
    onSuccess: () => {
      toast({ title: 'Logged in successfully' });
    },
    onError: (error: Error) => {
      toast({ variant: 'destructive', title: error.message });
    },
  });

  const onSubmit: SubmitHandler<FormData> = (formData: FormData) => {
    submitForm(formData);
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
        {isPending ? (
          <Button className="w-full" disabled>
            <Loader2 className="w-5 h-5" /> Logging in
          </Button>
        ) : (
          <Button className="w-full">Log in</Button>
        )}
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
