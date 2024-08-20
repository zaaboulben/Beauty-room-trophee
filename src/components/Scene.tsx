"use client";
import { OrbitControls, Environment, Center } from "@react-three/drei";
import Model from "./Model";
import Lights from "./Lights";
import {  Bloom, DepthOfField, EffectComposer, Noise } from "@react-three/postprocessing";
import SceneAnimated from "./SceneAnimated";
import Particles from "./Particles";


const Scene = () => {




    return (
        <group name="modelfromScene">

            <Environment
                files={["/envmap3/px.png", "/envmap3/nx.png", "/envmap3/py.png", "/envmap3/ny.png", "/envmap3/pz.png", "/envmap3/nz.png"]}
                // files={["/gradientmoredark/px.png", "/gradientmoredark/nx.png", "/gradientmoredark/py.png", "/gradientmoredark/ny.png", "/gradientmoredark/pz.png", "/gradientmoredark/nz.png"]}

                background={true}
                environmentIntensity={.3}
                ground={{ height: 10, scale: 0 }}
            />


            <Lights />
            <OrbitControls />
            {/* <ElementDeco /> */}



          

            {/* <Model NAME='melissa dupont henry'
                choixcouleur={2}
            /> */}

            <SceneAnimated/>
            
           


            {/* <Particles /> */}

        </group>


    );
};

export default Scene;
