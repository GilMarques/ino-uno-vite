import { Html } from "@react-three/drei";
import React from "react";
const Loader = () => {
  return (
    <Html>
      <div className="flex items-center justify-center">
        <div className="h-20 w-20 animate-spin rounded-full border-2 border-blue-500 border-t-blue-500 border-opacity-20"></div>
      </div>
    </Html>
  );
};

export default Loader;
