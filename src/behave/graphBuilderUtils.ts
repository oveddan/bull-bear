import {
  FlowsJSON,
  GraphJSON,
  INodeDefinition,
  NodeConfigurationDescription,
  NodeDefinition,
  NodeParameterJSON,
  NodeParametersJSON,
  SocketNames,
  SocketsDefinition,
  ValueJSON
} from '@oveddan-behave-graph/core';

export const autoIdIncrementer = () => {
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
  | number
  | bigint
  | boolean
  | {
      link: {
        nodeId: number;
        socketId: string;
      };
    };

type TInputValues<TInput extends SocketsDefinition> = {
  [key in SocketNames<TInput>]?: NodeValue;
};
type TInputFlows<TInput extends SocketsDefinition> = {
  [key in SocketNames<TInput>]?: {
    fromNodeId: number;
    fromSocketId: string;
  };
};

export type ConfiguredNode<
  TInput extends SocketsDefinition = SocketsDefinition,
  TOutput extends SocketsDefinition = SocketsDefinition,
  TConfig extends NodeConfigurationDescription = NodeConfigurationDescription
> = {
  id: number;
  definition: INodeDefinition<TInput, TOutput, TConfig>;
  inputValues?: TInputValues<TInput>;
  inputFlows?: TInputFlows<TInput>;
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

  const result: GraphJSON = {
    nodes: nodesJson
  };

  return result;
};

export const configuredNodeFactory = () => {
  const autoCounter = autoIdIncrementer();

  const create = <
    TInput extends SocketsDefinition,
    TOutput extends SocketsDefinition,
    TConfig extends NodeConfigurationDescription
  >({
    definition,
    inputFlows,
    inputValues
  }: {
    definition: INodeDefinition<TInput, TOutput, TConfig> | NodeDefinition;
    inputValues?: TInputValues<TInput>;
    inputFlows?: TInputFlows<TInput>;
  }): ConfiguredNode<TInput, TOutput, TConfig> => {
    return {
      id: autoCounter.next(),
      // @ts-ignore
      definition: definition,
      inputValues,
      inputFlows
    };
  };

  return { create };
};

export const inputFlowFrom = <TOutput extends SocketsDefinition>(
  {
    id
  }: {
    id: number;
    definition: {
      out?: TOutput;
    };
  },
  fromSocketId: SocketNames<TOutput>
) => ({
  fromNodeId: id,
  fromSocketId
});

export const inputValueLinkFrom = <TOutput extends SocketsDefinition>(
  {
    id
  }: {
    id: number;
    definition: {
      out?: TOutput;
    };
  },
  fromSocketId: SocketNames<TOutput>
) => ({
  link: { nodeId: id, socketId: fromSocketId }
});
