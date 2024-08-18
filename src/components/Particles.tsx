import { Instance, Instances, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, MutableRefObject } from "react";
import { MathUtils, Vector3, Color } from "three";
import * as THREE from "three";

useGLTF.preload("/model/tropheeBigChunks.glb");

const particlesPerSide = 250;
const corridorWidth = 10;
const corridorLength = 40;
const corridorSpacing = 5;
const wallHeight = 6; // Hauteur des murs de particules
const wallBottom = -3; // Position verticale du bas des murs

const baseColor = new Color("#6b4c85");
const generateColorVariation = () => {
  const hsl = { h: 0, s: 0, l: 0 };
  baseColor.getHSL(hsl);
  return new Color().setHSL(
    MathUtils.randFloat(Math.max(0, hsl.h - 0.1), Math.min(1, hsl.h + 0.1)),
    MathUtils.randFloat(Math.max(0, hsl.s - 0.2), Math.min(1, hsl.s + 0.2)),
    MathUtils.randFloat(Math.max(0, hsl.l - 0.2), Math.min(1, hsl.l + 0.2))
  );
};



const createParticles = (side: 'left' | 'right') => Array.from({ length: particlesPerSide }, () => ({
  factor: MathUtils.randInt(20, 100),
  speed: MathUtils.randFloat(0.01, 0.75),
  xFactor: side === 'left' 
    ? MathUtils.randFloat(-corridorWidth - corridorSpacing/2, -corridorSpacing/2) 
    : MathUtils.randFloat(corridorSpacing/2, corridorWidth + corridorSpacing/2),
  yFactor: MathUtils.randFloat(wallBottom, wallBottom + wallHeight),
  zFactor: MathUtils.randFloat(0, corridorLength),
  topIndex: MathUtils.randInt(0, 5),
  color: generateColorVariation()
}));

const particles = [...createParticles('left'), ...createParticles('right')

];

interface ParticlePARAMProps {
  factor: number;
  speed: number;
  xFactor: number;
  yFactor: number;
  zFactor: number;
  topIndex: number;
  color: THREE.Color;
}

function ParticlePARAM({ factor, speed, xFactor, yFactor, zFactor, color }: ParticlePARAMProps) {
  const ref = useRef<null>(null);
  useFrame((state) => {
    const t = factor + state.clock.elapsedTime * (speed / 2);
//@ts-ignore
    ref.current.scale.setScalar(Math.max(0.1, Math.cos(t) * 0.5));
//@ts-ignore
    ref.current.position.set(
      xFactor,
      yFactor + Math.sin(t) * 0.5,
      (zFactor + t * 10) % corridorLength - corridorLength / 2
    );
  });
  return <Instance ref={ref} color={color} />;
}

function Particle() {
  const { nodes } = useGLTF("/model/tropheeBigChunks.glb");
  const trophyTops = useMemo(() => {
    // @ts-ignore
    return Array.from({ length: 6 }, (_, i) => nodes[`tropheeTop${i + 1}`].geometry);
  }, [nodes]);

  return (
<group rotation-y={Math.PI*0.5} position={[0,2,0]}>
{trophyTops.map((geometry, index) => (
        <Instances key={index} limit={particles.length} castShadow receiveShadow>
          <bufferGeometry {...geometry} />
          <meshStandardMaterial roughness={1} metalness={0.1}/>
          {particles.filter(p => p.topIndex === index).map((data, i) => (
            <ParticlePARAM key={i} {...data} />
          ))}
        </Instances>
      ))}
    </group>
  );
}

export default function Particles() {
  return <Particle />;
}
