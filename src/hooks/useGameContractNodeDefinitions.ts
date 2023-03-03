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
  chainId: number | undefined;
  bullBearAddress: `0x${string}` | undefined;
  bullBearFoodAddress: `0x${string}` | undefined;
}) => ({
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

export const useGameContractNodeDefinitions = () => {
  const bullBearContract = useBullBear();
  const { data: bullBearFoodAddress } = useBullBearBullBearFood();
  const bullBearContractAddress = bullBearContract?.address;
  const chainId = useChainId();

  const currentAddressDefinition = useCurrentAddressNodeDefinition();

  return useMemo(
    () => ({
      ...currentAddressDefinition,
      ...makeAllContractDefinitions({
        chainId,
        bullBearAddress: bullBearContractAddress,
        bullBearFoodAddress
      })
    }),
    [
      bullBearContractAddress,
      bullBearFoodAddress,
      chainId,
      currentAddressDefinition
    ]
  );
};
