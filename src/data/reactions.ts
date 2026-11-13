
export interface ReactionData {
  id: string;
  name: string;
  reactants: string[];
  products: string[];
  balancedEquation: string;
  completeIonicEquation: string;
  netIonicEquation: string;
  spectatorIons: string[];
  observation: string;
  precipitate: string | null;
  gasFormation: boolean;
}

export const reactions: ReactionData[] = [
  {
    id: "neutralization-hcl-naoh",
    name: "Hidroklorik asit ile sodyum hidroksitin nötrleşmesi",
    reactants: ["HCl", "NaOH"],
    products: ["NaCl", "H2O"],
    balancedEquation:
      "HCl(aq) + NaOH(aq) → NaCl(aq) + H2O(l)",
    completeIonicEquation:
      "H+(aq) + Cl−(aq) + Na+(aq) + OH−(aq) → Na+(aq) + Cl−(aq) + H2O(l)",
    netIonicEquation:
      "H+(aq) + OH−(aq) → H2O(l)",
    spectatorIons: ["Na+", "Cl−"],
    observation:
      "Asit ve baz arasında nötrleşme gerçekleşir. Su ve sodyum klorür oluşur.",
    precipitate: null,
    gasFormation: false
  },
  {
    id: "precipitation-agcl",
    name: "Gümüş klorür çökelme tepkimesi",
    reactants: ["AgNO3", "NaCl"],
    products: ["AgCl", "NaNO3"],
    balancedEquation:
      "AgNO3(aq) + NaCl(aq) → AgCl(s) + NaNO3(aq)",
    completeIonicEquation:
      "Ag+(aq) + NO3−(aq) + Na+(aq) + Cl−(aq) → AgCl(s) + Na+(aq) + NO3−(aq)",
    netIonicEquation:
      "Ag+(aq) + Cl−(aq) → AgCl(s)",
    spectatorIons: ["Na+", "NO3−"],
    observation:
      "Beyaz renkli gümüş klorür katısı oluşur.",
    precipitate: "AgCl (beyaz)",
    gasFormation: false
  },
  {
    id: "precipitation-baso4",
    name: "Baryum sülfat çökelme tepkimesi",
    reactants: ["BaCl2", "Na2SO4"],
    products: ["BaSO4", "NaCl"],
    balancedEquation:
      "BaCl2(aq) + Na2SO4(aq) → BaSO4(s) + 2NaCl(aq)",
    completeIonicEquation:
      "Ba2+(aq) + 2Cl−(aq) + 2Na+(aq) + SO4 2−(aq) → BaSO4(s) + 2Na+(aq) + 2Cl−(aq)",
    netIonicEquation:
      "Ba2+(aq) + SO4 2−(aq) → BaSO4(s)",
    spectatorIons: ["Na+", "Cl−"],
    observation:
      "Beyaz renkli baryum sülfat çökeleği oluşur.",
    precipitate: "BaSO4 (beyaz)",
    gasFormation: false
  },
  {
    id: "acid-carbonate",
    name: "Asit ile karbonatın tepkimesi",
    reactants: ["2HCl", "Na2CO3"],
    products: ["2NaCl", "H2O", "CO2"],
    balancedEquation:
      "2HCl(aq) + Na2CO3(aq) → 2NaCl(aq) + H2O(l) + CO2(g)",
    completeIonicEquation:
      "2H+(aq) + 2Cl−(aq) + 2Na+(aq) + CO3 2−(aq) → 2Na+(aq) + 2Cl−(aq) + H2O(l) + CO2(g)",
    netIonicEquation:
      "2H+(aq) + CO3 2−(aq) → H2O(l) + CO2(g)",
    spectatorIons: ["Na+", "Cl−"],
    observation:
      "Karbondioksit gazı oluşur.",
    precipitate: null,
    gasFormation: true
  }
];
