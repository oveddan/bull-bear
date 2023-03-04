import { OnClickListeners } from '@oveddan-behave-graph/scene';
import {
  Backdrop,
  Center,
  Environment,
  Lightformer,
  OrbitControls,
  RandomizedLight,
  Reflector,
  SpotLight,
  Stage,
  useContextBridge
} from '@react-three/drei';
import { Canvas, ObjectMap, useLoader } from '@react-three/fiber';
import { useState } from 'react';
import { Object3D } from 'three';
import { GLTF, RGBELoader } from 'three-stdlib';
import { AnimationsState } from '../scene/useScene';
import { Context as WagmiContext } from 'wagmi';
import { RegisterOnClickListeners } from '../scene/RegisterOnClickListeners';
import ToggleAnimations from '../scene/ToggleAnimations';
import { Floor } from './Elements/Floor';

export const SceneInner = ({
  onClickListeners,
  gltf,
  animations
}: {
  onClickListeners: OnClickListeners;
  gltf: GLTF & ObjectMap;
  animations: AnimationsState;
}) => {
  // const [mainRef, setMainRef] = useState<Object3D | null>(null);
  const [mainRef, setMainRef] = useState<Object3D | null>(null);
  const ContextBridge = useContextBridge(WagmiContext);
  return (
    <Canvas className="bg-black">
      <ContextBridge>
        <OrbitControls makeDefault target={mainRef?.position} />
        <Environment background={true}>
          <Lightformer
            form="rect" // circle | ring | rect (optional, default = rect)
            intensity={0.5} // power level (optional = 1)
            color="white" // (optional = white)
            // scale={[10, 5]} // Scale it any way you prefer (optional = [1, 1])
            target={[0, 0, 0]} // Target position (optional = undefined)
          />
        </Environment>
        <SpotLight
          distance={10}
          angle={0.3}
          attenuation={5}
          anglePower={2} // Diffuse-cone anglePower (default: 5)
          position-y={4}
          position-z={3}
        />
        <Center>
          {/* <Backdrop
            floor={0.25} // Stretches the floor segment, 0.25 by default
            segments={20} // Mesh-resolution, 20 by default
            receiveShadow
          >
            <meshStandardMaterial color="#353540" />
          </Backdrop> */}
          <primitive object={gltf.scene} ref={setMainRef}>
            <RegisterOnClickListeners
              gltf={gltf}
              onClickListeners={onClickListeners}
            />
          </primitive>
          <Floor />
        </Center>
        <ToggleAnimations gltf={gltf} animationsState={animations} />
        {/* </Stage> */}
      </ContextBridge>
    </Canvas>
  );
};
