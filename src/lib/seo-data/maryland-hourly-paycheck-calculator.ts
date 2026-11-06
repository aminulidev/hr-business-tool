import type { CalculatorSeoData } from './types';
import { buildStatePaycheckSeo } from '@/lib/payroll/state-pages';

const seoData = buildStatePaycheckSeo('MD');

export default seoData;