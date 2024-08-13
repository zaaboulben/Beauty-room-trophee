// import { useFrame, useLoader } from "@react-three/fiber";
// import * as THREE from "three";
// import {
//     CameraControls,
//     Float,

//     MeshReflectorMaterial,

//     Reflector,

//     Sparkles,
//     Text,
//     useTexture
// } from "@react-three/drei";
// import { useEffect, useRef, useState, useCallback, useMemo } from "react";
// import { GLTFLoader } from "three/examples/jsm/Addons.js";
// import { useControls } from "leva";

// interface ModelProps {
//     NAME: string;
//     choixcouleur: number;
// }

// interface TropheeProps {
//     CouleurTrophez: THREE.Color;
// }

// interface GLTFResult {
//     nodes: {
//         LogoV2: THREE.Mesh;
//         Base003: THREE.Mesh;
//         Base003_1: THREE.Mesh;
//     };
// }

// export default function Model({ NAME, choixcouleur }: ModelProps): JSX.Element {
//     const groupRef = useRef<THREE.Group>(null);
//     const cameraControlsRef = useRef<CameraControls>(null);
//     const cubeRef = useRef<THREE.Mesh>(null);

//     const gradient = useTexture("/gradient/gradient.png");
//     if (gradient) {
//         gradient.rotation = -Math.PI / 2;
//     }

//     const glb = useLoader(GLTFLoader, "/model/trophyblend.glb");
//     const CouleurTrophez = useMemo(() => {
//         const color = new THREE.Color();
//         return choixcouleur === 1 ? color.set("#C0C0C0") : color.set("#FFC2B7");
//     }, [choixcouleur]);

//     const [isWindowBelow1024, setIsWindowBelow1024] = useState<boolean>(
//         window.innerWidth < 1024
//     );

//     const checkWindowSize = useCallback(() => {
//         setIsWindowBelow1024(window.innerWidth < 1024);
//     }, []);

//     useEffect(() => {
//         checkWindowSize();
//         window.addEventListener("resize", checkWindowSize);

//         return () => {
//             window.removeEventListener("resize", checkWindowSize);
//         };
//     }
//         , [checkWindowSize]);




//     const automove = useCallback(() => {
//         if (cameraControlsRef.current && cubeRef.current) {
//             cameraControlsRef.current.fitToBox(
//                 cubeRef.current,
//                 true
//             );
//         }
//     }, []);

//     const [cameraPositionS] = useState(() => new THREE.Vector3(0, 3, 30))
//     const [cameraPositionE] = useState(() => new THREE.Vector3(0, 4, 6.7))
//     const [cameraLookAt, setCameraLookAT] = useState(() => new THREE.Vector3(cubeRef.current?.position ))
//     let [FirstRender, useFirstRender] = useState(true)
//     const [StartWeb, useStartWeb] = useState(0)

//     useFrame((state) => {

//         // console.log(state, 'state.mouse');
//         let cameralook = new THREE.Vector3(cubeRef.current?.position.x - .5, cubeRef.current?.position.y + 2, cubeRef.current?.position.z)

//         state.camera.lookAt(cameralook)

//         if (FirstRender) {

//             useStartWeb(state.clock.elapsedTime)
//             useFirstRender(false)
//         }

//         if (state.clock.elapsedTime < (3 + StartWeb)) {
//             cameraPositionS.lerp(cameraPositionE, 0.05)
//             state.camera.position.copy(cameraPositionS)
//             // console.log(state.camera.position);


//         } else if ((3 + StartWeb) < state.clock.elapsedTime && state.clock.elapsedTime < (3.3 + StartWeb)) {
//             state.camera.position.copy(cameraPositionE)
//         }


//         // if(isWindowBelow1024){
//         //     // automove();          
//         //   }else{
//         //     state.camera.position.copy(cameraPositionS)
//         //   }


//         // if (state.clock.elapsedTime > 1) {
//         //     automove();
//         // }

//         // if (cubeRef.current) {
//         //     cubeRef.current.position.z = isWindowBelow1024 ? 0 : -1.7;
//         //     cubeRef.current.position.y = isWindowBelow1024 ? 1.3 : 1.5;
//         //     cubeRef.current.scale.set(1, 1, isWindowBelow1024 ? 1.2 : 1);
//         // }
//         //     if (groupRef.current) {
//         //         groupRef.current.rotation.y = isWindowBelow1024
//         //             ? Math.PI * 0.5
//         //             : Math.PI * 0.35;
//         //     }
//         // }
//     });

