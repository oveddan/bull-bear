import { Environment, Lightformer, useContextBridge } from '@react-three/drei';
import { Canvas, ObjectMap } from '@react-three/fiber';
import { useState } from 'react';
import { Object3D } from 'three';
import { GLTF } from 'three-stdlib';
import { AnimationsState } from '../scene/useScene';
import { Context as WagmiContext } from 'wagmi';
import { RegisterOnClickListeners } from '../scene/RegisterOnClickListeners';
import ToggleAnimations from '../scene/ToggleAnimations';
import { OnClickListeners } from '../scene/buildScene';
import { Background } from './Elements/Background';
import { Effects } from './Elements/Effects';
import { UI } from './UI';
import { BigNumber } from 'ethers';

export const SceneInner = ({
  onClickListeners,
  gltf,
  animations,
  tokenId
}: {
  onClickListeners: OnClickListeners;
  gltf: GLTF & ObjectMap;
  animations: AnimationsState;
  tokenId: BigNumber;
}) => {
  // enable wagmi context to be used in the 3d scene.
  const ContextBridge = useContextBridge(WagmiContext);
  return (
    <Canvas className="bg-black">
      <ContextBridge>
        {/* <OrbitControls makeDefault target={mainRef?.position} /> */}
        <Effects />
        <Environment background={true}>
          <Lightformer
            form="rect" // circle | ring | rect (optional, default = rect)
            intensity={0.2} // power level (optional = 1)
            color="white" // (optional = white)
            // scale={[10, 5]} // Scale it any way you prefer (optional = [1, 1])
            target={[0, 0, 0]} // Target position (optional = undefined)
          />
        </Environment>
        <Background />
        <group position-y={-1.5}>
          <primitive object={gltf.scene}></primitive>

          <UI tokenId={tokenId} />
        </group>
        <RegisterOnClickListeners
          gltf={gltf}
          onClickListeners={onClickListeners}
        />
        <ToggleAnimations gltf={gltf} animationsState={animations} />
      </ContextBridge>
    </Canvas>
  );
};
