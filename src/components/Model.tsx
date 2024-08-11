import { extend, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import {
    CameraControls,
    Float,
    GradientTexture,
    GradientType,
    MeshReflectorMaterial,
    shaderMaterial,
    Sparkles,
    Text,
    useCubeTexture,
    useTexture
} from "@react-three/drei";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

interface ModelProps {
    NAME: string;
    choixcouleur: number;
}

interface TropheeProps {
    CouleurTrophez: THREE.Color;
}

interface GLTFResult {
    nodes: {
        LogoV2: THREE.Mesh;
        Base003: THREE.Mesh;
        Base003_1: THREE.Mesh;
    };
}

export default function Model({ NAME, choixcouleur }: ModelProps): JSX.Element {
    const groupRef = useRef<THREE.Group>(null);
    const cameraControlsRef = useRef<CameraControls>(null);
    const cubeRef = useRef<THREE.Mesh>(null);

    const gradient = useTexture("/gradient/gradient.png");
    if (gradient) {
        gradient.rotation = -Math.PI / 2;
    }

    const glb = useLoader(GLTFLoader, "/model/trophyblend.glb");
    const CouleurTrophez = useMemo(() => {
        const color = new THREE.Color();
        return choixcouleur === 1 ? color.set("#C0C0C0") : color.set("#FFC2B7");
    }, [choixcouleur]);

    const [isWindowBelow1024, setIsWindowBelow1024] = useState<boolean>(
        window.innerWidth < 1024
    );

    const checkWindowSize = useCallback(() => {
        setIsWindowBelow1024(window.innerWidth < 1024);
    }, []);

    useEffect(() => {
        checkWindowSize();
        window.addEventListener("resize", checkWindowSize);

        return () => {
            window.removeEventListener("resize", checkWindowSize);
        };
    }, [checkWindowSize]);

    const automove = useCallback(() => {
        if (cameraControlsRef.current && cubeRef.current) {
            cameraControlsRef.current.fitToBox(
                cubeRef.current,
                true
            );
        }
    }, []);

    useFrame((state) => {
        if (state.clock.elapsedTime > 1) {
            automove();
        }

        if (cubeRef.current) {
            cubeRef.current.position.z = isWindowBelow1024 ? 0 : -1.7;
            cubeRef.current.position.y = isWindowBelow1024 ? 1.3 : 1.5;
            cubeRef.current.scale.set(1, 1, isWindowBelow1024 ? 1.2 : 1);

            if (groupRef.current) {
                groupRef.current.rotation.y = isWindowBelow1024
                    ? Math.PI * 0.5
                    : Math.PI * 0.35;
            }
        }
    });

    const getTextScale = useCallback((
        text: string,
        maxWidth: number,
        fontSize: number
    ): number => {
        const textWidth = text.length * fontSize * 0.6;
        return textWidth > maxWidth ? maxWidth / textWidth : 1;
    }, []);

    const textScale = useMemo(() => getTextScale(NAME, 2.2, 16), [NAME, getTextScale]);

    return (
        <group position={[0.5, 2, 0]}>
            <CameraControls ref={cameraControlsRef} enabled={true} />

            <group ref={groupRef} position={[2, 0, 0]}>
                <mesh ref={cubeRef} position-y={1.3} position-z={0}>
                    <boxGeometry args={[5, 3, 6]} />
                    <meshBasicMaterial wireframe visible={false} />
                </mesh>

                <Trophee CouleurTrophez={CouleurTrophez} />

                <Text
                    fontSize={16 * textScale}
                    color={"black"}
                    fontWeight={"bold"}
                    rotation={[0, -Math.PI * 0.5, 0]}
                    position={[-0.8, 0.04, 0]}
                >
                    {NAME}
                </Text>
            </group>

            <mesh
                rotation={[-Math.PI * 0.5, 0, Math.PI * 0.5]}
                position={[0, -1, 0]}
                receiveShadow
                frustumCulled={true}
            >
                <boxGeometry args={[1000, 1000, 1]} />

                <MeshReflectorMaterial
                    mirror={0.6}
                    blur={[400, 100]}
                    resolution={1024}
                    mixBlur={1}
                    map={gradient}
                    mixStrength={1}
                    depthScale={1}
                    depthToBlurRatioBias={1}
                    minDepthThreshold={0.85}
                    maxDepthThreshold={1}
                    metalness={0}
                    roughness={0}
                />
            </mesh>
        </group>
    );
}

function Trophee({ CouleurTrophez }: TropheeProps): JSX.Element {
    const { nodes } = useLoader(GLTFLoader, "/model/tropheeV2.glb") as GLTFResult;
    const gradient = useTexture("/gradient/gradient.png");
    if (gradient) {
        gradient.rotation = -Math.PI / 2;
    }

    return (
        <group>
            <Float
                speed={1}
                rotationIntensity={0.2}
                floatIntensity={0.2}
                floatingRange={[0.5, 1]}
            >
                <mesh
                    geometry={nodes.LogoV2.geometry}
                    position={[0, -0.9, 0]}
                    castShadow
                    receiveShadow
                >
                    <meshStandardMaterial
                        color={CouleurTrophez}
                        metalness={1}
                        roughness={0.4}
                    />
                    <Sparkles
                        count={20}
                        scale={2}
                        size={2}
                        position={[0, 1.4, 0]}
                        speed={0.4}
                        color={'#FF85BC'}
                    />
                </mesh>
            </Float>

            <mesh
                geometry={nodes.Base003.geometry}
                position={[0, -0.5, 0]}
                material={nodes.Base003.material}
                rotation-y={Math.PI}
                castShadow
                receiveShadow
            />

            <mesh
                geometry={nodes.Base003_1.geometry}
                position={[0, -0.5, 0]}
                material={nodes.Base003_1.material}
                rotation-y={Math.PI}
                castShadow
                receiveShadow
            />
        </group>
    );
}