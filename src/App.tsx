
import { useMemo, useState } from 'react';
import {
  Atom, FlaskConical, Search, Plus, Trash2, X, Beaker
} from 'lucide-react';
import LabScene from './LabScene';
import { elements } from './data/elements';
import { compounds } from './data/compounds';
import { findReaction } from './engine/reactionEngine';

type Substance = {
  id: string;
  name: string;
  formula: string;
  type: string;
  molarMass?: number;
  state?: string;
};

export default function App() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tümü');
  const [selected, setSelected] = useState<Substance[]>([]);
  const [reactionResult, setReactionResult] = useState<any>(null);

  const substances: Substance[] = useMemo(() => [
    ...elements.map(element => ({
      id: `element-${element.atomicNumber}`,
      name: element.name,
      formula: element.symbol,
      type: 'Element'
    })),
    ...compounds.map(compound => ({
      id: compound.id,
      name: compound.name,
      formula: compound.formula,
      type: compound.category,
      molarMass: compound.molarMass,
      state: compound.state
    }))
  ], []);

  const filtered = substances.filter(item => {
    const matchesSearch =
      `${item.name} ${item.formula} ${item.type}`
        .toLocaleLowerCase('tr')
        .includes(search.toLocaleLowerCase('tr'));

    const matchesCategory =
      category === 'Tümü' ||
      (category === 'Elementler' && item.type === 'Element') ||
      (category === 'Bileşikler' && item.type !== 'Element');

    return matchesSearch && matchesCategory;
  });

  function addSubstance(item: Substance) {
    setSelected(old => [...old, item]);
    setReactionResult(null);
  }

  function analyzeReaction() {
    const result = findReaction(selected.map(item => item.formula));
    setReactionResult(result);
  }

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand">
          <Atom size={30} />
          <div>
            <h1>SANAL KİMYA LABORATUVARI</h1>
            <p>Bilimsel keşif alanı</p>
          </div>
        </div>
        <span className="status">● LABORATUVAR HAZIR</span>
      </header>

      <section className="welcome">
        <p className="eyebrow">VIRTUAL CHEMISTRY EXPERIENCE</p>
        <h2>Kimyanın dünyasını <span>keşfet.</span></h2>
        <p>Maddeleri seç, deneylerini tasarla ve kimyasal değişimleri incele.</p>
      </section>

      <div className="workspace">
        <section className="panel library">
          <div className="panel-title">
            <h3><Atom size={19} /> Madde kütüphanesi</h3>
            <span>{filtered.length} madde</span>
          </div>

          <div className="search">
            <Search size={17} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Madde veya formül ara..."
            />
            {search && (
              <button onClick={() => setSearch('')} aria-label="Aramayı temizle">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="filters">
            {['Tümü', 'Elementler', 'Bileşikler'].map(item => (
              <button
                key={item}
                className={category === item ? 'active' : ''}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="substances">
            {filtered.map(item => (
              <button
                className="substance"
                key={item.id}
                onClick={() => addSubstance(item)}
              >
                <span className="formula">{item.formula}</span>
                <span className="substance-info">
                  <b>{item.name}</b>
                  <small>{item.type}</small>
                </span>
                <Plus size={17} />
              </button>
            ))}

            {filtered.length === 0 && (
              <p className="empty">Aradığın madde bulunamadı.</p>
            )}
          </div>
        </section>

        <section className="panel experiment">
          <div className="panel-title">
            <h3><FlaskConical size={19} /> 3D deney alanı</h3>
            <span>ETKİLEŞİMLİ MODEL</span>
          </div>

          <LabScene />

          <div className="selected-title">
            SEÇİLEN MADDELER ({selected.length})
          </div>

          {selected.length === 0 ? (
            <p className="empty">Kütüphaneden madde ekleyebilirsin.</p>
          ) : (
            selected.map((item, index) => (
              <div className="selected-item" key={`${item.id}-${index}`}>
                <span>
                  <b>{item.formula}</b> — {item.name}
                  {item.molarMass !== undefined && (
                    <small> · {item.molarMass} g/mol</small>
                  )}
                </span>
                <button
                  onClick={() => {
                    setSelected(old => old.filter((_, i) => i !== index));
                    setReactionResult(null);
                  }}
                  aria-label="Maddeyi kaldır"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}

          <button
            className="clear"
            onClick={() => {
              setSelected([]);
              setReactionResult(null);
            }}
          >
            <Trash2 size={15} /> Deney alanını temizle
          </button>

          <button
            className="analyze"
            onClick={analyzeReaction}
            disabled={selected.length < 2}
          >
            <Beaker size={17} /> Tepkimeleri incele
          </button>

          {reactionResult && (
            <div className="reaction-result">
              <h3>Tepkime analizi</h3>
              <p>{reactionResult.message}</p>

              {reactionResult.found && reactionResult.reaction && (
                <>
                  <h4>{reactionResult.reaction.name}</h4>
                  <p><b>Denklem:</b> {reactionResult.reaction.balancedEquation}</p>
                  <p><b>Tam iyonik:</b> {reactionResult.reaction.completeIonicEquation}</p>
                  <p><b>Net iyonik:</b> {reactionResult.reaction.netIonicEquation}</p>
                  <p><b>Seyirci iyonlar:</b> {reactionResult.reaction.spectatorIons.join(', ')}</p>
                  <p><b>Gözlem:</b> {reactionResult.reaction.observation}</p>
                  {reactionResult.reaction.precipitate && (
                    <p><b>Çökelek:</b> {reactionResult.reaction.precipitate}</p>
                  )}
                  <p><b>Gaz oluşumu:</b> {reactionResult.reaction.gasFormation ? 'Var' : 'Yok'}</p>
                </>
              )}
            </div>
          )}
        </section>
      </div>

      <footer>
        SANAL KİMYA LABORATUVARI · EĞİTİM VE BİLİM
      </footer>
    </main>
  );
}

