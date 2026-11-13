
import { useState } from 'react';
import { Beaker, Atom, FlaskConical, Search, Plus, Trash2 } from 'lucide-react';
import LabScene from './LabScene';

const substances = [
  { name: 'Su', formula: 'H₂O', type: 'Bileşik' },
  { name: 'Sodyum klorür', formula: 'NaCl', type: 'Bileşik' },
  { name: 'Hidroklorik asit', formula: 'HCl', type: 'Asit' },
  { name: 'Sodyum hidroksit', formula: 'NaOH', type: 'Baz' },
  { name: 'Gümüş nitrat', formula: 'AgNO₃', type: 'Tuz' },
  { name: 'Bakır sülfat', formula: 'CuSO₄', type: 'Tuz' },
  { name: 'Kalsiyum karbonat', formula: 'CaCO₃', type: 'Bileşik' },
  { name: 'Oksijen', formula: 'O₂', type: 'Element' },
  { name: 'Hidrojen', formula: 'H₂', type: 'Element' },
  { name: 'Karbon dioksit', formula: 'CO₂', type: 'Bileşik' },
];

export default function App() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof substances>([]);

  const filtered = substances.filter(s =>
    `${s.name} ${s.formula} ${s.type}`.toLowerCase().includes(search.toLowerCase())
  );

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
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Madde veya formül ara..." />
          </div>
          <div className="substances">
            {filtered.map((s, i) => (
              <button className="substance" key={i} onClick={() => setSelected(old => [...old, s])}>
                <span className="formula">{s.formula}</span>
                <span className="substance-info"><b>{s.name}</b><small>{s.type}</small></span>
                <Plus size={17} />
              </button>
            ))}
          </div>
        </section>

        <section className="panel experiment">
          <div className="panel-title">
            <h3><FlaskConical size={19} /> 3D deney alanı</h3>
            <span>ETKİLEŞİMLİ MODEL</span>
          </div>

          <LabScene />

          <div className="selected-title">SEÇİLEN MADDELER</div>
          {selected.length === 0 ? (
            <p className="empty">Kütüphaneden madde ekleyebilirsin.</p>
          ) : selected.map((s, i) => (
            <div className="selected-item" key={i}>
              <span><b>{s.formula}</b> — {s.name}</span>
              <button onClick={() => setSelected(old => old.filter((_, index) => index !== i))}><Trash2 size={16} /></button>
            </div>
          ))}
          <button className="clear" onClick={() => setSelected([])}>Deney alanını temizle</button>
        </section>
      </div>

      <footer>SANAL KİMYA LABORATUVARI · EĞİTİM VE BİLİM</footer>
    </main>
  );
}
