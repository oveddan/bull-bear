import { makeAllContractDefinitions } from '../src/hooks/useGameContractNodeDefinitions';

const main = async () => {
  const smartContractDefs = makeAllContractDefinitions({
    chainId: undefined
  });
};

main();
