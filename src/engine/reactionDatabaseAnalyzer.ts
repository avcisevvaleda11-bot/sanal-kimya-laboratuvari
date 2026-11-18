
import { reactions, type ReactionData } from '../data/reactions';
import { analyzeFormula } from './formulaParser';

export interface ReactionValidation {
  id: string;
  name: string;
  balanced: boolean;
  valid: boolean;
  errors: string[];
}

function parseReactionSide(
  formulas: string[]
): { formula: string; coefficient: number }[] {
  return formulas.map(item => {
    const match = item.trim().match(/^(\d+)?\s*(.+)$/);

    if (!match) {
      return { formula: item.trim(), coefficient: 1 };
    }

    return {
      coefficient: match[1] ? Number(match[1]) : 1,
      formula: match[2].trim()
    };
  });
}

function countAtoms(
  items: { formula: string; coefficient: number }[]
): Record<string, number> | null {
  const totals: Record<string, number> = {};

  for (const item of items) {
    const result = analyzeFormula(item.formula);

    if (!result.valid || item.coefficient <= 0) {
      return null;
    }

    for (const [element, count] of Object.entries(result.atoms)) {
      totals[element] =
        (totals[element] ?? 0) + count * item.coefficient;
    }
  }

  return totals;
}

function compareAtoms(
  left: Record<string, number>,
  right: Record<string, number>
): boolean {
  const elements = new Set([
    ...Object.keys(left),
    ...Object.keys(right)
  ]);

  return [...elements].every(
    element => (left[element] ?? 0) === (right[element] ?? 0)
  );
}

export function validateReaction(
  reaction: ReactionData
): ReactionValidation {
  const errors: string[] = [];

  const left = countAtoms(parseReactionSide(reaction.reactants));
  const right = countAtoms(parseReactionSide(reaction.products));

  if (!left || !right) {
    errors.push('Reaksiyon formüllerinden biri okunamadı.');
  }

  const balanced =
    left !== null &&
    right !== null &&
    compareAtoms(left, right);

  if (left && right && !balanced) {
    errors.push('Atom sayıları korunmuyor; denklem dengeli değil.');
  }

  return {
    id: reaction.id,
    name: reaction.name,
    balanced,
    valid: errors.length === 0,
    errors
  };
}

export function validateAllReactions(): ReactionValidation[] {
  return reactions.map(validateReaction);
}
