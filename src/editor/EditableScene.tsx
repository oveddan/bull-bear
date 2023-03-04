import { Suspense, useState } from 'react';
import './styles/resizer.css';
import { CustomControls } from './CustomControls';
import SplitEditor from './SplitEditor';
import { createSceneDependency, ObjectMap } from '@oveddan-behave-graph/scene';

import {
  useBehaveGraphFlow,
  useGraphRunner,
  useNodeSpecJson,
  NodePicker,
  useFlowHandlers,
  useCustomNodeTypes,
  useMergeDependencies,
  useDependency,
  useCoreRegistry,
  useMergeMap
} from '@oveddan-behave-graph/flow';
import ReactFlow, { Background, BackgroundVariant } from 'reactflow';
import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { GraphJSON, NodeDefinition } from '@oveddan-behave-graph/core';
import { useScene } from '../scene/useScene';
import { useSceneRegistry } from '../hooks/useSceneRegistry';
import { SceneInner } from '../components/SceneInner';

export type EditableSceneProps = {
  modelUrl: string;
  initialGraphJson: GraphJSON;
  additionalNodeDefinitions: Record<string, NodeDefinition> | undefined;
};

export function EditableSceneInner({
  modelUrl,
  initialGraphJson,
  additionalNodeDefinitions
}: EditableSceneProps) {
  const gltf = useGLTF(modelUrl) as GLTF & ObjectMap;

  const {
    nodeDefinitions: coreNodeDefinitions,
    valuesDefinitions: coreValueDefinitions,
    dependencies: coreDependencies
  } = useCoreRegistry();

  const coreAndAdditional = useMergeMap(
    coreNodeDefinitions,
    additionalNodeDefinitions
  );

  const { nodeDefinitions, valuesDefinitions } = useSceneRegistry({
    existingNodeDefinitions: coreAndAdditional,
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

  const { togglePlay, playing } = useGraphRunner({
    graphJson,
    valueTypeDefinitions: coreValueDefinitions,
    eventEmitter: coreDependencies.lifecycleEventEmitter,
    dependencies,
    nodeDefinitions
  });

  const {
    onConnect,
    handleStartConnect,
    handleStopConnect,
    handlePaneClick,
    handlePaneContextMenu,
    nodePickerVisibility,
    handleAddNode,
    closeNodePicker,
    nodePickFilters
  } = useFlowHandlers({
    nodes,
    onEdgesChange,
    onNodesChange,
    specJSON: specJson
  });

  const customNodeTypes = useCustomNodeTypes({
    specJson
  });

  const [refreshFlow, setRefreshFlow] = useState(false);

  useEffect(() => {
    setRefreshFlow(true);
    setTimeout(() => setRefreshFlow(false));
  }, [customNodeTypes]);

  const flowEditor = customNodeTypes && !refreshFlow && (
    <ReactFlow
      nodeTypes={customNodeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      // @ts-ignore
      onConnectStart={handleStartConnect}
      // @ts-ignore
      onConnectEnd={handleStopConnect}
      fitView
      fitViewOptions={{ maxZoom: 1 }}
      onPaneClick={handlePaneClick}
      onPaneContextMenu={handlePaneContextMenu}
    >
      {specJson && (
        <CustomControls
          toggleRun={togglePlay}
          graphJson={graphJson}
          running={playing}
          setBehaviorGraph={setGraphJson}
        />
      )}
      <Background
        variant={BackgroundVariant.Lines}
        color="#2a2b2d"
        style={{ backgroundColor: '#1E1F22' }}
      />
      {nodePickerVisibility && (
        <NodePicker
          position={nodePickerVisibility}
          filters={nodePickFilters}
          onPickNode={handleAddNode}
          onClose={closeNodePicker}
          specJSON={specJson}
        />
      )}
    </ReactFlow>
  );

  const interactiveModelPreview = gltf && (
    <SceneInner
      gltf={gltf}
      onClickListeners={sceneOnClickListeners}
      animations={animations}
    />
  );

  return (
    <>
      <div className="w-full h-full relative">
        <SplitEditor
          left={flowEditor || <></>}
          right={interactiveModelPreview}
        />
      </div>
    </>
  );
}

export function EditableScene(props: EditableSceneProps) {
  return (
    <Suspense fallback={null}>
      <EditableSceneInner {...props} />
    </Suspense>
  );
}
