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
import { AutoIdIncrementer, ConfiguredNode } from './graphBuilderUtils';

export const gameGraphBuilder = (
  nodeDefinitions: Record<string, NodeDefinition>
): ConfiguredNode[] => {
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

  return [sceneNodeClickConfig, counter, mod, toBoolean, startAnimation];
};
