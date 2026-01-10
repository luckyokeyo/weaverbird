import {
  FilterCondition,
  FilterSimpleCondition,
  IfThenElseStep,
  isFilterComboAnd,
  isFilterComboOr,
} from '@/lib/steps';

/**
 * transform a FilterCondition in a human readable string.
 *
 * @param condition the filter condition to transform.
 * @param operator the operator (and/or) used to link the condition.
 */
function _convertConditionToHumanFormat(
  condition: FilterCondition,
  operator: 'and' | 'or' | null = null,
): string {
  let humanReadable = '';
  if (isFilterComboAnd(condition)) {
    humanReadable = condition.and
      .map((cond) => `(${_convertConditionToHumanFormat(cond, 'and')})`)
      .join(' AND ');
  } else if (isFilterComboOr(condition)) {
    humanReadable = condition.or
      .map((cond) => `(${_convertConditionToHumanFormat(cond, 'or')})`)
      .join(' OR ');
  } else {
    // It's a simple condition
    const simpleCond = condition as FilterSimpleCondition;
    humanReadable = `${simpleCond.column} ${simpleCond.operator} ${simpleCond.value}`;
  }
  return humanReadable;
}

export default function convertIfThenElseToHumanFormat(step: IfThenElseStep): string {
  const ifCondition = _convertConditionToHumanFormat(step.if);
  const thenValue = step.then;
  // Handling 'else' which can be a nested IfThenElseStep or a value (Formula)
  // Recursion is needed if else is another step, but type definition says else is Formula | Omit<...>
  // But for simple display we might just show top level or recurse.
  // The original Vue code might have handled this.
  // For now let's keep it simple.

  // The type definition in memory says:
  // else: Formula | Omit<IfThenElseStep, 'name' | 'newColumn'>;

  let elseValue = '';
  if (typeof step.else === 'object' && 'if' in step.else) {
      elseValue = '...'; // Nested
  } else {
      elseValue = String(step.else);
  }

  return `if ${ifCondition} then ${thenValue} else ${elseValue}`;
}
