"use client";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
    CameraControls,
    Float,
    Reflector,
    Sparkles,
    Text,
    useTexture
} from "@react-three/drei";
import React, {
    useEffect,
    useRef,
    useState,
    useCallback,
    useMemo,
    memo
} from "react";
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
        Base_1: THREE.Mesh;
        Base_2: THREE.Mesh;
        Chapeau: THREE.Mesh;
        cocarde: THREE.Mesh;
        cocarde_1: THREE.Mesh;
        cocarde_2: THREE.Mesh;
        Parchemin001: THREE.Mesh;
        Parchemin001_1: THREE.Mesh;


    };
}

interface MousePosition {
    x: number;
    y: number;
}

export default function Model({ NAME, choixcouleur }: ModelProps): JSX.Element {
    const groupRef = useRef<THREE.Group>(null);
    const cubeRef = useRef<THREE.Mesh>(null);
    const cameraControlsRef = useRef<CameraControls>(null);
    const { camera, size } = useThree();

    const [isWindowBelow1024, setIsWindowBelow1024] = useState<boolean>(
        size.width < 1024
    );
    const [mousePosition, setMousePosition] = useState<MousePosition>({
        x: 0,
        y: 0
    });
    const velocityRef = useRef(new THREE.Vector2(0, 0));

    const gradient = useTexture("/gradient/gradient.png");
    if (gradient) {
        gradient.rotation = -Math.PI / 2;
    }

    const glb = useLoader(GLTFLoader, "/model/trophyblend.glb");
    const CouleurTrophez = useMemo(() => {
        return new THREE.Color(choixcouleur === 1 ? "#C0C0C0" : "#FFC2B7");
    }, [choixcouleur]);

    const updateLayout = useCallback(() => {
        setIsWindowBelow1024(size.width < 1024);
    }, [size.width]);

    useEffect(() => {
        updateLayout();
    }, [size, updateLayout]);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMousePosition({
                x: (event.clientX / window.innerWidth) * 2 - 1,
                y: -(event.clientY / window.innerHeight) * 2 + 1
            });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const [cameraInitialPosition] = useState(() => new THREE.Vector3(0, 4, 6.7));
    const [cameraPositionS] = useState(() => new THREE.Vector3(0, 3, 30));
    const [cameraPositionE] = useState(() => new THREE.Vector3(0, 1.5, 6));
    //  const [cameraLookAt, setCameraLookAT] = useState(() => new THREE.Vector3(cubeRef.current?.position ))

    const groupPosition = useMemo(() => {
        if (isWindowBelow1024) {
            return [0, 0, 0];
        } else {
            return [1.5, 0, 0];
        }

    }, [isWindowBelow1024]);

    const groupRotation = useMemo(() => {
        return [0, isWindowBelow1024 ? Math.PI * 0.5 : Math.PI * 0.35, 0];
    }, [isWindowBelow1024]);

    useFrame((state, delta) => {
        if (!cubeRef.current) return;

        const cameralook = new THREE.Vector3(
            cubeRef.current.position.x,
            cubeRef.current.position.y,
            cubeRef.current.position.z
        );

        camera.lookAt(cameralook);
        isWindowBelow1024 ? setIsWindowBelow1024(true) : setIsWindowBelow1024(false);


        const elapsedTime = state.clock.elapsedTime;
        const cameraDistance = 6;

        if (elapsedTime < 3) {

            cameraPositionS.lerp(cameraPositionE, 0.05);
            state.camera.position.copy(cameraPositionS);
            console.log('enter');

        } else if (size.width < 1024) {
            // Damped camera movement based on mouse position
            const dampingFactor = 0.09;
            const springStrength = 0.01;

            // Calculate target position
            // const targetX = cameraInitialPosition.x + mousePosition.x * 0.2;
            // const targetY = cameraInitialPosition.y + mousePosition.y * 0.2;
            const targetX = cameraPositionE.x + mousePosition.x * 0.2;
            const targetY = cameraPositionE.y + mousePosition.y * 0.2;

            // Calculate spring force
            const forceX = (targetX - camera.position.x) * springStrength;
            const forceY = (targetY - camera.position.y) * springStrength;

            // Apply force to velocity
            velocityRef.current.x += forceX;
            velocityRef.current.y += forceY;

            // Apply damping to velocity
            velocityRef.current.x *= 1 - dampingFactor;
            velocityRef.current.y *= 1 - dampingFactor;

            // Update camera position
            camera.position.x += velocityRef.current.x;
            camera.position.y += velocityRef.current.y;

            // Keep Z position constant

            camera.position.z = cameraDistance;

        }
        if (size.width < 1024) {
            camera.position.z = cameraDistance;
        }
        if (size.width < 800) {
            camera.position.z = cameraDistance + 1;
        }

        if (size.width < 590) {

            camera.position.z = cameraDistance + 4;
        }
        if (size.width < 400) {
            camera.position.z = cameraDistance + 6;
        }
        if (size.width < 300) {
            camera.position.z = cameraDistance + 8;
        }
        if (size.width < 200) {
            camera.position.z = cameraDistance + 10;
        }
    });

    const getTextScale = useCallback(
        (text: string, maxWidth: number, fontSize: number): number => {
            const textWidth = text.length * fontSize * 0.42;
            return textWidth > maxWidth ? maxWidth / textWidth : 1;
        },
        []
    );

    const textScale = useMemo(
        () => getTextScale(NAME, 2.2, 16),
        [NAME, getTextScale]
    );

    return (
        <>
            <group
                ref={groupRef}
                position={groupPosition as [number, number, number]}
                rotation={groupRotation as [number, number, number]}
            >
                <mesh ref={cubeRef} position-y={1} position-z={0}>
                    <boxGeometry args={[3.6, 3, 5]} />
                    <meshBasicMaterial wireframe visible={false} />
                </mesh>
                <Trophee CouleurTrophez={CouleurTrophez} />

                <Text
                    fontSize={16 * textScale}
                    color={"black"}
                    fontWeight={"bold"}
                    rotation={[0, -Math.PI * 0.5, 0]}
                    position={[-1.2, 0.1, 0]}
                >
                    {NAME}
                </Text>
            </group>

            <OptimizedReflector />
        </>
    );
}

