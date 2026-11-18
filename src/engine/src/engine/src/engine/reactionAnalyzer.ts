import {
  analyzeFormula,
  compareAtomCounts,
  type AtomCounts
} from './formulaParser';

export interface ReactionSideItem {
  formula: string;
  coefficient: number;
}

export interface ReactionBalanceResult {
  balanced: boolean;
  valid: boolean;
  leftAtoms: AtomCounts;
  rightAtoms: AtomCounts;
  differences: AtomCounts;
  message: string;
}

function calculateSide(
  items: ReactionSideItem[]
): AtomCounts {
  const totals: AtomCounts = {};

  for (const item of items) {
    if (
      !Number.isInteger(item.coefficient) ||
      item.coefficient <= 0
    ) {
      throw new Error('Katsayı pozitif bir tam sayı olmalıdır.');
    }

    const analysis = analyzeFormula(item.formula);

    if (!analysis.valid) {
      throw new Error(
        `${item.formula}: ${analysis.error}`
      );
    }

    for (const element in analysis.atoms) {
      totals[element] =
        (totals[element] ?? 0) +
        analysis.atoms[element] * item.coefficient;
    }
  }

  return totals;
}

export function analyzeReactionBalance(
  left: ReactionSideItem[],
  right: ReactionSideItem[]
): ReactionBalanceResult {
  try {
    if (!left.length || !right.length) {
      throw new Error(
        'Reaksiyonun iki tarafında da maddeler bulunmalıdır.'
      );
    }

    const leftAtoms = calculateSide(left);
    const rightAtoms = calculateSide(right);

    const allElements = new Set([
      ...Object.keys(leftAtoms),
      ...Object.keys(rightAtoms)
    ]);

    const differences: AtomCounts = {};

    for (const element of allElements) {
      const difference =
        (leftAtoms[element] ?? 0) -
        (rightAtoms[element] ?? 0);

      if (difference !== 0) {
        differences[element] = difference;
      }
    }

    const balanced = compareAtomCounts(
      leftAtoms,
      rightAtoms
    );

    return {
      balanced,
      valid: true,
      leftAtoms,
      rightAtoms,
      differences,
      message: balanced
        ? 'Atom sayıları iki tarafta eşit. Denklem atom korunumu açısından dengeli.'
        : 'Denklem atom korunumu açısından dengeli değil. Atom sayıları farklı.'
    };
  } catch (error) {
    return {
      balanced: false,
      valid: false,
      leftAtoms: {},
      rightAtoms: {},
      differences: {},
      message:
        error instanceof Error
          ? error.message
          : 'Reaksiyon analiz edilemedi.'
    };
  }
}
