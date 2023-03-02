import {
  Counter,
  GraphJSON,
  INodeDefinition,
  NodeDefinition,
  IntegerNodes,
  NodeJSON,
  NodeParameterJSON,
  NodeParametersJSON,
  ValueJSON,
  FlowsJSON
} from '@oveddan-behave-graph/core';
import { IScene } from '@oveddan-behave-graph/scene';
import { useMemo } from 'react';

import { OnSceneNodeClick } from '@oveddan-behave-graph/scene';
import { gameGraphBuilder } from './gameGraphBuilder';
import { toGraphJson } from './graphBuilderUtils';

export const useGraphJson = (
  scene: IScene | undefined,
  nodeDefinintions: Record<string, NodeDefinition>
): GraphJSON => {
  return useMemo(() => {
    const nodes = gameGraphBuilder(nodeDefinintions);
    return toGraphJson(nodes);
    return {
      nodes: []
    };
  }, [scene, nodeDefinintions]);
};
