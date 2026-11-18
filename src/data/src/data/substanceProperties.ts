export type PhysicalState =
  | 'solid'
  | 'liquid'
  | 'gas'
  | 'aqueous';

export type SubstanceCategory =
  | 'acid'
  | 'base'
  | 'salt'
  | 'oxide'
  | 'organic'
  | 'element'
  | 'other';

export interface SubstanceProperties {
  formula: string;
  name: string;
  category: SubstanceCategory;
  state: PhysicalState;
  solubleInWater: 'soluble' | 'insoluble' | 'limited' | 'unknown';
  strongElectrolyte: boolean | null;
  dissociatesInWater: boolean | null;
  description: string;
}

export const substanceProperties: Record<
  string,
  SubstanceProperties
> = {
  H2O: {
    formula: 'H2O',
    name: 'Su',
    category: 'other',
    state: 'liquid',
    solubleInWater: 'soluble',
    strongElectrolyte: false,
    dissociatesInWater: false,
    description: 'Polar bir çözücü olan su.'
  },

  NaCl: {
    formula: 'NaCl',
    name: 'Sodyum klorür',
    category: 'salt',
    state: 'solid',
    solubleInWater: 'soluble',
    strongElectrolyte: true,
    dissociatesInWater: true,
    description: 'Suda Na+ ve Cl- iyonları oluşturur.'
  },

  HCl: {
    formula: 'HCl',
    name: 'Hidroklorik asit',
    category: 'acid',
    state: 'aqueous',
    solubleInWater: 'soluble',
    strongElectrolyte: true,
    dissociatesInWater: true,
    description: 'Sulu çözeltisinde iyonlaşan güçlü bir asit.'
  },

  NaOH: {
    formula: 'NaOH',
    name: 'Sodyum hidroksit',
    category: 'base',
    state: 'solid',
    solubleInWater: 'soluble',
    strongElectrolyte: true,
    dissociatesInWater: true,
    description: 'Suda iyonlarına ayrılan güçlü bir baz.'
  },

  KOH: {
    formula: 'KOH',
    name: 'Potasyum hidroksit',
    category: 'base',
    state: 'solid',
    solubleInWater: 'soluble',
    strongElectrolyte: true,
    dissociatesInWater: true,
    description: 'Suda iyonlarına ayrılan güçlü bir baz.'
  },

  AgNO3: {
    formula: 'AgNO3',
    name: 'Gümüş nitrat',
    category: 'salt',
    state: 'solid',
    solubleInWater: 'soluble',
    strongElectrolyte: true,
    dissociatesInWater: true,
    description: 'Suda iyonlarına ayrışabilen bir tuz.'
  },

  AgCl: {
    formula: 'AgCl',
    name: 'Gümüş klorür',
    category: 'salt',
    state: 'solid',
    solubleInWater: 'insoluble',
    strongElectrolyte: false,
    dissociatesInWater: false,
    description: 'Suda çok az çözünen bir iyonik bileşik.'
  },

  BaCl2: {
    formula: 'BaCl2',
    name: 'Baryum klorür',
    category: 'salt',
    state: 'solid',
    solubleInWater: 'soluble',
    strongElectrolyte: true,
    dissociatesInWater: true,
    description: 'İyonik yapılı bir tuz.'
  },

  BaSO4: {
    formula: 'BaSO4',
    name: 'Baryum sülfat',
    category: 'salt',
    state: 'solid',
    solubleInWater: 'insoluble',
    strongElectrolyte: false,
    dissociatesInWater: false,
    description: 'Suda çok az çözünen bir iyonik bileşik.'
  },

  Na2SO4: {
    formula: 'Na2SO4',
    name: 'Sodyum sülfat',
    category: 'salt',
    state: 'solid',
    solubleInWater: 'soluble',
    strongElectrolyte: true,
    dissociatesInWater: true,
    description: 'Suda iyonlarına ayrışabilen bir tuz.'
  },

  CaCO3: {
    formula: 'CaCO3',
    name: 'Kalsiyum karbonat',
    category: 'salt',
    state: 'solid',
    solubleInWater: 'insoluble',
    strongElectrolyte: false,
    dissociatesInWater: false,
    description: 'Suda az çözünen bir karbonat.'
  },

  CO2: {
    formula: 'CO2',
    name: 'Karbondioksit',
    category: 'oxide',
    state: 'gas',
    solubleInWater: 'limited',
    strongElectrolyte: false,
    dissociatesInWater: false,
    description: 'Moleküler yapılı bir gaz.'
  },

  O2: {
    formula: 'O2',
    name: 'Oksijen',
    category: 'element',
    state: 'gas',
    solubleInWater: 'limited',
    strongElectrolyte: false,
    dissociatesInWater: false,
    description: 'İki atomlu moleküler element.'
  },

  H2: {
    formula: 'H2',
    name: 'Hidrojen',
    category: 'element',
    state: 'gas',
    solubleInWater: 'limited',
    strongElectrolyte: false,
    dissociatesInWater: false,
    description: 'İki atomlu moleküler element.'
  },

  N2: {
    formula: 'N2',
    name: 'Azot',
    category: 'element',
    state: 'gas',
    solubleInWater: 'limited',
    strongElectrolyte: false,
    dissociatesInWater: false,
    description: 'İki atomlu moleküler element.'
  },

  CH3COOH: {
    formula: 'CH3COOH',
    name: 'Asetik asit',
    category: 'acid',
    state: 'aqueous',
    solubleInWater: 'soluble',
    strongElectrolyte: false,
    dissociatesInWater: true,
    description: 'Suda kısmen iyonlaşan zayıf bir asit.'
  },

  NH3: {
    formula: 'NH3',
    name: 'Amonyak',
    category: 'base',
    state: 'gas',
    solubleInWater: 'soluble',
    strongElectrolyte: false,
    dissociatesInWater: true,
    description: 'Suda bazik özellik gösteren moleküler madde.'
  },

  glucose: {
    formula: 'C6H12O6',
    name: 'Glikoz',
    category: 'organic',
    state: 'solid',
    solubleInWater: 'soluble',
    strongElectrolyte: false,
    dissociatesInWater: false,
    description: 'Suda çözünebilen moleküler bir bileşik.'
  }
};

export function getSubstanceProperties(
  formula: string
): SubstanceProperties | undefined {
  return substanceProperties[formula];
}