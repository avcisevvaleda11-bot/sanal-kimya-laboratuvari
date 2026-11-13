
import { reactions, type ReactionData } from "../data/reactions";

export interface ReactionResult {
  found: boolean;
  reaction: ReactionData | null;
  message: string;
}

export function findReaction(
  selectedFormulas: string[]
): ReactionResult {
  const selected = selectedFormulas
    .map(formula => formula.replace(/\s/g, ""))
    .sort();

  if (selected.length < 2) {
    return {
      found: false,
      reaction: null,
      message: "Bir tepkimeyi incelemek için en az iki madde seçmelisin."
    };
  }

  const match = reactions.find(reaction => {
    const reactants = reaction.reactants
      .map(formula => formula.replace(/\s/g, "").replace(/^\d+/, ""))
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
      message: "Bu madde kombinasyonu henüz doğrulanmış tepkime veritabanında bulunmuyor. Bilimsel doğrulama olmadan sonuç gösterilmedi."
    };
  }

  return {
    found: true,
    reaction: match,
    message: "Doğrulanmış tepkime kaydı bulundu."
  };
}
