import {
  Environment,
  Lightformer,
  OrbitControls,
  Stage,
  useContextBridge,
  useGLTF
} from '@react-three/drei';
import { Canvas, ObjectMap } from '@react-three/fiber';
import { useState } from 'react';
import { Object3D } from 'three';
import { useScene } from '../scene/useScene';
import { GLTF } from 'three-stdlib';
import {
  useCoreRegistry,
  useDependency,
  useGraphRunner,
  // useGraphRunner,
  useMergeDependencies,
  useMergeMap
} from '@oveddan-behave-graph/flow';
import { useGraphJson } from '../behave/buildGraphJson';
import { useSceneRegistry } from '../hooks/useSceneRegistry';
import { createSceneDependency } from '@oveddan-behave-graph/scene';
// import { ConnectButton3d } from './ConnectButton3d';
import { Context as WagmiContext } from 'wagmi';
import { SceneInner } from './SceneInner';
import { useGameContractNodeDefinitions } from '../hooks/useGameContractNodeDefinitions';
// import { useWhyDidYouUpdate } from 'use-why-did-you-update';
export const NonEditableScene = ({ modelUrl }: { modelUrl: string }) => {
  const gltf = useGLTF(modelUrl) as GLTF & ObjectMap;

  // todo: combine the below into a single hook
  const {
    nodeDefinitions: coreNodeDefinitions,
    valuesDefinitions: coreValueDefinitions,
    dependencies: coreDependencies
  } = useCoreRegistry();

  const gameContractNodeDefinitions = useGameContractNodeDefinitions();

  const mergedDefinitions = useMergeMap(
    coreNodeDefinitions,
    gameContractNodeDefinitions
  );

  // get the possible nodes that can be defined for the behavior graph,
  // by merging the core nodes with the scene nodes
  const { nodeDefinitions /*, valuesDefinitions*/ } = useSceneRegistry({
    existingNodeDefinitions: mergedDefinitions,
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
  const graphJson = useGraphJson(scene, nodeDefinitions);

  // useWhyDidYouUpdate('Scene', {
  //   graphJson,
  //   dependencies,
  //   nodeDefinitions,
  //   coreValueDefinitions,
  //   lifecycle: coreDependencies.lifecycleEventEmitter
  // });

  // runs the behavior graph on the scene
  useGraphRunner({
    graphJson,
    valueTypeDefinitions: coreValueDefinitions,
    eventEmitter: coreDependencies.lifecycleEventEmitter,
    dependencies,
    nodeDefinitions,
    autoRun: true
  });

  const [mainRef, setMainRef] = useState<Object3D | null>(null);
  const ContextBridge = useContextBridge(WagmiContext);
  return (
    <Canvas>
      <ContextBridge>
        <OrbitControls makeDefault target={mainRef?.position} />
        <Environment>
          <Lightformer
            form="rect" // circle | ring | rect (optional, default = rect)
            intensity={1} // power level (optional = 1)
            color="white" // (optional = white)
            scale={[10, 5]} // Scale it any way you prefer (optional = [1, 1])
            target={[0, 0, 0]} // Target position (optional = undefined)
          />
        </Environment>
        <Stage intensity={0.1}>
          <SceneInner
            setMainRef={setMainRef}
            gltf={gltf}
            animations={animations}
            onClickListeners={onClickListeners}
          />
        </Stage>
      </ContextBridge>
    </Canvas>
  );
};