//     const getTextScale = useCallback((
//         text: string,
//         maxWidth: number,
//         fontSize: number
//     ): number => {
//         const textWidth = text.length * fontSize * 0.6;
//         return textWidth > maxWidth ? maxWidth / textWidth : 1;
//     }, []);

//     const textScale = useMemo(() => getTextScale(NAME, 2.2, 16), [NAME, getTextScale]);


//     return (
//         <group position={[0.5, 2, 0]} rotation-y={Math.PI * 0.5}>
//             {/* {isWindowBelow1024 ?  (

//                <CameraControls ref={cameraControlsRef} enabled={true} /> 
//         ): null
//             } */}
//             {/* <CameraControls ref={cameraControlsRef} enabled={true} /> */}

//             <group ref={groupRef} position={[0, 0, 0]}>
//                 <mesh ref={cubeRef} position-y={1} position-z={0} rotation-y={-Math.PI * 0.1}>
//                     <boxGeometry args={[3.6, 3, 5]} />
//                     <meshBasicMaterial wireframe visible={false} />
//                 </mesh>

//                 <Trophee CouleurTrophez={CouleurTrophez} />

//                 <Text
//                     fontSize={16 * textScale}
//                     color={"black"}
//                     fontWeight={"bold"}
//                     rotation={[0, -Math.PI * 0.6, 0]}
//                     position={[-0.8, 0.04, 0]}
//                 >
//                     {NAME}
//                 </Text>
//             </group>


//             <Reflector
//                 resolution={512} // Résolution réduite pour augmenter le flou
//                 mirror={0.4} // Réflexion moins intense
//                 mixBlur={10.5} // Flou très élevé
//                 mixStrength={1} // Force de réflexion réduite pour accentuer le flou
//                 blur={[100, 100]} // Flou très large, surtout horizontalement
//                 depthScale={1.2}
//                 minDepthThreshold={0.3}
//                 maxDepthThreshold={1.5}
//                 rotation={[-Math.PI / 2, 0, 0]} // Placer le sol à plat
//                 args={[1000, 1000]} // Taille du sol
//                 position-y={-0.5}

//             >
//                 {(Material, props) => (
//                     //@ts-ignore
//                     <Material
//                         color={"#6b4c85"} // Couleur rose similaire à l'imageB5838D //BC7F87//7B517C//5E375A//6A416D//614974
//                         metalness={0}
//                         roughness={1}
//                         {...props}
//                     />
//                 )}
//             </Reflector>

//         </group>
//     );
// }

// function Trophee({ CouleurTrophez }: TropheeProps): JSX.Element {
//     const { nodes } = useLoader(GLTFLoader, "/model/tropheeV2.glb") as GLTFResult;
//     const gradient = useTexture("/gradient/gradient.png");
//     if (gradient) {
//         gradient.rotation = -Math.PI / 2;
//     }
//     const ref = useRef<THREE.Group>(null);
//     console.log(ref.current?.position, 'ref.current?.position');


//     return (
//         <group position={[0, -0.5, 0]} rotation-y={-Math.PI * 0.1}>
//             <Float
//                 speed={2}
//                 rotationIntensity={0.2}
//                 floatIntensity={0.5}
//                 floatingRange={[0.5, 1.5]}
//             >
//                 <mesh ref={ref}
//                     geometry={nodes.LogoV2.geometry}
//                     position={[0, -0.5, 0]}
//                     castShadow
//                     receiveShadow
//                 >
//                     <meshStandardMaterial
//                         color={CouleurTrophez}

//                         metalness={0}
//                         roughness={1}
//                     />
//                     <Sparkles
//                         count={50}
//                         scale={3}
//                         size={2}
//                         position={[0, 1.4, 0]}
//                         speed={0.4}
//                         color={'#EED5D2'}
//                     />
//                 </mesh>
//             </Float>

//             <mesh
//                 geometry={nodes.Base.geometry}
//                 position={[0, 0, 0]}

//                 rotation-y={Math.PI}
//                 castShadow
//                 receiveShadow
//             >
//                 <meshStandardMaterial
//                     color={"#A17A74"}
//                     metalness={0}
//                     roughness={1}
//                 />
//             </mesh>


//         </group>
//     );
// }

