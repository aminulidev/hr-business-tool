import AppShell from '@/components/layout/AppShell';
import CalculatorSkeleton from '@/components/calculators/CalculatorSkeleton';

export default function Loading() {
  return (
    <AppShell>
      <CalculatorSkeleton />
    </AppShell>
  );
}
