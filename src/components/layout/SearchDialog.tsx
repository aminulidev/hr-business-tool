'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CommandDialog, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { getPublishedCalculators, categoryOrder } from '@/lib/calculator-meta';
import { searchCalculators, popularCalculators } from '@/lib/search-calculators';

/**
 * The header's search dialog. Header loads this file on first use (hover, focus, click or Ctrl+K)
 * with next/dynamic, because it is the only thing in the site chrome that needs the calculator
 * registry: about 270 kB of JavaScript (57 kB compressed) that every page used to download up front.
 * Keep registry imports out of Header.tsx, AppShell.tsx and Footer.tsx for the same reason.
 */
export default function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setSearch('');
    }
  };

  const handleSelect = (path: string) => {
    onOpenChange(false);
    setSearch('');
    router.push(path);
  };

  const isSearching = search.trim().length > 0;
  const searchResults = isSearching ? searchCalculators(search, getPublishedCalculators()) : [];

  return (
    <CommandDialog
      open={open}
      onOpenChange={handleOpenChange}
      shouldFilter={false}
      title="Search Calculators"
      description="Search for any business or HR calculator"
      showCloseButton={false}
      className="sm:max-w-xl"
    >
      <CommandInput
        placeholder="Search calculators (e.g. 'roi', 'commission', 'payroll', 'tax')..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList className="max-h-[60vh]">
        {isSearching ? (
          searchResults.length === 0 ? (
            <div className="py-10 px-4 text-center">
              <p className="text-sm font-semibold text-foreground">No calculators found</p>
              <p className="text-xs text-muted-foreground mt-1">
                We couldn&apos;t find any tool matching &ldquo;{search}&rdquo;.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                <span className="text-xs text-muted-foreground self-center mr-1">Try:</span>
                {['ROI', 'Commission', 'Payroll', 'Overtime', 'Break-Even', 'PTO'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setSearch(term)}
                    className="text-xs px-2.5 py-1 rounded-md bg-muted hover:bg-accent hover:text-foreground text-muted-foreground transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <CommandGroup heading={`Matching Calculators (${searchResults.length})`}>
              {searchResults.map(({ calculator: calc, score }, idx) => {
                const Icon = calc.icon;
                const isTopMatch = idx === 0 && score >= 1000;
                return (
                  <CommandItem
                    key={calc.slug}
                    value={calc.slug}
                    onSelect={() => handleSelect(calc.path)}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 cursor-pointer rounded-lg aria-selected:bg-accent"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate text-foreground">{calc.title}</p>
                          {isTopMatch && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 border border-emerald-500/20 shrink-0">
                              Best Match
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{calc.shortDescription}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted/80 text-muted-foreground shrink-0 hidden sm:inline">
                      {calc.category}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )
        ) : (
          <>
            {/* Popular Calculators Quick Access */}
            <CommandGroup heading="Popular Calculators">
              {popularCalculators.map((calc) => {
                const Icon = calc.icon;
                return (
                  <CommandItem
                    key={calc.slug}
                    value={calc.slug}
                    onSelect={() => handleSelect(calc.path)}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 cursor-pointer rounded-lg aria-selected:bg-accent"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate text-foreground">{calc.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{calc.shortDescription}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted/80 text-muted-foreground shrink-0 hidden sm:inline">
                      {calc.category}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>

            {/* All Categories */}
            {categoryOrder.map((category) => {
              const group = getPublishedCalculators().filter((c) => c.category === category);
              if (group.length === 0) return null;
              return (
                <CommandGroup key={category} heading={category}>
                  {group.map((calc) => {
                    const Icon = calc.icon;
                    return (
                      <CommandItem
                        key={calc.slug}
                        value={calc.slug}
                        onSelect={() => handleSelect(calc.path)}
                        className="flex items-center justify-between gap-3 px-3 py-2.5 cursor-pointer rounded-lg aria-selected:bg-accent"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate text-foreground">{calc.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{calc.shortDescription}</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted/80 text-muted-foreground shrink-0 hidden sm:inline">
                          {calc.category}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              );
            })}
          </>
        )}
      </CommandList>

      {/* Footer hint */}
      <div className="border-t px-3 py-2 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">↑↓</kbd>
          navigate
        </span>
        <span className="flex items-center gap-1">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">↵</kbd>
          open
        </span>
        <span className="flex items-center gap-1">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">Esc</kbd>
          close
        </span>
        <span className="ml-auto flex items-center gap-1">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">⌘K</kbd>
        </span>
      </div>
    </CommandDialog>
  );
}
