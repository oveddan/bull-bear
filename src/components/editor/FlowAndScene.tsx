import { Suspense, useState } from 'react';
import './styles/resizer.css';
import { CustomControls } from './CustomControls';
import SplitEditor from '../SplitEditor';
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
  fetchBehaviorGraphJson
} from '@oveddan-behave-graph/flow';
import { suspend } from 'suspend-react';
import ReactFlow, { Background, BackgroundVariant } from 'reactflow';
import { useEffect } from 'react';
import { GLTF } from 'three-stdlib';
import {
  Environment,
  Lightformer,
  OrbitControls,
  Stage,
  useGLTF
} from '@react-three/drei';
import { useSceneRegistry } from '../../hooks/useSceneRegistry';
import { useScene } from '../../scene/useScene';
import { Canvas } from '@react-three/fiber';
import { Object3D } from 'three';
import { SceneInner } from '../SceneInner';
import { GraphJSON } from '@oveddan-behave-graph/core';

type FlowAndSceneProps = { modelUrl: string; initialGraphJSON: GraphJSON };

export function FlowAndSceneInner({
  modelUrl,
  initialGraphJSON
}: FlowAndSceneProps) {
  const gltf = useGLTF(modelUrl) as GLTF & ObjectMap;

  const {
    nodeDefinitions: coreNodeDefinitions,
    valuesDefinitions: coreValueDefinitions,
    dependencies: coreDependencies
  } = useCoreRegistry();

  const { nodeDefinitions, valuesDefinitions } = useSceneRegistry({
    existingNodeDefinitions: coreNodeDefinitions,
    existingValuesDefinitions: coreValueDefinitions
  });

  const {
    scene,
    animations,
    sceneOnClickListeners: onClickListeners
  } = useScene(gltf);

  const sceneDependency = useDependency(scene, createSceneDependency);
  const dependencies = useMergeDependencies(coreDependencies, sceneDependency);

  const specJson = useNodeSpecJson({
    dependencies,
    nodes: nodeDefinitions,
    values: valuesDefinitions
  });

  const { nodes, edges, onNodesChange, onEdgesChange, graphJson } =
    useBehaveGraphFlow({
      initialGraphJson: initialGraphJSON,
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
  const [mainRef, setMainRef] = useState<Object3D | null>(null);

  const flowEditor = customNodeTypes && !refreshFlow && (
    <ReactFlow
      nodeTypes={customNodeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onConnectStart={handleStartConnect}
      onConnectEnd={handleStopConnect}
      fitView
      fitViewOptions={{ maxZoom: 1 }}
      onPaneClick={handlePaneClick}
      onPaneContextMenu={handlePaneContextMenu}
    >
      {specJson && <CustomControls toggleRun={togglePlay} running={playing} />}
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
    <Canvas>
      <OrbitControls makeDefault target={mainRef?.position} />
      <Environment>
        <Lightformer
          form="rect" // circle | ring | rect (optional, default = rect)
          intensity={1} // power level (optional = 1)
          color="white" // (optional = white)
          // scale={[10, 5]} // Scale it any way you prefer (optional = [1, 1])
          target={[0, 0, 0]} // Target position (optional = undefined)
        />
        <Stage intensity={0.5}>
          <SceneInner
            setMainRef={setMainRef}
            gltf={gltf}
            animations={animations}
            onClickListeners={onClickListeners}
          />
        </Stage>
      </Environment>
    </Canvas>
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

export function FlowAndScene(props: FlowAndSceneProps) {
  return (
    <Suspense fallback={null}>
      <FlowAndSceneInner {...props} />
    </Suspense>
  );
}
