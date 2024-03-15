import { useGLTF } from "@react-three/drei";

const Stool = (props) => {
  const { nodes, materials } = useGLTF("src/assets/stool_02.glb");
  return (
    <group {...props} dispose={null}>
      <group scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.OPM0014_OPM0014_0.geometry}
          material={materials.OPM0014}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
      </group>
    </group>
  );
};

export default Stool;
