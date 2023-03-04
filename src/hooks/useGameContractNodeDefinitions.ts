import { NodeDefinition } from '@oveddan-behave-graph/core';
import { useMemo } from 'react';
import { useChainId } from 'wagmi';
import {
  bullBearABI,
  bullBearTokenABI,
  useBullBear,
  useBullBearBullBearToken
} from '../generated';
import {
  makeSmartContractNodeDefinitions,
  useCurrentAddressNodeDefinition
} from '../nodes/makeSmartContractNodeDefintions';

export const makeAllContractDefinitions = ({
  chainId,
  bullBearAddress,
  // bullBearFoodAddress
  bullBearTokenAddress
}: {
  chainId: number;
  bullBearAddress: `0x${string}`;
  bullBearTokenAddress: `0x${string}`;
  // bullBearFoodAddress: `0x${string}`;
}): Record<string, NodeDefinition> => ({
  ...makeSmartContractNodeDefinitions({
    chainId,
    abi: bullBearABI,
    contractName: 'bullBear',
    contractAddress: bullBearAddress
  }),
  ...makeSmartContractNodeDefinitions({
    chainId,
    abi: bullBearTokenABI,
    contractName: 'bullBearToken',
    contractAddress: bullBearTokenAddress
  })
});

export const useGameContractNodeDefinitions = ():
  | Record<string, NodeDefinition>
  | undefined => {
  const bullBearContract = useBullBear();
  const { data: bullBearTokenAddress } = useBullBearBullBearToken();
  const bullBearContractAddress = bullBearContract?.address;
  const chainId = useChainId();

  const currentAddressDefinition = useCurrentAddressNodeDefinition();

  return useMemo(() => {
    if (!bullBearContractAddress || !bullBearTokenAddress) return;
    const result: Record<string, NodeDefinition> = {
      ...currentAddressDefinition,
      ...makeAllContractDefinitions({
        chainId,
        bullBearAddress: bullBearContractAddress,
        bullBearTokenAddress
      })
    };
    return result;
  }, [
    bullBearContractAddress,
    bullBearTokenAddress,
    chainId,
    currentAddressDefinition
  ]);
};
