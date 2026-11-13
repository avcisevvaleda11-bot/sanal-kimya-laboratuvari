
import { useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import {
  Atom,
  FlaskConical,
  Search,
  Plus,
  Trash2,
  X,
  Beaker,
  RotateCcw,
  Grip,
  Play,
  Pause,
  RotateCw,
  Thermometer,
  Waves,
  CheckCircle2,
  FlaskRound
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
  containerId?: string;
  canContain?: boolean;
};

const equipmentList = [
  { name: 'Beher', symbol: '⚗️', canContain: true },
  { name: 'Erlenmayer', symbol: '🧪', canContain: true },
  { name: 'Deney tüpü', symbol: '🧫', canContain: true },
  { name: 'Mezür', symbol: '🥛', canContain: true },
  { name: 'Pipet', symbol: '💧', canContain: false },
  { name: 'Termometre', symbol: '🌡️', canContain: false },
  { name: 'Hassas terazi', symbol: '⚖️', canContain: false },
  { name: 'pH metre', symbol: '📟', canContain: false },
  { name: 'Manyetik karıştırıcı', symbol: '🌀', canContain: false },
  { name: 'Isıtıcı tabla', symbol: '♨️', canContain: false },
  { name: 'Huni', symbol: '🔻', canContain: false },
  { name: 'Cam baget', symbol: '🥢', canContain: false },
  { name: 'Saat camı', symbol: '◯', canContain: false },
  { name: 'Spatül', symbol: '🥄', canContain: false },
  { name: 'Deney tüpü standı', symbol: '🧪', canContain: false },
  { name: 'Yıkama şişesi', symbol: '🚿', canContain: false }
];

const simulationStyles = `
@keyframes labBubble {
  0% { transform: translateY(15px) scale(.6); opacity: 0; }
  35% { opacity: .9; }
  100% { transform: translateY(-65px) scale(1.1); opacity: 0; }
}
@keyframes labPrecipitate {
  0% { transform: translateY(-22px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
@keyframes labHeat {
  0%, 100% { opacity: .35; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.08); }
}
@keyframes labPulse {
  0%, 100% { box-shadow: 0 0 0 rgba(93, 220, 190, 0); }
  50% { box-shadow: 0 0 24px rgba(93, 220, 190, .25); }
}
.lab-bubble {
  position: absolute;
  bottom: 12px;
  width: 9px;
  height: 9px;
  border: 1px solid #b9fff0;
  border-radius: 50%;
  background: #8de9db66;
  animation: labBubble 1.8s infinite ease-out;
}
.lab-bubble:nth-child(2) { animation-delay: .4s; left: 35%; }
.lab-bubble:nth-child(3) { animation-delay: .8s; left: 60%; }
.lab-bubble:nth-child(4) { animation-delay: 1.1s; left: 75%; }
.lab-precipitate {
  animation: labPrecipitate 1.2s ease-out both;
}
.lab-heat {
  animation: labHeat 1.6s infinite ease-in-out;
}
.lab-active {
  animation: labPulse 2s infinite ease-in-out;
}
`;

export default function App() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tümü');
  const [objects, setObjects] = useState<LabObject[]>([]);
  const [reactionResult, setReactionResult] = useState<any>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [selectedContainerId, setSelectedContainerId] = useState('');
  const [stageIndex, setStageIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationFinished, setSimulationFinished] = useState(false);

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

  const containers = objects.filter(
    item => item.kind === 'equipment' && item.canContain
  );

  const activeContainerId = containers.some(
    item => item.id === selectedContainerId
  )
    ? selectedContainerId
    : containers[0]?.id ?? '';

  const activeContainer = containers.find(
    item => item.id === activeContainerId
  );

  const selectedSubstances = objects
    .filter(item => item.kind === 'substance' && item.substance)
    .map(item => item.substance as Substance);

  const containerSubstances = objects
    .filter(
      item =>
        item.kind === 'substance' &&
        item.substance &&
        item.containerId === activeContainerId
    )
    .map(item => item.substance as Substance);

  const experimentSteps: string[] =
    reactionResult?.experimentSteps ?? [];

  useEffect(() => {
    if (!isRunning || !reactionResult?.found || experimentSteps.length === 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setStageIndex(current => {
        if (current + 1 >= experimentSteps.length) {
          window.clearInterval(timer);
          setIsRunning(false);
          setSimulationFinished(true);
          return current;
        }

        return current + 1;
      });
    }, 1800);

    return () => window.clearInterval(timer);
  }, [isRunning, reactionResult, experimentSteps.length]);

  function resetSimulation() {
    setIsRunning(false);
    setStageIndex(0);
    setSimulationFinished(false);
  }

  function addSubstance(substance: Substance) {
    const board = boardRef.current;
    const width = board?.clientWidth ?? 700;

    const newObject: LabObject = {
      id: `substance-${Date.now()}-${Math.random()}`,
      kind: 'substance',
      substance,
      symbol: '💧',
      x: Math.max(10, width / 2 - 50 + (objects.length % 4) * 18),
      y: 45 + (objects.length % 4) * 22
    };

    setObjects(old => [...old, newObject]);
    setReactionResult(null);
    resetSimulation();
  }

  function addEquipment(equipment: typeof equipmentList[number]) {
    const board = boardRef.current;
    const width = board?.clientWidth ?? 700;

    const newObject: LabObject = {
      id: `equipment-${Date.now()}-${Math.random()}`,
      kind: 'equipment',
      equipment: equipment.name,
      symbol: equipment.symbol,
      canContain: equipment.canContain,
      x: Math.max(10, width / 2 - 65 + (objects.length % 4) * 22),
      y: 135 + (objects.length % 3) * 24
    };

    setObjects(old => [...old, newObject]);

    if (equipment.canContain) {
      setSelectedContainerId(newObject.id);
    }
  }

  function moveObject(id: string, event: PointerEvent<HTMLDivElement>) {
    const board = boardRef.current;
    if (!board) return;

    const rect = board.getBoundingClientRect();

    const x = Math.max(
      5,
      Math.min(rect.width - 145, event.clientX - rect.left - 50)
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

  function finishDrag(id: string, event: PointerEvent<HTMLDivElement>) {
    const board = boardRef.current;

    if (!board) {
      setDraggingId(null);
      return;
    }

    const rect = board.getBoundingClientRect();
    const pointX = event.clientX - rect.left;
    const pointY = event.clientY - rect.top;

    const dragged = objects.find(item => item.id === id);

    if (dragged?.kind === 'substance') {
      const target = objects.find(item => {
        if (
          item.kind !== 'equipment' ||
          !item.canContain ||
          item.id === id
        ) {
          return false;
        }

        const contents = objects.filter(
          child => child.containerId === item.id
        );

        const height = 105 + contents.length * 25;

        return (
          pointX >= item.x &&
          pointX <= item.x + 145 &&
          pointY >= item.y &&
          pointY <= item.y + height
        );
      });

      if (target) {
        setObjects(old =>
          old.map(item =>
            item.id === id
              ? { ...item, containerId: target.id }
              : item
          )
        );

        setSelectedContainerId(target.id);
        setReactionResult(null);
        resetSimulation();
      }
    }

    setDraggingId(null);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function startDrag(
    item: LabObject,
    event: PointerEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (item.containerId) {
      const parent = objects.find(
        object => object.id === item.containerId
      );

      setObjects(old =>
        old.map(object =>
          object.id === item.id
            ? {
                ...object,
                containerId: undefined,
                x: (parent?.x ?? item.x) + 15,
                y: (parent?.y ?? item.y) + 45
              }
            : object
        )
      );
    }

    setDraggingId(item.id);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function analyzeReaction() {
    if (!activeContainerId || containerSubstances.length < 2) {
      setReactionResult({
        found: false,
        message: 'Analiz için aynı kabın içinde en az iki madde bulunmalıdır.'
      });
      resetSimulation();
      return;
    }

    const result = findReaction(
      containerSubstances.map(item => item.formula)
    );

    setReactionResult(result);
    resetSimulation();
  }

  function removeObject(id: string) {
    const removed = objects.find(item => item.id === id);

    setObjects(old =>
      old
        .filter(item => item.id !== id)
        .map(item =>
          item.containerId === id
            ? {
                ...item,
                containerId: undefined,
                x: (removed?.x ?? item.x) + 15,
                y: (removed?.y ?? item.y) + 45
              }
            : item
        )
    );

    if (selectedContainerId === id) {
      setSelectedContainerId('');
    }

    setReactionResult(null);
    resetSimulation();
  }

  function clearBoard() {
    setObjects([]);
    setSelectedContainerId('');
    setReactionResult(null);
    resetSimulation();
  }

  function getContainedItems(containerId: string) {
    return objects.filter(item => item.containerId === containerId);
  }

  function getObjectPosition(item: LabObject) {
    if (!item.containerId) {
      return { x: item.x, y: item.y };
    }

    const parent = objects.find(object => object.id === item.containerId);

    if (!parent) {
      return { x: item.x, y: item.y };
    }

    const contents = getContainedItems(item.containerId);
    const index = contents.findIndex(object => object.id === item.id);

    return {
      x: parent.x + 13,
      y: parent.y + 48 + index * 25
    };
  }

  const effects = reactionResult?.effects;

  return (
    <main className="app" style={{ minHeight: '100vh' }}>
      <style>{simulationStyles}</style>

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
                Maddeleri tutup kapların içine bırakabilirsin.
              </small>
            </div>

            <button className="clear" onClick={clearBoard}>
              <RotateCcw size={15} />
              Masayı temizle
            </button>
          </div>

          <div
            ref={boardRef}
            style={{
              position: 'relative',
              width: '100%',
              minHeight: 520,
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
                <h3 style={{ marginBottom: 5 }}>Deney masan hazır</h3>
                <p style={{ fontSize: 13, maxWidth: 260 }}>
                  Madde ve ekipman ekleyerek deneyini oluşturmaya başla.
                </p>
              </div>
            )}

            {objects.map(item => {
              const position = getObjectPosition(item);
              const contained = Boolean(item.containerId);
              const contents = item.kind === 'equipment'
                ? getContainedItems(item.id)
                : [];

              const containerHeight = 105 + contents.length * 25;
              const isSelectedContainer =
                item.id === activeContainerId && item.canContain;

              return (
                <div
                  key={item.id}
                  data-object-id={item.id}
                  onPointerDown={event => startDrag(item, event)}
                  onPointerMove={event => {
                    if (draggingId === item.id) {
                      moveObject(item.id, event);
                    }
                  }}
                  onPointerUp={event => finishDrag(item.id, event)}
                  onPointerCancel={() => setDraggingId(null)}
                  onClick={() => {
                    if (item.kind === 'equipment' && item.canContain) {
                      setSelectedContainerId(item.id);
                      setReactionResult(null);
                      resetSimulation();
                    }
                  }}
                  style={{
                    position: 'absolute',
                    left: position.x,
                    top: position.y,
                    width: contained ? 112 : item.kind === 'equipment' ? 145 : 105,
                    minHeight: contained ? 22 : item.kind === 'equipment' ? containerHeight : 76,
                    borderRadius: contained ? 7 : 13,
                    border: draggingId === item.id
                      ? '2px solid #8ce6d1'
                      : isSelectedContainer
                        ? '2px solid #8ce6d1'
                        : contained
                          ? '1px solid #77bdb0'
                          : '1px solid #56858a',
                    background: contained
                      ? 'linear-gradient(145deg, #286b69, #16464b)'
                      : item.kind === 'substance'
                        ? 'linear-gradient(145deg, #1c5056, #10343d)'
                        : 'linear-gradient(145deg, #31515b, #1a343e)',
                    color: '#effffb',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                    padding: contained ? 4 : 7,
                    boxSizing: 'border-box',
                    cursor: draggingId === item.id ? 'grabbing' : 'grab',
                    userSelect: 'none',
                    touchAction: 'none',
                    zIndex: draggingId === item.id ? 20 : contained ? 5 : 2,
                    boxShadow: isSelectedContainer
                      ? '0 0 18px #6bdcc255'
                      : draggingId === item.id
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

                  {contained ? (
                    <div style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 10
                    }}>
                      <span>💧</span>
                      <b>{item.substance?.formula}</b>
                    </div>
                  ) : (
                    <>
                      <span style={{ fontSize: 25 }}>
                        {item.kind === 'substance' ? '🧴' : item.symbol}
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
                          : item.canContain
                            ? `${contents.length} madde içinde`
                            : 'Deney ekipmanı'}
                      </small>

                      {item.kind === 'equipment' && item.canContain && (
                        <div style={{
                          width: '90%',
                          minHeight: 20,
                          marginTop: 4,
                          borderTop: '1px dashed #8eb6b0',
                          paddingTop: 5,
                          color: '#bde8df',
                          fontSize: 9,
                          textAlign: 'center'
                        }}>
                          {contents.length > 0
                            ? contents.map(child => child.substance?.formula).join(' · ')
                            : 'Madde bırak'}
                        </div>
                      )}

                      {isSelectedContainer && (
                        <small style={{ color: '#a6f5df', fontSize: 9 }}>
                          ✓ Seçili kap
                        </small>
                      )}
                    </>
                  )}
                </div>
              );
            })}

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

                  <b style={{ fontSize: 12 }}>{equipment.name}</b>

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

          <div style={{
            marginTop: 22,
            padding: 16,
            border: '1px solid #31585d',
            borderRadius: 14,
            background: '#0c252d'
          }}>
            <h3 style={{ color: '#d9f3ed', marginTop: 0 }}>
              <FlaskRound size={18} style={{ verticalAlign: 'middle' }} />
              {' '}Deney kabı seçimi
            </h3>

            <p style={{ color: '#9bbdb8', fontSize: 12 }}>
              Analiz, yalnızca seçtiğin kabın içindeki maddeler üzerinden yapılır.
            </p>

            <select
              value={activeContainerId}
              onChange={event => {
                setSelectedContainerId(event.target.value);
                setReactionResult(null);
                resetSimulation();
              }}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 9,
                border: '1px solid #477078',
                background: '#153740',
                color: '#effffb',
                fontSize: 14
              }}
            >
              <option value="">Önce deney kabı ekle</option>
              {containers.map(container => (
                <option key={container.id} value={container.id}>
                  {container.equipment} · {getContainedItems(container.id).length} madde
                </option>
              ))}
            </select>

            <div style={{ marginTop: 14 }}>
              <div style={{
                color: '#a8c9c2',
                fontSize: 11,
                letterSpacing: 1,
                marginBottom: 8
              }}>
                SEÇİLİ KABIN İÇERİĞİ
              </div>

              {containerSubstances.length === 0 ? (
                <p style={{ color: '#8ba9a5', fontSize: 13 }}>
                  Bu kapta henüz madde yok. Kütüphaneden madde ekleyip kabın içine sürükle.
                </p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {containerSubstances.map((item, index) => (
                    <span
                      key={`${item.id}-${index}`}
                      style={{
                        padding: '7px 10px',
                        borderRadius: 8,
                        background: '#1c4d50',
                        color: '#d9f3ed',
                        fontSize: 12
                      }}
                    >
                      {item.formula} · {item.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              className="analyze"
              onClick={analyzeReaction}
              disabled={!activeContainerId || containerSubstances.length < 2}
              style={{ width: '100%', marginTop: 15 }}
            >
              <Beaker size={17} />
              Seçili kaptaki maddeleri analiz et
            </button>
          </div>

          <div style={{ marginTop: 20 }}>
            <div className="selected-title">
              MASADAKİ TÜM MADDELER ({selectedSubstances.length})
            </div>

            {selectedSubstances.length === 0 ? (
              <p className="empty">
                Henüz deney masasına madde eklemedin.
              </p>
            ) : (
              selectedSubstances.map((item, index) => (
                <div className="selected-item" key={`${item.id}-${index}`}>
                  <span>
                    <b>{item.formula}</b> — {item.name}
                    {item.molarMass !== undefined && (
                      <small> · {item.molarMass} g/mol</small>
                    )}
                  </span>

                  <button
                    onClick={() => {
                      const object = objects.filter(
                        entry =>
                          entry.kind === 'substance' &&
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

          {reactionResult && (
            <section
              className="reaction-result"
              style={{
                marginTop: 22,
                padding: 18,
                borderRadius: 15,
                border: '1px solid #477078',
                background: '#0b252d',
                color: '#e4f5f0'
              }}
            >
              <h3 style={{ marginTop: 0 }}>
                <Atom size={19} style={{ verticalAlign: 'middle' }} />
                {' '}Tepkime analiz raporu
              </h3>

              <p style={{ color: '#b7d4ce' }}>
                {reactionResult.message}
              </p>

              {reactionResult.found && reactionResult.reaction && (
                <>
                  <div style={{
                    padding: 14,
                    borderRadius: 10,
                    background: '#123b40',
                    margin: '14px 0'
                  }}>
                    <h3 style={{ margin: '0 0 8px', color: '#9ce9d7' }}>
                      {reactionResult.reaction.name}
                    </h3>
                    <p style={{ margin: 0, fontSize: 14 }}>
                      {reactionResult.reaction.balancedEquation}
                    </p>
                  </div>

                  <h4>Deney simülasyonu</h4>

                  <div
                    className={isRunning ? 'lab-active' : ''}
                    style={{
                      position: 'relative',
                      minHeight: 155,
                      overflow: 'hidden',
                      borderRadius: 13,
                      border: '1px solid #477078',
                      background: 'linear-gradient(160deg, #163c43, #071b23)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 15
                    }}
                  >
                    {effects?.gas?.occurs && stageIndex > 0 && (
                      <div style={{
                        position: 'absolute',
                        inset: 'auto 15% 25px',
                        height: 80,
                        pointerEvents: 'none'
                      }}>
                        <span className="lab-bubble" style={{ left: '15%' }} />
                        <span className="lab-bubble" />
                        <span className="lab-bubble" />
                        <span className="lab-bubble" />
                      </div>
                    )}

                    {effects?.temperature?.occurs && stageIndex > 0 && (
                      <Flame
                        className="lab-heat"
                        size={30}
                        color="#ffb56b"
                      />
                    )}

                    {effects?.precipitate?.occurs && stageIndex > 0 && (
                      <div
                        className="lab-precipitate"
                        style={{
                          position: 'absolute',
                          bottom: 15,
                          width: 95,
                          height: 13,
                          borderRadius: '50%',
                          background: 'linear-gradient(#eee9d4, #b7b6a8)',
                          boxShadow: '0 0 15px #e4e1cc66'
                        }}
                      />
                    )}

                    {effects?.colorChange?.occurs && stageIndex > 0 && (
                      <div style={{
                        width: 55,
                        height: 55,
                        borderRadius: '50%',
                        background: effects.colorChange.color ?? '#5a9d9a',
                        marginBottom: 8
                      }} />
                    )}

                    {!effects?.gas?.occurs &&
                      !effects?.precipitate?.occurs &&
                      !effects?.temperature?.occurs &&
                      !effects?.colorChange?.occurs && (
                        <Waves size={34} color="#83c9bc" />
                    )}

                    <b style={{
                      position: 'relative',
                      zIndex: 2,
                      marginTop: 8,
                      textAlign: 'center'
                    }}>
                      {stageIndex === 0
                        ? 'Deney henüz başlatılmadı'
                        : simulationFinished
                          ? 'Simülasyon tamamlandı'
                          : 'Tepkime gözlemleniyor'}
                    </b>

                    <small style={{
                      position: 'relative',
                      zIndex: 2,
                      color: '#a8c9c2',
                      textAlign: 'center',
                      marginTop: 6
                    }}>
                      {stageIndex === 0
                        ? 'Başlat düğmesine basarak aşamaları izle.'
                        : effects?.gas?.occurs
                          ? 'Gaz oluşumu veritabanındaki gözleme göre gösteriliyor.'
                          : effects?.precipitate?.occurs
                            ? 'Çökelme gözlemi gösteriliyor.'
                            : effects?.temperature?.occurs
                              ? 'Sıcaklık etkisi tanımlanmış.'
                              : 'Veritabanında ek bir görsel etki tanımlanmamış.'}
                    </small>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                    marginTop: 13
                  }}>
                    <button
                      onClick={() => {
                        if (simulationFinished) {
                          setStageIndex(0);
                          setSimulationFinished(false);
                        }
                        setIsRunning(true);
                      }}
                      disabled={isRunning || simulationFinished}
                      style={{
                        flex: 1,
                        minWidth: 100,
                        padding: 11,
                        border: 0,
                        borderRadius: 9,
                        background: '#287d68',
                        color: 'white',
                        cursor: 'pointer',
                        opacity: isRunning || simulationFinished ? .5 : 1
                      }}
                    >
                      <Play size={15} style={{ verticalAlign: 'middle' }} />
                      {' '}Başlat
                    </button>

                    <button
                      onClick={() => setIsRunning(false)}
                      disabled={!isRunning}
                      style={{
                        flex: 1,
                        minWidth: 100,
                        padding: 11,
                        border: '1px solid #477078',
                        borderRadius: 9,
                        background: '#153740',
                        color: '#e4f5f0',
                        cursor: 'pointer',
                        opacity: !isRunning ? .5 : 1
                      }}
                    >
                      <Pause size={15} style={{ verticalAlign: 'middle' }} />
                      {' '}Duraklat
                    </button>

                    <button
                      onClick={resetSimulation}
                      style={{
                        flex: 1,
                        minWidth: 100,
                        padding: 11,
                        border: '1px solid #477078',
                        borderRadius: 9,
                        background: '#153740',
                        color: '#e4f5f0',
                        cursor: 'pointer'
                      }}
                    >
                      <RotateCw size={15} style={{ verticalAlign: 'middle' }} />
                      {' '}Yeniden oynat
                    </button>
                  </div>

                  <div style={{ marginTop: 18 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: '#a8c9c2',
                      fontSize: 12,
                      marginBottom: 7
                    }}>
                      <b>Deney aşamaları</b>
                      <span>
                        {experimentSteps.length > 0
                          ? `${stageIndex}/${experimentSteps.length}`
                          : 'Aşama yok'}
                      </span>
                    </div>

                    <div style={{
                      height: 6,
                      borderRadius: 8,
                      background: '#24434a',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: experimentSteps.length
                          ? `${(stageIndex / experimentSteps.length) * 100}%`
                          : '0%',
                        height: '100%',
                        background: '#72d9bd',
                        transition: 'width .3s ease'
                      }} />
                    </div>

                    <ol style={{
                      paddingLeft: 22,
                      color: '#c5ded8',
                      lineHeight: 1.8,
                      fontSize: 13
                    }}>
                      {experimentSteps.map((step: string, index: number) => (
                        <li
                          key={index}
                          style={{
                            color: index < stageIndex
                              ? '#8ce6c9'
                              : index === stageIndex
                                ? '#ffffff'
                                : '#789994',
                            fontWeight: index === stageIndex ? 700 : 400
                          }}
                        >
                          {step}
                          {index < stageIndex && (
                            <CheckCircle2
                              size={13}
                              style={{ marginLeft: 6, verticalAlign: 'middle' }}
                            />
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <h4>Gözlem ve etki tablosu</h4>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: 12
                    }}>
                      <thead>
                        <tr style={{ color: '#9ce9d7', textAlign: 'left' }}>
                          <th style={{ padding: 9, borderBottom: '1px solid #477078' }}>Özellik</th>
                          <th style={{ padding: 9, borderBottom: '1px solid #477078' }}>Sonuç</th>
                          <th style={{ padding: 9, borderBottom: '1px solid #477078' }}>Açıklama</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(reactionResult.resultTable ?? []).map(
                          (row: any, index: number) => (
                            <tr key={index}>
                              <td style={{ padding: 9, borderBottom: '1px solid #25454b' }}>
                                {row.property}
                              </td>
                              <td style={{ padding: 9, borderBottom: '1px solid #25454b' }}>
                                {row.result}
                              </td>
                              <td style={{ padding: 9, borderBottom: '1px solid #25454b', color: '#a8c9c2' }}>
                                {row.observation}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  <h4>Kimyasal denklemler</h4>
                  <p><b>Denklem:</b> {reactionResult.reaction.balancedEquation}</p>
                  <p><b>Tam iyonik:</b> {reactionResult.reaction.completeIonicEquation}</p>
                  <p><b>Net iyonik:</b> {reactionResult.reaction.netIonicEquation}</p>
                  <p><b>Seyirci iyonlar:</b> {reactionResult.reaction.spectatorIons.join(', ') || 'Yok'}</p>

                  <h4>Bilimsel açıklama</h4>
                  <p style={{ color: '#b7d4ce', lineHeight: 1.7 }}>
                    {reactionResult.scientificExplanation}
                  </p>

                  <p style={{ color: '#91aaa9', fontSize: 11, lineHeight: 1.6 }}>
                    Not: Bu ekran, doğrulanmış tepkime kayıtlarını görselleştirir.
                    Gerçek zamanlı sıvı dinamiği, derişim hesabı veya ölçülmüş
                    sıcaklık değeri üretmez.
                  </p>
                </>
              )}
            </section>
          )}
        </section>
      </div>

      <footer>
        SANAL KİMYA LABORATUVARI · EĞİTİM VE BİLİM
      </footer>
    </main>
  );
}