// import { useFrame, useLoader, useThree } from "@react-three/fiber";
// import * as THREE from "three";
// import {
//     Float,
//     Reflector,
//     Sparkles,
//     Text,
//     useTexture
// } from "@react-three/drei";
// import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
// import { GLTFLoader } from "three/examples/jsm/Addons.js";

// interface ModelProps {
//     NAME: string;
//     choixcouleur: number;
// }

// interface TropheeProps {
//     CouleurTrophez: THREE.Color;
// }

// interface GLTFResult {
//     nodes: {
//         LogoV2: THREE.Mesh;
//         Base003: THREE.Mesh;
//         Base003_1: THREE.Mesh;
//     };
// }

// interface MousePosition {
//     x: number;
//     y: number;
// }

// export default function Model({ NAME, choixcouleur }: ModelProps): JSX.Element {
//     const groupRef = useRef<THREE.Group>(null);
//     const cubeRef = useRef<THREE.Mesh>(null);

//     const gradient = useTexture("/gradient/gradient.png");
//     if (gradient) {
//         gradient.rotation = -Math.PI / 2;
//     }

//     const glb = useLoader(GLTFLoader, "/model/trophyblend.glb");
//     const CouleurTrophez = useMemo(() => {
//         return new THREE.Color(choixcouleur === 1 ? "#C0C0C0" : "#FFC2B7");
//     }, [choixcouleur]);

//     const [isWindowBelow1024, setIsWindowBelow1024] = useState<boolean>(
//         window.innerWidth < 1024
//     );

//     const checkWindowSize = useCallback(() => {
//         setIsWindowBelow1024(window.innerWidth < 1024);
//     }, []);

//     useEffect(() => {
//         checkWindowSize();
//         window.addEventListener("resize", checkWindowSize);
//         return () => window.removeEventListener("resize", checkWindowSize);
//     }, [checkWindowSize]);

//     const [cameraPositionS] = useState(() => new THREE.Vector3(0, 3, 30));
//     const [cameraPositionE] = useState(() => new THREE.Vector3(0, 4, 6.7));
//     const [StartWeb, setStartWeb] = useState(0);
//     const [isMouseOnScreen, setIsMouseOnScreen] = useState(true);
//     const [cameraInitialPosition] = useState(() => new THREE.Vector3(0, 4, 6.7));
//     const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
//     const velocityRef = useRef(new THREE.Vector2(0, 0));

//     const { camera } = useThree();

//     useEffect(() => {
//         const handleMouseMove = (event: MouseEvent) => {
//             setMousePosition({
//                 x: (event.clientX / window.innerWidth) * 2 - 1,
//                 y: -(event.clientY / window.innerHeight) * 2 + 1
//             });
//         };

//         window.addEventListener('mousemove', handleMouseMove);

//         return () => {
//             window.removeEventListener('mousemove', handleMouseMove);
//         };
//     }, []);

//     useFrame((state, delta) => {
//         if (!cubeRef.current) return;

//         const cameralook = new THREE.Vector3(
//             cubeRef.current.position.x - 0.5,
//             cubeRef.current.position.y + 2,
//             cubeRef.current.position.z
//         );

//         camera.lookAt(cameralook);

//         const elapsedTime = state.clock.elapsedTime;

//         if (elapsedTime < 3) {
//             // Initial animation
//             camera.position.lerp(cameraInitialPosition, 0.05);
//         } else {
//             // Damped camera movement based on mouse position
//             const dampingFactor = 0.1;
//             const springStrength = 0.02;

//             // Calculate target position
//             const targetX = cameraInitialPosition.x + mousePosition.x * 0.5;
//             const targetY = cameraInitialPosition.y + mousePosition.y * 0.5;

//             // Calculate spring force
//             const forceX = (targetX - camera.position.x) * springStrength;
//             const forceY = (targetY - camera.position.y) * springStrength;

//             // Apply force to velocity
//             velocityRef.current.x += forceX;
//             velocityRef.current.y += forceY;

//             // Apply damping to velocity
//             velocityRef.current.x *= (1 - dampingFactor);
//             velocityRef.current.y *= (1 - dampingFactor);

//             // Update camera position
//             camera.position.x += velocityRef.current.x;
//             camera.position.y += velocityRef.current.y;

//             // Keep Z position constant
//             camera.position.z = cameraInitialPosition.z;
//         }
//     });



//     useFrame((state) => {
//         if (!cubeRef.current) return;

