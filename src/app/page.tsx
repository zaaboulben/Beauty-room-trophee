"use client";
import dynamic from "next/dynamic";
import HtmlText from "@/components/HtmlText";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Lights from "@/components/Lights";
import SceneAnimated from "@/components/SceneAnimated";
import { useControls } from "leva";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Home() {
  
const {formationnumber}=useControls({
  formationnumber: {
    value: 1,
    min: 1,
    max: 4,
    step: 1,
  },
});

  return (
<Scene 
nom = "tropheeBigChunks"
formationNumber = {formationnumber}  

/>
  
  );
}

