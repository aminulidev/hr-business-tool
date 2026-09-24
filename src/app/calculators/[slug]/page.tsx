import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import {
  getCalculatorBySlug,
  getAllSlugs,
  isCalculatorPublished,
  SITE_URL,
  SITE_NAME,
} from '@/lib/calculator-meta';
import AppShell from '@/components/layout/AppShell';
import CalculatorLayoutServer from '@/components/calculators/CalculatorLayoutServer';
import CalculatorSkeleton from '@/components/calculators/CalculatorSkeleton';

// Use dynamic imports to reduce memory - only load the component needed for each page
const componentMap: Record<string, React.ComponentType> = {
  'commission-calculator': dynamic(() => import('@/components/calculators/SalesCommissionCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'pro-rata-calculator': dynamic(() => import('@/components/calculators/ProRataSalaryCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'salary-increase-calculator': dynamic(() => import('@/components/calculators/SalaryIncreaseCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'payroll-calculator': dynamic(() => import('@/components/calculators/PayrollCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'time-card-calculator': dynamic(() => import('@/components/calculators/TimeCardCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'profit-margin-calculator': dynamic(() => import('@/components/calculators/ProfitMarginCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'bonus-tax-calculator': dynamic(() => import('@/components/calculators/PostTaxBonusCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'roi-calculator': dynamic(() => import('@/components/calculators/ROICalculator'), { loading: () => <CalculatorSkeleton /> }),
  'salary-converter': dynamic(() => import('@/components/calculators/SalaryConverterCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'overtime-calculator': dynamic(() => import('@/components/calculators/OvertimeCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'discount-calculator': dynamic(() => import('@/components/calculators/DiscountCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'tax-bracket-calculator': dynamic(() => import('@/components/calculators/TaxBracketCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'after-tax-income-calculator': dynamic(() => import('@/components/calculators/AfterTaxIncomeCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'business-day-calculator': dynamic(() => import('@/components/calculators/BusinessDayCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'property-tax-calculator': dynamic(() => import('@/components/calculators/PropertyTaxCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'gross-margin-calculator': dynamic(() => import('@/components/calculators/GrossMarginCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'markup-calculator': dynamic(() => import('@/components/calculators/MarkupCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'tax-refund-estimator': dynamic(() => import('@/components/calculators/TaxRefundCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'time-to-decimal-calculator': dynamic(() => import('@/components/calculators/DecimalConverterCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'wages-calculator': dynamic(() => import('@/components/calculators/WagesCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'payroll-deduction-calculator': dynamic(() => import('@/components/calculators/PayrollDeductionCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'salary-tax-calculator': dynamic(() => import('@/components/calculators/SalaryTaxCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'time-card-calculator-with-lunch': dynamic(() => import('@/components/calculators/TimeCardLunchCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'hourly-paycheck-calculator': dynamic(() => import('@/components/calculators/HourlyPaycheckCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'severance-pay-calculator': dynamic(() => import('@/components/calculators/SeverancePayCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'workers-comp-calculator': dynamic(() => import('@/components/calculators/WorkersCompCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'fica-tax-calculator': dynamic(() => import('@/components/calculators/FicaTaxCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'time-and-a-half-calculator': dynamic(() => import('@/components/calculators/TimeAndAHalfCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'employee-turnover-calculator': dynamic(() => import('@/components/calculators/EmployeeTurnoverCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'cost-per-hire-calculator': dynamic(() => import('@/components/calculators/CostPerHireCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'billable-hours-calculator': dynamic(() => import('@/components/calculators/BillableHoursCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'revenue-per-employee-calculator': dynamic(() => import('@/components/calculators/RevenuePerEmployeeCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'pto-accrual-calculator': dynamic(() => import('@/components/calculators/PTOAccrualCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'contractor-vs-employee-calculator': dynamic(() => import('@/components/calculators/ContractorVsEmployeeCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'break-even-calculator': dynamic(() => import('@/components/calculators/BreakEvenCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'cash-flow-forecast-calculator': dynamic(() => import('@/components/calculators/CashFlowForecastCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'social-security-estimator': dynamic(() => import('@/components/calculators/SocialSecurityEstimator'), { loading: () => <CalculatorSkeleton /> }),
  'shift-pay-calculator': dynamic(() => import('@/components/calculators/ShiftPayCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'night-shift-differential-calculator': dynamic(() => import('@/components/calculators/NightShiftDifferentialCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'holiday-pay-calculator': dynamic(() => import('@/components/calculators/HolidayPayCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'double-time-calculator': dynamic(() => import('@/components/calculators/DoubleTimeCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'hazard-pay-calculator': dynamic(() => import('@/components/calculators/HazardPayCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'federal-tax-calculator': dynamic(() => import('@/components/calculators/FederalTaxCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'state-tax-calculator': dynamic(() => import('@/components/calculators/StateTaxCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'w-2-calculator': dynamic(() => import('@/components/calculators/W2Calculator'), { loading: () => <CalculatorSkeleton /> }),
  '1099-calculator': dynamic(() => import('@/components/calculators/Calculator1099'), { loading: () => <CalculatorSkeleton /> }),
  'self-employment-tax-calculator': dynamic(() => import('@/components/calculators/SelfEmploymentTaxCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'work-hours-calculator': dynamic(() => import('@/components/calculators/WorkHoursCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'employee-hours-calculator': dynamic(() => import('@/components/calculators/EmployeeHoursCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'shift-hours-calculator': dynamic(() => import('@/components/calculators/ShiftHoursCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'attendance-calculator': dynamic(() => import('@/components/calculators/AttendanceCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'leave-calculator': dynamic(() => import('@/components/calculators/LeaveCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'sick-leave-calculator': dynamic(() => import('@/components/calculators/SickLeaveCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'holiday-countdown-calculator': dynamic(() => import('@/components/calculators/HolidayCountdownCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'working-hours-calculator': dynamic(() => import('@/components/calculators/WorkingHoursCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'timesheet-calculator': dynamic(() => import('@/components/calculators/TimesheetCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'payroll-hours-calculator': dynamic(() => import('@/components/calculators/PayrollHoursCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'clock-in-calculator': dynamic(() => import('@/components/calculators/ClockInCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'clock-out-calculator': dynamic(() => import('@/components/calculators/ClockOutCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'hours-between-times-calculator': dynamic(() => import('@/components/calculators/HoursBetweenTimesCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'utilization-rate-calculator': dynamic(() => import('@/components/calculators/UtilizationRateCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'employee-schedule-calculator': dynamic(() => import('@/components/calculators/EmployeeScheduleCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'shift-rotation-calculator': dynamic(() => import('@/components/calculators/ShiftRotationCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'time-difference-calculator': dynamic(() => import('@/components/calculators/TimeDifferenceCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'break-calculator': dynamic(() => import('@/components/calculators/BreakCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'lunch-deduction-calculator': dynamic(() => import('@/components/calculators/LunchDeductionCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'employee-retention-calculator': dynamic(() => import('@/components/calculators/EmployeeRetentionCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'attrition-calculator': dynamic(() => import('@/components/calculators/AttritionCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'fte-calculator': dynamic(() => import('@/components/calculators/FTECalculator'), { loading: () => <CalculatorSkeleton /> }),
  'headcount-calculator': dynamic(() => import('@/components/calculators/HeadcountCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'cost-of-turnover-calculator': dynamic(() => import('@/components/calculators/CostOfTurnoverCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'labor-cost-calculator': dynamic(() => import('@/components/calculators/LaborCostCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'employee-productivity-calculator': dynamic(() => import('@/components/calculators/EmployeeProductivityCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'hr-budget-calculator': dynamic(() => import('@/components/calculators/HRBudgetCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'compensation-ratio-calculator': dynamic(() => import('@/components/calculators/CompensationRatioCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'time-to-hire-calculator': dynamic(() => import('@/components/calculators/TimeToHireCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'time-to-fill-calculator': dynamic(() => import('@/components/calculators/TimeToFillCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'recruiting-roi-calculator': dynamic(() => import('@/components/calculators/RecruitingRoiCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'employee-engagement-score-calculator': dynamic(() => import('@/components/calculators/EmployeeEngagementScoreCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'training-cost-calculator': dynamic(() => import('@/components/calculators/TrainingCostCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'employee-cost-calculator': dynamic(() => import('@/components/calculators/EmployeeCostCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'absenteeism-calculator': dynamic(() => import('@/components/calculators/AbsenteeismCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'replacement-cost-calculator': dynamic(() => import('@/components/calculators/ReplacementCostCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'hr-roi-calculator': dynamic(() => import('@/components/calculators/HrRoiCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'salary-benchmark-calculator': dynamic(() => import('@/components/calculators/SalaryBenchmarkCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'employee-benefit-cost-calculator': dynamic(() => import('@/components/calculators/EmployeeBenefitCostCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'employee-utilization-calculator': dynamic(() => import('@/components/calculators/EmployeeUtilizationCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'payroll-cost-calculator': dynamic(() => import('@/components/calculators/PayrollCostCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'workforce-planning-calculator': dynamic(() => import('@/components/calculators/WorkforcePlanningCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'workforce-capacity-calculator': dynamic(() => import('@/components/calculators/WorkforceCapacityCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'span-of-control-calculator': dynamic(() => import('@/components/calculators/SpanOfControlCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'diversity-ratio-calculator': dynamic(() => import('@/components/calculators/DiversityRatioCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'promotion-rate-calculator': dynamic(() => import('@/components/calculators/PromotionRateCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'internal-mobility-calculator': dynamic(() => import('@/components/calculators/InternalMobilityCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'employee-lifetime-value-calculator': dynamic(() => import('@/components/calculators/EmployeeLifetimeValueCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'labor-efficiency-calculator': dynamic(() => import('@/components/calculators/LaborEfficiencyCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'roe-calculator': dynamic(() => import('@/components/calculators/RoeCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'roa-calculator': dynamic(() => import('@/components/calculators/RoaCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'net-margin-calculator': dynamic(() => import('@/components/calculators/NetMarginCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'contribution-margin-calculator': dynamic(() => import('@/components/calculators/ContributionMarginCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'ebitda-margin-calculator': dynamic(() => import('@/components/calculators/EbitdaMarginCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'operating-margin-calculator': dynamic(() => import('@/components/calculators/OperatingMarginCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'gross-profit-calculator': dynamic(() => import('@/components/calculators/GrossProfitCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'net-profit-calculator': dynamic(() => import('@/components/calculators/NetProfitCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'selling-price-calculator': dynamic(() => import('@/components/calculators/SellingPriceCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'wholesale-price-calculator': dynamic(() => import('@/components/calculators/WholesalePriceCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'retail-margin-calculator': dynamic(() => import('@/components/calculators/RetailMarginCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'burn-rate-calculator': dynamic(() => import('@/components/calculators/BurnRateCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'runway-calculator': dynamic(() => import('@/components/calculators/RunwayCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'budget-calculator': dynamic(() => import('@/components/calculators/BudgetCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'working-capital-calculator': dynamic(() => import('@/components/calculators/WorkingCapitalCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'inventory-turnover-calculator': dynamic(() => import('@/components/calculators/InventoryTurnoverCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'inventory-holding-cost-calculator': dynamic(() => import('@/components/calculators/InventoryHoldingCostCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'eoq-calculator': dynamic(() => import('@/components/calculators/EoqCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'safety-stock-calculator': dynamic(() => import('@/components/calculators/SafetyStockCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'reorder-point-calculator': dynamic(() => import('@/components/calculators/ReorderPointCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'debt-ratio-calculator': dynamic(() => import('@/components/calculators/DebtRatioCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'current-ratio-calculator': dynamic(() => import('@/components/calculators/CurrentRatioCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'quick-ratio-calculator': dynamic(() => import('@/components/calculators/QuickRatioCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'interest-coverage-ratio-calculator': dynamic(() => import('@/components/calculators/InterestCoverageRatioCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'asset-turnover-calculator': dynamic(() => import('@/components/calculators/AssetTurnoverCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'business-valuation-calculator': dynamic(() => import('@/components/calculators/BusinessValuationCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'depreciation-calculator': dynamic(() => import('@/components/calculators/DepreciationCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'amortization-calculator': dynamic(() => import('@/components/calculators/AmortizationCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'cash-conversion-cycle-calculator': dynamic(() => import('@/components/calculators/CashConversionCycleCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'financial-ratio-calculator': dynamic(() => import('@/components/calculators/FinancialRatioCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'unit-economics-calculator': dynamic(() => import('@/components/calculators/UnitEconomicsCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'operating-cash-flow-calculator': dynamic(() => import('@/components/calculators/OperatingCashFlowCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'contribution-calculator': dynamic(() => import('@/components/calculators/ContributionCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'tiered-commission-calculator': dynamic(() => import('@/components/calculators/TieredCommissionCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'split-commission-calculator': dynamic(() => import('@/components/calculators/SplitCommissionCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'quota-calculator': dynamic(() => import('@/components/calculators/QuotaCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'sales-target-calculator': dynamic(() => import('@/components/calculators/SalesTargetCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'sales-bonus-calculator': dynamic(() => import('@/components/calculators/SalesBonusCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'commission-split-calculator': dynamic(() => import('@/components/calculators/CommissionSplitCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'incentive-calculator': dynamic(() => import('@/components/calculators/IncentiveCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'revenue-forecast-calculator': dynamic(() => import('@/components/calculators/RevenueForecastCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'sales-forecast-calculator': dynamic(() => import('@/components/calculators/SalesForecastCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'pipeline-calculator': dynamic(() => import('@/components/calculators/PipelineCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'win-rate-calculator': dynamic(() => import('@/components/calculators/WinRateCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'conversion-rate-calculator': dynamic(() => import('@/components/calculators/ConversionRateCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'lead-cost-calculator': dynamic(() => import('@/components/calculators/LeadCostCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'customer-acquisition-cost-calculator': dynamic(() => import('@/components/calculators/CustomerAcquisitionCostCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'customer-lifetime-value-calculator': dynamic(() => import('@/components/calculators/CustomerLifetimeValueCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'cac-payback-calculator': dynamic(() => import('@/components/calculators/CacPaybackCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'marketing-roi-calculator': dynamic(() => import('@/components/calculators/MarketingRoiCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'cpl-calculator': dynamic(() => import('@/components/calculators/CplCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'cpa-calculator': dynamic(() => import('@/components/calculators/CpaCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'cpm-calculator': dynamic(() => import('@/components/calculators/CpmCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'cpc-calculator': dynamic(() => import('@/components/calculators/CpcCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'roas-calculator': dynamic(() => import('@/components/calculators/RoasCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'revenue-growth-calculator': dynamic(() => import('@/components/calculators/RevenueGrowthCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'customer-retention-calculator': dynamic(() => import('@/components/calculators/CustomerRetentionCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'freelance-hourly-rate-calculator': dynamic(() => import('@/components/calculators/FreelanceHourlyRateCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'fiverr-fee-calculator': dynamic(() => import('@/components/calculators/FiverrFeeCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'upwork-fee-calculator': dynamic(() => import('@/components/calculators/UpworkFeeCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'project-pricing-calculator': dynamic(() => import('@/components/calculators/ProjectPricingCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'invoice-calculator': dynamic(() => import('@/components/calculators/InvoiceCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'client-profit-calculator': dynamic(() => import('@/components/calculators/ClientProfitCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'agency-margin-calculator': dynamic(() => import('@/components/calculators/AgencyMarginCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'proposal-price-calculator': dynamic(() => import('@/components/calculators/ProposalPriceCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'retainer-calculator': dynamic(() => import('@/components/calculators/RetainerCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'consultant-fee-calculator': dynamic(() => import('@/components/calculators/ConsultantFeeCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'billable-rate-calculator': dynamic(() => import('@/components/calculators/BillableRateCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'profit-per-client-calculator': dynamic(() => import('@/components/calculators/ProfitPerClientCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'time-value-calculator': dynamic(() => import('@/components/calculators/TimeValueCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'monthly-revenue-calculator': dynamic(() => import('@/components/calculators/MonthlyRevenueCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'team-cost-calculator': dynamic(() => import('@/components/calculators/TeamCostCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'quote-calculator': dynamic(() => import('@/components/calculators/QuoteCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'estimate-calculator': dynamic(() => import('@/components/calculators/EstimateCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'mrr-calculator': dynamic(() => import('@/components/calculators/MrrCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'arr-calculator': dynamic(() => import('@/components/calculators/ArrCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'churn-rate-calculator': dynamic(() => import('@/components/calculators/ChurnRateCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'expansion-mrr-calculator': dynamic(() => import('@/components/calculators/ExpansionMrrCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'net-revenue-retention-calculator': dynamic(() => import('@/components/calculators/NetRevenueRetentionCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'saas-pricing-calculator': dynamic(() => import('@/components/calculators/SaasPricingCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'ltv-cac-ratio-calculator': dynamic(() => import('@/components/calculators/LtvCacRatioCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'trial-conversion-calculator': dynamic(() => import('@/components/calculators/TrialConversionCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'free-to-paid-conversion-calculator': dynamic(() => import('@/components/calculators/FreeToPaidConversionCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'arpu-calculator': dynamic(() => import('@/components/calculators/ArpuCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'acv-calculator': dynamic(() => import('@/components/calculators/AcvCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'gross-revenue-retention-calculator': dynamic(() => import('@/components/calculators/GrossRevenueRetentionCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'mau-value-calculator': dynamic(() => import('@/components/calculators/MauValueCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'startup-valuation-calculator': dynamic(() => import('@/components/calculators/StartupValuationCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'equity-dilution-calculator': dynamic(() => import('@/components/calculators/EquityDilutionCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'cap-table-calculator': dynamic(() => import('@/components/calculators/CapTableCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'safe-note-calculator': dynamic(() => import('@/components/calculators/SafeNoteCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'option-pool-calculator': dynamic(() => import('@/components/calculators/OptionPoolCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'founder-equity-split-calculator': dynamic(() => import('@/components/calculators/FounderEquitySplitCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'gst-calculator': dynamic(() => import('@/components/calculators/GstCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'vat-calculator': dynamic(() => import('@/components/calculators/VatCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'sales-tax-calculator': dynamic(() => import('@/components/calculators/SalesTaxCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'income-tax-calculator': dynamic(() => import('@/components/calculators/IncomeTaxCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'straight-line-depreciation-calculator': dynamic(() => import('@/components/calculators/StraightLineDepreciationCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'declining-balance-depreciation-calculator': dynamic(() => import('@/components/calculators/DecliningBalanceDepreciationCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'journal-entry-calculator': dynamic(() => import('@/components/calculators/JournalEntryCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'trial-balance-calculator': dynamic(() => import('@/components/calculators/TrialBalanceCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'balance-sheet-calculator': dynamic(() => import('@/components/calculators/BalanceSheetCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'cash-flow-statement-calculator': dynamic(() => import('@/components/calculators/CashFlowStatementCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'pnl-calculator': dynamic(() => import('@/components/calculators/PnlCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'inventory-valuation-calculator': dynamic(() => import('@/components/calculators/InventoryValuationCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'fifo-calculator': dynamic(() => import('@/components/calculators/FifoCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'lifo-calculator': dynamic(() => import('@/components/calculators/LifoCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'weighted-average-cost-calculator': dynamic(() => import('@/components/calculators/WeightedAverageCostCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'accounts-receivable-days-calculator': dynamic(() => import('@/components/calculators/AccountsReceivableDaysCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'accounts-payable-days-calculator': dynamic(() => import('@/components/calculators/AccountsPayableDaysCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'book-value-calculator': dynamic(() => import('@/components/calculators/BookValueCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'fixed-asset-calculator': dynamic(() => import('@/components/calculators/FixedAssetCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'cost-allocation-calculator': dynamic(() => import('@/components/calculators/CostAllocationCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'overhead-rate-calculator': dynamic(() => import('@/components/calculators/OverheadRateCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'manufacturing-cost-calculator': dynamic(() => import('@/components/calculators/ManufacturingCostCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'cogs-calculator': dynamic(() => import('@/components/calculators/CogsCalculator'), { loading: () => <CalculatorSkeleton /> }),
  'operating-expense-ratio-calculator': dynamic(() => import('@/components/calculators/OperatingExpenseRatioCalculator'), { loading: () => <CalculatorSkeleton /> }),
};

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const calc = getCalculatorBySlug(slug);

    if (!calc) {
      return { title: 'Calculator Not Found' };
    }

    const currentYear = new Date().getFullYear();
    const title = calc.metaTitle || `${calc.title} (${currentYear}) — Free Online Calculator`;
    const fullTitle = calc.metaTitle ? `${calc.metaTitle} | ${SITE_NAME}` : `${title} | ${SITE_NAME}`;
    const url = `${SITE_URL}${calc.path}`;

    return {
      title,
      description: calc.metaDescription,
      keywords: calc.keywords,
      authors: [{ name: SITE_NAME, url: SITE_URL }],
      creator: SITE_NAME,
      publisher: SITE_NAME,
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: fullTitle,
        description: calc.metaDescription,
        url,
        siteName: SITE_NAME,
        type: 'website',
        locale: 'en_US',
        images: [
          {
            url: '/og-image.png',
            width: 1344,
            height: 768,
            alt: calc.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: fullTitle,
        description: calc.metaDescription,
        images: ['/og-image.png'],
      },
    };
  });
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);

  if (!calc || !isCalculatorPublished(calc)) {
    notFound();
  }

  const CalculatorComponent = componentMap[slug];

  if (!CalculatorComponent) {
    notFound();
  }

  let seoData: any = null;
  try {
    const mod = await import(`@/lib/seo-data/${slug}`);
    seoData = mod.default;
  } catch (e) {
    // If no SEO data exists yet for this slug, fallback gracefully
  }

  return (
    <AppShell>
      {seoData ? (
        <CalculatorLayoutServer
          title={calc.title}
          description={calc.metaDescription}
          icon={<calc.icon className="h-7 w-7 text-white" />}
          breadcrumbs={[{ label: 'Calculators' }, { label: calc.title }]}
          tableOfContents={[
            ...(seoData.howToSteps?.length > 0 ? [{ id: 'how-to-calculate', label: 'How to Calculate' }] : []),
            ...(seoData.formula ? [{ id: 'formula', label: 'Formula' }] : []),
            ...(seoData.commissionStructures?.length > 0 ? [{ id: 'commission-structures', label: 'Common Commission Structures' }] : []),
            ...(seoData.workedExamples?.length > 0 ? [{ id: 'worked-examples', label: 'Worked Examples' }] : []),
            ...(seoData.faqs?.length > 0 ? [{ id: 'frequently-asked-questions', label: 'FAQs' }] : []),
            { id: 'statutory-sources', label: 'Statutory Sources' },
            ...(seoData.relatedTools?.length > 0 ? [{ id: 'related-calculators', label: 'Related Calculators' }] : []),
          ]}
          howToSteps={seoData.howToSteps}
          formula={seoData.formula}
          formulaDescription={seoData.formulaDescription}
          commissionStructures={seoData.commissionStructures}
          workedExamples={seoData.workedExamples}
          faqs={seoData.faqs}
          relatedTools={seoData.relatedTools}
        >
          <CalculatorComponent />
        </CalculatorLayoutServer>
      ) : (
        <CalculatorComponent />
      )}
    </AppShell>
  );
}
