// Not AppShell: a loading file that imports the client shell makes every page download it again (see ShellSkeleton).
import ShellSkeleton from '@/components/layout/ShellSkeleton';
import CalculatorSkeleton from '@/components/calculators/CalculatorSkeleton';

export default function Loading() {
  return (
    <ShellSkeleton>
      <CalculatorSkeleton />
    </ShellSkeleton>
  );
}
