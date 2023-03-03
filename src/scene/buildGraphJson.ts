import { GraphJSON, NodeDefinition } from '@oveddan-behave-graph/core';
import { IScene } from '@oveddan-behave-graph/scene';
import { useMemo } from 'react';

import { gameGraphBuilder } from './gameGraphBuilder';
import { toGraphJson } from './graphBuilderUtils';

export const useGraphJson = (
  scene: IScene | undefined,
  nodeDefinintions: Record<string, NodeDefinition>
): GraphJSON => {
  return useMemo(() => {
    const nodes = gameGraphBuilder(nodeDefinintions);
    console.log(scene?.getProperties());
    const result = toGraphJson(nodes);

    return result;
  }, [scene, nodeDefinintions]);
};
