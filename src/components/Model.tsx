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
import { useEffect, useRef, useState, useCallback } from "react";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

interface ModelProps {
    NAME: string;
    choixcouleur: number;
}

export default function Model({ NAME, choixcouleur }: ModelProps): JSX.Element {
    const groupRef = useRef<THREE.Group | null>(null);
    const cameraControlsRef = useRef<CameraControls | null>(null);
    const cubeRef = useRef<THREE.Mesh>(null);

    const gradient = useTexture("/gradient/gradient.png");
    gradient.rotation = -Math.PI / 2;

    // const choixcouleur = 1;
    const glb = useLoader(GLTFLoader, "/model/trophyblend.glb");
    const CouleurTrophez = new THREE.Color("#C0C0C0");

    if (choixcouleur === 1) {
        CouleurTrophez.set("#C0C0C0");
    } else if (choixcouleur === 2) {
        CouleurTrophez.set("#FFC2B7"); //FFC2B7 e7968b
    }

    const [isWindowBelow1024, setIsWindowBelow1024] = useState(
        window.innerWidth < 1024
    );

    // Function to check if window width is below 1024 pixels
    const checkWindowSize = useCallback(() => {
        setIsWindowBelow1024(window.innerWidth < 1024);
    }, []);

    useEffect(() => {
        // Check window size on mount
        checkWindowSize();
        // Add event listener to check window size on resize
        window.addEventListener("resize", checkWindowSize);

        // Clean up event listener on unmount
        return () => {
            window.removeEventListener("resize", checkWindowSize);
        };
    }, [checkWindowSize]);

    // Function to automatically move the camera to fit the cube
    const automove = useCallback(() => {
        cameraControlsRef.current?.fitToBox(
            cubeRef.current as THREE.Object3D<THREE.Object3DEventMap> | THREE.Box3,
            true
        );
        //  cameraControlsRef.current?.setPosition(1,6,4);
    }, []);

    // Frame loop to perform automatic movement after 1 second
    useFrame((state, delta) => {
        if (state.clock.elapsedTime > 1) {
            automove();
        }

        // Update cube position in the animation loop if window size changes
        if (cubeRef.current) {
            cubeRef.current.position.z = isWindowBelow1024 ? 0 : -1.7;
            cubeRef.current.position.y = isWindowBelow1024 ? 1.3 : 1.5;
            cubeRef.current.scale.set(1, 1, isWindowBelow1024 ? 1.2 : 1);
            //@ts-ignore
            groupRef.current.rotation.y = isWindowBelow1024
                ? Math.PI * 0.5
                : Math.PI * 0.35;
        }
    });

    const getTextScale = (
        text: string,
        maxWidth: number,
        fontSize: number
    ): number => {
        const textWidth = text.length * fontSize * 0.6; // Approximate text width
        return textWidth > maxWidth ? maxWidth / textWidth : 1;
    };
    const name = NAME;
    //@ts-ignore
    const text = NAME;
    const fontSize = 16;
    const maxWidth = 2.2; // Maximum width the text can occupy

    const textScale = getTextScale(text, maxWidth, fontSize);


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
                    fontSize={fontSize * textScale}
                    color={"black"}
                    fontWeight={"bold"}
                    rotation={[0, -Math.PI * 0.5, 0]}
                    position={[-0.8, 0.04, 0]}
                >
                    {text}
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
                //   transparent
                //   opacity={0.4}
                />
            </mesh>
        </group>
    );
}

function Trophee(CouleurTrophez) {
    const { nodes } = useLoader(GLTFLoader, "/model/tropheeV2.glb");
    const gradient = useTexture("/gradient/gradient.png");
    gradient.rotation = -Math.PI / 2;

    const tropheeLogo = nodes.LogoV2.geometry;
    const tropheeBase = nodes.Base003.geometry;
    const tropheeBase1 = nodes.Base003_1.geometry;
    const tropheeBaseMat = nodes.Base003.material;
    const tropheeBaseMat1 = nodes.Base003_1.material;

    console.log(nodes);

    console.log(CouleurTrophez.CouleurTrophez);

    return (
        <group>

            <Float
                speed={1} // Animation speed, defaults to 1
                rotationIntensity={0.2} // XYZ rotation intensity, defaults to 1
                floatIntensity={0.2} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                floatingRange={[0.5, 1]}
            >
                <mesh
                    geometry={tropheeLogo}
                    position={[0, -0.9, 0]}
                    castShadow
                    receiveShadow
                >

                    <meshStandardMaterial
                        color={CouleurTrophez.CouleurTrophez}
                        metalness={1}
                        roughness={0.4}
                    />
                       <Sparkles count={20} scale={  2} size={2}  position={[0,1.4,0]} speed={0.4} color={'#FF85BC'} />

                </mesh>
            </Float>

            <mesh
                geometry={tropheeBase}
                position={[0, -0.5, 0]}
                material={tropheeBaseMat}
                rotation-y={Math.PI}
                castShadow
                receiveShadow
            >

            </mesh>
            <mesh
                geometry={tropheeBase1}
                position={[0, -0.5, 0]}
                material={tropheeBaseMat1}
                rotation-y={Math.PI}
                castShadow
                receiveShadow
            />
        </group>
    );
}
