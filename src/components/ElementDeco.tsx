import React, { useMemo, useCallback } from "react";
import { useGLTF } from "@react-three/drei";
import { Mesh, BufferGeometry, Material, Vector3, Euler } from "three";

interface GLTFResult {
  nodes: {
    BouchonEncre: Mesh;
    EncreAtatouage: Mesh;
    tasse: Mesh;
    MakeUpMirror: Mesh;
    makeUpMirrorGlass: Mesh;
    Crayon: {
      children: Mesh[];
    };
  };
}

const BOUCHON_COLOR = "#000000";
const BOUCHON_METALNESS = 0.3;
const BOUCHON_ROUGHNESS = 0.4;

const ENCRE_COLOR = "#76091D";
const ENCRE_METALNESS = 0;
const ENCRE_ROUGHNESS = 0.1;

const TASSE_COLOR = "#96315C";//FF87C0 966976 
const TASSE_METALNESS = 0;
const TASSE_ROUGHNESS = 0.2;

const BouchonEncreGroup = React.memo(function BouchonEncreGroup({ Bouchon, Encre}: { Bouchon: Mesh, Encre: Mesh } ) {
  return (
    <group position={[-1,0,-5] }>
      <mesh geometry={Bouchon.geometry} position={Bouchon.position} castShadow>
        <meshStandardMaterial color={BOUCHON_COLOR} metalness={BOUCHON_METALNESS} roughness={BOUCHON_ROUGHNESS} />
      </mesh>
      <mesh geometry={Encre.geometry} position={Encre.position} castShadow>
        <meshStandardMaterial color={ENCRE_COLOR} metalness={ENCRE_METALNESS} roughness={ENCRE_ROUGHNESS} />
      </mesh>
    </group>
  );
});

const TasseGroup = React.memo(function TasseGroup({ tasse, crayonlist }: { tasse: Mesh, crayonlist: Mesh[] }) {
  const renderCrayons = useCallback(() => 
    crayonlist.map((crayon: Mesh, index: number) => (
      <mesh
        key={index}
        geometry={crayon.geometry}
        material={crayon.material}
        position={crayon.position}
        rotation={crayon.rotation}
        castShadow
      />
    )),
    [crayonlist]
  );

  return (
    <group rotation={[0, Math.PI * 0.6, 0]}
        position={[-0.2, 0, -2]}
    >
      <mesh
        geometry={tasse.geometry}
        position-y={tasse.position.y}
        rotation={tasse.rotation}
        castShadow
      >
        <meshStandardMaterial color={TASSE_COLOR} metalness={TASSE_METALNESS} roughness={TASSE_ROUGHNESS} />
      </mesh>
      {renderCrayons()}
    </group>
  );
});

const MirrorGroup = React.memo(function MirrorGroup({ MakeUpMirror, MakeUpMirrorGlass }: { MakeUpMirror: Mesh, MakeUpMirrorGlass: Mesh }) {
  return (
    <group position={[6, 0.13, 1.8]}>
      <mesh
        geometry={MakeUpMirror.geometry}
        position={MakeUpMirror.position}
        material={MakeUpMirror.material}
        castShadow
        rotation-y={Math.PI * 0.35}
      />
      <mesh
        geometry={MakeUpMirrorGlass.geometry}
        position={MakeUpMirrorGlass.position}
        castShadow
        material={MakeUpMirrorGlass.material}
        rotation-y={Math.PI * 0.35}
      />
    </group>
  );
});

const ElementDeco = React.memo(function ElementDeco(): JSX.Element {
    //@ts-ignore
  const { nodes } = useGLTF("/model/ElementMaquillage.glb") as GLTFResult;

  const Bouchon = useMemo(() => nodes.BouchonEncre, [nodes]);
  const Encre = useMemo(() => nodes.EncreAtatouage, [nodes]);
  const tasse = useMemo(() => nodes.tasse, [nodes]);
  const MakeUpMirror = useMemo(() => nodes.MakeUpMirror, [nodes]);
  const MakeUpMirrorGlass = useMemo(() => nodes.makeUpMirrorGlass, [nodes]);
  const crayonlist = useMemo(() => nodes.Crayon.children, [nodes]);

  return (
    <group position={[0, 1.3, 0]}>
      <BouchonEncreGroup Bouchon={Bouchon} Encre={Encre} />

      <TasseGroup tasse={tasse} crayonlist={crayonlist} />
      <MirrorGroup MakeUpMirror={MakeUpMirror} MakeUpMirrorGlass={MakeUpMirrorGlass} />
    </group>
  );
});

export default ElementDeco;