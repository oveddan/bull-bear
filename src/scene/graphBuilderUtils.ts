import {
  FlowsJSON,
  GraphJSON,
  INodeDefinition,
  NodeDefinition,
  NodeParameterJSON,
  NodeParametersJSON,
  ValueJSON
} from '@oveddan-behave-graph/core';

export const AutoIdIncrementer = () => {
  let value = 0;

  const next = () => {
    value++;
    return value;
  };

  return {
    next
  };
};

export type NodeValue =
  | string
  | bigint
  | boolean
  | {
      link: {
        nodeId: number;
        socketId: string;
      };
    };

export type ConfiguredNode = {
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

export const toGraphJson = (nodes: ConfiguredNode[]): GraphJSON => {
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
