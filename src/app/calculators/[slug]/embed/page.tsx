import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCalculatorBySlug, getAllSlugs, isCalculatorPublished } from '@/lib/calculator-meta';
import dynamic from 'next/dynamic';
import CalculatorSkeleton from '@/components/calculators/CalculatorSkeleton';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Dynamic imports — same map as main calculator page
// ---------------------------------------------------------------------------

const SalesCommissionCalculator = dynamic(() => import('@/components/calculators/SalesCommissionCalculator'), { loading: () => <CalculatorSkeleton /> });
const ProRataSalaryCalculator = dynamic(() => import('@/components/calculators/ProRataSalaryCalculator'), { loading: () => <CalculatorSkeleton /> });
const SalaryIncreaseCalculator = dynamic(() => import('@/components/calculators/SalaryIncreaseCalculator'), { loading: () => <CalculatorSkeleton /> });
const PayrollCalculator = dynamic(() => import('@/components/calculators/PayrollCalculator'), { loading: () => <CalculatorSkeleton /> });
const TimeCardCalculator = dynamic(() => import('@/components/calculators/TimeCardCalculator'), { loading: () => <CalculatorSkeleton /> });
const ProfitMarginCalculator = dynamic(() => import('@/components/calculators/ProfitMarginCalculator'), { loading: () => <CalculatorSkeleton /> });
const PostTaxBonusCalculator = dynamic(() => import('@/components/calculators/PostTaxBonusCalculator'), { loading: () => <CalculatorSkeleton /> });
const ROICalculator = dynamic(() => import('@/components/calculators/ROICalculator'), { loading: () => <CalculatorSkeleton /> });
const SalaryConverterCalculator = dynamic(() => import('@/components/calculators/SalaryConverterCalculator'), { loading: () => <CalculatorSkeleton /> });
const OvertimeCalculator = dynamic(() => import('@/components/calculators/OvertimeCalculator'), { loading: () => <CalculatorSkeleton /> });
const DiscountCalculator = dynamic(() => import('@/components/calculators/DiscountCalculator'), { loading: () => <CalculatorSkeleton /> });
const TaxBracketCalculator = dynamic(() => import('@/components/calculators/TaxBracketCalculator'), { loading: () => <CalculatorSkeleton /> });
const AfterTaxIncomeCalculator = dynamic(() => import('@/components/calculators/AfterTaxIncomeCalculator'), { loading: () => <CalculatorSkeleton /> });
const BusinessDayCalculator = dynamic(() => import('@/components/calculators/BusinessDayCalculator'), { loading: () => <CalculatorSkeleton /> });
const PropertyTaxCalculator = dynamic(() => import('@/components/calculators/PropertyTaxCalculator'), { loading: () => <CalculatorSkeleton /> });
const GrossMarginCalculator = dynamic(() => import('@/components/calculators/GrossMarginCalculator'), { loading: () => <CalculatorSkeleton /> });
const MarkupCalculator = dynamic(() => import('@/components/calculators/MarkupCalculator'), { loading: () => <CalculatorSkeleton /> });
const TaxRefundCalculator = dynamic(() => import('@/components/calculators/TaxRefundCalculator'), { loading: () => <CalculatorSkeleton /> });
const DecimalConverterCalculator = dynamic(() => import('@/components/calculators/DecimalConverterCalculator'), { loading: () => <CalculatorSkeleton /> });
const WagesCalculator = dynamic(() => import('@/components/calculators/WagesCalculator'), { loading: () => <CalculatorSkeleton /> });
const PayrollDeductionCalculator = dynamic(() => import('@/components/calculators/PayrollDeductionCalculator'), { loading: () => <CalculatorSkeleton /> });
const SalaryTaxCalculator = dynamic(() => import('@/components/calculators/SalaryTaxCalculator'), { loading: () => <CalculatorSkeleton /> });
const TimeCardLunchCalculator = dynamic(() => import('@/components/calculators/TimeCardLunchCalculator'), { loading: () => <CalculatorSkeleton /> });
const HourlyPaycheckCalculator = dynamic(() => import('@/components/calculators/HourlyPaycheckCalculator'), { loading: () => <CalculatorSkeleton /> });
const SeverancePayCalculator = dynamic(() => import('@/components/calculators/SeverancePayCalculator'), { loading: () => <CalculatorSkeleton /> });
const WorkersCompCalculator = dynamic(() => import('@/components/calculators/WorkersCompCalculator'), { loading: () => <CalculatorSkeleton /> });
const FicaTaxCalculator = dynamic(() => import('@/components/calculators/FicaTaxCalculator'), { loading: () => <CalculatorSkeleton /> });
const TimeAndAHalfCalculator = dynamic(() => import('@/components/calculators/TimeAndAHalfCalculator'), { loading: () => <CalculatorSkeleton /> });
const EmployeeTurnoverCalculator = dynamic(() => import('@/components/calculators/EmployeeTurnoverCalculator'), { loading: () => <CalculatorSkeleton /> });
const CostPerHireCalculator = dynamic(() => import('@/components/calculators/CostPerHireCalculator'), { loading: () => <CalculatorSkeleton /> });
const BillableHoursCalculator = dynamic(() => import('@/components/calculators/BillableHoursCalculator'), { loading: () => <CalculatorSkeleton /> });
const RevenuePerEmployeeCalculator = dynamic(() => import('@/components/calculators/RevenuePerEmployeeCalculator'), { loading: () => <CalculatorSkeleton /> });
// Missing Phase 3 calculators
const PTOAccrualCalculator = dynamic(() => import('@/components/calculators/PTOAccrualCalculator'), { loading: () => <CalculatorSkeleton /> });
const ContractorVsEmployeeCalculator = dynamic(() => import('@/components/calculators/ContractorVsEmployeeCalculator'), { loading: () => <CalculatorSkeleton /> });
const BreakEvenCalculator = dynamic(() => import('@/components/calculators/BreakEvenCalculator'), { loading: () => <CalculatorSkeleton /> });
const CashFlowForecastCalculator = dynamic(() => import('@/components/calculators/CashFlowForecastCalculator'), { loading: () => <CalculatorSkeleton /> });
const SocialSecurityEstimator = dynamic(() => import('@/components/calculators/SocialSecurityEstimator'), { loading: () => <CalculatorSkeleton /> });
// Phase 4 expansion: 10 new calculators
const ShiftPayCalculator = dynamic(() => import('@/components/calculators/ShiftPayCalculator'), { loading: () => <CalculatorSkeleton /> });
const NightShiftDifferentialCalculator = dynamic(() => import('@/components/calculators/NightShiftDifferentialCalculator'), { loading: () => <CalculatorSkeleton /> });
const HolidayPayCalculator = dynamic(() => import('@/components/calculators/HolidayPayCalculator'), { loading: () => <CalculatorSkeleton /> });
const DoubleTimeCalculator = dynamic(() => import('@/components/calculators/DoubleTimeCalculator'), { loading: () => <CalculatorSkeleton /> });
const HazardPayCalculator = dynamic(() => import('@/components/calculators/HazardPayCalculator'), { loading: () => <CalculatorSkeleton /> });
const FederalTaxCalculator = dynamic(() => import('@/components/calculators/FederalTaxCalculator'), { loading: () => <CalculatorSkeleton /> });
const StateTaxCalculator = dynamic(() => import('@/components/calculators/StateTaxCalculator'), { loading: () => <CalculatorSkeleton /> });
const W2Calculator = dynamic(() => import('@/components/calculators/W2Calculator'), { loading: () => <CalculatorSkeleton /> });
const Calculator1099 = dynamic(() => import('@/components/calculators/Calculator1099'), { loading: () => <CalculatorSkeleton /> });
const SelfEmploymentTaxCalculator = dynamic(() => import('@/components/calculators/SelfEmploymentTaxCalculator'), { loading: () => <CalculatorSkeleton /> });
// Phase 5 expansion: 19 new Time & Attendance calculators
const WorkHoursCalculator = dynamic(() => import('@/components/calculators/WorkHoursCalculator'), { loading: () => <CalculatorSkeleton /> });
const EmployeeHoursCalculator = dynamic(() => import('@/components/calculators/EmployeeHoursCalculator'), { loading: () => <CalculatorSkeleton /> });
const ShiftHoursCalculator = dynamic(() => import('@/components/calculators/ShiftHoursCalculator'), { loading: () => <CalculatorSkeleton /> });
const AttendanceCalculator = dynamic(() => import('@/components/calculators/AttendanceCalculator'), { loading: () => <CalculatorSkeleton /> });
const LeaveCalculator = dynamic(() => import('@/components/calculators/LeaveCalculator'), { loading: () => <CalculatorSkeleton /> });
const SickLeaveCalculator = dynamic(() => import('@/components/calculators/SickLeaveCalculator'), { loading: () => <CalculatorSkeleton /> });
const HolidayCountdownCalculator = dynamic(() => import('@/components/calculators/HolidayCountdownCalculator'), { loading: () => <CalculatorSkeleton /> });
const WorkingHoursCalculator = dynamic(() => import('@/components/calculators/WorkingHoursCalculator'), { loading: () => <CalculatorSkeleton /> });
const TimesheetCalculator = dynamic(() => import('@/components/calculators/TimesheetCalculator'), { loading: () => <CalculatorSkeleton /> });
const PayrollHoursCalculator = dynamic(() => import('@/components/calculators/PayrollHoursCalculator'), { loading: () => <CalculatorSkeleton /> });
const ClockInCalculator = dynamic(() => import('@/components/calculators/ClockInCalculator'), { loading: () => <CalculatorSkeleton /> });
const ClockOutCalculator = dynamic(() => import('@/components/calculators/ClockOutCalculator'), { loading: () => <CalculatorSkeleton /> });
const HoursBetweenTimesCalculator = dynamic(() => import('@/components/calculators/HoursBetweenTimesCalculator'), { loading: () => <CalculatorSkeleton /> });
const UtilizationRateCalculator = dynamic(() => import('@/components/calculators/UtilizationRateCalculator'), { loading: () => <CalculatorSkeleton /> });
const EmployeeScheduleCalculator = dynamic(() => import('@/components/calculators/EmployeeScheduleCalculator'), { loading: () => <CalculatorSkeleton /> });
const ShiftRotationCalculator = dynamic(() => import('@/components/calculators/ShiftRotationCalculator'), { loading: () => <CalculatorSkeleton /> });
const TimeDifferenceCalculator = dynamic(() => import('@/components/calculators/TimeDifferenceCalculator'), { loading: () => <CalculatorSkeleton /> });
const BreakCalculator = dynamic(() => import('@/components/calculators/BreakCalculator'), { loading: () => <CalculatorSkeleton /> });
const LunchDeductionCalculator = dynamic(() => import('@/components/calculators/LunchDeductionCalculator'), { loading: () => <CalculatorSkeleton /> });
// Phase 6 expansion: 30 new HR Analytics calculators
const EmployeeRetentionCalculator = dynamic(() => import('@/components/calculators/EmployeeRetentionCalculator'), { loading: () => <CalculatorSkeleton /> });
const AttritionCalculator = dynamic(() => import('@/components/calculators/AttritionCalculator'), { loading: () => <CalculatorSkeleton /> });
const FTECalculator = dynamic(() => import('@/components/calculators/FTECalculator'), { loading: () => <CalculatorSkeleton /> });
const HeadcountCalculator = dynamic(() => import('@/components/calculators/HeadcountCalculator'), { loading: () => <CalculatorSkeleton /> });
const CostOfTurnoverCalculator = dynamic(() => import('@/components/calculators/CostOfTurnoverCalculator'), { loading: () => <CalculatorSkeleton /> });
const LaborCostCalculator = dynamic(() => import('@/components/calculators/LaborCostCalculator'), { loading: () => <CalculatorSkeleton /> });
const EmployeeProductivityCalculator = dynamic(() => import('@/components/calculators/EmployeeProductivityCalculator'), { loading: () => <CalculatorSkeleton /> });
const HRBudgetCalculator = dynamic(() => import('@/components/calculators/HRBudgetCalculator'), { loading: () => <CalculatorSkeleton /> });
const CompensationRatioCalculator = dynamic(() => import('@/components/calculators/CompensationRatioCalculator'), { loading: () => <CalculatorSkeleton /> });
const TimeToHireCalculator = dynamic(() => import('@/components/calculators/TimeToHireCalculator'), { loading: () => <CalculatorSkeleton /> });
const TimeToFillCalculator = dynamic(() => import('@/components/calculators/TimeToFillCalculator'), { loading: () => <CalculatorSkeleton /> });
const RecruitingRoiCalculator = dynamic(() => import('@/components/calculators/RecruitingRoiCalculator'), { loading: () => <CalculatorSkeleton /> });
const EmployeeEngagementScoreCalculator = dynamic(() => import('@/components/calculators/EmployeeEngagementScoreCalculator'), { loading: () => <CalculatorSkeleton /> });
const TrainingCostCalculator = dynamic(() => import('@/components/calculators/TrainingCostCalculator'), { loading: () => <CalculatorSkeleton /> });
const EmployeeCostCalculator = dynamic(() => import('@/components/calculators/EmployeeCostCalculator'), { loading: () => <CalculatorSkeleton /> });
const AbsenteeismCalculator = dynamic(() => import('@/components/calculators/AbsenteeismCalculator'), { loading: () => <CalculatorSkeleton /> });
const ReplacementCostCalculator = dynamic(() => import('@/components/calculators/ReplacementCostCalculator'), { loading: () => <CalculatorSkeleton /> });
const HrRoiCalculator = dynamic(() => import('@/components/calculators/HrRoiCalculator'), { loading: () => <CalculatorSkeleton /> });
const SalaryBenchmarkCalculator = dynamic(() => import('@/components/calculators/SalaryBenchmarkCalculator'), { loading: () => <CalculatorSkeleton /> });
const EmployeeBenefitCostCalculator = dynamic(() => import('@/components/calculators/EmployeeBenefitCostCalculator'), { loading: () => <CalculatorSkeleton /> });
const EmployeeUtilizationCalculator = dynamic(() => import('@/components/calculators/EmployeeUtilizationCalculator'), { loading: () => <CalculatorSkeleton /> });
const PayrollCostCalculator = dynamic(() => import('@/components/calculators/PayrollCostCalculator'), { loading: () => <CalculatorSkeleton /> });
const WorkforcePlanningCalculator = dynamic(() => import('@/components/calculators/WorkforcePlanningCalculator'), { loading: () => <CalculatorSkeleton /> });
const WorkforceCapacityCalculator = dynamic(() => import('@/components/calculators/WorkforceCapacityCalculator'), { loading: () => <CalculatorSkeleton /> });
const SpanOfControlCalculator = dynamic(() => import('@/components/calculators/SpanOfControlCalculator'), { loading: () => <CalculatorSkeleton /> });
const DiversityRatioCalculator = dynamic(() => import('@/components/calculators/DiversityRatioCalculator'), { loading: () => <CalculatorSkeleton /> });
const PromotionRateCalculator = dynamic(() => import('@/components/calculators/PromotionRateCalculator'), { loading: () => <CalculatorSkeleton /> });
const InternalMobilityCalculator = dynamic(() => import('@/components/calculators/InternalMobilityCalculator'), { loading: () => <CalculatorSkeleton /> });
const EmployeeLifetimeValueCalculator = dynamic(() => import('@/components/calculators/EmployeeLifetimeValueCalculator'), { loading: () => <CalculatorSkeleton /> });
const LaborEfficiencyCalculator = dynamic(() => import('@/components/calculators/LaborEfficiencyCalculator'), { loading: () => <CalculatorSkeleton /> });
// Phase 7 expansion: 33 new Business Finance calculators
const RoeCalculator = dynamic(() => import('@/components/calculators/RoeCalculator'), { loading: () => <CalculatorSkeleton /> });
const RoaCalculator = dynamic(() => import('@/components/calculators/RoaCalculator'), { loading: () => <CalculatorSkeleton /> });
const NetMarginCalculator = dynamic(() => import('@/components/calculators/NetMarginCalculator'), { loading: () => <CalculatorSkeleton /> });
const ContributionMarginCalculator = dynamic(() => import('@/components/calculators/ContributionMarginCalculator'), { loading: () => <CalculatorSkeleton /> });
const EbitdaMarginCalculator = dynamic(() => import('@/components/calculators/EbitdaMarginCalculator'), { loading: () => <CalculatorSkeleton /> });
const OperatingMarginCalculator = dynamic(() => import('@/components/calculators/OperatingMarginCalculator'), { loading: () => <CalculatorSkeleton /> });
const GrossProfitCalculator = dynamic(() => import('@/components/calculators/GrossProfitCalculator'), { loading: () => <CalculatorSkeleton /> });
const NetProfitCalculator = dynamic(() => import('@/components/calculators/NetProfitCalculator'), { loading: () => <CalculatorSkeleton /> });
const SellingPriceCalculator = dynamic(() => import('@/components/calculators/SellingPriceCalculator'), { loading: () => <CalculatorSkeleton /> });
const WholesalePriceCalculator = dynamic(() => import('@/components/calculators/WholesalePriceCalculator'), { loading: () => <CalculatorSkeleton /> });
const RetailMarginCalculator = dynamic(() => import('@/components/calculators/RetailMarginCalculator'), { loading: () => <CalculatorSkeleton /> });
const BurnRateCalculator = dynamic(() => import('@/components/calculators/BurnRateCalculator'), { loading: () => <CalculatorSkeleton /> });
const RunwayCalculator = dynamic(() => import('@/components/calculators/RunwayCalculator'), { loading: () => <CalculatorSkeleton /> });
const BudgetCalculator = dynamic(() => import('@/components/calculators/BudgetCalculator'), { loading: () => <CalculatorSkeleton /> });
const WorkingCapitalCalculator = dynamic(() => import('@/components/calculators/WorkingCapitalCalculator'), { loading: () => <CalculatorSkeleton /> });
const InventoryTurnoverCalculator = dynamic(() => import('@/components/calculators/InventoryTurnoverCalculator'), { loading: () => <CalculatorSkeleton /> });
const InventoryHoldingCostCalculator = dynamic(() => import('@/components/calculators/InventoryHoldingCostCalculator'), { loading: () => <CalculatorSkeleton /> });
const EoqCalculator = dynamic(() => import('@/components/calculators/EoqCalculator'), { loading: () => <CalculatorSkeleton /> });
const SafetyStockCalculator = dynamic(() => import('@/components/calculators/SafetyStockCalculator'), { loading: () => <CalculatorSkeleton /> });
const ReorderPointCalculator = dynamic(() => import('@/components/calculators/ReorderPointCalculator'), { loading: () => <CalculatorSkeleton /> });
const DebtRatioCalculator = dynamic(() => import('@/components/calculators/DebtRatioCalculator'), { loading: () => <CalculatorSkeleton /> });
const CurrentRatioCalculator = dynamic(() => import('@/components/calculators/CurrentRatioCalculator'), { loading: () => <CalculatorSkeleton /> });
const QuickRatioCalculator = dynamic(() => import('@/components/calculators/QuickRatioCalculator'), { loading: () => <CalculatorSkeleton /> });
const InterestCoverageRatioCalculator = dynamic(() => import('@/components/calculators/InterestCoverageRatioCalculator'), { loading: () => <CalculatorSkeleton /> });
const AssetTurnoverCalculator = dynamic(() => import('@/components/calculators/AssetTurnoverCalculator'), { loading: () => <CalculatorSkeleton /> });
const BusinessValuationCalculator = dynamic(() => import('@/components/calculators/BusinessValuationCalculator'), { loading: () => <CalculatorSkeleton /> });
const DepreciationCalculator = dynamic(() => import('@/components/calculators/DepreciationCalculator'), { loading: () => <CalculatorSkeleton /> });
const AmortizationCalculator = dynamic(() => import('@/components/calculators/AmortizationCalculator'), { loading: () => <CalculatorSkeleton /> });
const CashConversionCycleCalculator = dynamic(() => import('@/components/calculators/CashConversionCycleCalculator'), { loading: () => <CalculatorSkeleton /> });
const FinancialRatioCalculator = dynamic(() => import('@/components/calculators/FinancialRatioCalculator'), { loading: () => <CalculatorSkeleton /> });
const UnitEconomicsCalculator = dynamic(() => import('@/components/calculators/UnitEconomicsCalculator'), { loading: () => <CalculatorSkeleton /> });
const OperatingCashFlowCalculator = dynamic(() => import('@/components/calculators/OperatingCashFlowCalculator'), { loading: () => <CalculatorSkeleton /> });
const ContributionCalculator = dynamic(() => import('@/components/calculators/ContributionCalculator'), { loading: () => <CalculatorSkeleton /> });
// Phase 8 expansion: 24 new Sales & Compensation calculators
const TieredCommissionCalculator = dynamic(() => import('@/components/calculators/TieredCommissionCalculator'), { loading: () => <CalculatorSkeleton /> });
const SplitCommissionCalculator = dynamic(() => import('@/components/calculators/SplitCommissionCalculator'), { loading: () => <CalculatorSkeleton /> });
const QuotaCalculator = dynamic(() => import('@/components/calculators/QuotaCalculator'), { loading: () => <CalculatorSkeleton /> });
const SalesTargetCalculator = dynamic(() => import('@/components/calculators/SalesTargetCalculator'), { loading: () => <CalculatorSkeleton /> });
const SalesBonusCalculator = dynamic(() => import('@/components/calculators/SalesBonusCalculator'), { loading: () => <CalculatorSkeleton /> });
const CommissionSplitCalculator = dynamic(() => import('@/components/calculators/CommissionSplitCalculator'), { loading: () => <CalculatorSkeleton /> });
const IncentiveCalculator = dynamic(() => import('@/components/calculators/IncentiveCalculator'), { loading: () => <CalculatorSkeleton /> });
const RevenueForecastCalculator = dynamic(() => import('@/components/calculators/RevenueForecastCalculator'), { loading: () => <CalculatorSkeleton /> });
const SalesForecastCalculator = dynamic(() => import('@/components/calculators/SalesForecastCalculator'), { loading: () => <CalculatorSkeleton /> });
const PipelineCalculator = dynamic(() => import('@/components/calculators/PipelineCalculator'), { loading: () => <CalculatorSkeleton /> });
const WinRateCalculator = dynamic(() => import('@/components/calculators/WinRateCalculator'), { loading: () => <CalculatorSkeleton /> });
const ConversionRateCalculator = dynamic(() => import('@/components/calculators/ConversionRateCalculator'), { loading: () => <CalculatorSkeleton /> });
const LeadCostCalculator = dynamic(() => import('@/components/calculators/LeadCostCalculator'), { loading: () => <CalculatorSkeleton /> });
const CustomerAcquisitionCostCalculator = dynamic(() => import('@/components/calculators/CustomerAcquisitionCostCalculator'), { loading: () => <CalculatorSkeleton /> });
const CustomerLifetimeValueCalculator = dynamic(() => import('@/components/calculators/CustomerLifetimeValueCalculator'), { loading: () => <CalculatorSkeleton /> });
const CacPaybackCalculator = dynamic(() => import('@/components/calculators/CacPaybackCalculator'), { loading: () => <CalculatorSkeleton /> });
const MarketingRoiCalculator = dynamic(() => import('@/components/calculators/MarketingRoiCalculator'), { loading: () => <CalculatorSkeleton /> });
const CplCalculator = dynamic(() => import('@/components/calculators/CplCalculator'), { loading: () => <CalculatorSkeleton /> });
const CpaCalculator = dynamic(() => import('@/components/calculators/CpaCalculator'), { loading: () => <CalculatorSkeleton /> });
const CpmCalculator = dynamic(() => import('@/components/calculators/CpmCalculator'), { loading: () => <CalculatorSkeleton /> });
const CpcCalculator = dynamic(() => import('@/components/calculators/CpcCalculator'), { loading: () => <CalculatorSkeleton /> });
const RoasCalculator = dynamic(() => import('@/components/calculators/RoasCalculator'), { loading: () => <CalculatorSkeleton /> });
const RevenueGrowthCalculator = dynamic(() => import('@/components/calculators/RevenueGrowthCalculator'), { loading: () => <CalculatorSkeleton /> });
const CustomerRetentionCalculator = dynamic(() => import('@/components/calculators/CustomerRetentionCalculator'), { loading: () => <CalculatorSkeleton /> });
// Phase 9 expansion: 17 new Freelancer & Agency calculators
const FreelanceHourlyRateCalculator = dynamic(() => import('@/components/calculators/FreelanceHourlyRateCalculator'), { loading: () => <CalculatorSkeleton /> });
const FiverrFeeCalculator = dynamic(() => import('@/components/calculators/FiverrFeeCalculator'), { loading: () => <CalculatorSkeleton /> });
const UpworkFeeCalculator = dynamic(() => import('@/components/calculators/UpworkFeeCalculator'), { loading: () => <CalculatorSkeleton /> });
const ProjectPricingCalculator = dynamic(() => import('@/components/calculators/ProjectPricingCalculator'), { loading: () => <CalculatorSkeleton /> });
const InvoiceCalculator = dynamic(() => import('@/components/calculators/InvoiceCalculator'), { loading: () => <CalculatorSkeleton /> });
const ClientProfitCalculator = dynamic(() => import('@/components/calculators/ClientProfitCalculator'), { loading: () => <CalculatorSkeleton /> });
const AgencyMarginCalculator = dynamic(() => import('@/components/calculators/AgencyMarginCalculator'), { loading: () => <CalculatorSkeleton /> });
const ProposalPriceCalculator = dynamic(() => import('@/components/calculators/ProposalPriceCalculator'), { loading: () => <CalculatorSkeleton /> });
const RetainerCalculator = dynamic(() => import('@/components/calculators/RetainerCalculator'), { loading: () => <CalculatorSkeleton /> });
const ConsultantFeeCalculator = dynamic(() => import('@/components/calculators/ConsultantFeeCalculator'), { loading: () => <CalculatorSkeleton /> });
const BillableRateCalculator = dynamic(() => import('@/components/calculators/BillableRateCalculator'), { loading: () => <CalculatorSkeleton /> });
const ProfitPerClientCalculator = dynamic(() => import('@/components/calculators/ProfitPerClientCalculator'), { loading: () => <CalculatorSkeleton /> });
const TimeValueCalculator = dynamic(() => import('@/components/calculators/TimeValueCalculator'), { loading: () => <CalculatorSkeleton /> });
const MonthlyRevenueCalculator = dynamic(() => import('@/components/calculators/MonthlyRevenueCalculator'), { loading: () => <CalculatorSkeleton /> });
const TeamCostCalculator = dynamic(() => import('@/components/calculators/TeamCostCalculator'), { loading: () => <CalculatorSkeleton /> });
const QuoteCalculator = dynamic(() => import('@/components/calculators/QuoteCalculator'), { loading: () => <CalculatorSkeleton /> });
// Phase 10 expansion: 19 new Startup & SaaS calculators
const MrrCalculator = dynamic(() => import('@/components/calculators/MrrCalculator'), { loading: () => <CalculatorSkeleton /> });
const ArrCalculator = dynamic(() => import('@/components/calculators/ArrCalculator'), { loading: () => <CalculatorSkeleton /> });
const ChurnRateCalculator = dynamic(() => import('@/components/calculators/ChurnRateCalculator'), { loading: () => <CalculatorSkeleton /> });
const ExpansionMrrCalculator = dynamic(() => import('@/components/calculators/ExpansionMrrCalculator'), { loading: () => <CalculatorSkeleton /> });
const NetRevenueRetentionCalculator = dynamic(() => import('@/components/calculators/NetRevenueRetentionCalculator'), { loading: () => <CalculatorSkeleton /> });
const SaasPricingCalculator = dynamic(() => import('@/components/calculators/SaasPricingCalculator'), { loading: () => <CalculatorSkeleton /> });
const LtvCacRatioCalculator = dynamic(() => import('@/components/calculators/LtvCacRatioCalculator'), { loading: () => <CalculatorSkeleton /> });
const TrialConversionCalculator = dynamic(() => import('@/components/calculators/TrialConversionCalculator'), { loading: () => <CalculatorSkeleton /> });
const FreeToPaidConversionCalculator = dynamic(() => import('@/components/calculators/FreeToPaidConversionCalculator'), { loading: () => <CalculatorSkeleton /> });
const ArpuCalculator = dynamic(() => import('@/components/calculators/ArpuCalculator'), { loading: () => <CalculatorSkeleton /> });
const AcvCalculator = dynamic(() => import('@/components/calculators/AcvCalculator'), { loading: () => <CalculatorSkeleton /> });
const GrossRevenueRetentionCalculator = dynamic(() => import('@/components/calculators/GrossRevenueRetentionCalculator'), { loading: () => <CalculatorSkeleton /> });
const MauValueCalculator = dynamic(() => import('@/components/calculators/MauValueCalculator'), { loading: () => <CalculatorSkeleton /> });
const StartupValuationCalculator = dynamic(() => import('@/components/calculators/StartupValuationCalculator'), { loading: () => <CalculatorSkeleton /> });
const EquityDilutionCalculator = dynamic(() => import('@/components/calculators/EquityDilutionCalculator'), { loading: () => <CalculatorSkeleton /> });
const CapTableCalculator = dynamic(() => import('@/components/calculators/CapTableCalculator'), { loading: () => <CalculatorSkeleton /> });
const SafeNoteCalculator = dynamic(() => import('@/components/calculators/SafeNoteCalculator'), { loading: () => <CalculatorSkeleton /> });
const OptionPoolCalculator = dynamic(() => import('@/components/calculators/OptionPoolCalculator'), { loading: () => <CalculatorSkeleton /> });
const FounderEquitySplitCalculator = dynamic(() => import('@/components/calculators/FounderEquitySplitCalculator'), { loading: () => <CalculatorSkeleton /> });
// Phase 10 expansion: 19 new Startup & SaaS calculators
const GstCalculator = dynamic(() => import('@/components/calculators/GstCalculator'), { loading: () => <CalculatorSkeleton /> });
const VatCalculator = dynamic(() => import('@/components/calculators/VatCalculator'), { loading: () => <CalculatorSkeleton /> });
const SalesTaxCalculator = dynamic(() => import('@/components/calculators/SalesTaxCalculator'), { loading: () => <CalculatorSkeleton /> });
const CogsCalculator = dynamic(() => import('@/components/calculators/CogsCalculator'), { loading: () => <CalculatorSkeleton /> });
const OperatingExpenseRatioCalculator = dynamic(() => import('@/components/calculators/OperatingExpenseRatioCalculator'), { loading: () => <CalculatorSkeleton /> });
const AccountsReceivableDaysCalculator = dynamic(() => import('@/components/calculators/AccountsReceivableDaysCalculator'), { loading: () => <CalculatorSkeleton /> });
const AccountsPayableDaysCalculator = dynamic(() => import('@/components/calculators/AccountsPayableDaysCalculator'), { loading: () => <CalculatorSkeleton /> });
const BookValueCalculator = dynamic(() => import('@/components/calculators/BookValueCalculator'), { loading: () => <CalculatorSkeleton /> });
const OverheadRateCalculator = dynamic(() => import('@/components/calculators/OverheadRateCalculator'), { loading: () => <CalculatorSkeleton /> });
const StraightLineDepreciationCalculator = dynamic(() => import('@/components/calculators/StraightLineDepreciationCalculator'), { loading: () => <CalculatorSkeleton /> });
const DecliningBalanceDepreciationCalculator = dynamic(() => import('@/components/calculators/DecliningBalanceDepreciationCalculator'), { loading: () => <CalculatorSkeleton /> });
const EstimateCalculator = dynamic(() => import('@/components/calculators/EstimateCalculator'), { loading: () => <CalculatorSkeleton /> });
const IncomeTaxCalculator = dynamic(() => import('@/components/calculators/IncomeTaxCalculator'), { loading: () => <CalculatorSkeleton /> });
const JournalEntryCalculator = dynamic(() => import('@/components/calculators/JournalEntryCalculator'), { loading: () => <CalculatorSkeleton /> });
const TrialBalanceCalculator = dynamic(() => import('@/components/calculators/TrialBalanceCalculator'), { loading: () => <CalculatorSkeleton /> });
const BalanceSheetCalculator = dynamic(() => import('@/components/calculators/BalanceSheetCalculator'), { loading: () => <CalculatorSkeleton /> });
const CashFlowStatementCalculator = dynamic(() => import('@/components/calculators/CashFlowStatementCalculator'), { loading: () => <CalculatorSkeleton /> });
const PnlCalculator = dynamic(() => import('@/components/calculators/PnlCalculator'), { loading: () => <CalculatorSkeleton /> });
const FifoCalculator = dynamic(() => import('@/components/calculators/FifoCalculator'), { loading: () => <CalculatorSkeleton /> });
const LifoCalculator = dynamic(() => import('@/components/calculators/LifoCalculator'), { loading: () => <CalculatorSkeleton /> });
const WeightedAverageCostCalculator = dynamic(() => import('@/components/calculators/WeightedAverageCostCalculator'), { loading: () => <CalculatorSkeleton /> });
const FixedAssetCalculator = dynamic(() => import('@/components/calculators/FixedAssetCalculator'), { loading: () => <CalculatorSkeleton /> });
const CostAllocationCalculator = dynamic(() => import('@/components/calculators/CostAllocationCalculator'), { loading: () => <CalculatorSkeleton /> });
const ManufacturingCostCalculator = dynamic(() => import('@/components/calculators/ManufacturingCostCalculator'), { loading: () => <CalculatorSkeleton /> });
const InventoryValuationCalculator = dynamic(() => import('@/components/calculators/InventoryValuationCalculator'), { loading: () => <CalculatorSkeleton /> });

