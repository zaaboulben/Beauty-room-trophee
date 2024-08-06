import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";


import {
    CameraControls,
    Float,
    MeshReflectorMaterial,
    Sparkles,
    Text,
    useTexture
} from "@react-three/drei";
import { useEffect, useRef, useState, useCallback } from "react";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

interface ModelProps {
    NAME: string;
    choixcouleur: number;
}

export default function Model({ NAME ,choixcouleur}:ModelProps ): JSX.Element {

    const groupRef = useRef<THREE.Group | null>(null);
    const cameraControlsRef = useRef<CameraControls | null>(null);
    const cubeRef = useRef<THREE.Mesh>(null);

    const gradient = useTexture("/gradient/gradient.png");

    // const choixcouleur = 1;
    const glb = useLoader(GLTFLoader, "/model/trophyblend.glb");
    const CouleurTrophez = new THREE.Color("#C0C0C0");
  

    
    if (choixcouleur === 1) {
        CouleurTrophez.set("#C0C0C0");
    } else if (choixcouleur === 2) {
        CouleurTrophez.set("#e7968b");
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
    console.log(NAME, "NAME");
    const name = NAME;
    //@ts-ignore
    const text = NAME;
    const fontSize = 16;
    const maxWidth = 2.2; // Maximum width the text can occupy

    const textScale = getTextScale(text, maxWidth, fontSize);

    return (
        <group position={[0.5, 2, 0]}>
           

            <CameraControls ref={cameraControlsRef} enabled={true} 
            />

            <group ref={groupRef} position={[2, 0, 0]}>
                <mesh ref={cubeRef} position-y={1.3} position-z={0}>
                    <boxGeometry args={[4, 3, 5]} />
                    <meshBasicMaterial  wireframe visible={false} />
                </mesh>

                <Float
                    speed={1} // Animation speed, defaults to 1
                    rotationIntensity={0.2} // XYZ rotation intensity, defaults to 1
                    floatIntensity={0.2} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                    floatingRange={[0.5, 1]}
                >
                    <mesh
                        geometry={(glb.scene.children[0] as THREE.Mesh).geometry}
                        castShadow
                        receiveShadow
                        rotation={[-Math.PI * 0.25, 0, 0]}
                        position={[0, 1.2, 0]}

                    >
                           <Sparkles count={10} scale={  2} size={2}  speed={0.4} color={'#FF85BC'} />
                        <meshStandardMaterial
                            color={CouleurTrophez}
                            metalness={1}
                            roughness={0.4}


                        />



                    </mesh>
                </Float>
                    
                <mesh
                    geometry={(glb.scene.children[1] as THREE.Mesh).geometry}
                    castShadow
                    receiveShadow
                >
                    <meshStandardMaterial color={CouleurTrophez}  metalness={1}
                        roughness={0.4}
                        />
                </mesh>

                <mesh
                    geometry={(glb.scene.children[2] as THREE.Mesh).geometry}
                    castShadow
                    receiveShadow
                >
                    <meshStandardMaterial
                        color="#FFF2F2"
                        metalness={1}
                        roughness={0.4}
                     
                        
                    />
                </mesh>

                <Text
                    fontSize={fontSize * textScale}
                    color={"black"}
                    fontWeight={"bold"}
                    rotation={[0, -Math.PI * 0.5, 0]}
                    position={[-0.3, 0.04, 0]}
                >
                    {text}
                </Text>
            </group>
            <mesh
                rotation={[-Math.PI * 0.5, 0, Math.PI * 0.5]}
                position={[0, -0.55, 0]}
                receiveShadow
                castShadow
            >
                <circleGeometry args={[100, 64]} />
                <meshStandardMaterial map={gradient} metalness={1} roughness={0.7} />
                {/* < MeshReflectorMaterial
            blur={[400, 100]}
            resolution={1024}
            mixBlur={1}
            mixStrength={.5}
            map={gradient2} 
            color={0x000000}
            
            depthScale={1}
            minDepthThreshold={0.85}
            metalness={1}
            roughness={0.7}
          /> */}

            </mesh>
        </group>
    );
}
