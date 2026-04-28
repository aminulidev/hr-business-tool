'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { calculators, categoryOrder, categoryMeta, type CalculatorMeta } from '@/lib/calculator-meta';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
};

export default function HubPage() {
  // Group calculators by category, preserving categoryOrder
  const grouped: { category: string; meta: { emoji: string; description: string }; items: CalculatorMeta[] }[] = [];
  for (const cat of categoryOrder) {
    const items = calculators.filter((c) => c.category === cat);
    if (items.length > 0 && categoryMeta[cat]) {
      grouped.push({ category: cat, meta: categoryMeta[cat], items });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-8 sm:py-12"
    >
      {/* Hero Section */}
      <div className="text-center mb-12 sm:mb-16 px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
        >
          Business & HR{' '}
          <span className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-gold-500 bg-clip-text text-transparent">
            Calculators
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground max-w-2xl mx-auto text-lg"
        >
          Professional-grade tools for small business owners, HR managers, and
          financial professionals. Free, accurate, and instant results.
        </motion.p>
        {/* Calculator count badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-600 font-medium"
        >
          <span>{calculators.length}</span>
          <span className="text-muted-foreground">free tools available</span>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {grouped.map((group) => (
          <section key={group.category}>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{group.meta.emoji}</span>
              <div>
                <h2 className="text-xl font-bold">
                  {group.category}
                  <span className="ml-2 text-sm font-medium text-muted-foreground">
                    ({group.items.length} tool{group.items.length > 1 ? 's' : ''})
                  </span>
                </h2>
                <p className="text-sm text-muted-foreground">
                  {group.meta.description}
                </p>
              </div>
            </div>
            <motion.div
              key={group.category}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {group.items.map((calc) => (
                <CalculatorCardComponent key={calc.slug} calc={calc} />
              ))}
            </motion.div>
          </section>
        ))}
      </div>
    </motion.div>
  );
}

function CalculatorCardComponent({ calc }: { calc: CalculatorMeta }) {
  const Icon = calc.icon;

  return (
    <motion.div
      variants={cardVariants}
      className="cursor-pointer group hover:-translate-y-1 active:scale-[0.98] transition-transform duration-200"
    >
      <Link href={calc.path} className="block h-full">
        <div className="relative h-full rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-5 sm:p-6 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-500/30">
          <div className="flex items-start justify-between mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-shadow">
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="font-bold text-base mb-1.5 group-hover:text-emerald-600 transition-colors">
            {calc.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {calc.shortDescription}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
