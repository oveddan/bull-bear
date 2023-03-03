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

export const makeAllContractDefinitions = ({
  chainId
}: {
  chainId: number | undefined;
}) => ({
  ...makeSmartContractNodeDefinitions({
    chainId,
    abi: counterABI,
    contractName: 'counter'
  }),
  ...makeSmartContractNodeDefinitions({
    chainId,
    abi: bullBearABI,
    contractName: 'bullBear'
  }),
  ...makeSmartContractNodeDefinitions({
    chainId,
    abi: bullBearFoodABI,
    contractName: 'bullBearFood'
  })
});

export const useGameContractNodeDefinitions = () => {
  const counterContract = useCounter();
  const bullBearContract = useBullBear();
  const { data: bullBearFoodAddress } = useBullBearBullBearFood();
  const counterContractAddress = counterContract?.address;
  const bullBearContractAddress = bullBearContract?.address;
  const chainId = useChainId();

  return useMemo(() => makeAllContractDefinitions({ chainId }), []);
};
