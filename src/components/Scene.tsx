import {
  OrbitControls,
  Stage,
  useContextBridge,
  useGLTF
} from '@react-three/drei';
import { Canvas, ObjectMap } from '@react-three/fiber';
import { useState } from 'react';
import { Object3D } from 'three';
import catModel from '../assets/final_cat.glb';
import { useScene } from '../scene/useScene';
import { GLTF } from 'three-stdlib';
import {
  useCoreRegistry,
  useDependency,
  // useGraphRunner,
  useMergeDependencies
} from '@oveddan-behave-graph/flow';
import { useGraphJson } from '../scene/buildGraphJson';
import { useSceneRegistry } from '../hooks/useSceneRegistry';
import { createSceneDependency } from '@oveddan-behave-graph/scene';
import ToggleAnimations from '../scene/ToggleAnimations';
import { RegisterOnClickListeners } from '../scene/RegisterOnClickListeners';
import { ConnectButton3d } from './ConnectButton3d';
import { Context as WagmiContext } from 'wagmi';
export const Scene = () => {
  const gltf = useGLTF(catModel) as GLTF & ObjectMap;

  // todo: combine the below into a single hook
  const {
    nodeDefinitions: coreNodeDefinitions,
    valuesDefinitions: coreValueDefinitions,
    dependencies: coreDependencies
  } = useCoreRegistry();

  // get the possible nodes that can be defined for the behavior graph,
  // by merging the core nodes with the scene nodes
  const { nodeDefinitions /*, valuesDefinitions*/ } = useSceneRegistry({
    existingNodeDefinitions: coreNodeDefinitions,
    existingValuesDefinitions: coreValueDefinitions
  });

  // create the scene api on the loaded gltf, that is used by the behavior graph
  const {
    scene,
    animations,
    sceneOnClickListeners: onClickListeners
  } = useScene(gltf);

  // create the scene dependency, a wrapper around the scene api
  // created around the gltf, that is used by the behavior graph
  // scene nodes
  const sceneDependency = useDependency(scene, createSceneDependency);
  // merge the core dependencies with the scene dependency
  const dependencies = useMergeDependencies(coreDependencies, sceneDependency);

  // loads the behave graph for the scene
  const graphJson = useGraphJson();

  // runs the behavior graph on the scene
  // useGraphRunner({
  //   graphJson,
  //   valueTypeDefinitions: coreValueDefinitions,
  //   eventEmitter: coreDependencies.lifecycleEventEmitter,
  //   dependencies,
  //   nodeDefinitions,
  //   autoRun: true
  // });

  const [mainRef, setMainRef] = useState<Object3D | null>(null);
  const ContextBridge = useContextBridge(WagmiContext);
  return (
    <Canvas>
      <ContextBridge>
        <OrbitControls makeDefault target={mainRef?.position} />
        <Stage shadows intensity={1} environment="city" preset="rembrandt">
          <primitive object={gltf.scene} ref={setMainRef}>
            <RegisterOnClickListeners
              gltf={gltf}
              onClickListeners={onClickListeners}
            />
          </primitive>
        </Stage>
        <ToggleAnimations gltf={gltf} animationsState={animations} />
      </ContextBridge>
    </Canvas>
  );
};