//         const cameralook = new THREE.Vector3(
//             cubeRef.current.position.x - 0.5,
//             cubeRef.current.position.y + 2,
//             cubeRef.current.position.z
//         );

//         camera.lookAt(cameralook);

//         const elapsedTime = state.clock.elapsedTime;
//         if (elapsedTime < (3 + StartWeb)) {
//             cameraPositionS.lerp(cameraPositionE, 0.05);
//             camera.position.copy(cameraPositionS);
//         } else if (elapsedTime < (3.3 + StartWeb)) {
//             camera.position.copy(cameraPositionE);
//         } else {
//             if (isMouseOnScreen) {
//                 const targetX = cameraPositionE.x + mousePosition.x * 0.5;
//                 const targetY = cameraPositionE.y + mousePosition.y * 0.5;

//                 camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.1);
//                 camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.1);
//             } else {
//                 camera.position.lerp(cameraPositionE, 0.1);
//             }
//         }
//     });

//     const getTextScale = useCallback((
//         text: string,
//         maxWidth: number,
//         fontSize: number
//     ): number => {
//         const textWidth = text.length * fontSize * 0.6;
//         return textWidth > maxWidth ? maxWidth / textWidth : 1;
//     }, []);

//     const textScale = useMemo(() => getTextScale(NAME, 2.2, 16), [NAME, getTextScale]);

//     return (
//         <group position={[0.5, 2, 0]} rotation-y={Math.PI * 0.5}>
//             <group ref={groupRef} position={[0, 0, 0]}>
//                 <mesh ref={cubeRef} position-y={1} position-z={0} rotation-y={-Math.PI * 0.1}>
//                     <boxGeometry args={[3.6, 3, 5]} />
//                     <meshBasicMaterial wireframe visible={false} />
//                 </mesh>

//                 <Trophee CouleurTrophez={CouleurTrophez} />

//                 <Text
//                     fontSize={16 * textScale}
//                     color={"black"}
//                     fontWeight={"bold"}
//                     rotation={[0, -Math.PI * 0.6, 0]}
//                     position={[-0.8, 0.04, 0]}
//                 >
//                     {NAME}
//                 </Text>
//             </group>

//             <OptimizedReflector />
//         </group>
//     );
// }

// const OptimizedReflector = React.memo(() => (
//     <Reflector
//         resolution={512}
//         mirror={0.4}
//         mixBlur={10.5}
//         mixStrength={1}
//         blur={[100, 100]}
//         depthScale={1.2}
//         minDepthThreshold={0.3}
//         maxDepthThreshold={1.5}
//         rotation={[-Math.PI / 2, 0, 0]}
//         args={[1000, 1000]}
//         position-y={-0.5}
//     >
//         {(Material, props) => (
//             <meshReflectorMaterial
//                 color={"#6b4c85"}
//                 metalness={0}
//                 roughness={1}
//                 {...props}
//             />
//         )}
//     </Reflector>
// ));

// const Trophee = React.memo(({ CouleurTrophez }: TropheeProps) => {
//     const { nodes } = useLoader(GLTFLoader, "/model/tropheeV2.glb") as GLTFResult;
//     const gradient = useTexture("/gradient/gradient.png");
//     if (gradient) {
//         gradient.rotation = -Math.PI / 2;
//     }
//     const ref = useRef<THREE.Group>(null);

//     return (
//         <group position={[0, -0.5, 0]} rotation-y={-Math.PI * 0.1}>
//             <Float
//                 speed={2}
//                 rotationIntensity={0.2}
//                 floatIntensity={0.5}
//                 floatingRange={[0.5, 1.5]}
//             >
//                 <mesh
//                     ref={ref}
//                     geometry={nodes.LogoV2.geometry}
//                     position={[0, -0.5, 0]}
//                     castShadow
//                     receiveShadow
//                 >
//                     <meshStandardMaterial
//                         color={CouleurTrophez}
//                         metalness={0}
//                         roughness={1}
//                     />
//                     <Sparkles
//                         count={50}
//                         scale={3}
//                         size={2}
//                         position={[0, 1.4, 0]}
//                         speed={0.4}
//                         color={'#EED5D2'}
//                     />
//                 </mesh>
//             </Float>

//             <mesh
//                 geometry={nodes.Base.geometry}
//                 position={[0, 0, 0]}
//                 rotation-y={Math.PI}
//                 castShadow
//                 receiveShadow
//             >
//                 <meshStandardMaterial
//                     color={"#A17A74"}
//                     metalness={0}
//                     roughness={1}
//                 />
//             </mesh>
//         </group>
//     );
// });


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
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
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

