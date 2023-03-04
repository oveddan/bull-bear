import { NodeDefinition } from '@oveddan-behave-graph/core';
import { useMemo } from 'react';
import { useChainId } from 'wagmi';
import {
  bullBearABI,
  bullBearFoodABI,
  useBullBear,
  useBullBearBullBearFood
} from '../generated';
import {
  makeSmartContractNodeDefinitions,
  useCurrentAddressNodeDefinition
} from '../nodes/makeSmartContractNodeDefintions';

export const makeAllContractDefinitions = ({
  chainId,
  bullBearAddress,
  bullBearFoodAddress
}: {
  chainId: number;
  bullBearAddress: `0x${string}`;
  bullBearFoodAddress: `0x${string}`;
}): Record<string, NodeDefinition> => ({
  ...makeSmartContractNodeDefinitions({
    chainId,
    abi: bullBearABI,
    contractName: 'bullBear',
    contractAddress: bullBearAddress
  }),
  ...makeSmartContractNodeDefinitions({
    chainId,
    abi: bullBearFoodABI,
    contractName: 'bullBearFood',
    contractAddress: bullBearFoodAddress
  })
});

export const useGameContractNodeDefinitions = ():
  | Record<string, NodeDefinition>
  | undefined => {
  const bullBearContract = useBullBear();
  const { data: bullBearFoodAddress } = useBullBearBullBearFood();
  const bullBearContractAddress = bullBearContract?.address;
  const chainId = useChainId();

  const currentAddressDefinition = useCurrentAddressNodeDefinition();

  return useMemo(() => {
    if (!bullBearContractAddress || !bullBearFoodAddress) return;
    const result: Record<string, NodeDefinition> = {
      ...currentAddressDefinition,
      ...makeAllContractDefinitions({
        chainId,
        bullBearAddress: bullBearContractAddress,
        bullBearFoodAddress
      })
    };
    return result;
  }, [
    bullBearContractAddress,
    bullBearFoodAddress,
    chainId,
    currentAddressDefinition
  ]);
};
