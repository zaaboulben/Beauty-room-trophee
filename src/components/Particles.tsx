import { Instance, Instances } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, useState, useEffect } from "react";
import { MathUtils, Color } from "three";


const particlesPerSide = 75;
const corridorWidth = 10;
const corridorLength = 40;
const corridorSpacing = 5;
const wallHeight = 4;
const wallBottom = -2;

interface ParticlePARAMProps {
    factor: number;
    speed: number;
    xFactor: number;
    yFactor: number;
    zFactor: number;
    color: Color;
}

interface ParticleProps {
    baseColor: string;
}

function ParticlePARAM({ factor, speed, xFactor, yFactor, zFactor, color }: ParticlePARAMProps) {
    //@ts-ignore
    const ref = useRef<THREE.InstancedMesh>(null);
    useFrame((state) => {
        const t = factor + state.clock.elapsedTime * (speed / 2);
        if (ref.current) {
            ref.current.scale.setScalar(Math.max(0.1, Math.cos(t) * 0.2));
            ref.current.position.set(
                xFactor,
                yFactor + Math.sin(t) * 0.5,
                (zFactor + t * 10) % corridorLength - corridorLength / 2
            );
        }
    });
    return <Instance ref={ref} color={color} />;
}

function Particle({ baseColor }: ParticleProps) {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    useEffect(() => {
        const handleResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }
        window.addEventListener("resize", handleResize);


        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    const corridorSpacingByScreen = useMemo(() => {
        if (size.width < 638) {
            return 2;
        } else if (size.width < 750) {
            return 3;
        } else if (size.width < 1024) {
            return 4;
        } else {
            return 5;
        }
    }

        , [size.width]);


    const particlesData = useMemo(() => {
        const baseColorObj = new Color(baseColor);
        const generateColorVariation = () => {
            const hsl = { h: 0, s: 0, l: 0 };
            baseColorObj.getHSL(hsl);
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
                ? MathUtils.randFloat(-corridorWidth - corridorSpacingByScreen / 2, -corridorSpacingByScreen / 2)
                : MathUtils.randFloat(corridorSpacingByScreen / 2, corridorWidth + corridorSpacingByScreen / 2),
            yFactor: MathUtils.randFloat(wallBottom, wallBottom + wallHeight),
            zFactor: MathUtils.randFloat(0, corridorLength),
            color: generateColorVariation()
        }));

        return [...createParticles('left'), ...createParticles('right')];
    }, [baseColor]);

    return (
        <group rotation-y={Math.PI * 0.5} position={[0, 2, 0]}>
            <Instances limit={particlesData.length} castShadow receiveShadow>
                <sphereGeometry args={[0.2, 32, 32]} />
                <meshStandardMaterial roughness={1} metalness={0.1} toneMapped={false} emissive={new Color(baseColor)} emissiveIntensity={1} transparent />
                {particlesData.map((data, i) => (
                    <ParticlePARAM key={i} {...data} />
                ))}
            </Instances>
        </group>
    );
}

export default function Particles({ baseColor }: ParticleProps) {
    return <Particle baseColor={baseColor} />;
}