"use client";
import { OrbitControls, Environment } from "@react-three/drei";
import Model from "./Model";
import Lights from "./Lights";
import {  DepthOfField, EffectComposer, Noise } from "@react-three/postprocessing";


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

            <OrbitControls />

            <Lights />

            {/* <ElementDeco /> */}



            <EffectComposer>
      <DepthOfField focusDistance={.02} focalLength={0.1} bokehScale={2} height={480} />
    </EffectComposer>

            <Model NAME='melissa dupont '
                choixcouleur={2}
            />

        </group>


    );
};

export default Scene;
