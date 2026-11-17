// ---------------------------------------------------------------------------
// The per-state facts the calculators need in the browser
// ---------------------------------------------------------------------------
// state-pages.ts holds each state's whole article (FAQs, notes, sources: 100 kB).
// The calculators only need a state's name, its paycheck-page slug, the label
// and defaults of its allowance input and its minimum wage for the presets, so
// client components import this file and never state-pages.ts
// (bundle-boundaries.test.ts enforces it).
//
// The values repeat what STATE_PAYCHECK_PAGES holds; state-meta.test.ts fails if
// the two disagree, so edit a state in both places.

import type { CalculatorSlug } from '@/lib/registry';
import type { StateCode } from './withholding';

export interface StateMeta {
  code: StateCode;
  name: string;
  slug: CalculatorSlug;
  /** Label and defaults of the state withholding input; null if the state has none */
  allowances: { label: string; help: string; defaultSingle: number; defaultMarried: number } | null;
  minimumWage: number;
}

export const STATE_META: Record<StateCode, StateMeta> = {
  CA: {
    code: 'CA',
    name: 'California',
    slug: 'california-hourly-paycheck-calculator',
    allowances: {
      label: 'DE 4 allowances',
      help: 'Regular withholding allowances from your California DE 4 (or W-4 if you never filed a DE 4).',
      defaultSingle: 1,
      defaultMarried: 2,
    },
    minimumWage: 16.9,
  },
  TX: {
    code: 'TX',
    name: 'Texas',
    slug: 'texas-hourly-paycheck-calculator',
    allowances: null,
    minimumWage: 7.25,
  },
  FL: {
    code: 'FL',
    name: 'Florida',
    slug: 'florida-hourly-paycheck-calculator',
    allowances: null,
    minimumWage: 15,
  },
  NY: {
    code: 'NY',
    name: 'New York',
    slug: 'new-york-hourly-paycheck-calculator',
    allowances: {
      label: 'IT-2104 allowances',
      help: 'Total allowances from your New York IT-2104 (0 if you did not file one).',
      defaultSingle: 0,
      defaultMarried: 0,
    },
    minimumWage: 17,
  },
  IL: {
    code: 'IL',
    name: 'Illinois',
    slug: 'illinois-hourly-paycheck-calculator',
    allowances: {
      label: 'IL-W-4 allowances',
      help: 'Line 1 allowances from your IL-W-4 — usually 1 for yourself, plus 1 for your spouse and each dependent.',
      defaultSingle: 1,
      defaultMarried: 2,
    },
    minimumWage: 15,
  },
  WA: {
    code: 'WA',
    name: 'Washington',
    slug: 'washington-hourly-paycheck-calculator',
    allowances: null,
    minimumWage: 17.13,
  },
  TN: {
    code: 'TN',
    name: 'Tennessee',
    slug: 'tennessee-hourly-paycheck-calculator',
    allowances: null,
    minimumWage: 7.25,
  },
  NV: {
    code: 'NV',
    name: 'Nevada',
    slug: 'nevada-hourly-paycheck-calculator',
    allowances: null,
    minimumWage: 12,
  },
  PA: {
    code: 'PA',
    name: 'Pennsylvania',
    slug: 'pennsylvania-hourly-paycheck-calculator',
    allowances: null,
    minimumWage: 7.25,
  },
  NC: {
    code: 'NC',
    name: 'North Carolina',
    slug: 'north-carolina-hourly-paycheck-calculator',
    allowances: {
      label: 'NC-4 allowances',
      help: 'Total allowances claimed on your North Carolina Form NC-4 ($2,500 deduction per allowance).',
      defaultSingle: 0,
      defaultMarried: 0,
    },
    minimumWage: 7.25,
  },
  GA: {
    code: 'GA',
    name: 'Georgia',
    slug: 'georgia-hourly-paycheck-calculator',
    allowances: {
      label: 'G-4 dependent allowances',
      help: 'Dependent allowances from your Georgia Form G-4 ($4,000 deduction per dependent allowance).',
      defaultSingle: 0,
      defaultMarried: 0,
    },
    minimumWage: 7.25,
  },
  MI: {
    code: 'MI',
    name: 'Michigan',
    slug: 'michigan-hourly-paycheck-calculator',
    allowances: {
      label: 'MI-W4 exemptions',
      help: 'Personal and dependent exemptions claimed on your Michigan Form MI-W4 ($5,800 per exemption).',
      defaultSingle: 1,
      defaultMarried: 2,
    },
    minimumWage: 13.73,
  },
  IN: {
    code: 'IN',
    name: 'Indiana',
    slug: 'indiana-hourly-paycheck-calculator',
    allowances: {
      label: 'WH-4 exemptions',
      help: 'Total personal and dependent exemptions on your Indiana Form WH-4 ($1,000 per exemption).',
      defaultSingle: 1,
      defaultMarried: 2,
    },
    minimumWage: 7.25,
  },
  AZ: {
    code: 'AZ',
    name: 'Arizona',
    slug: 'arizona-hourly-paycheck-calculator',
    allowances: {
      label: 'Dependent credits ($100/ea)',
      help: 'Number of qualifying dependents ($100 annual Arizona tax credit per dependent).',
      defaultSingle: 0,
      defaultMarried: 0,
    },
    minimumWage: 15.15,
  },
  CO: {
    code: 'CO',
    name: 'Colorado',
    slug: 'colorado-hourly-paycheck-calculator',
    allowances: {
      label: 'DR 0004 dependent allowances',
      help: 'Optional withholding allowances from Colorado Form DR 0004 (0 if using your federal W-4 default).',
      defaultSingle: 0,
      defaultMarried: 0,
    },
    minimumWage: 15.16,
  },
  UT: {
    code: 'UT',
    name: 'Utah',
    slug: 'utah-hourly-paycheck-calculator',
    allowances: {
      label: 'Dependent exemptions',
      help: 'Number of qualifying dependents for the Utah taxpayer tax credit computation.',
      defaultSingle: 0,
      defaultMarried: 0,
    },
    minimumWage: 7.25,
  },
  KY: {
    code: 'KY',
    name: 'Kentucky',
    slug: 'kentucky-hourly-paycheck-calculator',
    allowances: null,
    minimumWage: 7.25,
  },
  LA: {
    code: 'LA',
    name: 'Louisiana',
    slug: 'louisiana-hourly-paycheck-calculator',
    allowances: {
      label: 'L-4 dependent exemptions',
      help: 'Number of dependent exemptions claimed on Louisiana Form L-4 ($1,000 deduction per dependent).',
      defaultSingle: 0,
      defaultMarried: 0,
    },
    minimumWage: 7.25,
  },
  IA: {
    code: 'IA',
    name: 'Iowa',
    slug: 'iowa-hourly-paycheck-calculator',
    allowances: {
      label: 'IA W-4 allowances ($40 credit/ea)',
      help: 'Total exemption allowances from your Iowa Form IA W-4 ($40 annual tax credit per allowance).',
      defaultSingle: 1,
      defaultMarried: 2,
    },
    minimumWage: 7.25,
  },
  ID: {
    code: 'ID',
    name: 'Idaho',
    slug: 'idaho-hourly-paycheck-calculator',
    allowances: {
      label: 'ID W-4 child tax allowances',
      help: 'Qualifying children claimed on Idaho Form ID W-4 ($2,960 deduction per allowance).',
      defaultSingle: 0,
      defaultMarried: 0,
    },
    minimumWage: 7.25,
  },
  OH: {
    code: 'OH',
    name: 'Ohio',
    slug: 'ohio-hourly-paycheck-calculator',
    allowances: {
      label: 'IT 4 exemptions',
      help: 'Personal and dependent exemptions claimed on Ohio Form IT 4 ($2,400 deduction per exemption).',
      defaultSingle: 1,
      defaultMarried: 2,
    },
    minimumWage: 11,
  },
  VA: {
    code: 'VA',
    name: 'Virginia',
    slug: 'virginia-hourly-paycheck-calculator',
    allowances: {
      label: 'VA-4 exemptions',
      help: 'Personal and dependent exemptions from Virginia Form VA-4 ($930 deduction per exemption).',
      defaultSingle: 1,
      defaultMarried: 2,
    },
    minimumWage: 12.77,
  },
  NJ: {
    code: 'NJ',
    name: 'New Jersey',
    slug: 'new-jersey-hourly-paycheck-calculator',
    allowances: {
      label: 'NJ-W4 allowances',
      help: 'Total allowances claimed on New Jersey Form NJ-W4 ($1,000 deduction per allowance).',
      defaultSingle: 1,
      defaultMarried: 2,
    },
    minimumWage: 15.92,
  },
  MA: {
    code: 'MA',
    name: 'Massachusetts',
    slug: 'massachusetts-hourly-paycheck-calculator',
    allowances: {
      label: 'M-4 exemptions',
      help: 'Total exemptions claimed on Massachusetts Form M-4 ($4,400 personal + $1,000 per additional exemption).',
      defaultSingle: 1,
      defaultMarried: 2,
    },
    minimumWage: 15,
  },
  MD: {
    code: 'MD',
    name: 'Maryland',
    slug: 'maryland-hourly-paycheck-calculator',
    allowances: {
      label: 'MW507 exemptions',
      help: 'Total personal and dependent exemptions on Maryland Form MW507 ($3,200 deduction per exemption).',
      defaultSingle: 1,
      defaultMarried: 2,
    },
    minimumWage: 15,
  },
  MN: {
    code: 'MN',
    name: 'Minnesota',
    slug: 'minnesota-hourly-paycheck-calculator',
    allowances: {
      label: 'W-4MN allowances',
      help: 'Withholding allowances claimed on Minnesota Form W-4MN ($5,200 deduction per allowance).',
      defaultSingle: 0,
      defaultMarried: 0,
    },
    minimumWage: 11.41,
  },
  MO: {
    code: 'MO',
    name: 'Missouri',
    slug: 'missouri-hourly-paycheck-calculator',
    allowances: null,
    minimumWage: 15,
  },
  WI: {
    code: 'WI',
    name: 'Wisconsin',
    slug: 'wisconsin-hourly-paycheck-calculator',
    allowances: {
      label: 'WT-4 exemptions',
      help: 'Total personal and dependent exemptions claimed on Wisconsin Form WT-4 ($700 deduction per exemption).',
      defaultSingle: 1,
      defaultMarried: 2,
    },
    minimumWage: 7.25,
  },
  OR: {
    code: 'OR',
    name: 'Oregon',
    slug: 'oregon-hourly-paycheck-calculator',
    allowances: {
      label: 'OR-W-4 allowances ($256 credit/ea)',
      help: 'Total allowances from Oregon Form OR-W-4 ($256 annual personal exemption credit per allowance).',
      defaultSingle: 1,
      defaultMarried: 2,
    },
    minimumWage: 15.55,
  },
  SC: {
    code: 'SC',
    name: 'South Carolina',
    slug: 'south-carolina-hourly-paycheck-calculator',
    allowances: {
      label: 'SC W-4 allowances',
      help: 'Total allowances claimed on South Carolina Form SC W-4 ($4,860 deduction per allowance).',
      defaultSingle: 1,
      defaultMarried: 2,
    },
    minimumWage: 7.25,
  },
};

/** The 30 states with a paycheck page, in the order of STATE_PAYCHECK_PAGES */
export const STATE_CODES = Object.keys(STATE_META) as StateCode[];
