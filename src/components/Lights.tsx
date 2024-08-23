"use client";
import React, { use, useRef } from "react";
import { SpotLight, useHelper } from "@react-three/drei";
import { DirectionalLightHelper, DirectionalLight, PointLightHelper } from "three";

const Lights = () => {
  // const light2 = useRef();
  // const light3 = useRef();
  // const light4 = useRef();
  // useHelper(light2, DirectionalLightHelper, 0.2, "green");
  // useHelper(light3, DirectionalLightHelper, 0.2, "blue");
  // useHelper(light4, DirectionalLightHelper, 0.2, "yellow")


  return (
    <group>
      <directionalLight 
      // ref={light1}
      position={[6, 7, 6]} target-position={[0, 2,0]} intensity={1} shadow-normalBias={ 0.14 }   castShadow   />
 
      <directionalLight
      //  ref={light2}
      position={[0, 7, -6]} target-position={[0,2,0]} intensity={1} shadow-normalBias={ 0.14 }  shadow-mapSize={[1024, 1024]} />
      <directionalLight 
      // ref={light3}
      position={[6, 7, 6]} target-position={[0,2,0]} intensity={1}  shadow-normalBias={ 0.14 }  shadow-mapSize={[1024, 1024]}/>
      <directionalLight 
      //ref={light4}
      position={[-6, 7, 6]} target-position={[0,2,0]} intensity={1} shadow-normalBias={ 0.14 }  castShadow  />

    <ambientLight intensity={1} />
    
    <directionalLight 

      position={[0, 2, 6]} 
      scale={10}
      
      frustumCulled={true}
      target-position={[0,2,0]} intensity={0.5} shadow-normalBias={ 0.14 }  castShadow  />

    </group>
  );
};

export default Lights;
