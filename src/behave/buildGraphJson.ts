import { GraphJSON, NodeDefinition } from '@oveddan-behave-graph/core';
import { IScene } from '@oveddan-behave-graph/scene';
import { useMemo } from 'react';

// import { bullBearGraph } from './bullBearGraph';
// import { toGraphJson } from './graphBuilderUtils';

export const useGraphJson = (
  scene: IScene | undefined,
  nodeDefinintions: Record<string, NodeDefinition>
): GraphJSON => {
  return useMemo(() => {
    // const nodes = []; //;;bullBearGraph(nodeDefinintions);
    console.log(scene?.getProperties());
    console.log(scene?.getRaycastableProperties());
    // const result = toGraphJson({});
    const result: GraphJSON = {};

    return result;
  }, [scene, nodeDefinintions]);
};
