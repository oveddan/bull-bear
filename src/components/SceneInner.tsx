import { OnClickListeners } from '@oveddan-behave-graph/scene';
import {
  Environment,
  Lightformer,
  OrbitControls,
  Stage,
  useContextBridge
} from '@react-three/drei';
import { Canvas, ObjectMap } from '@react-three/fiber';
import { useState } from 'react';
import { Object3D } from 'three';
import { GLTF } from 'three-stdlib';
import { AnimationsState } from '../scene/useScene';
import { Context as WagmiContext } from 'wagmi';
import { RegisterOnClickListeners } from '../scene/RegisterOnClickListeners';
import ToggleAnimations from '../scene/ToggleAnimations';

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
    <Canvas>
      <ContextBridge>
        <OrbitControls makeDefault target={mainRef?.position} />
        <Environment>
          <Lightformer
            form="rect" // circle | ring | rect (optional, default = rect)
            intensity={0.5} // power level (optional = 1)
            color="white" // (optional = white)
            // scale={[10, 5]} // Scale it any way you prefer (optional = [1, 1])
            target={[0, 0, 0]} // Target position (optional = undefined)
          />
        </Environment>
        <Stage intensity={0.2}>
          <primitive object={gltf.scene} ref={setMainRef}>
            <RegisterOnClickListeners
              gltf={gltf}
              onClickListeners={onClickListeners}
            />
          </primitive>
          <ToggleAnimations gltf={gltf} animationsState={animations} />
        </Stage>
      </ContextBridge>
    </Canvas>
  );
};
