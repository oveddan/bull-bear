import {
  Counter,
  NodeDefinition,
  IntegerNodes,
  FloatNodes
} from '@oveddan-behave-graph/core';

import { OnSceneNodeClick } from '@oveddan-behave-graph/scene';
import { AutoIdIncrementer, ConfiguredNode } from './graphBuilderUtils';

export const bullBearGraph = (
  nodeDefinitions: Record<string, NodeDefinition>
): ConfiguredNode[] => {
  console.log(nodeDefinitions);
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

  const smartContractIncrement: ConfiguredNode = {
    id: autoCounter.next(),
    definition: nodeDefinitions['smartContract/counter/increment']!,
    inputFlows: {
      flow: {
        fromNodeId: startAnimation.id,
        fromSocketId: 'flow'
      }
    }
  };

  const getNumber: ConfiguredNode = {
    id: autoCounter.next(),
    definition: nodeDefinitions['smartContract/counter/getNumber']!
  };

  const maxCount = 5;

  const mod5: ConfiguredNode = {
    id: autoCounter.next(),
    definition: IntegerNodes.Modulus,
    inputValues: {
      a: {
        link: {
          nodeId: getNumber.id,
          socketId: '0'
        }
      },
      b: BigInt(maxCount)
    }
  };

  const toFloat: ConfiguredNode = {
    id: autoCounter.next(),
    definition: IntegerNodes.ToFloat,
    inputValues: {
      a: {
        link: {
          nodeId: mod5.id,
          socketId: 'result'
        }
      }
    }
  };

  const toFloatPct: ConfiguredNode = {
    id: autoCounter.next(),
    definition: FloatNodes.Divide,
    inputValues: {
      a: {
        link: {
          nodeId: toFloat.id,
          socketId: 'result'
        }
      },
      b: maxCount
    }
  };

  const setEmission: ConfiguredNode = {
    id: autoCounter.next(),
    definition: nodeDefinitions['scene/set/float'],
    inputValues: {
      jsonPath: 'materials/0/emissiveIntensity',
      value: {
        link: {
          nodeId: toFloatPct.id,
          socketId: 'result'
        }
      }
    },
    inputFlows: {
      flow: {
        fromNodeId: getNumber.id,
        fromSocketId: 'flow'
      }
    }
  };

  return [
    sceneNodeClickConfig,
    counter,
    mod,
    toBoolean,
    startAnimation,
    smartContractIncrement,
    getNumber,
    mod5,
    toFloat,
    toFloatPct,
    setEmission
  ];
};
