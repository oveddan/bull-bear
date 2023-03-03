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
  nodeDefinitions: Record<string, NodeDefinition>,
  bullBearContractAddress: string
): ConfiguredNode[] => {
  const factory = configuredNodeFactory();

  const sceneSetBoolean = nodeDefinitions['scene/set/boolean'];

  const tokenId = factory.create({
    definition: IntegerNodes.Constant,
    inputValues: {
      a: BigInt(1)
    }
  });

  const ownerOf = factory.create({
    definition: nodeDefinitions['smartContract/bullBear/ownerOf'],
    inputFlows: {
      '0': inputFlowFrom(tokenId, 'result')
    }
  });

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

  // const smartContractIncrement = factory.create({
  //   definition: nodeDefinitions['smartContract/counter/increment']!,
  //   inputFlows: {
  //     flow: inputFlowFrom(startAnimation, 'flow')
  //   }
  // });

  const getHappiness = factory.create({
    definition: IntegerNodes.Constant,
    inputValues: {
      a: BigInt(1)
    }
  });

  const maxCount = 5;

  const mod5 = factory.create({
    definition: IntegerNodes.Modulus,
    inputValues: {
      a: inputValueLinkFrom(getHappiness, 'value'),
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
      flow: inputFlowFrom(getHappiness, 'flow')
    }
  });

  return [
    sceneNodeClickConfig,
    counter,
    mod,
    toBoolean,
    tokenId,
    ownerOf,
    startAnimation,
    // smartContractIncrement,
    getHappiness,
    mod5,
    toFloat,
    toFloatPct,
    setEmission
  ];
};
