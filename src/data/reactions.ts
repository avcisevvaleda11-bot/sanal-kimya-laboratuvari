
export interface ReactionEffect {
  occurs: boolean;
  description: string;
  color?: string;
  animation?: 'bubbles' | 'precipitate' | 'heat' | 'cooling' | 'color-change';
}

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
  precipitate?: string;
  gasFormation: boolean;
  effects: {
    gas: ReactionEffect;
    precipitate: ReactionEffect;
    temperature: ReactionEffect;
    colorChange: ReactionEffect;
  };
  experimentSteps: string[];
  scientificExplanation: string;
}

export const reactions: ReactionData[] = [
  {
    id: "acid-base-neutralization",
    name: "Asit-baz nötralleşmesi",
    reactants: ["HCl", "NaOH"],
    products: ["NaCl", "H2O"],
    balancedEquation: "HCl(aq) + NaOH(aq) → NaCl(aq) + H2O(l)",
    completeIonicEquation: "H+(aq) + Cl−(aq) + Na+(aq) + OH−(aq) → Na+(aq) + Cl−(aq) + H2O(l)",
    netIonicEquation: "H+(aq) + OH−(aq) → H2O(l)",
    spectatorIons: ["Na+", "Cl−"],
    observation: "Asit ve baz tepkimeye girerek su ve çözünmüş tuz oluşturur.",
    gasFormation: false,
    effects: {
      gas: { occurs: false, description: "Gaz oluşumu beklenmez." },
      precipitate: { occurs: false, description: "Çözeltide çökelti oluşmaz." },
      temperature: {
        occurs: true,
        description: "Güçlü asit ve güçlü bazın nötralleşmesi ekzotermiktir. Uygun koşullarda sıcaklık artışı gözlenir.",
        animation: "heat"
      },
      colorChange: {
        occurs: false,
        description: "İndikatör eklenmemişse belirgin bir renk değişimi gösterilmez."
      }
    },
    experimentSteps: [
      "Hidroklorik asit çözeltisi sanal behere eklenir.",
      "Sodyum hidroksit çözeltisi eklenir.",
      "Çözeltiler karıştırılır.",
      "Nötralleşme sırasında ısı açığa çıkması gözlenebilir."
    ],
    scientificExplanation: "Hidrojen iyonları ile hidroksit iyonları birleşerek su oluşturur. Tepkime ekzotermiktir."
  },

  {
    id: "silver-chloride-precipitation",
    name: "Gümüş klorür çökelme tepkimesi",
    reactants: ["AgNO3", "NaCl"],
    products: ["AgCl", "NaNO3"],
    balancedEquation: "AgNO3(aq) + NaCl(aq) → AgCl(s) + NaNO3(aq)",
    completeIonicEquation: "Ag+(aq) + NO3−(aq) + Na+(aq) + Cl−(aq) → AgCl(s) + Na+(aq) + NO3−(aq)",
    netIonicEquation: "Ag+(aq) + Cl−(aq) → AgCl(s)",
    spectatorIons: ["Na+", "NO3−"],
    observation: "Karışımda beyaz renkli gümüş klorür çökeleği oluşur.",
    precipitate: "AgCl (beyaz)",
    gasFormation: false,
    effects: {
      gas: { occurs: false, description: "Gaz oluşumu beklenmez." },
      precipitate: {
        occurs: true,
        description: "Beyaz renkli AgCl katısı oluşur.",
        color: "#f3f0df",
        animation: "precipitate"
      },
      temperature: { occurs: false, description: "Belirgin sıcaklık değişimi bu simülasyonda hesaplanmamaktadır." },
      colorChange: { occurs: false, description: "Beyaz çökelek oluşumu dışında indikatör renk değişimi beklenmez." }
    },
    experimentSteps: [
      "Gümüş nitrat çözeltisi sanal behere eklenir.",
      "Sodyum klorür çözeltisi eklenir.",
      "Beyaz çökelek oluşumu gözlenir.",
      "Çökeleğin sıvıdan ayrılması incelenir."
    ],
    scientificExplanation: "Gümüş iyonları ile klorür iyonları birleşerek suda çok az çözünen gümüş klorürü oluşturur."
  },

  {
    id: "barium-sulfate-precipitation",
    name: "Baryum sülfat çökelme tepkimesi",
    reactants: ["BaCl2", "Na2SO4"],
    products: ["BaSO4", "2NaCl"],
    balancedEquation: "BaCl2(aq) + Na2SO4(aq) → BaSO4(s) + 2NaCl(aq)",
    completeIonicEquation: "Ba2+(aq) + 2Cl−(aq) + 2Na+(aq) + SO4^2−(aq) → BaSO4(s) + 2Na+(aq) + 2Cl−(aq)",
    netIonicEquation: "Ba2+(aq) + SO4^2−(aq) → BaSO4(s)",
    spectatorIons: ["Na+", "Cl−"],
    observation: "Beyaz renkli baryum sülfat çökeleği oluşur.",
    precipitate: "BaSO4 (beyaz)",
    gasFormation: false,
    effects: {
      gas: { occurs: false, description: "Gaz oluşumu beklenmez." },
      precipitate: {
        occurs: true,
        description: "Beyaz renkli baryum sülfat katısı oluşur.",
        color: "#f3f0df",
        animation: "precipitate"
      },
      temperature: { occurs: false, description: "Sıcaklık değişimi bu simülasyonda hesaplanmamaktadır." },
      colorChange: { occurs: false, description: "Belirgin indikatör renk değişimi beklenmez." }
    },
    experimentSteps: [
      "Baryum klorür çözeltisi sanal behere eklenir.",
      "Sodyum sülfat çözeltisi eklenir.",
      "Beyaz çökelek oluşumu gözlenir.",
      "Çökeleğin özellikleri incelenir."
    ],
    scientificExplanation: "Baryum iyonları ve sülfat iyonları birleşerek suda çözünürlüğü çok düşük olan baryum sülfatı oluşturur."
  },

  {
    id: "acid-carbonate",
    name: "Asit-karbonat tepkimesi",
    reactants: ["2HCl", "Na2CO3"],
    products: ["2NaCl", "H2O", "CO2"],
    balancedEquation: "2HCl(aq) + Na2CO3(aq) → 2NaCl(aq) + H2O(l) + CO2(g)",
    completeIonicEquation: "2H+(aq) + 2Cl−(aq) + 2Na+(aq) + CO3^2−(aq) → 2Na+(aq) + 2Cl−(aq) + H2O(l) + CO2(g)",
    netIonicEquation: "2H+(aq) + CO3^2−(aq) → H2O(l) + CO2(g)",
    spectatorIons: ["Na+", "Cl−"],
    observation: "Karbondioksit gazı oluşur. Çözeltide gaz kabarcıkları gözlenir.",
    gasFormation: true,
    effects: {
      gas: {
        occurs: true,
        description: "Karbondioksit gazı oluşur. Kabarcıklar sıvı içerisinde yükselir.",
        color: "#d9f4ed",
        animation: "bubbles"
      },
      precipitate: { occurs: false, description: "Çökelti oluşumu beklenmez." },
      temperature: { occurs: false, description: "Sıcaklık değişimi deney koşullarına bağlıdır." },
      colorChange: { occurs: false, description: "İndikatör kullanılmadığında belirgin renk değişimi beklenmez." }
    },
    experimentSteps: [
      "Sodyum karbonat çözeltisi sanal behere eklenir.",
      "Hidroklorik asit çözeltisi eklenir.",
      "Karbondioksit gazı oluşumu gözlenir.",
      "Gaz kabarcıklarının hareketi incelenir."
    ],
    scientificExplanation: "Karbonat iyonları asitten gelen hidrojen iyonlarıyla tepkimeye girerek su ve karbondioksit gazı oluşturur."
  },

  {
    id: "copper-hydroxide-precipitation",
    name: "Bakır(II) hidroksit çökelme tepkimesi",
    reactants: ["CuSO4", "NaOH"],
    products: ["Cu(OH)2", "Na2SO4"],
    balancedEquation: "CuSO4(aq) + 2NaOH(aq) → Cu(OH)2(s) + Na2SO4(aq)",
    completeIonicEquation: "Cu2+(aq) + SO4^2−(aq) + 2Na+(aq) + 2OH−(aq) → Cu(OH)2(s) + 2Na+(aq) + SO4^2−(aq)",
    netIonicEquation: "Cu2+(aq) + 2OH−(aq) → Cu(OH)2(s)",
    spectatorIons: ["Na+", "SO4^2−"],
    observation: "Mavi renkli bakır(II) hidroksit çökeleği oluşur.",
    precipitate: "Cu(OH)2 (mavi)",
    gasFormation: false,
    effects: {
      gas: { occurs: false, description: "Gaz oluşumu beklenmez." },
      precipitate: {
        occurs: true,
        description: "Açık mavi renkli bakır(II) hidroksit çökeleği oluşur.",
        color: "#55a9e8",
        animation: "precipitate"
      },
      temperature: { occurs: false, description: "Sıcaklık değişimi bu simülasyonda hesaplanmamaktadır." },
      colorChange: {
        occurs: true,
        description: "Mavi çökelek oluşumu nedeniyle karışımın görünümü değişir.",
        color: "#55a9e8",
        animation: "color-change"
      }
    },
    experimentSteps: [
      "Bakır(II) sülfat çözeltisi sanal behere eklenir.",
      "Sodyum hidroksit çözeltisi eklenir.",
      "Mavi çökelek oluşumu gözlenir.",
      "Çökeleğin rengini ve görünümünü inceleyin."
    ],
    scientificExplanation: "Bakır(II) iyonları hidroksit iyonlarıyla birleşerek suda az çözünen bakır(II) hidroksiti oluşturur. Sodyum ve sülfat iyonları seyirci iyonlardır."
  },

  {
    id: "iron-hydroxide-precipitation",
    name: "Demir(III) hidroksit çökelme tepkimesi",
    reactants: ["FeCl3", "NaOH"],
    products: ["Fe(OH)3", "NaCl"],
    balancedEquation: "FeCl3(aq) + 3NaOH(aq) → Fe(OH)3(s) + 3NaCl(aq)",
    completeIonicEquation: "Fe3+(aq) + 3Cl−(aq) + 3Na+(aq) + 3OH−(aq) → Fe(OH)3(s) + 3Na+(aq) + 3Cl−(aq)",
    netIonicEquation: "Fe3+(aq) + 3OH−(aq) → Fe(OH)3(s)",
    spectatorIons: ["Na+", "Cl−"],
    observation: "Kızıl kahverengi demir(III) hidroksit çökeleği oluşur.",
    precipitate: "Fe(OH)3 (kızıl kahverengi)",
    gasFormation: false,
    effects: {
      gas: { occurs: false, description: "Gaz oluşumu beklenmez." },
      precipitate: {
        occurs: true,
        description: "Kızıl kahverengi demir(III) hidroksit çökeleği oluşur.",
        color: "#a65332",
        animation: "precipitate"
      },
      temperature: { occurs: false, description: "Sıcaklık değişimi bu simülasyonda hesaplanmamaktadır." },
      colorChange: {
        occurs: true,
        description: "Kızıl kahverengi çökelek oluşumu gözlenir.",
        color: "#a65332",
        animation: "color-change"
      }
    },
    experimentSteps: [
      "Demir(III) klorür çözeltisi sanal behere eklenir.",
      "Sodyum hidroksit çözeltisi eklenir.",
      "Kızıl kahverengi çökelek oluşumu gözlenir.",
      "Çökeleğin görünümü incelenir."
    ],
    scientificExplanation: "Demir(III) iyonları hidroksit iyonlarıyla birleşerek suda az çözünen demir(III) hidroksiti oluşturur. Sodyum ve klorür iyonları seyirci iyonlardır."
  }
];
