import AbsoluteValueStepForm from './AbsoluteValueStepForm';
import AddMissingDatesStepForm from './AddMissingDatesStepForm';
import AddTextColumnStepForm from './AddTextColumnStepForm';
import AddTotalRowsStepForm from './AddTotalRowsStepForm';
import AggregateStepForm from './AggregateStepForm';
import AppendStepForm from './AppendStepForm';
import ArgmaxStepForm from './ArgmaxStepForm';
import ArgminStepForm from './ArgminStepForm';
import CompareTextStepForm from './CompareTextStepForm';
import ComputeDurationStepForm from './ComputeDurationStepForm';
import ConcatenateStepForm from './ConcatenateStepForm';
import ConvertStepForm from './ConvertStepForm';
import CumSumStepForm from './CumSumStepForm';
import CustomSqlStepForm from './CustomSqlStepForm';
import CustomStepForm from './CustomStepForm';
import DateExtractStepForm from './DateExtractStepForm';
import DateGranularityStepForm from './DateGranularityStepForm';
import DeleteColumnStepForm from './DeleteColumnStepForm';
import DissolveStepForm from './DissolveStepForm';
import DomainStepForm from './DomainStepForm';
import DuplicateColumnStepForm from './DuplicateColumnStepForm';
import EvolutionStepForm from './EvolutionStepForm';
import FillnaStepForm from './FillnaStepForm';
import FilterStepForm from './FilterStepForm';
import FormulaStepForm from './FormulaStepForm';
import FromDateStepForm from './FromDateStepForm';
import HierarchyStepForm from './HierarchyStepForm';
import IfThenElseStepForm from './IfThenElseStepForm';
import JoinStepForm from './JoinStepForm';
import MovingAverageStepForm from './MovingAverageStepForm';
import PercentageStepForm from './PercentageStepForm';
import PivotStepForm from './PivotStepForm';
import RankStepForm from './RankStepForm';
import RenameStepForm from './RenameStepForm';
import ReplaceStepForm from './ReplaceStepForm';
import ReplaceTextStepForm from './ReplaceTextStepForm';
import RollupStepForm from './RollupStepForm';
import SelectColumnStepForm from './SelectColumnStepForm';
import SimplifyStepForm from './SimplifyStepForm';
import SortStepForm from './SortStepForm';
import SplitStepForm from './SplitStepForm';
import StatisticsStepForm from './StatisticsStepForm';
import SubstringStepForm from './SubstringStepForm';
import ToDateStepForm from './ToDateStepForm';
import ToLowerStepForm from './ToLowerStepForm';
import ToUpperStepForm from './ToUpperStepForm';
import TopStepForm from './TopStepForm';
import TrimStepForm from './TrimStepForm';
import UniqueGroupsStepForm from './UniqueGroupsStepForm';
import UnpivotStepForm from './UnpivotStepForm';
import WaterfallStepForm from './WaterfallStepForm';

// Mapping from step name to component
const StepFormsComponents: Record<string, any> = {
  absolutevalue: AbsoluteValueStepForm,
  addmissingdates: AddMissingDatesStepForm,
  text: AddTextColumnStepForm,
  totals: AddTotalRowsStepForm,
  aggregate: AggregateStepForm,
  append: AppendStepForm,
  argmax: ArgmaxStepForm,
  argmin: ArgminStepForm,
  comparetext: CompareTextStepForm,
  duration: ComputeDurationStepForm,
  concatenate: ConcatenateStepForm,
  convert: ConvertStepForm,
  cumsum: CumSumStepForm,
  customsql: CustomSqlStepForm,
  custom: CustomStepForm,
  dateextract: DateExtractStepForm,
  dategranularity: DateGranularityStepForm,
  delete: DeleteColumnStepForm,
  dissolve: DissolveStepForm,
  domain: DomainStepForm,
  duplicate: DuplicateColumnStepForm,
  evolution: EvolutionStepForm,
  fillna: FillnaStepForm,
  filter: FilterStepForm,
  formula: FormulaStepForm,
  fromdate: FromDateStepForm,
  hierarchy: HierarchyStepForm,
  ifthenelse: IfThenElseStepForm,
  join: JoinStepForm,
  movingaverage: MovingAverageStepForm,
  percentage: PercentageStepForm,
  pivot: PivotStepForm,
  rank: RankStepForm,
  rename: RenameStepForm,
  replace: ReplaceStepForm,
  replacetext: ReplaceTextStepForm,
  rollup: RollupStepForm,
  select: SelectColumnStepForm,
  simplify: SimplifyStepForm,
  sort: SortStepForm,
  split: SplitStepForm,
  statistics: StatisticsStepForm,
  substring: SubstringStepForm,
  todate: ToDateStepForm,
  lowercase: ToLowerStepForm,
  uppercase: ToUpperStepForm,
  top: TopStepForm,
  trim: TrimStepForm,
  uniquegroups: UniqueGroupsStepForm,
  unpivot: UnpivotStepForm,
  waterfall: WaterfallStepForm,
};

export default StepFormsComponents;

export {
  AbsoluteValueStepForm,
  AddMissingDatesStepForm,
  AddTextColumnStepForm,
  AddTotalRowsStepForm,
  AggregateStepForm,
  AppendStepForm,
  ArgmaxStepForm,
  ArgminStepForm,
  CompareTextStepForm,
  ComputeDurationStepForm,
  ConcatenateStepForm,
  ConvertStepForm,
  CumSumStepForm,
  CustomSqlStepForm,
  CustomStepForm,
  DateExtractStepForm,
  DateGranularityStepForm,
  DeleteColumnStepForm,
  DissolveStepForm,
  DomainStepForm,
  DuplicateColumnStepForm,
  EvolutionStepForm,
  FillnaStepForm,
  FilterStepForm,
  FormulaStepForm,
  FromDateStepForm,
  HierarchyStepForm,
  IfThenElseStepForm,
  JoinStepForm,
  MovingAverageStepForm,
  PercentageStepForm,
  PivotStepForm,
  RankStepForm,
  RenameStepForm,
  ReplaceStepForm,
  ReplaceTextStepForm,
  RollupStepForm,
  SelectColumnStepForm,
  SimplifyStepForm,
  SortStepForm,
  SplitStepForm,
  StatisticsStepForm,
  SubstringStepForm,
  ToDateStepForm,
  ToLowerStepForm,
  ToUpperStepForm,
  TopStepForm,
  TrimStepForm,
  UniqueGroupsStepForm,
  UnpivotStepForm,
  WaterfallStepForm,
};
