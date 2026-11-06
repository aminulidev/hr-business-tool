import type { CalculatorSeoData } from './types';
import { buildStatePaycheckSeo } from '@/lib/payroll/state-pages';

const seoData = buildStatePaycheckSeo('OH');

export default seoData;