
import { reactions, type ReactionData } from '../data/reactions';

export interface ReactionResult {
  found: boolean;
  reaction: ReactionData | null;
  message: string;
}

function normalizeFormula(formula: string): string {
  return formula
    .replace(/\s/g, '')
    .replace(/^\d+/, '');
}

function sortFormulas(formulas: string[]): string[] {
  return formulas.map(normalizeFormula).sort();
}

export function findReaction(
  selectedFormulas: string[]
): ReactionResult {
  if (selectedFormulas.length < 2) {
    return {
      found: false,
      reaction: null,
      message: 'Tepkime analizi için en az iki madde seçmelisin.'
    };
  }

  const selected = sortFormulas(selectedFormulas);

  const match = reactions.find((reaction: ReactionData) => {
    const reactants = sortFormulas(reaction.reactants);

    return (
      selected.length === reactants.length &&
      selected.every((formula, index) => formula === reactants[index])
    );
  });

  if (!match) {
    return {
      found: false,
      reaction: null,
      message:
        'Bu kombinasyon doğrulanmış tepkime veritabanında bulunmuyor. Bilimsel doğrulama olmadan sonuç üretilmedi.'
    };
  }

  return {
    found: true,
    reaction: match,
    message: 'Tepkime veritabanında eşleşme bulundu.'
  };
}
