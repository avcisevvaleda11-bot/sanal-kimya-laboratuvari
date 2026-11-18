
import type { ReactionData } from '../data/reactions';

export interface IonicEquationValidation {
  valid: boolean;
  atomBalanced: boolean;
  chargeBalanced: boolean;
  spectatorIonsValid: boolean;
  errors: string[];
}

interface Species {
  formula: string;
  coefficient: number;
  charge: number;
}

function parseSpecies(token: string): Species | null {
  const match = token.trim().match(
    /^(\d+)?\s*([A-Za-z0-9()]+)(?:\^(\d+)?([+\-−])|(\d+)?([+\-−]))?\((aq|s|l|g)\)$/
  );

  if (!match) return null;

  const coefficient = Number(match[1] || 1);
  const formula = match[2];
  const chargeMagnitude = Number(match[3] || match[5] || 1);
  const chargeSign = match[4] || match[6] || '';

  if (!Number.isInteger(coefficient) || coefficient < 1) {
    return null;
  }

  const charge =
    chargeSign === '+' ? chargeMagnitude :
    chargeSign === '-' || chargeSign === '−'
      ? -chargeMagnitude
      : 0;

  return { formula, coefficient, charge };
}

function splitSide(side: string): Species[] | null {
  const tokens = side.trim().split(/\s+\+\s+/);

  if (!tokens.length || tokens.some(token => !token.trim())) {
    return null;
  }

  const result: Species[] = [];

  for (const token of tokens) {
    const species = parseSpecies(token);
    if (!species) return null;
    result.push(species);
  }

  return result;
}

function countAtoms(
  formula: string
): Record<string, number> | null {
  const tokens = formula.match(/[A-Z][a-z]?|\d+|\(|\)/g);

  if (!tokens || tokens.join('') !== formula) {
    return null;
  }

  let index = 0;

  function parseGroup(): Record<string, number> | null {
    const counts: Record<string, number> = {};

    while (index < tokens.length) {
      const token = tokens[index];

      if (token === ')') {
        index++;
        return counts;
      }

      if (token === '(') {
        index++;

        const inner = parseGroup();
        if (!inner) return null;

        const multiplier = Number(tokens[index]) || 1;

        if (/^\d+$/.test(tokens[index] || '')) {
          index++;
        }

        for (const element in inner) {
          counts[element] =
            (counts[element] || 0) +
            inner[element] * multiplier;
        }

        continue;
      }

      if (/^[A-Z][a-z]?$/.test(token)) {
        index++;

        const multiplier = Number(tokens[index]) || 1;

        if (/^\d+$/.test(tokens[index] || '')) {
          index++;
        }

        counts[token] =
          (counts[token] || 0) + multiplier;

        continue;
      }

      return null;
    }

    return counts;
  }

  const result = parseGroup();

  if (!result || index !== tokens.length) {
    return null;
  }

  return result;
}

function parseEquation(equation: string) {
  const sides = equation.split('→');

  if (sides.length !== 2) return null;

  const left = splitSide(sides[0]);
  const right = splitSide(sides[1]);

  if (!left || !right) return null;

  return { left, right };
}

function validateBalance(equation: string) {
  const parsed = parseEquation(equation);

  if (!parsed) {
    return {
      valid: false,
      atomBalanced: false,
      chargeBalanced: false
    };
  }

  const atomTotals: Record<string, number>[] = [{}, {}];
  const chargeTotals = [0, 0];

  const sides = [parsed.left, parsed.right];

  for (let sideIndex = 0; sideIndex < 2; sideIndex++) {
    for (const species of sides[sideIndex]) {
      const atoms = countAtoms(species.formula);

      if (!atoms) {
        return {
          valid: false,
          atomBalanced: false,
          chargeBalanced: false
        };
      }

      for (const element in atoms) {
        atomTotals[sideIndex][element] =
          (atomTotals[sideIndex][element] || 0) +
          atoms[element] * species.coefficient;
      }

      chargeTotals[sideIndex] +=
        species.charge * species.coefficient;
    }
  }

  const elements = new Set([
    ...Object.keys(atomTotals[0]),
    ...Object.keys(atomTotals[1])
  ]);

  const atomBalanced = [...elements].every(
    element =>
      atomTotals[0][element] === atomTotals[1][element]
  );

  const chargeBalanced =
    chargeTotals[0] === chargeTotals[1];

  return {
    valid: atomBalanced && chargeBalanced,
    atomBalanced,
    chargeBalanced
  };
}

function ionKey(species: Species): string {
  const sign = species.charge > 0 ? '+' : '-';
  const magnitude = Math.abs(species.charge);

  return `${species.formula}${sign}${magnitude === 1 ? '' : magnitude}`;
}

function findSpectatorIons(
  equation: string
): string[] | null {
  const parsed = parseEquation(equation);

  if (!parsed) return null;

  const left = new Map<string, number>();
  const right = new Map<string, number>();

  for (const species of parsed.left) {
    if (species.charge === 0) continue;

    const key = ionKey(species);

    left.set(
      key,
      (left.get(key) || 0) + species.coefficient
    );
  }

  for (const species of parsed.right) {
    if (species.charge === 0) continue;

    const key = ionKey(species);

    right.set(
      key,
      (right.get(key) || 0) + species.coefficient
    );
  }

  return [...left.entries()]
    .filter(([ion, amount]) => right.get(ion) === amount)
    .map(([ion]) => ion);
}

function normalizeIon(ion: string): string {
  return ion
    .replace(/\s/g, '')
    .replace(/−/g, '-')
    .replace(/\^/g, '');
}

export function validateIonicEquation(
  reaction: ReactionData
): IonicEquationValidation {
  const errors: string[] = [];

  const complete = validateBalance(
    reaction.completeIonicEquation
  );

  const net = validateBalance(
    reaction.netIonicEquation
  );

  if (!complete.valid) {
    errors.push(
      'Tam iyonik denklemde atom veya yük korunumu sağlanmıyor ya da denklem okunamıyor.'
    );
  }

  if (!net.valid) {
    errors.push(
      'Net iyonik denklemde atom veya yük korunumu sağlanmıyor ya da denklem okunamıyor.'
    );
  }

  const foundSpectators = findSpectatorIons(
    reaction.completeIonicEquation
  );

  const expected = reaction.spectatorIons
    .map(normalizeIon)
    .sort();

  const actual = (foundSpectators || [])
    .map(normalizeIon)
    .sort();

  const spectatorIonsValid =
    foundSpectators !== null &&
    expected.length === actual.length &&
    expected.every((ion, index) => ion === actual[index]);

  if (!spectatorIonsValid) {
    errors.push(
      'Seyirci iyon listesi tam iyonik denklemle uyuşmuyor.'
    );
  }

  return {
    valid:
      complete.valid &&
      net.valid &&
      spectatorIonsValid,
    atomBalanced:
      complete.atomBalanced && net.atomBalanced,
    chargeBalanced:
      complete.chargeBalanced && net.chargeBalanced,
    spectatorIonsValid,
    errors
  };
}
