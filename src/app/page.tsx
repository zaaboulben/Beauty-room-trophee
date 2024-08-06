"use client";
import dynamic from "next/dynamic";
import HtmlText from "@/components/HtmlText";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import { ScrollControls } from "@react-three/drei";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Home() {
  

  return (

    <main className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="relative w-full h-full">
        <div className="absolute w-full h-full">
        <Suspense fallback={null}>

        <HtmlText />

          <Canvas   shadows={"soft"}   gl={{ antialias: true }} dpr={[1,2]} camera={{position:[0,3,30]}} >
            <Scene />
            

          </Canvas>
          </Suspense>

        </div>
      </div>
    </main>
  );
}

