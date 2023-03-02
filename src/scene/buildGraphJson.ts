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

const AutoIdIncrementer = () => {
  let value = 0;

  const next = () => {
    value++;
    return value;
  };

  return {
    next
  };
};

type NodeValue =
  | string
  | bigint
  | boolean
  | {
      link: {
        nodeId: number;
        socketId: string;
      };
    };

type ConfiguredNode = {
  id: number;
  definition: INodeDefinition | NodeDefinition;
  inputValues?: {
    [key: string]: NodeValue;
  };
  inputFlows?: {
    [key: string]: {
      fromNodeId: number;
      fromSocketId: string;
    };
  };
};

const toValueJson = (value: string | bigint | boolean): ValueJSON => {
  if (typeof value === 'string') return value;
  if (typeof value === 'boolean') return value;

  return value.toString();
};

const toGraphJson = (nodes: ConfiguredNode[]): GraphJSON => {
  const nodesJson = nodes.map((node): NodeJSON => {
    const nodeParameters: NodeParametersJSON = Object.fromEntries(
      Object.entries(node.inputValues || {}).map(([id, nodeDef]) => {
        let param: NodeParameterJSON;
        if (typeof nodeDef === 'object' && 'link' in nodeDef) {
          param = {
            link: {
              nodeId: nodeDef.link.nodeId.toString(),
              socket: nodeDef.link.socketId
            }
          };
        } else {
          param = {
            value: toValueJson(nodeDef)
          };
        }

        return [id, param];
      })
    );

    const edgesFromNode = nodes.flatMap((otherNode) =>
      Object.entries(otherNode.inputFlows || {})
        .filter(([, flow]) => {
          return flow.fromNodeId === node.id;
        })
        .map(([socketId, flow]) => ({
          toSocketId: socketId,
          toNodeId: otherNode.id,
          fromSocketId: flow.fromSocketId
        }))
    );

    let flowsJson: FlowsJSON | undefined;

    if (edgesFromNode.length > 0) {
      flowsJson = {};

      edgesFromNode.forEach((edge) => {
        (flowsJson as FlowsJSON)[edge.fromSocketId] = {
          nodeId: edge.toNodeId.toString(),
          socket: edge.toSocketId
        };
      });
    }

    return {
      id: node.id.toString(),
      type: node.definition.typeName,
      parameters: nodeParameters,
      flows: flowsJson
    };
  });

  return {
    nodes: nodesJson
  };
};

const buildGraph = (
  scene: IScene,
  nodeDefinitions: Record<string, NodeDefinition>
) => {
  const autoCounter = AutoIdIncrementer();

  const sceneSetBoolean = nodeDefinitions['scene/set/boolean'];

  const sceneNodeClickConfig: ConfiguredNode = {
    id: autoCounter.next(),
    definition: OnSceneNodeClick,
    inputValues: {
      jsonPath: 'meshes/8'
    }
  };

  const counter: ConfiguredNode = {
    id: autoCounter.next(),
    definition: Counter,
    inputFlows: {
      flow: {
        fromNodeId: sceneNodeClickConfig.id,
        fromSocketId: 'flow'
      }
    }
  };

  const mod: ConfiguredNode = {
    id: autoCounter.next(),
    definition: IntegerNodes.Modulus,
    inputValues: {
      a: {
        link: {
          nodeId: counter.id,
          socketId: 'count'
        }
      },
      b: BigInt(2)
    }
  };

  const toBoolean: ConfiguredNode = {
    id: autoCounter.next(),
    definition: IntegerNodes.toBoolean,
    inputValues: {
      a: {
        link: {
          nodeId: mod.id,
          socketId: 'result'
        }
      }
    }
  };

  const startAnimation: ConfiguredNode = {
    id: autoCounter.next(),
    definition: sceneSetBoolean!,
    inputValues: {
      jsonPath: 'animations/0/playing',
      value: {
        link: {
          nodeId: toBoolean.id,
          socketId: 'result'
        }
      }
    },
    inputFlows: {
      flow: {
        fromNodeId: counter.id,
        fromSocketId: 'flow'
      }
    }
  };

  const graphJson = toGraphJson([
    sceneNodeClickConfig,
    counter,
    mod,
    toBoolean,
    startAnimation
  ]);

  console.log(graphJson);

  return graphJson;
};

export const useGraphJson = (
  scene: IScene | undefined,
  nodeDefinintions: Record<string, NodeDefinition>
): GraphJSON => {
  return useMemo(() => {
    if (scene) return buildGraph(scene, nodeDefinintions);
    return {
      nodes: []
    };
  }, [scene, nodeDefinintions]);
};
