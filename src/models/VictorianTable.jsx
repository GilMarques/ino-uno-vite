/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Author: Enzo Amanrich (https://sketchfab.com/ImaGeniusMan)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/victorian-wooden-table-1fe13399313e483ca04e34e56ba1c1c7
Title: Victorian Wooden table
*/

"use client";
import { useGLTF } from "@react-three/drei";
import { victoriantable } from "../assets";

export function VictorianTable(props) {
  const { nodes, materials } = useGLTF(victoriantable);
  return (
    <group
      {...props}
      dispose={null}
      position={props.position}
      scale={[2, 2, 2]}
    >
      <group scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder_low_Wooden_table_txt_0.geometry}
          material={materials.Wooden_table_txt}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Socle_low_Wooden_table_txt_0.geometry}
          material={materials.Wooden_table_txt}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Pieds_low_Wooden_table_txt_0.geometry}
          material={materials.Wooden_table_txt}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Table_top_low_Wooden_table_txt_0.geometry}
          material={materials.Wooden_table_txt}
        />
      </group>
    </group>
  );
}

export default VictorianTable;
