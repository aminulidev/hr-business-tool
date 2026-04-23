'use client';

import { Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TryExampleProps {
  label?: string;
  onClick: () => void;
}

export default function TryExample({ label = 'Try an Example', onClick }: TryExampleProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="gap-1.5 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/20 print:hidden"
    >
      <Lightbulb className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}
