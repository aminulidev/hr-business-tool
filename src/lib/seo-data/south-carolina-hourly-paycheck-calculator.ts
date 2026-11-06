import type { CalculatorSeoData } from './types';
import { buildStatePaycheckSeo } from '@/lib/payroll/state-pages';

const seoData = buildStatePaycheckSeo('SC');

export default seoData;