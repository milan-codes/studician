import { ModeToggle } from '@/components/mode-toggle';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Button>Sign up</Button>
      <Link href={'/login'} className={cn(buttonVariants({ variant: 'default' }))}>
        Log in
      </Link>
      <ModeToggle />
    </div>
  );
}