const OptimizedReflector = memo(() => (
    <Reflector
        resolution={512}
        mirror={0.4}
        mixBlur={10.5}
        mixStrength={1}
        blur={[100, 100]}
        depthScale={1.2}
        minDepthThreshold={0.3}
        maxDepthThreshold={1.5}
        rotation={[-Math.PI / 2, 0, 0]}
        args={[1000, 1000]}
        position-y={-0.5}
    >
        {(Material, props) => (
            <meshReflectorMaterial
                color={"#6b4c85"}
                metalness={0}
                roughness={1}
                {...props}
            />
        )}
    </Reflector>
));
OptimizedReflector.displayName = "OptimizedReflector";


const Trophee = memo(({ CouleurTrophez }: TropheeProps) => {
    //   const { nodes } = useLoader(GLTFLoader, "/model/tropheeV2.glb") as GLTFResult;
    const { nodes } = useLoader(GLTFLoader, "/model/trophyblend.glb") as GLTFResult;
    console.log(nodes);


    return (
        <group position={[0, -0.5, 0]}>
            <Float
                speed={2}
                rotationIntensity={0.2}
                floatIntensity={0.5}
                floatingRange={[0.5, 1.5]}
            >
                <mesh
                    geometry={nodes.LogoV2.geometry}
                    position={[0, -0.5, 0]}
                    castShadow
                    receiveShadow
                >
                    <meshStandardMaterial
                        color={CouleurTrophez}
                        metalness={0}
                        roughness={1}
                    />
                    <Sparkles
                        count={50}
                        scale={3}
                        size={2}
                        position={[0, 1.4, 0]}
                        speed={0.4}
                        color={"#F9D5C7"}
                    />
                </mesh>
            </Float>

            <mesh
                //@ts-ignore
                geometry={nodes.Base_1.geometry}
                position={[0, 0, 0]}
                rotation-y={Math.PI}
                castShadow
                receiveShadow
            >
                <meshStandardMaterial color={"#D8BFD8"} metalness={0} roughness={1} />
            </mesh>
            <mesh
                castShadow
                geometry={nodes.Base_2.geometry}
                material={nodes.Base_2.material}
            // FA8072 D8BFD8
            >
                <meshStandardMaterial color={"#625462"} metalness={0} roughness={1} 
                
                />

            </mesh>
            <mesh
                castShadow
                geometry={nodes.Chapeau.geometry}
                material={nodes.Chapeau.material}
            >

            </mesh>
            <mesh
                castShadow
                geometry={nodes.cocarde.geometry}
                material={nodes.cocarde.material}
            >
                <meshStandardMaterial color={"#F82B5A"} metalness={0} roughness={1} />


            </mesh>
            <mesh
                castShadow
                geometry={nodes.cocarde_1.geometry}
                material={nodes.cocarde_1.material}
            >

            </mesh>
            <mesh
                castShadow
                geometry={nodes.cocarde_2.geometry}
                material={nodes.cocarde_2.material}
            >
                <meshStandardMaterial color={"#FF5D83"} metalness={0} roughness={1} />

            </mesh>
            <mesh
                castShadow
                geometry={nodes.Parchemin001
                    .geometry}
                material={nodes.Parchemin001.material}
            >

            </mesh>
            <mesh
                castShadow
                geometry={nodes.Parchemin001_1
                    .geometry}
                material={nodes.Parchemin001_1.material}
            >


            </mesh>



        </group>
    );
});
Trophee.displayName = "Trophee";
