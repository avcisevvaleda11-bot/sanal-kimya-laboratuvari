import { analyzeFormula } from './formulaParser';
import { analyzeChemicalReaction, analyzeSubstances } from './chemicalEngine';

export interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

function assert(
  condition: boolean,
  message: string
): void {
  if (!condition) {
    throw new Error(message);
  }
}

export function runChemicalEngineTests(): TestResult[] {
  const results: TestResult[] = [];

  function test(name: string, action: () => void) {
    try {
      action();

      results.push({
        name,
        passed: true,
        message: 'Test başarılı.'
      });
    } catch (error) {
      results.push({
        name,
        passed: false,
        message:
          error instanceof Error
            ? error.message
            : 'Bilinmeyen test hatası.'
      });
    }
  }

  test('NaCl formülünü okuma', () => {
    const result = analyzeFormula('NaCl');

    assert(result.valid, 'NaCl okunamadı.');
    assert(result.atoms.Na === 1, 'Na sayısı yanlış.');
    assert(result.atoms.Cl === 1, 'Cl sayısı yanlış.');
  });

  test('Parantezli formül okuma', () => {
    const result = analyzeFormula('Ca(OH)2');

    assert(result.valid, 'Formül okunamadı.');
    assert(result.atoms.Ca === 1, 'Ca sayısı yanlış.');
    assert(result.atoms.O === 2, 'O sayısı yanlış.');
    assert(result.atoms.H === 2, 'H sayısı yanlış.');
  });

  test('Dengeli su oluşumu denklemi', () => {
    const result = analyzeChemicalReaction(
      [
        { formula: 'H2', coefficient: 2 },
        { formula: 'O2', coefficient: 1 }
      ],
      [
        { formula: 'H2O', coefficient: 2 }
      ]
    );

    assert(
      result.reactionBalance?.balanced === true,
      'Denklem dengeli olarak algılanmadı.'
    );
  });

  test('Dengesiz su oluşumu denklemi', () => {
    const result = analyzeChemicalReaction(
      [
        { formula: 'H2', coefficient: 1 },
        { formula: 'O2', coefficient: 1 }
      ],
      [
        { formula: 'H2O', coefficient: 1 }
      ]
    );

    assert(
      result.reactionBalance?.balanced === false,
      'Denklem dengesiz olarak algılanmadı.'
    );
  });

  test('Bilinmeyen madde uyarısı', () => {
    const result = analyzeSubstances([
      { formula: 'NaCl' },
      { formula: 'XeF6' }
    ]);

    assert(
      result.warnings.some(warning =>
        warning.includes('veritabanında')
      ),
      'Bilinmeyen madde uyarısı verilmedi.'
    );
  });

  return results;
}