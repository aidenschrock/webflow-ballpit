import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, usePlane, useSphere } from "@react-three/cannon";
import { EffectComposer, SSAO } from "@react-three/postprocessing";
import { useTexture } from "@react-three/drei";
import texture from "./assets/bright-blue-128.png";

import "./App.css";

function App() {
  function InstancedSpheres({ count = 20 }) {
    const matcap = useTexture(texture);
    const { viewport } = useThree();
    const [ref] = useSphere((index) => ({
      mass: 100,
      position: [4 - Math.random() * 8, viewport.height, 0, 0],
      args: [2],
    }));
    return (
      <instancedMesh
        ref={ref}
        castShadow
        receiveShadow
        args={[null, null, count]}
      >
        <sphereGeometry args={[2, 32, 32]} />
        <meshMatcapMaterial matcap={matcap} />
        {/* <meshLambertMaterial color="#ff7b00" /> */}
      </instancedMesh>
    );
  }

  function Borders() {
    const { viewport } = useThree();
    return (
      <>
        <Plane
          position={[0, -viewport.height / 1.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
        <Plane position={[-10, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
        <Plane position={[10, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
        <Plane position={[0, 0, -3.5]} rotation={[0, 0, 0]} />
        <Plane position={[0, 0, 3.5]} rotation={[0, -Math.PI, 0]} />
      </>
    );
  }

  function Plane({ color, ...props }) {
    usePlane(() => ({ ...props }));
    return null;
  }

  function Mouse() {
    const { viewport } = useThree();
    const [, api] = useSphere(() => ({ type: "Kinematic", args: [8] }));
    return useFrame((state) =>
      api.position.set(
        (state.pointer.x * viewport.width) / 2,
        (state.pointer.y * viewport.height) / 2,
        7
      )
    );
  }

  return (
    <main className="main">
      <Canvas
        shadows
        gl={{ stencil: false, antialias: false }}
        camera={{ position: [0, 0, 20], fov: 50, near: 17, far: 40 }}
      >
        <fog attach="fog" args={["#b85a95", 25, 35]} />
        {/* <color attach="background" args={["#feef8a"]} /> */}
        {/* <ambientLight intensity={1.5} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <directionalLight
          castShadow
          intensity={4}
          position={[50, 50, 25]}
          shadow-mapSize={[256, 256]}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        /> */}
        <Physics
          gravity={[0, -50, 0]}
          defaultContactMaterial={{ restitution: 0.3 }}
        >
          <group position={[0, 0, -10]}>
            <Mouse />
            <Borders />
            <InstancedSpheres />
          </group>
        </Physics>
        <EffectComposer>
          <SSAO
            radius={0.4}
            intensity={50}
            luminanceInfluence={0.4}
            color="yellow"
          />
        </EffectComposer>
      </Canvas>
    </main>
  );
}

export default App;
