


"use client";
import {  OrbitControls, Environment, Sparkles } from "@react-three/drei";
import Model from "./Model";
import Lights from "./Lights";
import ElementDeco from "./ElementDeco";


const Scene = () => {




    return (
        <group name="modelfromScene">

            <Environment
                files={["/envmap3/px.png", "/envmap3/nx.png", "/envmap3/py.png", "/envmap3/ny.png", "/envmap3/pz.png", "/envmap3/nz.png"]}
                //  files={["/gradientmoredark/px.png", "/gradientmoredark/nx.png", "/gradientmoredark/py.png", "/gradientmoredark/ny.png", "/gradientmoredark/pz.png", "/gradientmoredark/nz.png"]} 

                background={"only"}

                ground={{ height: 10, scale: 0 }}
            />
            <OrbitControls />

            <Lights />
           
                <ElementDeco />

               


            
                <Model NAME='BENYAMINE ZAABOUL '
                    choixcouleur={2}
                />

            </group>


    );
};

export default Scene;
