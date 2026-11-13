
import {
  reactions,
  type ReactionData,
  type ReactionEffect
} from '../data/reactions';

export interface ReactionTableRow {
  property: string;
  result: string;
  observation: string;
}

export interface ReactionResult {
  found: boolean;
  reaction: ReactionData | null;
  message: string;

  effects: {
    gas: ReactionEffect;
    precipitate: ReactionEffect;
    temperature: ReactionEffect;
    colorChange: ReactionEffect;
  } | null;

  experimentSteps: string[];
  scientificExplanation: string;
  resultTable: ReactionTableRow[];
}

function normalizeFormula(formula: string): string {
  return formula
    .replace(/\s/g, '')
    .replace(/^\d+/, '')
    .replace(/−/g, '-');
}

function sortFormulas(formulas: string[]): string[] {
  return formulas.map(normalizeFormula).sort();
}

function createResultTable(
  reaction: ReactionData
): ReactionTableRow[] {
  const effects = reaction.effects;

  return [
    {
      property: 'Gaz oluşumu',
      result: effects.gas.occurs ? 'Var' : 'Yok',
      observation: effects.gas.description
    },
    {
      property: 'Çökelme',
      result: effects.precipitate.occurs ? 'Var' : 'Yok',
      observation: effects.precipitate.description
    },
    {
      property: 'Sıcaklık',
      result: effects.temperature.occurs
        ? 'Isı etkisi bekleniyor'
        : 'Sayısal değişim belirlenmedi',
      observation: effects.temperature.description
    },
    {
      property: 'Renk değişimi',
      result: effects.colorChange.occurs
        ? 'Var'
        : 'Belirgin değişim beklenmiyor',
      observation: effects.colorChange.description
    }
  ];
}

function emptyResult(message: string): ReactionResult {
  return {
    found: false,
    reaction: null,
    message,
    effects: null,
    experimentSteps: [],
    scientificExplanation: '',
    resultTable: []
  };
}

export function findReaction(
  selectedFormulas: string[]
): ReactionResult {
  if (selectedFormulas.length < 2) {
    return emptyResult(
      'Tepkime analizi için en az iki madde seçmelisin.'
    );
  }

  const selected = sortFormulas(selectedFormulas);

  const match = reactions.find((reaction: ReactionData) => {
    const reactants = sortFormulas(reaction.reactants);

    return (
      selected.length === reactants.length &&
      selected.every(
        (formula, index) => formula === reactants[index]
      )
    );
  });

  if (!match) {
    return emptyResult(
      'Bu madde kombinasyonu doğrulanmış tepkime veritabanında bulunmuyor. Bilimsel doğrulama olmadan sonuç üretilmedi.'
    );
  }

  return {
    found: true,
    reaction: match,
    message: `${match.name} için doğrulanmış tepkime eşleşmesi bulundu.`,
    effects: match.effects,
    experimentSteps: [...match.experimentSteps],
    scientificExplanation: match.scientificExplanation,
    resultTable: createResultTable(match)
  };
}
