import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function Particles({ count = 1000 }) {
  const mesh = useRef<THREE.Points>(null!);

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        temp[i * 3] = (Math.random() - 0.5) * 10;
        temp[i * 3 + 1] = (Math.random() - 0.5) * 10;
        temp[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    mesh.current.rotation.y = time * 0.1;
    mesh.current.rotation.x = time * 0.05;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#3b82f6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function FloatingShapes() {
    return (
        <group>
            <mesh position={[-2, 1, -2]}>
                <torusKnotGeometry args={[0.5, 0.2, 128, 16]} />
                <meshStandardMaterial color="#8b5cf6" roughness={0.1} metalness={0.8} />
            </mesh>
            <mesh position={[2, -1, -3]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#ec4899" roughness={0.1} metalness={0.8} />
            </mesh>
        </group>
    );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 opacity-40">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Particles count={2000} />
        <FloatingShapes />
      </Canvas>
    </div>
  );
}
