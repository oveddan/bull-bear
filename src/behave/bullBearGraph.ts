import {
  Counter,
  NodeDefinition,
  IntegerNodes,
  FloatNodes
} from '@oveddan-behave-graph/core';

import { OnSceneNodeClick } from '@oveddan-behave-graph/scene';
import {
  ConfiguredNode,
  configuredNodeFactory,
  inputFlowFrom,
  inputValueLinkFrom
} from './graphBuilderUtils';

export const bullBearGraph = (
  nodeDefinitions: Record<string, NodeDefinition>
): ConfiguredNode[] => {
  const factory = configuredNodeFactory();

  const sceneSetBoolean = nodeDefinitions['scene/set/boolean'];

  const sceneNodeClickConfig = factory.create({
    definition: OnSceneNodeClick,
    inputValues: {
      jsonPath: 'meshes/0'
    }
  });

  const counter = factory.create({
    definition: Counter,
    inputFlows: {
      flow: inputFlowFrom(sceneNodeClickConfig, 'flow')
    }
  });

  const mod = factory.create({
    definition: IntegerNodes.Modulus,
    inputValues: {
      a: inputValueLinkFrom(counter, 'count'),
      b: BigInt(2)
    }
  });

  const toBoolean = factory.create({
    definition: IntegerNodes.toBoolean,
    inputValues: {
      a: inputValueLinkFrom(mod, 'result')
    }
  });

  const startAnimation = factory.create({
    definition: sceneSetBoolean!,
    inputValues: {
      jsonPath: 'animations/1/playing',
      value: inputValueLinkFrom(toBoolean, 'result')
    },
    inputFlows: {
      flow: inputFlowFrom(counter, 'flow')
    }
  });

  const smartContractIncrement = factory.create({
    definition: nodeDefinitions['smartContract/counter/increment']!,
    inputFlows: {
      flow: inputFlowFrom(startAnimation, 'flow')
    }
  });

  const getNumber = factory.create({
    definition: nodeDefinitions['smartContract/counter/getNumber']!
  });

  const maxCount = 5;

  const mod5 = factory.create({
    definition: IntegerNodes.Modulus,
    inputValues: {
      a: inputValueLinkFrom(getNumber, '0'),
      b: BigInt(maxCount)
    }
  });

  const toFloat = factory.create({
    definition: IntegerNodes.ToFloat,
    inputValues: {
      a: inputValueLinkFrom(mod5, 'result')
    }
  });

  const toFloatPct = factory.create({
    definition: FloatNodes.Divide,
    inputValues: {
      a: inputValueLinkFrom(toFloat, 'result'),
      b: maxCount
    }
  });

  const setEmission = factory.create({
    definition: nodeDefinitions['scene/set/float'],
    inputValues: {
      jsonPath: 'materials/0/emissiveIntensity',
      value: inputValueLinkFrom(toFloatPct, 'result')
    },
    inputFlows: {
      flow: inputFlowFrom(getNumber, 'flow')
    }
  });

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
