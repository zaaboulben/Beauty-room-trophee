"use client";

import { Center, MeshReflectorMaterial, Reflector, useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useRef, useEffect, useState, memo, useMemo } from "react";
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
    position: [0, 2, 0] as [number, number, number],
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
    const atinitial = true

    if (meshRef.current && mouseEntered) {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(meshRef.current);

      if (intersects.length > 0 && !hovered) {
        setHovered(true);
        api.start({
          position: [
            (Math.random() - 0.5) * viewport.width * 0.05,
            (Math.random() - 0.5) * viewport.height * 0.05,
            (Math.random() - 0.5) * 0.5
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
    />
  );
}
interface MousePosition {
  x: number;
  y: number;
}
export default function SceneAnimated() {
  const groupRef = useRef<THREE.Group>(null);
  // @ts-ignore
  const { nodes, animations } = useGLTF("/model/tropheeBigChunks.glb") as GLTFResult;
  const { actions, mixer } = useAnimations(animations, groupRef);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cameraInitialPosition] = useState(() => new THREE.Vector3(0, 1.5, 6));

  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0
  });
  const velocityRef = useRef(new THREE.Vector2(0, 0));

  const material = new THREE.MeshPhysicalMaterial({
    color: "#6b4c85",
    roughness: 0.7,
    metalness: 0.1,
    reflectivity: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.5
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
  }, [mousePosition.x, mousePosition.y]);

  useFrame((state) => {
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
      mixer.update(state.clock.getDelta());
    }
  });


  return (
    <group
    >
      <Center
        position={[0, 2.5, 0]}
      >
        <OptimizedReflector />

        <group ref={groupRef} position-y={.5} position-z={-2} rotation-y={Math.PI * 0.5}>
          {Object.entries(nodes).map(([name, node]) => {
            if (node.isMesh) {
              return (
                <AnimatedMesh

                  key={name}
                  name={name}
                  geometry={node.geometry}
                  material={material}
                  isVisible={isVisible}
                />
              );
            }
            return null;
          })}

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
