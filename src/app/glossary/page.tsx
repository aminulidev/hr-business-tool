import React from 'react';
import Link from 'next/link';
import { Book, Search, ArrowRight, ExternalLink } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Business & HR Glossary - QuickBizCalc',
  description: 'A comprehensive dictionary of business, HR, payroll, and financial terms to help you understand the metrics behind our calculators.',
};

const terms = [
  {
    term: 'Annualized ROI',
    definition: 'The average annual return of an investment over a specific period of time. It allows you to compare the performance of investments held for different lengths of time.',
    category: 'Finance',
    link: '/calculators/roi-calculator'
  },
  {
    term: 'COGS (Cost of Goods Sold)',
    definition: 'The direct costs of producing the goods sold by a company. This includes the cost of the materials and labor directly used to create the good.',
    category: 'Business',
    link: '/calculators/gross-margin-calculator'
  },
  {
    term: 'Commission',
    definition: 'A form of variable compensation paid to sales employees based on the amount of sales they generate. It can be a flat rate, a percentage, or tiered.',
    category: 'HR',
    link: '/calculators/commission-calculator'
  },
  {
    term: 'Deductions',
    definition: 'Amounts taken out of an employee\'s gross pay for taxes, insurance premiums, retirement contributions, and other benefits.',
    category: 'Payroll',
    link: '/calculators/payroll-deduction-calculator'
  },
  {
    term: 'Effective Tax Rate',
    definition: 'The average rate at which an individual or corporation is taxed on earned income, calculated by dividing total tax paid by total taxable income.',
    category: 'Payroll',
    link: '/calculators/tax-bracket-calculator'
  },
  {
    term: 'FICA (Federal Insurance Contributions Act)',
    definition: 'A U.S. federal payroll tax that funds Social Security and Medicare programs. Both employees and employers contribute to FICA.',
    category: 'Payroll',
    link: '/calculators/payroll-calculator'
  },
  {
    term: 'FUTA (Federal Unemployment Tax Act)',
    definition: 'A federal tax paid by employers to fund state unemployment agencies and the federal government\'s oversight of unemployment programs.',
    category: 'Payroll',
    link: '/calculators/payroll-calculator'
  },
  {
    term: 'Gross Margin',
    definition: 'A company\'s net sales revenue minus its cost of goods sold (COGS). It represents the percentage of total sales revenue that the company retains after incurring the direct costs.',
    category: 'Business',
    link: '/calculators/gross-margin-calculator'
  },
  {
    term: 'Gross Pay',
    definition: 'The total amount of money an employee earns before any taxes or other deductions are taken out of their paycheck.',
    category: 'HR',
    link: '/calculators/salary-converter'
  },
  {
    term: 'Markup',
    definition: 'The difference between the cost of a good or service and its selling price. It is typically expressed as a percentage above the cost.',
    category: 'Business',
    link: '/calculators/markup-calculator'
  },
  {
    term: 'Net Pay (Take-Home Pay)',
    definition: 'The amount of money an employee actually receives in their paycheck after all taxes and deductions have been subtracted from their gross pay.',
    category: 'Payroll',
    link: '/calculators/after-tax-income-calculator'
  },
  {
    term: 'Overtime',
    definition: 'Time worked beyond one\'s regular working hours. In the U.S., FLSA rules typically require pay at 1.5 times the regular rate for hours over 40 per week.',
    category: 'HR',
    link: '/calculators/overtime-calculator'
  },
  {
    term: 'Pro Rata',
    definition: 'A Latin term meaning "in proportion." In payroll, it refers to calculating a portion of a salary for an employee who starts mid-period or works part-time.',
    category: 'HR',
    link: '/calculators/pro-rata-calculator'
  },
  {
    term: 'Profit Margin',
    definition: 'A measure of profitability. It is calculated by finding the net profit as a percentage of the revenue.',
    category: 'Business',
    link: '/calculators/profit-margin-calculator'
  },
  {
    term: 'Quota',
    definition: 'A fixed share of something that a person or group is entitled to receive or is bound to contribute. In sales, it is the performance goal for a sales representative.',
    category: 'HR',
    link: '/calculators/commission-calculator'
  },
  {
    term: 'ROI (Return on Investment)',
    definition: 'A performance measure used to evaluate the efficiency or profitability of an investment or compare the efficiency of several different investments.',
    category: 'Finance',
    link: '/calculators/roi-calculator'
  },
  {
    term: 'SUTA (State Unemployment Tax Act)',
    definition: 'A state-level payroll tax paid by employers to fund unemployment benefits for workers who have lost their jobs.',
    category: 'Payroll',
    link: '/calculators/payroll-calculator'
  },
  {
    term: 'Tax Bracket',
    definition: 'The range of incomes taxed at a particular rate, which established the marginal tax rate an individual pays.',
    category: 'Finance',
    link: '/calculators/tax-bracket-calculator'
  },
  {
    term: 'Tiered Commission',
    definition: 'A commission structure where the percentage paid to a salesperson increases as they reach higher levels of sales volume.',
    category: 'HR',
    link: '/calculators/commission-calculator'
  },
  {
    term: 'W-4 Form',
    definition: 'An IRS form completed by an employee in the U.S. to indicate their tax situation to the employer. It determines the amount of federal income tax to withhold.',
    category: 'HR',
    link: '/calculators/payroll-calculator'
  }
];

export default function GlossaryPage() {
  return (
    <div className="min-h-screen flex flex-col mesh-gradient">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="px-3 py-1 bg-emerald-500/10 border-emerald-500/30 text-emerald-600">
              Reference Guide
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              Business & HR <span className="text-emerald-600">Glossary</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Master the terminology behind the metrics. A comprehensive dictionary of terms used across our business and HR calculator suite.
            </p>
          </div>

          {/* Quick Search / Alpha Navigation (Simplified for now) */}
          <div className="grid grid-cols-1 gap-6">
            {terms.sort((a, b) => a.term.localeCompare(b.term)).map((item) => (
              <div 
                key={item.term}
                id={item.term.toLowerCase().replace(/\s+/g, '-')}
                className="group p-6 sm:p-8 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-emerald-500/30 hover:bg-card/80 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <Book className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      {item.term}
                    </h2>
                  </div>
                  <Badge variant="secondary" className="w-fit">
                    {item.category}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {item.definition}
                </p>

                <Link 
                  href={item.link}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors group/link"
                >
                  Use the {item.term} Calculator
                  <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-xl shadow-emerald-600/20 text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold">Confused by a metric?</h2>
            <p className="text-emerald-50/90 max-w-xl mx-auto">
              Our calculators aren't just tools; they're educational resources. If there's a term you'd like us to explain, or a new tool you need, let us know.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/calculators"
                className="px-8 py-3 rounded-xl bg-white text-emerald-700 font-bold hover:bg-emerald-50 transition-colors"
              >
                Browse All Tools
              </Link>
              <Link 
                href="/contact"
                className="px-8 py-3 rounded-xl bg-emerald-700 text-white font-bold border border-emerald-500/30 hover:bg-emerald-600 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
