
import { describe, expect, it } from 'vitest';
import { analyzeFormula } from './formulaParser';
import {
  analyzeChemicalReaction,
  analyzeSubstances
} from './chemicalEngine';
import { validateAllReactions } from './reactionDatabaseAnalyzer';

describe('Kimyasal motor testleri', () => {
  it('NaCl formülünü doğru okur', () => {
    const result = analyzeFormula('NaCl');

    expect(result.valid).toBe(true);
    expect(result.atoms.Na).toBe(1);
    expect(result.atoms.Cl).toBe(1);
  });

  it('Parantezli formülü doğru okur', () => {
    const result = analyzeFormula('Ca(OH)2');

    expect(result.valid).toBe(true);
    expect(result.atoms.Ca).toBe(1);
    expect(result.atoms.O).toBe(2);
    expect(result.atoms.H).toBe(2);
  });

  it('Dengeli denklemi doğru tanır', () => {
    const result = analyzeChemicalReaction(
      [
        { formula: 'H2', coefficient: 2 },
        { formula: 'O2', coefficient: 1 }
      ],
      [
        { formula: 'H2O', coefficient: 2 }
      ]
    );

    expect(result.reactionBalance?.balanced).toBe(true);
  });

  it('Dengesiz denklemi doğru tanır', () => {
    const result = analyzeChemicalReaction(
      [
        { formula: 'H2', coefficient: 1 },
        { formula: 'O2', coefficient: 1 }
      ],
      [
        { formula: 'H2O', coefficient: 1 }
      ]
    );

    expect(result.reactionBalance?.balanced).toBe(false);
  });

  it('Bilinmeyen madde için uyarı verir', () => {
    const result = analyzeSubstances([
      { formula: 'NaCl' },
      { formula: 'XeF6' }
    ]);

    expect(
      result.warnings.some(warning => warning.includes('veritabanında'))
    ).toBe(true);
  });

  it('Veritabanındaki bütün reaksiyonları kontrol eder', () => {
    const results = validateAllReactions();

    expect(results.length).toBeGreaterThan(0);
    expect(results.every(result => result.valid)).toBe(true);
  });

  it('Bütün kayıtlı reaksiyonlar dengeli olmalıdır', () => {
    const results = validateAllReactions();

    for (const result of results) {
      expect(
        result.balanced,
        `${result.name} reaksiyonu dengeli değil.`
      ).toBe(true);
    }
  });
});
