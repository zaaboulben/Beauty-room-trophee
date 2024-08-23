"use client";
import Lights from "./Lights";
import SceneAnimated from "./SceneAnimated";
import { Suspense } from "react";
import HtmlText from "./HtmlText";
import { Canvas } from "@react-three/fiber";

interface SceneProps {
    nom: string;
    formationNumber: number;
}

interface MaterialParams {
    color: string;
    roughness: number;
    metalness: number;
    reflectivity: number;
    clearcoat: number;
    clearcoatRoughness: number;
    ior: number;
    fog: boolean;
    envMapIntensity: number;
    emissive: string;
    emissiveIntensity: number;
    transmission: number;
    transparent: boolean;
    opacity: number;
    sheen: number;
    sheenColor: string;
    sheenRoughness: number;
    iridescence: number;
    iridescenceIOR: number;
    precision: string;
    specularIntensity: number;
    specularColor: string;
}

interface Parametres {
    material: MaterialParams;
    floorColor: string;
    worldcolor: string;
    particlecolor: string;
}


let parametres = {
    material: {
        color: "#6b4c85",
        roughness: 0.35,  // Slightly increased for more blending and smoother surface
        metalness: 0.5,   // Reduced further to make the material softer and less reflective
        reflectivity: 1,  // Slightly lowered to soften reflections
        clearcoat: 0.5,   // Reduced clearcoat to avoid too much shininess on imperfections
        clearcoatRoughness: 0.1,  // A bit rougher to blend clearcoat with the base layer
        ior: 1.4,  // Reduced to soften light interaction with the surface
        fog: true,
        envMapIntensity: 0.6,  // Lowered to reduce harsh environment reflections
        emissive: "#8a6fa8",  // Slightly brighter emissive color for a subtle glowing center
        emissiveIntensity: 0.1,  // Increased to make the center appear brighter
        transmission: 0.25,  // Reduced to prevent over-transparency, keeping depth subtle
        transparent: true,
        opacity: 1,
        sheen: 0.3,  // Reduced sheen for more subtle light variations
        sheenColor: "#8a6fa8",
        sheenRoughness: 0.25,  // Increased roughness to soften sheen and hide imperfections
        iridescence: 1.1,  // Lowered iridescence for subtler color shift, keeping it soft
        iridescenceIOR: 2.,  // Reduced further for a softer effect at the edges
        precision: "highp",
        specularIntensity: 0.9,  // Lowered to reduce sharp specular highlights
        specularColor: "#8a6fa8",
    },
    floorColor: "#6b4c85",
    worldcolor: "#260226",
    particlecolor: "#6b4c85",
};


