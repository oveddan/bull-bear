import { useGLTF } from '@react-three/drei';
import { ObjectMap } from '@react-three/fiber';
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
import { useSceneRegistry } from '../hooks/useSceneRegistry';
import { createSceneDependency } from '@oveddan-behave-graph/scene';
// import { ConnectButton3d } from './ConnectButton3d';
import { SceneInner } from './SceneInner';
import { useGameContractNodeDefinitions } from '../hooks/useGameContractNodeDefinitions';
import { GraphJSON } from '@oveddan-behave-graph/core';
import { useEffect } from 'react';
import { BigNumber } from 'ethers';
import { useModelAndGraphFromToken } from '../hooks/useModelAndGraphFromToken';
// import { useWhyDidYouUpdate } from 'use-why-did-you-update';

const defaultTokenId = BigNumber.from(0);

export const NonEditableScene = ({
  modelUrl,
  graphJson
}: {
  modelUrl: string;
  graphJson: GraphJSON;
}) => {
  const gltf = useGLTF(modelUrl) as GLTF & ObjectMap;

  useEffect(() => {
    console.log('loaded');
  }, []);

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
  // runs the behavior graph on the scene
  useGraphRunner({
    graphJson,
    valueTypeDefinitions: coreValueDefinitions,
    eventEmitter: coreDependencies.lifecycleEventEmitter,
    dependencies,
    nodeDefinitions,
    autoRun: true
  });

  return (
    <SceneInner
      gltf={gltf}
      animations={animations}
      onClickListeners={onClickListeners}
      tokenId={defaultTokenId}
    />
  );
};

export const NonEditableSceneWithFilesFromToken = () => {
  const result = useModelAndGraphFromToken();

  if (!result.graphJson) return null;

  return (
    <NonEditableScene modelUrl={result.modelUrl} graphJson={result.graphJson} />
  );
};
