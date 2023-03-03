import { useMemo } from 'react';
import { useChainId } from 'wagmi';
import {
  bullBearABI,
  bullBearFoodABI,
  counterABI,
  useBullBear,
  useBullBearBullBearFood,
  useCounter
} from '../generated';
import { makeSmartContractNodeDefinitions } from '../nodes/makeSmartContractNodeDefintions';

export const useGameContractNodeDefinitions = () => {
  const counterContract = useCounter();
  const bullBearContract = useBullBear();
  const { data: bullBearFoodAddress } = useBullBearBullBearFood();
  const counterContractAddress = counterContract?.address;
  const bullBearContractAddress = bullBearContract?.address;
  const chainId = useChainId();

  return useMemo(
    () => ({
      ...makeSmartContractNodeDefinitions({
        contractAddress: counterContractAddress,
        chainId,
        abi: counterABI,
        contractName: 'counter'
      }),
      ...makeSmartContractNodeDefinitions({
        contractAddress: bullBearContractAddress,
        chainId,
        abi: bullBearABI,
        contractName: 'bullBear'
      }),
      ...makeSmartContractNodeDefinitions({
        contractAddress: bullBearFoodAddress,
        chainId,
        abi: bullBearFoodABI,
        contractName: 'bullBearFood'
      })
    }),
    [
      counterContractAddress,
      bullBearContractAddress,
      bullBearFoodAddress,
      chainId
    ]
  );
};
