"use client";

import { Center, Float, MeshReflectorMaterial, useAnimations, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useRef, useEffect, useState, memo, useMemo, useCallback, use } from "react";
import * as THREE from "three";
import { useSpring, a } from '@react-spring/three';
import { GLTF } from 'three-stdlib';
import Particles from "./Particles";

type GLTFResult = GLTF & {
  nodes: {
    [key: string]: THREE.Mesh;
  };
  animations: THREE.AnimationClip[];
};

useGLTF.preload("/model/tropheeBigChunks.glb");


interface AnimatedMeshProps {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  name: string;
  isVisible: boolean;
}
function AnimatedMesh({ geometry, material, name, isVisible }: AnimatedMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [mouseEntered, setMouseEntered] = useState(false);
  const { viewport, camera, mouse, gl } = useThree();

  const [spring, api] = useSpring(() => ({
    position: [0, 0, 0] as [number, number, number],
    config: { mass: 3, tension: 400, friction: 30 }
  }));

  useEffect(() => {
    const canvas = gl.domElement;
    const handleMouseEnter = () => setMouseEntered(true);
    const handleMouseLeave = () => {
      setMouseEntered(false);
      setHovered(false);
      api.start({ position: [0, 0, 0] });
    };

    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [gl, api]);

  useFrame(() => {

    if (meshRef.current) {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(meshRef.current);

      if (intersects.length > 0 && !hovered) {
        setHovered(true);
        api.start({
          position: [
            ((Math.random() - 0.5)) * viewport.width * 0.05,
            ((Math.random() - 0.5)) * viewport.height * 0.05,
            ((Math.random() - 0.5)) * 0.5
          ] as [number, number, number]
        });
      } else if (intersects.length === 0 && hovered) {
        setHovered(false);
        api.start({ position: [0, 0, 0] });
      }
    }
  });

  return (
    <a.mesh
      ref={meshRef}
      name={name}
      castShadow
      geometry={geometry}
      material={material}
      position={spring.position}
      visible={isVisible}
    >

    </a.mesh>
  );
}
interface MousePosition {
  x: number;
  y: number;
}

export default function SceneAnimated() {
  const materialRef = useRef()

  const groupRef = useRef<THREE.Group>(null);
  //@ts-ignore
  const { nodes, animations, scene } = useGLTF("/model/tropheeBigChunks.glb") as GLTFResult;
  const { actions, mixer } = useAnimations(animations, groupRef);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cameraInitialPosition] = useState(() => new THREE.Vector3(0, 1.5, 6));

  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0
  });
  const velocityRef = useRef(new THREE.Vector2(0, 0));
  //   <meshPhysicalMaterial
  //   ref={materialRef}
  //   color="#FFD700"
  //   metalness={0.9}
  //   roughness={0.2}
  //   clearcoat={0.5}
  //   clearcoatRoughness={0.3}
  //   sheen={0.5}
  //   sheenRoughness={0.2}
  //   sheenColor="#FFD700"
  // />

  const material = new THREE.MeshPhysicalMaterial({
    color: "#6b4c85",
    roughness: 0.35,  // Légèrement réduit pour plus de brillance
    metalness: 0.5,   // Légèrement augmenté
    reflectivity: 1,  // Réduit car > 1 peut donner des résultats inattendus
    clearcoat: 0.5,   // Légèrement augmenté
    clearcoatRoughness: 0.1,
    ior: 1.5,
    fog: true,
    envMapIntensity: 1.,  // Légèrement augmenté
    emissive: "#6b4c85",
    emissiveIntensity: 0.2,  // Augmenté
    transmission: 0.3,  // Réduit
    transparent: true,  // Changé à true
    opacity: 1,
    sheen: 0.3,  // Augmenté
    sheenColor: "#AD86B1",
    sheenRoughness: 0.1,  // Légèrement augmenté
    iridescence: 1.1,
    iridescenceIOR: 2.6,
    precision: "highp",
    specularIntensity: 0.9,
    specularColor: "#AD86B1",
  });


  useEffect(() => {
    Object.values(actions).forEach((action) => {
      if (action) {
        action.reset().paused = true;
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      }
    });
  }, [actions]);

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
  useFrame((state) => {
    if (material) {
      // material.roughness = 0.4 + Math.sin(state.clock.elapsedTime) * 0.05
      // material.iridescence = 0.5 + Math.sin(state.clock.elapsedTime) * 0.5

      
    }
    const camera = state.camera;
    const elapsedTime = state.clock.elapsedTime;
    const dampingFactor = 0.1;
    const springStrength = 0.01;

    if (elapsedTime > 0 && !animationStarted) {
      Object.values(actions).forEach((action) => {
        if (action) {
          action.paused = false;
          action.play();
        }
      });
      setAnimationStarted(true);
      setIsVisible(true);
    }

    const targetX = cameraInitialPosition.x + mousePosition.x * 0.5;
    const targetY = cameraInitialPosition.y + mousePosition.y * 0.5;
    const forceX = (targetX - camera.position.x) * springStrength;
    const forceY = (targetY - camera.position.y) * springStrength;

    velocityRef.current.x += forceX;
    velocityRef.current.y += forceY;
    velocityRef.current.x *= 1 - dampingFactor;
    velocityRef.current.y *= 1 - dampingFactor;

    camera.position.x += velocityRef.current.x;
    camera.position.y += velocityRef.current.y;
    camera.lookAt(0, 1, 0);

    if (mixer) {
      const delta = state.clock.getDelta();
      mixer.update(delta);
      //timeclip 2.875
      //0.9997182048983915

      Object.values(actions).forEach((action) => {
        if (action) {
          const progress = action.time / action.getClip().duration;

          if (progress > 0.5 && progress <= 0.8) {
            action.setEffectiveTimeScale(0.5);
          }
          else if (progress > 0.8 && progress <= 0.9997208561942135) {
            const dampingFactor = 1 - Math.pow((progress - 0.8) / 0.2, 2);
            action.setEffectiveTimeScale(dampingFactor * 0.5);
            console.log("progress", progress);


          } else {
            action.setEffectiveTimeScale(1);
            console.log("progress222", progress);


          }





        }
      });
    }
  });

  return (
    <group
    >
      <Center
        position={[0, 2, 0]}
      >
        <OptimizedReflector />

        <group ref={groupRef} position-y={.5} position-z={-2} rotation-y={Math.PI * 0.5}>
          <Float
            speed={2}
            rotationIntensity={0.2}
            floatIntensity={0.9}
            floatingRange={[-.2, .2]}
          >
            {Object.entries(nodes).map(([name, node]) => {
              if (node.isMesh) {

                return (

                  <AnimatedMesh

                    key={name}
                    name={name}
                    geometry={node.geometry}
                    //@ts-ignore
                    material={material}
                    isVisible={isVisible}
                  />
                );
              }
              return null;
            })}
          </Float>

          {/* <mesh
          
            
            visible={isVisible}
          >
               <meshPhysicalMaterial
        ref={materialRef}
        color="#FFD700"
        metalness={0.9}
        roughness={0.2}
        clearcoat={0.5}
        clearcoatRoughness={0.3}
        sheen={0.5}
        sheenRoughness={0.2}
        sheenColor="#FFD700"
      />
            <boxGeometry args={[1, 1, 1]} />
          </mesh> */}



          <Particles />
        </group>
      </Center>
    </group>
  );
}



const OptimizedReflector = memo(() => (
  <>

    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position-y={0}

    >
      <planeGeometry args={[1000, 1000]} />
      <MeshReflectorMaterial
        color={"#6b4c85"}
        metalness={0}
        roughness={1}
        resolution={512}
        mirror={0.4}
        mixBlur={10.5}
        mixStrength={1}
        blur={[100, 100]}
        depthScale={1.2}
        minDepthThreshold={0.3}
        maxDepthThreshold={1.5}
      ></MeshReflectorMaterial>

    </mesh>
  </>
));

OptimizedReflector.displayName = "OptimizedReflector";