const componentMap: Record<string, React.ComponentType> = {
  'commission-calculator': SalesCommissionCalculator,
  'pro-rata-calculator': ProRataSalaryCalculator,
  'salary-increase-calculator': SalaryIncreaseCalculator,
  'payroll-calculator': PayrollCalculator,
  'time-card-calculator': TimeCardCalculator,
  'profit-margin-calculator': ProfitMarginCalculator,
  'bonus-tax-calculator': PostTaxBonusCalculator,
  'roi-calculator': ROICalculator,
  'salary-converter': SalaryConverterCalculator,
  'overtime-calculator': OvertimeCalculator,
  'discount-calculator': DiscountCalculator,
  'tax-bracket-calculator': TaxBracketCalculator,
  'after-tax-income-calculator': AfterTaxIncomeCalculator,
  'business-day-calculator': BusinessDayCalculator,
  'property-tax-calculator': PropertyTaxCalculator,
  'gross-margin-calculator': GrossMarginCalculator,
  'markup-calculator': MarkupCalculator,
  'tax-refund-estimator': TaxRefundCalculator,
  'time-to-decimal-calculator': DecimalConverterCalculator,
  'wages-calculator': WagesCalculator,
  'payroll-deduction-calculator': PayrollDeductionCalculator,
  'salary-tax-calculator': SalaryTaxCalculator,
  'time-card-calculator-with-lunch': TimeCardLunchCalculator,
  'hourly-paycheck-calculator': HourlyPaycheckCalculator,
  'severance-pay-calculator': SeverancePayCalculator,
  'workers-comp-calculator': WorkersCompCalculator,
  'fica-tax-calculator': FicaTaxCalculator,
  'time-and-a-half-calculator': TimeAndAHalfCalculator,
  'employee-turnover-calculator': EmployeeTurnoverCalculator,
  'cost-per-hire-calculator': CostPerHireCalculator,
  'billable-hours-calculator': BillableHoursCalculator,
  'revenue-per-employee-calculator': RevenuePerEmployeeCalculator,
  // Missing Phase 3 calculators
  'pto-accrual-calculator': PTOAccrualCalculator,
  'contractor-vs-employee-calculator': ContractorVsEmployeeCalculator,
  'break-even-calculator': BreakEvenCalculator,
  'cash-flow-forecast-calculator': CashFlowForecastCalculator,
  'social-security-estimator': SocialSecurityEstimator,
  // Phase 4 expansion: 10 new calculators
  'shift-pay-calculator': ShiftPayCalculator,
  'night-shift-differential-calculator': NightShiftDifferentialCalculator,
  'holiday-pay-calculator': HolidayPayCalculator,
  'double-time-calculator': DoubleTimeCalculator,
  'hazard-pay-calculator': HazardPayCalculator,
  'federal-tax-calculator': FederalTaxCalculator,
  'state-tax-calculator': StateTaxCalculator,
  'w-2-calculator': W2Calculator,
  '1099-calculator': Calculator1099,
  'self-employment-tax-calculator': SelfEmploymentTaxCalculator,
  // Phase 5 expansion: 19 new Time & Attendance calculators
  'work-hours-calculator': WorkHoursCalculator,
  'employee-hours-calculator': EmployeeHoursCalculator,
  'shift-hours-calculator': ShiftHoursCalculator,
  'attendance-calculator': AttendanceCalculator,
  'leave-calculator': LeaveCalculator,
  'sick-leave-calculator': SickLeaveCalculator,
  'holiday-countdown-calculator': HolidayCountdownCalculator,
  'working-hours-calculator': WorkingHoursCalculator,
  'timesheet-calculator': TimesheetCalculator,
  'payroll-hours-calculator': PayrollHoursCalculator,
  'clock-in-calculator': ClockInCalculator,
  'clock-out-calculator': ClockOutCalculator,
  'hours-between-times-calculator': HoursBetweenTimesCalculator,
  'utilization-rate-calculator': UtilizationRateCalculator,
  'employee-schedule-calculator': EmployeeScheduleCalculator,
  'shift-rotation-calculator': ShiftRotationCalculator,
  'time-difference-calculator': TimeDifferenceCalculator,
  'break-calculator': BreakCalculator,
  'lunch-deduction-calculator': LunchDeductionCalculator,
  // Phase 6 expansion: 30 new HR Analytics calculators
  'employee-retention-calculator': EmployeeRetentionCalculator,
  'attrition-calculator': AttritionCalculator,
  'fte-calculator': FTECalculator,
  'headcount-calculator': HeadcountCalculator,
  'cost-of-turnover-calculator': CostOfTurnoverCalculator,
  'labor-cost-calculator': LaborCostCalculator,
  'employee-productivity-calculator': EmployeeProductivityCalculator,
  'hr-budget-calculator': HRBudgetCalculator,
  'compensation-ratio-calculator': CompensationRatioCalculator,
  'time-to-hire-calculator': TimeToHireCalculator,
  'time-to-fill-calculator': TimeToFillCalculator,
  'recruiting-roi-calculator': RecruitingRoiCalculator,
  'employee-engagement-score-calculator': EmployeeEngagementScoreCalculator,
  'training-cost-calculator': TrainingCostCalculator,
  'employee-cost-calculator': EmployeeCostCalculator,
  'absenteeism-calculator': AbsenteeismCalculator,
  'replacement-cost-calculator': ReplacementCostCalculator,
  'hr-roi-calculator': HrRoiCalculator,
  'salary-benchmark-calculator': SalaryBenchmarkCalculator,
  'employee-benefit-cost-calculator': EmployeeBenefitCostCalculator,
  'employee-utilization-calculator': EmployeeUtilizationCalculator,
  'payroll-cost-calculator': PayrollCostCalculator,
  'workforce-planning-calculator': WorkforcePlanningCalculator,
  'workforce-capacity-calculator': WorkforceCapacityCalculator,
  'span-of-control-calculator': SpanOfControlCalculator,
  'diversity-ratio-calculator': DiversityRatioCalculator,
  'promotion-rate-calculator': PromotionRateCalculator,
  'internal-mobility-calculator': InternalMobilityCalculator,
  'employee-lifetime-value-calculator': EmployeeLifetimeValueCalculator,
  'labor-efficiency-calculator': LaborEfficiencyCalculator,
  // Phase 7 expansion: 33 new Business Finance calculators
  'roe-calculator': RoeCalculator,
  'roa-calculator': RoaCalculator,
  'net-margin-calculator': NetMarginCalculator,
  'contribution-margin-calculator': ContributionMarginCalculator,
  'ebitda-margin-calculator': EbitdaMarginCalculator,
  'operating-margin-calculator': OperatingMarginCalculator,
  'gross-profit-calculator': GrossProfitCalculator,
  'net-profit-calculator': NetProfitCalculator,
  'selling-price-calculator': SellingPriceCalculator,
  'wholesale-price-calculator': WholesalePriceCalculator,
  'retail-margin-calculator': RetailMarginCalculator,
  'burn-rate-calculator': BurnRateCalculator,
  'runway-calculator': RunwayCalculator,
  'budget-calculator': BudgetCalculator,
  'working-capital-calculator': WorkingCapitalCalculator,
  'inventory-turnover-calculator': InventoryTurnoverCalculator,
  'inventory-holding-cost-calculator': InventoryHoldingCostCalculator,
  'eoq-calculator': EoqCalculator,
  'safety-stock-calculator': SafetyStockCalculator,
  'reorder-point-calculator': ReorderPointCalculator,
  'debt-ratio-calculator': DebtRatioCalculator,
  'current-ratio-calculator': CurrentRatioCalculator,
  'quick-ratio-calculator': QuickRatioCalculator,
  'interest-coverage-ratio-calculator': InterestCoverageRatioCalculator,
  'asset-turnover-calculator': AssetTurnoverCalculator,
  'business-valuation-calculator': BusinessValuationCalculator,
  'depreciation-calculator': DepreciationCalculator,
  'amortization-calculator': AmortizationCalculator,
  'cash-conversion-cycle-calculator': CashConversionCycleCalculator,
  'financial-ratio-calculator': FinancialRatioCalculator,
  'unit-economics-calculator': UnitEconomicsCalculator,
  'operating-cash-flow-calculator': OperatingCashFlowCalculator,
  'contribution-calculator': ContributionCalculator,
  // Phase 8 expansion: 24 new Sales & Compensation calculators
  'tiered-commission-calculator': TieredCommissionCalculator,
  'split-commission-calculator': SplitCommissionCalculator,
  'quota-calculator': QuotaCalculator,
  'sales-target-calculator': SalesTargetCalculator,
  'sales-bonus-calculator': SalesBonusCalculator,
  'commission-split-calculator': CommissionSplitCalculator,
  'incentive-calculator': IncentiveCalculator,
  'revenue-forecast-calculator': RevenueForecastCalculator,
  'sales-forecast-calculator': SalesForecastCalculator,
  'pipeline-calculator': PipelineCalculator,
  'win-rate-calculator': WinRateCalculator,
  'conversion-rate-calculator': ConversionRateCalculator,
  'lead-cost-calculator': LeadCostCalculator,
  'customer-acquisition-cost-calculator': CustomerAcquisitionCostCalculator,
  'customer-lifetime-value-calculator': CustomerLifetimeValueCalculator,
  'cac-payback-calculator': CacPaybackCalculator,
  'marketing-roi-calculator': MarketingRoiCalculator,
  'cpl-calculator': CplCalculator,
  'cpa-calculator': CpaCalculator,
  'cpm-calculator': CpmCalculator,
  'cpc-calculator': CpcCalculator,
  'roas-calculator': RoasCalculator,
  'revenue-growth-calculator': RevenueGrowthCalculator,
  'customer-retention-calculator': CustomerRetentionCalculator,
  // Phase 9 expansion: 17 new Freelancer & Agency calculators
  'freelance-hourly-rate-calculator': FreelanceHourlyRateCalculator,
  'fiverr-fee-calculator': FiverrFeeCalculator,
  'upwork-fee-calculator': UpworkFeeCalculator,
  'project-pricing-calculator': ProjectPricingCalculator,
  'invoice-calculator': InvoiceCalculator,
  'client-profit-calculator': ClientProfitCalculator,
  'agency-margin-calculator': AgencyMarginCalculator,
  'proposal-price-calculator': ProposalPriceCalculator,
  'retainer-calculator': RetainerCalculator,
  'consultant-fee-calculator': ConsultantFeeCalculator,
  'billable-rate-calculator': BillableRateCalculator,
  'profit-per-client-calculator': ProfitPerClientCalculator,
  'time-value-calculator': TimeValueCalculator,
  'monthly-revenue-calculator': MonthlyRevenueCalculator,
  'team-cost-calculator': TeamCostCalculator,
  'quote-calculator': QuoteCalculator,
  'estimate-calculator': EstimateCalculator,
  // Phase 10 expansion: 19 new Startup & SaaS calculators
  'mrr-calculator': MrrCalculator,
  'arr-calculator': ArrCalculator,
  'churn-rate-calculator': ChurnRateCalculator,
  'expansion-mrr-calculator': ExpansionMrrCalculator,
  'net-revenue-retention-calculator': NetRevenueRetentionCalculator,
  'saas-pricing-calculator': SaasPricingCalculator,
  'ltv-cac-ratio-calculator': LtvCacRatioCalculator,
  'trial-conversion-calculator': TrialConversionCalculator,
  'free-to-paid-conversion-calculator': FreeToPaidConversionCalculator,
  'arpu-calculator': ArpuCalculator,
  'acv-calculator': AcvCalculator,
  'gross-revenue-retention-calculator': GrossRevenueRetentionCalculator,
  'mau-value-calculator': MauValueCalculator,
  'startup-valuation-calculator': StartupValuationCalculator,
  'equity-dilution-calculator': EquityDilutionCalculator,
  'cap-table-calculator': CapTableCalculator,
  'safe-note-calculator': SafeNoteCalculator,
  'option-pool-calculator': OptionPoolCalculator,
  'founder-equity-split-calculator': FounderEquitySplitCalculator,
  // Phase 10 expansion: 19 new Startup & SaaS calculators
  'gst-calculator': GstCalculator,
  'vat-calculator': VatCalculator,
  'sales-tax-calculator': SalesTaxCalculator,
  'cogs-calculator': CogsCalculator,
  'operating-expense-ratio-calculator': OperatingExpenseRatioCalculator,
  'accounts-receivable-days-calculator': AccountsReceivableDaysCalculator,
  'accounts-payable-days-calculator': AccountsPayableDaysCalculator,
  'book-value-calculator': BookValueCalculator,
  'overhead-rate-calculator': OverheadRateCalculator,
  'straight-line-depreciation-calculator': StraightLineDepreciationCalculator,
  'declining-balance-depreciation-calculator': DecliningBalanceDepreciationCalculator,
  // Phase 11b: Missing Accounting calculators
  'income-tax-calculator': IncomeTaxCalculator,
  'journal-entry-calculator': JournalEntryCalculator,
  'trial-balance-calculator': TrialBalanceCalculator,
  'balance-sheet-calculator': BalanceSheetCalculator,
  'cash-flow-statement-calculator': CashFlowStatementCalculator,
  'pnl-calculator': PnlCalculator,
  'fifo-calculator': FifoCalculator,
  'lifo-calculator': LifoCalculator,
  'weighted-average-cost-calculator': WeightedAverageCostCalculator,
  'fixed-asset-calculator': FixedAssetCalculator,
  'cost-allocation-calculator': CostAllocationCalculator,
  'manufacturing-cost-calculator': ManufacturingCostCalculator,
  'inventory-valuation-calculator': InventoryValuationCalculator,
};


// ---------------------------------------------------------------------------
// Metadata — noindex so embed pages don't create duplicate content
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);
  return {
    title: calc ? `${calc.title} — Embed | QuickBizCalc` : 'Calculator Embed',
    robots: { index: false, follow: false },
  };
}

// ---------------------------------------------------------------------------
// Static params
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// ---------------------------------------------------------------------------
// Embed page — chrome-free calculator shell for iframe embedding
// ---------------------------------------------------------------------------

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);
  if (!calc || !isCalculatorPublished(calc)) notFound();

  const CalculatorComponent = componentMap[slug];
  if (!CalculatorComponent) notFound();

  return (
    <div className="embed-page min-h-screen bg-background">
      <CalculatorComponent />
      <div className="text-center py-2 text-xs text-muted-foreground border-t border-border mt-2">
        Powered by{' '}
        <Link
          href={`https://quickbizcalc.com/calculators/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-semibold hover:underline"
        >
          QuickBizCalc
        </Link>
      </div>
    </div>
  );
}