interface MousePosition {
    x: number;
    y: number;
}

export default function Model({ NAME, choixcouleur }: ModelProps): JSX.Element {
    const groupRef = useRef<THREE.Group>(null);
    const cubeRef = useRef<THREE.Mesh>(null);
    const cameraControlsRef = useRef<CameraControls>(null);
    const { camera, size } = useThree();

    const [isWindowBelow1024, setIsWindowBelow1024] = useState<boolean>(size.width < 1024);
    const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
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

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const [cameraInitialPosition] = useState(() => new THREE.Vector3(0, 4, 6.7));
    const [cameraPositionS] = useState(() => new THREE.Vector3(0, 3, 30))
    const [cameraPositionE] = useState(() => new THREE.Vector3(0, 1.5, 6.7))
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

        const elapsedTime = state.clock.elapsedTime;
        const cameraDistance = isWindowBelow1024 ? 8 : 6.7;

        if (elapsedTime < 3) {
            // Initial animation
            // camera.position.lerp(new THREE.Vector3(0, 4, cameraDistance), 0.05);
            cameraPositionS.lerp(cameraPositionE, 0.05)
            state.camera.position.copy(cameraPositionS)

        } else {
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
            velocityRef.current.x *= (1 - dampingFactor);
            velocityRef.current.y *= (1 - dampingFactor);

            // Update camera position
            camera.position.x += velocityRef.current.x;
            camera.position.y += velocityRef.current.y;

            // Keep Z position constant
            camera.position.z = cameraDistance;

        }
        if (size.width < 590) {
            camera.position.z = cameraDistance+2;

        }
        if (size.width < 400) {
            camera.position.z = cameraDistance+4;

        }
        if (size.width < 300) {
            camera.position.z = cameraDistance+6;

        }
        if (size.width < 200) {
            camera.position.z = cameraDistance+8;

        }



       
    });
    useEffect(() => {
        if (isWindowBelow1024 && cameraControlsRef.current && cubeRef.current) {
            cameraControlsRef.current.fitToBox(cubeRef.current, true);
        }
    }, [isWindowBelow1024]);
    const getTextScale = useCallback((
                text: string,
                maxWidth: number,
                fontSize: number
            ): number => {
                const textWidth = text.length * fontSize * 0.35;
                return textWidth > maxWidth ? maxWidth / textWidth : 1;
            }, []);
        
            const textScale = useMemo(() => getTextScale(NAME, 2.2, 16), [NAME, getTextScale]);

    return (
        <>
            <group ref={groupRef} position={groupPosition as [number, number, number]} rotation={groupRotation as [number, number, number]}>
            {isWindowBelow1024 && <CameraControls ref={cameraControlsRef} />}
                <mesh ref={cubeRef} position-y={1} position-z={0} >
                    <boxGeometry args={[3.6, 3, 5]} />
                    <meshBasicMaterial wireframe visible={false} />
                </mesh>
                <Trophee CouleurTrophez={CouleurTrophez} />

                <Text
                    fontSize={16*textScale}
                    color={"black"}
                    fontWeight={"bold"}
                    rotation={[0, -Math.PI * 0.5, 0]}
                    position={[-0.8, 0.04, 0]}
                >
                    {NAME}
                </Text>
            </group>

            <OptimizedReflector />
        </>
    );
}

const OptimizedReflector = React.memo(() => (
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

const Trophee = React.memo(({ CouleurTrophez }: TropheeProps) => {
    const { nodes } = useLoader(GLTFLoader, "/model/tropheeV2.glb") as GLTFResult;
    const gradient = useTexture("/gradient/gradient.png");
    if (gradient) {
        gradient.rotation = -Math.PI / 2;
    }
    const ref = useRef<THREE.Group>(null);

    return (

        <group position={[0, -0.5, 0]} >
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
                        color={'#EED5D2'}
                    />
                </mesh>
            </Float>

            <mesh
                //@ts-ignore
                geometry={nodes.Base.geometry}
                position={[0, 0, 0]}
                rotation-y={Math.PI}
                castShadow
                receiveShadow
            >
                <meshStandardMaterial
                    color={"#A17A74"}
                    metalness={0}
                    roughness={1}
                />
            </mesh>
        </group>
    );
});