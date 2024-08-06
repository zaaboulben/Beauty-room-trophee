"use client";
import React, { use, useRef } from "react";
import { useHelper } from "@react-three/drei";
import { DirectionalLightHelper, DirectionalLight, PointLightHelper } from "three";

const Lights = () => {

  return (
    <group>
      <directionalLight 
      position={[6, 7, 6]} target-position={[2.5, 2,0]} intensity={4}      />
 
      <directionalLight 
      position={[0, 7, -6]} target-position={[2.5,2,0]} intensity={5} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight 
      position={[0, 7, 6]} target-position={[2.5,2,0]} intensity={10}   shadow-mapSize={[1024, 1024]}/>
      <directionalLight
      position={[-6, 7, 6]} target-position={[2.5,2,0]} intensity={4}  />
      
    </group>
  );
};

export default Lights;
