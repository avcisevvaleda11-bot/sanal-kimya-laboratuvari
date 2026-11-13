
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

export function findReaction(
  selectedFormulas: string[]
): ReactionResult {
  const selected = selectedFormulas
    .map(normalizeFormula)
    .sort();

  if (selected.length < 2) {
    return {
      found: false,
      reaction: null,
      message: 'Bir tepkimeyi incelemek için en az iki madde seçmelisin.'
    };
  }

  const match = reactions.find(reaction => {
    const reactants = reaction.reactants
      .map(normalizeFormula)
      .sort();

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
        'Bu madde kombinasyonu doğrulanmış tepkime kayıtlarımızda bulunmuyor. Bilimsel doğrulama olmadan sonuç gösterilmedi.'
    };
  }

  return {
    found: true,
    reaction: match,
    message: 'Tepkime veritabanında eşleşme bulundu.'
  };
}
