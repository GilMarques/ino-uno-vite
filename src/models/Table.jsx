/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Author: shedmon (https://sketchfab.com/shedmon)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/wooden-table-acd1cef307b94803846d624b251a4e63
Title: Wooden Table
*/
"use client";
import { useGLTF } from "@react-three/drei";

const Table = (props) => {
  const { nodes, materials } = useGLTF("/assets/wooden_table.glb");
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.07}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.defaultMaterial.geometry}
          material={materials.Default}
          rotation={[Math.PI / 2, 0, 0]}
        />
      </group>
    </group>
  );
};

export default Table;
