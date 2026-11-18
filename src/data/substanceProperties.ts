
export type PhysicalState =
  | 'solid'
  | 'liquid'
  | 'gas'
  | 'aqueous'
  | 'unknown';

export type SubstanceCategory =
  | 'element'
  | 'acid'
  | 'base'
  | 'salt'
  | 'oxide'
  | 'organic'
  | 'other';

export interface SubstanceProperties {
  formula: string;
  name: string;
  state: PhysicalState;
  category: SubstanceCategory;
  description: string;
  color: string;
  solubility: string;
}

const substanceDatabase: Record<string, SubstanceProperties> = {
  H2O: {
    formula: 'H2O',
    name: 'Su',
    state: 'liquid',
    category: 'other',
    description: 'Polar yapılı bir moleküler bileşiktir.',
    color: 'Renksiz',
    solubility: 'Birçok polar maddeyle karışabilir.'
  },

  NaCl: {
    formula: 'NaCl',
    name: 'Sodyum klorür',
    state: 'solid',
    category: 'salt',
    description: 'İyonik yapılı bir tuzdur.',
    color: 'Beyaz',
    solubility: 'Suda çözünür.'
  },

  HCl: {
    formula: 'HCl',
    name: 'Hidroklorik asit',
    state: 'aqueous',
    category: 'acid',
    description: 'Sulu çözeltide güçlü bir asittir.',
    color: 'Renksiz',
    solubility: 'Suda çözünür.'
  },

  NaOH: {
    formula: 'NaOH',
    name: 'Sodyum hidroksit',
    state: 'solid',
    category: 'base',
    description: 'Güçlü bir bazdır.',
    color: 'Beyaz',
    solubility: 'Suda çözünür.'
  },

  KOH: {
    formula: 'KOH',
    name: 'Potasyum hidroksit',
    state: 'solid',
    category: 'base',
    description: 'Güçlü bir bazdır.',
    color: 'Beyaz',
    solubility: 'Suda çözünür.'
  },

  AgNO3: {
    formula: 'AgNO3',
    name: 'Gümüş nitrat',
    state: 'solid',
    category: 'salt',
    description: 'Suda çözünebilen iyonik bir tuzdur.',
    color: 'Beyaz',
    solubility: 'Suda çözünür.'
  },

  AgCl: {
    formula: 'AgCl',
    name: 'Gümüş klorür',
    state: 'solid',
    category: 'salt',
    description: 'Suda çok az çözünen bir tuzdur.',
    color: 'Beyaz',
    solubility: 'Suda çözünmez denecek kadar az çözünür.'
  },

  BaCl2: {
    formula: 'BaCl2',
    name: 'Baryum klorür',
    state: 'solid',
    category: 'salt',
    description: 'İyonik yapılı bir baryum tuzudur.',
    color: 'Beyaz',
    solubility: 'Suda çözünür.'
  },

  BaSO4: {
    formula: 'BaSO4',
    name: 'Baryum sülfat',
    state: 'solid',
    category: 'salt',
    description: 'Suda çok az çözünen bir tuzdur.',
    color: 'Beyaz',
    solubility: 'Suda çözünmez denecek kadar az çözünür.'
  },

  Na2SO4: {
    formula: 'Na2SO4',
    name: 'Sodyum sülfat',
    state: 'solid',
    category: 'salt',
    description: 'İyonik yapılı bir tuzdur.',
    color: 'Beyaz',
    solubility: 'Suda çözünür.'
  },

  CaCO3: {
    formula: 'CaCO3',
    name: 'Kalsiyum karbonat',
    state: 'solid',
    category: 'salt',
    description: 'Kireç taşı ve mermerin temel bileşenlerindendir.',
    color: 'Beyaz',
    solubility: 'Suda çok az çözünür.'
  },

  CO2: {
    formula: 'CO2',
    name: 'Karbondioksit',
    state: 'gas',
    category: 'oxide',
    description: 'Karbon ve oksijenden oluşan bir gazdır.',
    color: 'Renksiz',
    solubility: 'Suda bir miktar çözünür.'
  },

  O2: {
    formula: 'O2',
    name: 'Oksijen',
    state: 'gas',
    category: 'element',
    description: 'İki atomlu element molekülüdür.',
    color: 'Renksiz',
    solubility: 'Suda az çözünür.'
  },

  H2: {
    formula: 'H2',
    name: 'Hidrojen',
    state: 'gas',
    category: 'element',
    description: 'İki atomlu element molekülüdür.',
    color: 'Renksiz',
    solubility: 'Suda çok az çözünür.'
  },

  N2: {
    formula: 'N2',
    name: 'Azot',
    state: 'gas',
    category: 'element',
    description: 'Atmosferin büyük bölümünü oluşturan gazdır.',
    color: 'Renksiz',
    solubility: 'Suda az çözünür.'
  },

  CH3COOH: {
    formula: 'CH3COOH',
    name: 'Asetik asit',
    state: 'liquid',
    category: 'organic',
    description: 'Sirkeye karakteristik özelliğini veren organik asittir.',
    color: 'Renksiz',
    solubility: 'Suyla tamamen karışır.'
  },

  NH3: {
    formula: 'NH3',
    name: 'Amonyak',
    state: 'gas',
    category: 'other',
    description: 'Azot ve hidrojen içeren moleküler bileşiktir.',
    color: 'Renksiz',
    solubility: 'Suda çok iyi çözünür.'
  },

  C6H12O6: {
    formula: 'C6H12O6',
    name: 'Glikoz',
    state: 'solid',
    category: 'organic',
    description: 'Canlılarda enerji metabolizmasında kullanılan bir şekerdir.',
    color: 'Beyaz',
    solubility: 'Suda çözünür.'
  }
};

export function getSubstanceProperties(
  formula: string
): SubstanceProperties | undefined {
  return substanceDatabase[formula.trim()];
}
