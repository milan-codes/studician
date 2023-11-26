import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div>
      <Button>Sign up</Button>
      <Button variant="secondary">Sign in</Button>
      <ModeToggle />
    </div>
  );
}
