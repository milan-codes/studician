import { Metadata } from 'next';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import UserLoginForm from '@/components/user-login-form';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
};

const LoginPage = () => {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute left-4 top-4 md:left-8 md:top-8'
        )}
      >
        <>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight">Studician</h1>
          <p className="text-sm text-muted-foreground">Enter your account information to sign in</p>
        </div>
        <UserLoginForm />
        <div className="flex flex-col md:flex-row justify-between">
          <Link
            href="/register"
            className="text-sm text-muted-foreground hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account?
          </Link>
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground hover:text-brand underline underline-offset-4"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
