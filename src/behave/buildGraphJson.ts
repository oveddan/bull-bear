import { GraphJSON, NodeDefinition } from '@oveddan-behave-graph/core';
import { IScene } from '@oveddan-behave-graph/scene';
import { useMemo } from 'react';

import { bullBearGraph } from './bullBearGraph';
import { toGraphJson } from './graphBuilderUtils';

export const useGraphJson = (
  scene: IScene | undefined,
  nodeDefinintions: Record<string, NodeDefinition>
): GraphJSON => {
  return useMemo(() => {
    const nodes = bullBearGraph(nodeDefinintions);
    console.log(scene?.getProperties());
    const result = toGraphJson(nodes);

    return result;
  }, [scene, nodeDefinintions]);
};
