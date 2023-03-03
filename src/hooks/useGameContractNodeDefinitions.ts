import { useMemo } from 'react';
import { useChainId } from 'wagmi';
import { counterABI, useCounter } from '../generated';
import { makeSmartContractNodeDefinitions } from '../nodes/makeSmartContractNodeDefintions';

export const useGameContractNodeDefinitions = () => {
  const counterContract = useCounter();
  const contractAddress = counterContract?.address;
  const chainId = useChainId();
  return useMemo(
    () =>
      makeSmartContractNodeDefinitions({
        contractAddress,
        chainId,
        abi: counterABI,
        contractName: 'counter'
      }),
    [contractAddress, chainId]
  );
};