const Scene = ({ nom, formationNumber }: SceneProps) => {


    switch (formationNumber) {
        case 1:
            parametres = {
                //violet
                material: {
                    color: "#6b4c85",

                    roughness: 0.35,  // Slightly increased for more blending and smoother surface
                    metalness: 0.5,   // Reduced further to make the material softer and less reflective
                    reflectivity: 1,  // Slightly lowered to soften reflections
                    clearcoat: 0.5,   // Reduced clearcoat to avoid too much shininess on imperfections
                    clearcoatRoughness: 0.1,  // A bit rougher to blend clearcoat with the base layer
                    ior: 1.4,  // Reduced to soften light interaction with the surface
                    fog: true,
                    envMapIntensity: 0.6,  // Lowered to reduce harsh environment reflections
                    emissive: "#8a6fa8",  // Slightly brighter emissive color for a subtle glowing center
                    emissiveIntensity: 0.1,  // Increased to make the center appear brighter
                    transmission: 0.25,  // Reduced to prevent over-transparency, keeping depth subtle
                    transparent: true,
                    opacity: 1,
                    sheen: 0.3,  // Reduced sheen for more subtle light variations
                    sheenColor: "#8a6fa8",
                    sheenRoughness: 0.25,  // Increased roughness to soften sheen and hide imperfections
                    iridescence: 1.1,  // Lowered iridescence for subtler color shift, keeping it soft
                    iridescenceIOR: 2.,  // Reduced further for a softer effect at the edges
                    precision: "highp",
                    specularIntensity: 0.9,  // Lowered to reduce sharp specular highlights
                    specularColor: "#8a6fa8",
                },
                floorColor: "#6b4c85",
                worldcolor: "#260226",
                particlecolor: "#6b4c85",
            };
            break;
        case 2:
            parametres = {
                //brown
                material: {
                    color: "#8B5A2B",  // Warm, rich brown base color
                    roughness: 0.3,  // Smooth surface to maintain a glossy texture
                    metalness: 0.2,  // Low metalness for a soft, non-metallic feel
                    reflectivity: 0.8,  // Reflective enough to give a shiny, polished effect
                    clearcoat: 0.6,  // Clearcoat for a glossy finish reminiscent of polished surfaces
                    clearcoatRoughness: 0.1,  // Smooth clearcoat for a polished look
                    ior: 1.4,  // Balanced refraction to soften light interaction
                    fog: true,  // Fog interaction for depth
                    envMapIntensity: 0.5,  // Moderate environment reflection for soft highlights
                    emissive: "#A97C56",  // Lighter brown emissive for subtle inner glow
                    emissiveIntensity: 0.1,  // Soft emissive glow for depth
                    transmission: 0.2,  // Light transmission for a slight translucent effect
                    transparent: true,  // Transparency to enhance the glossy, deep feel
                    opacity: 1,  // Fully opaque, with transparency for subtle effects
                    sheen: 0.3,  // Soft sheen to enhance the glossy appearance
                    sheenColor: "#A97C56",  // Sheen color matching the emissive for cohesiveness
                    sheenRoughness: 0.2,  // Slightly rougher sheen for texture
                    iridescence: 0.5,  // Subtle iridescence for dynamic light interaction
                    iridescenceIOR: 1.8,  // Low iridescence IOR to avoid harsh color shifts
                    precision: "highp",  // High precision for smooth shading
                    specularIntensity: 0.8,  // Strong specular highlights for a polished, glossy finish
                    specularColor: "#A97C56",  // Light brown specular highlights to match the base
                },
                floorColor: "#6C3F17",
                worldcolor: "#1E1106",
                particlecolor: "#8B5A2B",



            }



            break;


        case 3:
            parametres = {
                //grey
                material: {
                    color: "#5D5D5D",  // Neutral dark gray
                    roughness: 0.35,
                    metalness: 0.5,
                    reflectivity: 1,
                    clearcoat: 0.5,
                    clearcoatRoughness: 0.1,
                    ior: 1.4,
                    fog: true,
                    envMapIntensity: 0.6,
                    emissive: "#A6A6A6",  // Soft light gray glow
                    emissiveIntensity: 0.1,
                    transmission: 0.25,
                    transparent: true,
                    opacity: 1,
                    sheen: 0.3,
                    sheenColor: "#A6A6A6",  // Light gray sheen
                    sheenRoughness: 0.25,
                    iridescence: .2,
                    iridescenceIOR: 1.,
                    precision: "highp",
                    specularIntensity: 0.9,
                    specularColor: "#A6A6A6",  // Gray specular highlights
                },
                floorColor: "#7D7D7D",
                worldcolor: "#121212",
                particlecolor: "#5D5D5D",
            };

            break;
        case 4:
            parametres = {
                material: {
//rose
                    color: "#FF66B2",  // Bright, vibrant rose bonbon pink
                    roughness: 0.5,  // Slightly smooth for a candy-like texture
                    metalness: 0.2,  // Low metalness for a soft, non-metallic feel
                    reflectivity: 0.8,  // Reflective enough to give a shiny, glossy effect
                    clearcoat: 0.6,  // Clearcoat for a glossy, candy-like finish
                    clearcoatRoughness: 0.1,  // Smooth clearcoat for a polished look
                    ior: 1.4,  // Balanced refraction for soft light interaction
                    fog: true,  // Fog interaction for depth
                    envMapIntensity: 0.5,  // Moderate environment reflection for soft highlights
                    emissive: "#FF99CC",  // Soft light pink emissive for a gentle glow
                    emissiveIntensity: 0.1,  // Subtle emissive glow to add depth
                    transmission: 0.2,  // Light transmission for a semi-translucent effect
                    transparent: true,  // Transparency for a glossy and deep feel
                    opacity: 1,  // Fully opaque, relying on transmission for depth
                    sheen: 0.3,  // Soft sheen to enhance the glossy look
                    sheenColor: "#FF99CC",  // Matching sheen color for a cohesive pink look
                    sheenRoughness: 0.2,  // Slightly rougher sheen for texture
                    iridescence: 1.5,  // Subtle iridescence to add a dynamic color shift
                    iridescenceIOR: 2.8,  // Low iridescence IOR to prevent harsh color changes
                    precision: "highp",  // High precision for smooth blending
                    specularIntensity: 0.8,  // Strong specular highlights for a glossy, polished finish
                    specularColor: "#FF99CC",  // Pink specular highlights to complement the base
                },
                floorColor: "#E55BA0",
                worldcolor: "#4C1E35",
                particlecolor: "#FF66B2",

            }



    }

    


    return (
        <main className="h-screen w-screen flex flex-col items-center justify-center" style={{ backgroundColor: parametres.worldcolor }}>
            <div className="relative w-full h-full">
                <div className="absolute w-full h-full">
                    <Suspense fallback={
                        <div className="absolute w-full h-full flex items-center justify-center">
                            <p className="text-white text-2xl">Loading...</p>
                        </div>
                    }>

                        <HtmlText />

                        <Canvas
                            shadows={"soft"} gl={{
                                antialias: true,

                            }} dpr={[1, 2]} camera={{
                                fov: 60,
                                near: 0.1,
                                far: 100,



                            }}  >
                            <Lights />


                            <SceneAnimated parametres={parametres} />
                            {/* <fog attach="fog" args={["#260226", 0.1, 25]} /> */} marron 6C3F17
                            <fog attach="fog" args={[parametres.worldcolor, 0.1, 25]} />


                        </Canvas>
                    </Suspense>

                </div>
            </div>
        </main>


    );
};

export default Scene;
