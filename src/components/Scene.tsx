import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { Canvas, ObjectMap } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { Object3D } from 'three';
import catModel from '../assets/final_cat.glb';
import { useScene } from '../scene/useScene';
import { GLTF } from 'three-stdlib';
import {
  useBehaveGraphFlow,
  useCoreRegistry,
  useCustomNodeTypes,
  useDependency,
  useGraphRunner,
  useMergeDependencies,
  useNodeSpecJson
} from '@oveddan-behave-graph/flow';
import { useGraphJson } from '../scene/buildGraphJson';
import { useSceneRegistry } from '../hooks/useSceneRegistry';

export const Scene = () => {
  const gltf = useGLTF(catModel) as GLTF & ObjectMap;

  const {
    nodeDefinitions: coreNodeDefinitions,
    valuesDefinitions: coreValueDefinitions,
    dependencies: coreDependencies
  } = useCoreRegistry();

  const { nodeDefinitions, valuesDefinitions } = useSceneRegistry({
    existingNodeDefinitions: coreNodeDefinitions,
    existingValuesDefinitions: coreValueDefinitions
  });

  const { scene, animations, sceneOnClickListeners } = useScene(gltf);

  const sceneDependency = useDependency(scene, createSceneDependency);
  const dependencies = useMergeDependencies(coreDependencies, sceneDependency);

  const specJson = useNodeSpecJson({
    dependencies,
    nodes: nodeDefinitions,
    values: valuesDefinitions
  });

  const initialGraphJson = useGraphJson();

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    graphJson,
    setGraphJson
  } = useBehaveGraphFlow({
    initialGraphJson,
    specJson
  });

  useGraphRunner({
    graphJson,
    valueTypeDefinitions: coreValueDefinitions,
    eventEmitter: coreDependencies.lifecycleEventEmitter,
    dependencies,
    nodeDefinitions,
    autoRun: true
  });

  const customNodeTypes = useCustomNodeTypes({
    specJson
  });

  const [refreshFlow, setRefreshFlow] = useState(false);

  useEffect(() => {
    setRefreshFlow(true);
    setTimeout(() => setRefreshFlow(false));
  }, [customNodeTypes]);

  const [mainRef, setMainRef] = useState<Object3D | null>(null);
  return (
    <Canvas>
      <OrbitControls makeDefault target={mainRef?.position} />
      <Stage shadows intensity={1} environment="city" preset="rembrandt">
        <primitive object={gltf.scene} ref={setMainRef} />
      </Stage>
    </Canvas>
  );
};
