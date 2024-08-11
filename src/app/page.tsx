"use client";
import dynamic from "next/dynamic";
import HtmlText from "@/components/HtmlText";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Home() {
  

  return (

    <main className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="relative w-full h-full">
        <div className="absolute w-full h-full">
        <Suspense fallback={null}>

        <HtmlText />

          <Canvas  
           shadows={"soft"}   gl={{ antialias: true }} dpr={[1,2]} camera={{position:[0,3,30],
          fov: 60,
          near: 0.1,
          far: 1000,
          


          } }  >
            <Scene />
            
            <fog attach="fog" args={["#260226", 10, 50]} />

          </Canvas>
          </Suspense>

        </div>
      </div>
    </main>
  );
}

