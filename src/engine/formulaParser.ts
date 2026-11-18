export type AtomCounts = Record<string, number>;

export interface FormulaAnalysis {
  formula: string;
  atoms: AtomCounts;
  totalAtoms: number;
  valid: boolean;
  error?: string;
}

function parseGroup(
  formula: string,
  startIndex: number
): { atoms: AtomCounts; index: number } {
  const atoms: AtomCounts = {};
  let i = startIndex;

  while (i < formula.length) {
    const char = formula[i];

    // Grup kapanışı
    if (char === ')') {
      return { atoms, index: i + 1 };
    }

    // Alt grup açılışı
    if (char === '(') {
      const group = parseGroup(formula, i + 1);

      if (formula[group.index - 1] !== ')') {
        throw new Error('Parantez eşleşmesi hatalı.');
      }

      let multiplier = '';
      let j = group.index;

      while (j < formula.length && /\d/.test(formula[j])) {
        multiplier += formula[j];
        j++;
      }

      const factor = multiplier ? Number(multiplier) : 1;

      for (const element in group.atoms) {
        atoms[element] =
          (atoms[element] ?? 0) + group.atoms[element] * factor;
      }

      i = j;
      continue;
    }

    // Element sembolü
    if (/[A-Z]/.test(char)) {
      let symbol = char;
      i++;

      while (i < formula.length && /[a-z]/.test(formula[i])) {
        symbol += formula[i];
        i++;
      }

      let number = '';
      while (i < formula.length && /\d/.test(formula[i])) {
        number += formula[i];
        i++;
      }

      const count = number ? Number(number) : 1;

      if (!Number.isInteger(count) || count <= 0) {
        throw new Error('Atom sayısı geçersiz.');
      }

      atoms[symbol] = (atoms[symbol] ?? 0) + count;
      continue;
    }

    throw new Error(`Beklenmeyen karakter: ${char}`);
  }

  return { atoms, index: i };
}

export function analyzeFormula(
  formula: string
): FormulaAnalysis {
  try {
    const cleaned = formula.replace(/\s/g, '');

    if (!cleaned) {
      throw new Error('Formül boş olamaz.');
    }

    const result = parseGroup(cleaned, 0);

    if (result.index !== cleaned.length) {
      throw new Error('Formül tam olarak okunamadı.');
    }

    if (Object.keys(result.atoms).length === 0) {
      throw new Error('Formülde atom bulunamadı.');
    }

    const totalAtoms = Object.values(result.atoms).reduce(
      (sum, count) => sum + count,
      0
    );

    return {
      formula: cleaned,
      atoms: result.atoms,
      totalAtoms,
      valid: true
    };
  } catch (error) {
    return {
      formula,
      atoms: {},
      totalAtoms: 0,
      valid: false,
      error:
        error instanceof Error
          ? error.message
          : 'Formül analiz edilemedi.'
    };
  }
}

export function compareAtomCounts(
  left: AtomCounts,
  right: AtomCounts
): boolean {
  const elements = new Set([
    ...Object.keys(left),
    ...Object.keys(right)
  ]);

  for (const element of elements) {
    if ((left[element] ?? 0) !== (right[element] ?? 0)) {
      return false;
    }
  }

  return true;
}