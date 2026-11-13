
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';

function Flask() {
  return (
    <group position={[0, -0.7, 0]}>
      {/* Cam şişenin gövdesi */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.72, 0.9, 1.5, 64, 1, true]} />
        <meshPhysicalMaterial
          color="#b8fff3"
          transparent
          opacity={0.22}
          roughness={0.08}
          metalness={0}
          transmission={0.75}
          thickness={0.4}
          side={2}
        />
      </mesh>

      {/* Şişenin tabanı */}
      <mesh position={[0, -0.75, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.09, 64]} />
        <meshPhysicalMaterial color="#a4eee4" transparent opacity={0.55} />
      </mesh>

      {/* Şişenin boynu */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.23, 0.3, 0.55, 48]} />
        <meshPhysicalMaterial
          color="#c7fff5"
          transparent
          opacity={0.35}
          transmission={0.6}
          roughness={0.08}
        />
      </mesh>

      {/* Şişe ağzı */}
      <mesh position={[0, 1.24, 0]}>
        <torusGeometry args={[0.24, 0.045, 16, 64]} />
        <meshStandardMaterial color="#b8fff3" />
      </mesh>

      {/* İçindeki sıvı */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.68, 0.84, 0.72, 64]} />
        <meshPhysicalMaterial
          color="#29c9b2"
          transparent
          opacity={0.78}
          roughness={0.12}
          transmission={0.15}
        />
      </mesh>

      {/* Sıvı yüzeyi */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 0.025, 64]} />
        <meshStandardMaterial color="#70f3d5" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function Platform() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, 0]}>
      <circleGeometry args={[2.3, 64]} />
      <meshStandardMaterial color="#17383d" roughness={0.35} />
    </mesh>
  );
}

export default function LabScene() {
  return (
    <div style={{ width: '100%', height: '360px' }}>
      <Canvas camera={{ position: [3, 2.3, 4.5], fov: 42 }}>
        <color attach="background" args={['#0b1b21']} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[4, 6, 4]} intensity={2.2} />
        <pointLight position={[-3, 2, -2]} intensity={1.5} color="#48d9c0" />

        <Flask />
        <Platform />

        <ContactShadows
          position={[0, -1.53, 0]}
          opacity={0.4}
          scale={5}
          blur={2}
        />

        <Environment preset="city" />
        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
