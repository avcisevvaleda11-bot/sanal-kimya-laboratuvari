
import { useMemo, useRef, useState } from 'react';
import {
  Atom,
  FlaskConical,
  Search,
  Plus,
  Trash2,
  X,
  Beaker,
  Pipette,
  RotateCcw,
  Grip
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

type LabObject = {
  id: string;
  kind: 'substance' | 'equipment';
  substance?: Substance;
  equipment?: string;
  symbol: string;
  x: number;
  y: number;
};

const equipmentList = [
  { name: 'Beher', symbol: '⚗️' },
  { name: 'Erlenmayer', symbol: '🧪' },
  { name: 'Deney tüpü', symbol: '🧫' },
  { name: 'Pipet', symbol: '💧' },
  { name: 'Mezür', symbol: '🥛' }
];

export default function App() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tümü');
  const [objects, setObjects] = useState<LabObject[]>([]);
  const [reactionResult, setReactionResult] = useState<any>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);

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
    const text = `${item.name} ${item.formula} ${item.type}`
      .toLocaleLowerCase('tr');

    const matchesSearch = text.includes(search.toLocaleLowerCase('tr'));

    const matchesCategory =
      category === 'Tümü' ||
      (category === 'Elementler' && item.type === 'Element') ||
      (category === 'Bileşikler' && item.type !== 'Element');

    return matchesSearch && matchesCategory;
  });

  const selectedSubstances = objects
    .filter(item => item.kind === 'substance' && item.substance)
    .map(item => item.substance as Substance);

  function addSubstance(substance: Substance) {
    const board = boardRef.current;
    const width = board?.clientWidth ?? 700;

    const newObject: LabObject = {
      id: `substance-${Date.now()}-${objects.length}`,
      kind: 'substance',
      substance,
      symbol: '💧',
      x: Math.max(15, width / 2 - 55 + (objects.length % 4) * 18),
      y: 45 + (objects.length % 4) * 22
    };

    setObjects(old => [...old, newObject]);
    setReactionResult(null);
  }

  function addEquipment(equipment: typeof equipmentList[number]) {
    const board = boardRef.current;
    const width = board?.clientWidth ?? 700;

    const newObject: LabObject = {
      id: `equipment-${Date.now()}-${objects.length}`,
      kind: 'equipment',
      equipment: equipment.name,
      symbol: equipment.symbol,
      x: Math.max(15, width / 2 - 65 + (objects.length % 4) * 22),
      y: 135 + (objects.length % 3) * 24
    };

    setObjects(old => [...old, newObject]);
  }

  function moveObject(
    id: string,
    event: React.PointerEvent<HTMLDivElement>
  ) {
    const board = boardRef.current;
    if (!board) return;

    const rect = board.getBoundingClientRect();

    const x = Math.max(
      5,
      Math.min(rect.width - 110, event.clientX - rect.left - 48)
    );

    const y = Math.max(
      5,
      Math.min(rect.height - 100, event.clientY - rect.top - 35)
    );

    setObjects(old =>
      old.map(item =>
        item.id === id ? { ...item, x, y } : item
      )
    );
  }

  function analyzeReaction() {
    const result = findReaction(
      selectedSubstances.map(item => item.formula)
    );
    setReactionResult(result);
  }

  function removeObject(id: string) {
    setObjects(old => old.filter(item => item.id !== id));
    setReactionResult(null);
  }

  function clearBoard() {
    setObjects([]);
    setReactionResult(null);
  }

  return (
    <main className="app" style={{ minHeight: '100vh' }}>
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
        <p>
          Maddeleri seç, deney araçlarını yerleştir ve
          kendi deney ortamını oluştur.
        </p>
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
              onChange={event => setSearch(event.target.value)}
              placeholder="Madde veya formül ara..."
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                aria-label="Aramayı temizle"
              >
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
                title="Deney masasına ekle"
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
            <h3>
              <FlaskConical size={19} />
              Deney laboratuvarı
            </h3>
            <span>ETKİLEŞİMLİ ÇALIŞMA ALANI</span>
          </div>

          <div style={{
            background: '#071c22',
            borderRadius: 14,
            padding: 10,
            marginBottom: 15
          }}>
            <LabScene />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 10,
            marginBottom: 12
          }}>
            <div>
              <h3 style={{ margin: 0, color: '#d9f3ed' }}>
                <Grip size={17} style={{ verticalAlign: 'middle' }} />
                {' '}Deney masası
              </h3>
              <small style={{ color: '#91aaa9' }}>
                Nesneleri parmağınla tutup istediğin yere taşı.
              </small>
            </div>

            <button
              className="clear"
              onClick={clearBoard}
            >
              <RotateCcw size={15} />
              Masayı temizle
            </button>
          </div>

          <div
            ref={boardRef}
            style={{
              position: 'relative',
              width: '100%',
              minHeight: 440,
              overflow: 'hidden',
              borderRadius: 16,
              border: '1px solid #28545a',
              background:
                'radial-gradient(ellipse at 50% 30%, #16434a 0%, #0b252d 55%, #07191f 100%)',
              touchAction: 'pan-y',
              boxShadow: 'inset 0 0 35px #020c10'
            }}
          >
            <div style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.13,
              pointerEvents: 'none',
              backgroundImage:
                'linear-gradient(#8bc7bd 1px, transparent 1px), linear-gradient(90deg, #8bc7bd 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }} />

            <div style={{
              position: 'absolute',
              top: 12,
              left: 14,
              color: '#9bbdb8',
              fontSize: 10,
              letterSpacing: 2,
              pointerEvents: 'none'
            }}>
              VIRTUAL LAB · WORKSPACE 01
            </div>

            {objects.length === 0 && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#a2c2bd',
                textAlign: 'center',
                padding: 20,
                pointerEvents: 'none'
              }}>
                <Beaker size={48} strokeWidth={1} />
                <h3 style={{ marginBottom: 5 }}>
                  Deney masan hazır
                </h3>
                <p style={{ fontSize: 13, maxWidth: 260 }}>
                  Soldaki kütüphaneden madde veya aşağıdaki
                  araçlardan ekipman ekleyerek başla.
                </p>
              </div>
            )}

            {objects.map(item => (
              <div
                key={item.id}
                onPointerDown={event => {
                  event.preventDefault();
                  setDraggingId(item.id);
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={event => {
                  if (draggingId === item.id) {
                    moveObject(item.id, event);
                  }
                }}
                onPointerUp={event => {
                  setDraggingId(null);
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                  }
                }}
                onPointerCancel={() => setDraggingId(null)}
                style={{
                  position: 'absolute',
                  left: item.x,
                  top: item.y,
                  width: 100,
                  minHeight: 76,
                  borderRadius: 13,
                  border: draggingId === item.id
                    ? '2px solid #8ce6d1'
                    : '1px solid #56858a',
                  background: item.kind === 'substance'
                    ? 'linear-gradient(145deg, #1c5056, #10343d)'
                    : 'linear-gradient(145deg, #31515b, #1a343e)',
                  color: '#effffb',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  padding: 7,
                  boxSizing: 'border-box',
                  cursor: draggingId === item.id ? 'grabbing' : 'grab',
                  userSelect: 'none',
                  touchAction: 'none',
                  zIndex: draggingId === item.id ? 10 : 2,
                  boxShadow: draggingId === item.id
                    ? '0 8px 25px #0009'
                    : '0 4px 12px #0005'
                }}
              >
                <button
                  onPointerDown={event => event.stopPropagation()}
                  onClick={event => {
                    event.stopPropagation();
                    removeObject(item.id);
                  }}
                  aria-label="Nesneyi kaldır"
                  style={{
                    position: 'absolute',
                    top: 3,
                    right: 4,
                    border: 0,
                    background: 'transparent',
                    color: '#d4eeea',
                    padding: 2,
                    cursor: 'pointer'
                  }}
                >
                  <X size={13} />
                </button>

                <span style={{ fontSize: 25 }}>
                  {item.kind === 'substance'
                    ? '🧴'
                    : item.symbol}
                </span>

                <b style={{
                  fontSize: 12,
                  textAlign: 'center',
                  overflowWrap: 'anywhere'
                }}>
                  {item.kind === 'substance'
                    ? item.substance?.formula
                    : item.equipment}
                </b>

                <small style={{
                  color: '#b6d5d0',
                  fontSize: 9,
                  textAlign: 'center'
                }}>
                  {item.kind === 'substance'
                    ? item.substance?.name
                    : 'Deney ekipmanı'}
                </small>
              </div>
            ))}

            <div style={{
              position: 'absolute',
              bottom: 10,
              right: 12,
              color: '#719b98',
              fontSize: 10,
              pointerEvents: 'none'
            }}>
              {objects.length} nesne
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <div className="panel-title">
              <h3><FlaskConical size={18} /> Deney malzemeleri</h3>
              <span>EKİPMAN KÜTÜPHANESİ</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))',
              gap: 9
            }}>
              {equipmentList.map(equipment => (
                <button
                  key={equipment.name}
                  onClick={() => addEquipment(equipment)}
                  style={{
                    minHeight: 76,
                    borderRadius: 12,
                    border: '1px solid #31585d',
                    background: '#102d34',
                    color: '#e0f3ef',
                    padding: 10,
                    cursor: 'pointer'
                  }}
                >
                  <span style={{
                    display: 'block',
                    fontSize: 23,
                    marginBottom: 5
                  }}>
                    {equipment.symbol}
                  </span>
                  <b style={{ fontSize: 12 }}>
                    {equipment.name}
                  </b>
                  <small style={{
                    display: 'block',
                    color: '#8eb6b0',
                    marginTop: 4
                  }}>
                    <Plus size={11} style={{ verticalAlign: 'middle' }} />
                    {' '}Masaya ekle
                  </small>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <div className="selected-title">
              DENEYDEKİ MADDELER ({selectedSubstances.length})
            </div>

            {selectedSubstances.length === 0 ? (
              <p className="empty">
                Henüz deney masasına madde eklemedin.
              </p>
            ) : (
              selectedSubstances.map((item, index) => (
                <div
                  className="selected-item"
                  key={`${item.id}-${index}`}
                >
                  <span>
                    <b>{item.formula}</b> — {item.name}
                    {item.molarMass !== undefined && (
                      <small> · {item.molarMass} g/mol</small>
                    )}
                  </span>
                  <button
                    onClick={() => {
                      const object = objects.filter(
                        entry => entry.kind === 'substance' &&
                          entry.substance?.id === item.id
                      )[index];

                      if (object) removeObject(object.id);
                    }}
                    aria-label="Maddeyi kaldır"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          <button
            className="analyze"
            onClick={analyzeReaction}
            disabled={selectedSubstances.length < 2}
            style={{ width: '100%', marginTop: 15 }}
          >
            <Beaker size={17} />
            Tepkimeleri incele
          </button>

          {reactionResult && (
            <div className="reaction-result">
              <h3>Tepkime analizi</h3>
              <p>{reactionResult.message}</p>

              {reactionResult.found && reactionResult.reaction && (
                <>
                  <h4>{reactionResult.reaction.name}</h4>
                  <p>
                    <b>Denklem:</b>{' '}
                    {reactionResult.reaction.balancedEquation}
                  </p>
                  <p>
                    <b>Tam iyonik:</b>{' '}
                    {reactionResult.reaction.completeIonicEquation}
                  </p>
                  <p>
                    <b>Net iyonik:</b>{' '}
                    {reactionResult.reaction.netIonicEquation}
                  </p>
                  <p>
                    <b>Seyirci iyonlar:</b>{' '}
                    {reactionResult.reaction.spectatorIons.join(', ')}
                  </p>
                  <p>
                    <b>Gözlem:</b>{' '}
                    {reactionResult.reaction.observation}
                  </p>
                  {reactionResult.reaction.precipitate && (
                    <p>
                      <b>Çökelek:</b>{' '}
                      {reactionResult.reaction.precipitate}
                    </p>
                  )}
                  <p>
                    <b>Gaz oluşumu:</b>{' '}
                    {reactionResult.reaction.gasFormation ? 'Var' : 'Yok'}
                  </p>
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
