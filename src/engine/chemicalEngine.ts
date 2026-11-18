import { analyzeFormula } from './formulaParser';
import {
  analyzeReactionBalance,
  type ReactionSideItem
} from './reactionAnalyzer';
import { getSubstanceProperties } from '../data/substanceProperties';

export interface ChemicalInput {
  formula: string;
  coefficient?: number;
}

export interface SubstanceReport {
  formula: string;
  validFormula: boolean;
  atomCounts: Record<string, number>;
  totalAtoms: number;
  properties: ReturnType<typeof getSubstanceProperties>;
}

export interface ChemicalAnalysisReport {
  success: boolean;
  substances: SubstanceReport[];
  reactionBalance: ReturnType<typeof analyzeReactionBalance> | null;
  warnings: string[];
  summary: string;
}

export function analyzeSubstances(
  inputs: ChemicalInput[]
): ChemicalAnalysisReport {
  const warnings: string[] = [];
  const substances: SubstanceReport[] = [];

  if (inputs.length === 0) {
    return {
      success: false,
      substances: [],
      reactionBalance: null,
      warnings: ['Analiz için en az bir madde girilmelidir.'],
      summary: 'Analiz yapılamadı.'
    };
  }

  for (const input of inputs) {
    const result = analyzeFormula(input.formula);
    const properties = getSubstanceProperties(input.formula);

    substances.push({
      formula: input.formula,
      validFormula: result.valid,
      atomCounts: result.atoms,
      totalAtoms: result.totalAtoms,
      properties
    });

    if (!result.valid) {
      warnings.push(
        `${input.formula}: ${result.error ?? 'Formül okunamadı.'}`
      );
    }

    if (!properties) {
      warnings.push(
        `${input.formula}: Bu maddenin özellikleri henüz veritabanında bulunmuyor.`
      );
    }
  }

  const allValid = substances.every(
    substance => substance.validFormula
  );

  return {
    success: allValid,
    substances,
    reactionBalance: null,
    warnings,
    summary: allValid
      ? 'Maddelerin formülleri okundu. Reaksiyon oluştuğu henüz belirlenmedi.'
      : 'Bazı formüller okunamadı. Lütfen girişleri kontrol edin.'
  };
}

export function analyzeChemicalReaction(
  left: ChemicalInput[],
  right: ChemicalInput[]
): ChemicalAnalysisReport {
  const allInputs = [...left, ...right];
  const substanceReport = analyzeSubstances(allInputs);

  if (!substanceReport.success) {
    return substanceReport;
  }

  const toReactionItems = (
    items: ChemicalInput[]
  ): ReactionSideItem[] =>
    items.map(item => ({
      formula: item.formula,
      coefficient: item.coefficient ?? 1
    }));

  const balance = analyzeReactionBalance(
    toReactionItems(left),
    toReactionItems(right)
  );

  const warnings = [...substanceReport.warnings];

  if (!balance.balanced) {
    warnings.push(
      'Denklem atom korunumu açısından dengeli değil.'
    );
  }

  return {
    success: balance.valid,
    substances: substanceReport.substances,
    reactionBalance: balance,
    warnings,
    summary: balance.valid
      ? balance.balanced
        ? 'Denklem atom korunumu açısından dengeli.'
        : 'Denklem geçerli şekilde okundu ancak dengeli değil.'
      : 'Reaksiyon denklemi analiz edilemedi.'
  };
}