
export interface CompoundData {
  id: string;
  name: string;
  formula: string;
  molarMass: number;
  state: "solid" | "liquid" | "gas" | "aqueous";
  category: string;
  solubleInWater: boolean;
}

export const compounds: CompoundData[] = [
  {
    id: "water",
    name: "Su",
    formula: "H2O",
    molarMass: 18.015,
    state: "liquid",
    category: "Oksit",
    solubleInWater: true
  },
  {
    id: "sodium-chloride",
    name: "Sodyum klorür",
    formula: "NaCl",
    molarMass: 58.44,
    state: "solid",
    category: "Tuz",
    solubleInWater: true
  },
  {
    id: "hydrochloric-acid",
    name: "Hidroklorik asit",
    formula: "HCl",
    molarMass: 36.46,
    state: "aqueous",
    category: "Asit",
    solubleInWater: true
  },
  {
    id: "sulfuric-acid",
    name: "Sülfürik asit",
    formula: "H2SO4",
    molarMass: 98.079,
    state: "aqueous",
    category: "Asit",
    solubleInWater: true
  },
  {
    id: "nitric-acid",
    name: "Nitrik asit",
    formula: "HNO3",
    molarMass: 63.012,
    state: "aqueous",
    category: "Asit",
    solubleInWater: true
  },
  {
    id: "acetic-acid",
    name: "Asetik asit",
    formula: "CH3COOH",
    molarMass: 60.052,
    state: "liquid",
    category: "Zayıf asit",
    solubleInWater: true
  },
  {
    id: "sodium-hydroxide",
    name: "Sodyum hidroksit",
    formula: "NaOH",
    molarMass: 39.997,
    state: "solid",
    category: "Baz",
    solubleInWater: true
  },
  {
    id: "potassium-hydroxide",
    name: "Potasyum hidroksit",
    formula: "KOH",
    molarMass: 56.106,
    state: "solid",
    category: "Baz",
    solubleInWater: true
  },
  {
    id: "calcium-hydroxide",
    name: "Kalsiyum hidroksit",
    formula: "Ca(OH)2",
    molarMass: 74.092,
    state: "solid",
    category: "Baz",
    solubleInWater: true
  },
  {
    id: "ammonia",
    name: "Amonyak",
    formula: "NH3",
    molarMass: 17.031,
    state: "gas",
    category: "Moleküler bileşik",
    solubleInWater: true
  },
  {
    id: "carbon-dioxide",
    name: "Karbondioksit",
    formula: "CO2",
    molarMass: 44.01,
    state: "gas",
    category: "Oksit",
    solubleInWater: true
  },
  {
    id: "oxygen",
    name: "Oksijen",
    formula: "O2",
    molarMass: 31.998,
    state: "gas",
    category: "Element molekülü",
    solubleInWater: false
  },
  {
    id: "hydrogen",
    name: "Hidrojen",
    formula: "H2",
    molarMass: 2.016,
    state: "gas",
    category: "Element molekülü",
    solubleInWater: false
  },
  {
    id: "nitrogen",
    name: "Azot",
    formula: "N2",
    molarMass: 28.014,
    state: "gas",
    category: "Element molekülü",
    solubleInWater: false
  },
  {
    id: "glucose",
    name: "Glikoz",
    formula: "C6H12O6",
    molarMass: 180.156,
    state: "solid",
    category: "Organik bileşik",
    solubleInWater: true
  },
  {
    id: "sucrose",
    name: "Sakkaroz",
    formula: "C12H22O11",
    molarMass: 342.297,
    state: "solid",
    category: "Organik bileşik",
    solubleInWater: true
  },
  {
    id: "calcium-carbonate",
    name: "Kalsiyum karbonat",
    formula: "CaCO3",
    molarMass: 100.086,
    state: "solid",
    category: "Karbonat",
    solubleInWater: false
  },
  {
    id: "silver-nitrate",
    name: "Gümüş nitrat",
    formula: "AgNO3",
    molarMass: 169.872,
    state: "solid",
    category: "Tuz",
    solubleInWater: true
  },
  {
    id: "silver-chloride",
    name: "Gümüş klorür",
    formula: "AgCl",
    molarMass: 143.321,
    state: "solid",
    category: "Tuz",
    solubleInWater: false
  },
  {
    id: "sodium-nitrate",
    name: "Sodyum nitrat",
    formula: "NaNO3",
    molarMass: 84.994,
    state: "solid",
    category: "Tuz",
    solubleInWater: true
  },
  {
    id: "potassium-nitrate",
    name: "Potasyum nitrat",
    formula: "KNO3",
    molarMass: 101.103,
    state: "solid",
    category: "Tuz",
    solubleInWater: true
  },
  {
    id: "calcium-chloride",
    name: "Kalsiyum klorür",
    formula: "CaCl2",
    molarMass: 110.98,
    state: "solid",
    category: "Tuz",
    solubleInWater: true
  },
  {
    id: "magnesium-sulfate",
    name: "Magnezyum sülfat",
    formula: "MgSO4",
    molarMass: 120.366,
    state: "solid",
    category: "Tuz",
    solubleInWater: true
  },
  {
    id: "copper-sulfate",
    name: "Bakır(II) sülfat",
    formula: "CuSO4",
    molarMass: 159.609,
    state: "solid",
    category: "Tuz",
    solubleInWater: true
  },
  {
    id: "sodium-carbonate",
    name: "Sodyum karbonat",
    formula: "Na2CO3",
    molarMass: 105.988,
    state: "solid",
    category: "Karbonat",
    solubleInWater: true
  },
  {
    id: "sodium-bicarbonate",
    name: "Sodyum bikarbonat",
    formula: "NaHCO3",
    molarMass: 84.007,
    state: "solid",
    category: "Bikarbonat",
    solubleInWater: true
  },
  {
    id: "hydrogen-peroxide",
    name: "Hidrojen peroksit",
    formula: "H2O2",
    molarMass: 34.014,
    state: "liquid",
    category: "Peroksit",
    solubleInWater: true
  },
  {
    id: "ethanol",
    name: "Etanol",
    formula: "C2H6O",
    molarMass: 46.069,
    state: "liquid",
    category: "Organik bileşik",
    solubleInWater: true
  },
  {
    id: "methane",
    name: "Metan",
    formula: "CH4",
    molarMass: 16.043,
    state: "gas",
    category: "Organik bileşik",
    solubleInWater: false
  },
  {
    id: "sulfur-dioxide",
    name: "Kükürt dioksit",
    formula: "SO2",
    molarMass: 64.066,
    state: "gas",
    category: "Oksit",
    solubleInWater: true
  },
  {
    id: "barium-sulfate",
    name: "Baryum sülfat",
    formula: "BaSO4",
    molarMass: 233.388,
    state: "solid",
    category: "Tuz",
    solubleInWater: false
  },
  {
    id: "barium-chloride",
    name: "Baryum klorür",
    formula: "BaCl2",
    molarMass: 208.23,
    state: "solid",
    category: "Tuz",
    solubleInWater: true
  },
  {
    id: "sodium-sulfate",
    name: "Sodyum sülfat",
    formula: "Na2SO4",
    molarMass: 142.04,
    state: "solid",
    category: "Tuz",
    solubleInWater: true
  }
];
