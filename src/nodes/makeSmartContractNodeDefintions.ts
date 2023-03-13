import {
  INodeDefinition,
  makeEventNodeDefinition,
  makeFlowNodeDefinition,
  NodeCategory,
  NodeDefinition,
  SocketsMap
} from '@oveddan-behave-graph/core';
import { EaseSceneProperty } from '@oveddan-behave-graph/scene';
import {
  prepareWriteContract,
  writeContract,
  watchContractEvent,
  watchReadContract
} from '@wagmi/core';
import { Abi, AbiEvent, AbiFunction, AbiParameter } from 'abitype';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { OnThenOff } from './OnThenOff';

type AbiFunctionThatIsFunction = AbiFunction & { type: 'function' };

const toSocketType = (abiType: string) => {
  if (abiType === 'address' || abiType === 'string') {
    // todo - make an address value type?
    return 'string';
  }
  if (abiType.includes('uint')) return 'integer';
  if (abiType.includes('bytes')) return 'string';
  if (abiType.includes('bool')) return 'boolean';

  console.error('unknown abi type of ' + abiType);

  // todo - what to do when array?
  return 'string';
};

const toSockets = (abiParameters: readonly AbiParameter[]): SocketsMap => {
  return Object.fromEntries(
    abiParameters.map(
      (x, i) => [getInputName(x, i), toSocketType(x.type)] as const
    )
  );
};

const toExecuteTransactionInputs = (
  abiParameters: readonly AbiParameter[],
  isPayable: boolean
): SocketsMap => {
  const valueInputs = toSockets(abiParameters);

  const payableInput: SocketsMap = isPayable
    ? {
        ethValue: {
          valueType: 'integer'
        }
      }
    : {};

  return {
    ...valueInputs,
    ...payableInput,
    flow: 'flow'
  };
};

const getInputName = (input: AbiParameter, index: number): string => {
  return input.name || index.toString();
};

const generateInputArgs = (
  inputs: readonly AbiParameter[],
  read: (param: string) => any
) =>
  inputs.length > 0
    ? inputs.map((x, i) => read(getInputName(x, i)))
    : undefined;

const makeReadFunctions = ({
  readFunctions,
  abi,
  name,
  chainId,
  contractAddress
}: {
  readFunctions: AbiFunctionThatIsFunction[];
  abi: Abi;
  name: string;
  chainId: number;
  contractAddress: `0x${string}`;
}) => {
  const defaultPollInterval = 2;

  return readFunctions.map((x) => {
    const initialState: UnwatchState = {};

    const typeName = `smartContract/${name}/${x.name}`;

    const inputs = toSockets(x.inputs);

    return makeEventNodeDefinition({
      typeName: typeName,
      category: NodeCategory.Event,
      label: `Read ${name} contract ${x.name}`,
      in: {
        ...inputs
        // contractAddress: 'string'
      },
      configuration: {
        pollInterval: {
          valueType: 'integer',
          defaultValue: defaultPollInterval
        }
      },
      out: {
        ...toSockets(x.outputs),
        flow: 'flow'
      },
      initialState,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      dispose: ({ state }) => {
        if (state.unwatch) {
          state.unwatch();
        }
        return {};
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      init: ({ read, configuration, write, commit }) => {
        const unwatch = watchReadContract(
          {
            chainId,
            abi,
            address: contractAddress,
            functionName: x.name,
            args: generateInputArgs(x.inputs, read),
            listenToBlock: true
          },
          (result) => {
            let toBigInt: bigint;
            try {
              if (typeof result === 'number') {
                toBigInt = BigInt(result);
              } else {
                toBigInt = (result as BigNumber).toBigInt();
              }
            } catch (e) {
              console.error(e);
              return;
            }

            console.log('got result', { toBigInt });

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            write('0', toBigInt);
            commit('flow');
          }
        );

        return { unwatch };
      }
    });
  });
};

type UnwatchState = {
  unwatch?: () => void;
};

const makeWriteFunctions = ({
  writeFunctions,
  abi,
  name,
  chainId,
  contractAddress
}: {
  writeFunctions: AbiFunctionThatIsFunction[];
  abi: Abi;
  name: string;
  chainId: number;
  contractAddress: `0x${string}`;
}) => {
  return writeFunctions.map((x) => {
    const typeName = `smartContract/${name}/${x.name}`;
    return makeFlowNodeDefinition({
      typeName,
      label: `Write to ${name} contract ${x.name}`,

      category: NodeCategory.Flow,
      in: toExecuteTransactionInputs(x.inputs, x.stateMutability === 'payable'),
      out: {},
      initialState: undefined,
      triggered: ({ read, commit, graph }) => {
        if (!contractAddress) {
          console.error('no contract address for node');
          return;
        }
        if (!chainId) {
          console.error('missing chain id');
          return;
        }

        const args = generateInputArgs(x.inputs, read);

        (async () => {
          // console.log('writing to', { contractAddress, name: x.name, args });
          const config = await prepareWriteContract({
            chainId,
            abi,
            address: contractAddress,
            functionName: x.name,
            args
          });

          try {
            // commit('started');
            const { hash, wait } = await writeContract({
              ...config,
              abi
            });
            // console.log({ hash, wait });
            // console.log('waiting');
            await wait();
            console.log('succeeded and writing');
            // commit('succeeded');
            // console.log('done');
          } catch (error) {
            console.error(error);
            // commit('failed');
          }
        })();
      }
    });
  });
};

function makeSmartContractFunctionNodeDefinitions({
  abi,
  name,
  chainId,
  contractAddress
}: {
  abi: Abi;
  name: string;
  chainId: number;
  contractAddress: `0x${string}`;
}): INodeDefinition[] {
  const functions = abi.filter(
    (x) => x.type === 'function'
  ) as AbiFunctionThatIsFunction[];

  const readFunctions = functions.filter(
    ({ stateMutability }) =>
      stateMutability === 'view' || stateMutability === 'pure'
  );

  const writeFunctions = functions.filter(
    ({ stateMutability }) =>
      stateMutability === 'nonpayable' || stateMutability === 'payable'
  );

  const events = abi.filter((x) => x.type === 'event') as AbiEvent[];

  const readFunctionDefinitions = makeReadFunctions({
    readFunctions,
    abi,
    name,
    chainId,
    contractAddress
  });

  const writeFunctionDefinitions = makeWriteFunctions({
    writeFunctions,
    abi,
    name,
    chainId,
    contractAddress
  });

  const eventFunctionDefinitions = events.map((x) => {
    const initialState: UnwatchState = {};

    return makeEventNodeDefinition({
      typeName: `smartContract/${name}/on${x.name}`,
      in: {},
      out: {
        flow: 'flow',
        ...toSockets(x.inputs)
      },
      label: `On ${name} contract event ${x.name}`,
      initialState,
      init: ({ read, write, commit }) => {
        const unwatch = watchContractEvent(
          {
            address: contractAddress,
            abi,
            eventName: x.name
          },
          (args) => {
            // todo: parse args
            console.log(args);
            commit('flow');
          }
        );

        return { unwatch };
      },
      dispose: ({ state }) => {
        if (state.unwatch) state.unwatch();
        return {};
      }
    });
  });

  const result: INodeDefinition[] = [
    ...readFunctionDefinitions,
    ...writeFunctionDefinitions,
    ...eventFunctionDefinitions,
    OnThenOff
  ];

  return result;
}

export function makeSmartContractNodeDefinitions<
  //   TMode extends WriteContractMode,
  //   TFunctionName extends string,
  //   TChainId extends number,
  TAbi extends Abi
  //   TConfig extends Pick<
  //     UsePrepareContractWriteConfig<TAbi>,
  //     'functionName' | 'abi' | 'args'
  //   >
  //   TFunctionName extends ExtractAbiFunctionNames<TAbi, 'nonpayable'>
  //   TFunction extends ExtractAbiFunction<Abi, TFunctionName>,
  //   TArgs extends AbiParametersToPrimitiveTypes<TFunction['inputs']>,
>({
  abi,
  contractName: name,
  chainId,
  contractAddress
}: {
  abi: TAbi;
  contractName: string;
  chainId: number;
  contractAddress: `0x${string}`;
}): Record<string, NodeDefinition> {
  // const contractName = abi.e

  const allDefinitions = makeSmartContractFunctionNodeDefinitions({
    abi,
    name,
    chainId,
    contractAddress
  });

  return Object.fromEntries(
    allDefinitions.map((x) => [x.typeName, x] as const)
  );
}

export const useCurrentAddressNodeDefinition = () => {
  const currentAddress = useAccount().address;

  return useMemo(() => {
    if (!currentAddress) return undefined;

    return {
      currentAddress: makeEventNodeDefinition({
        typeName: 'account/currentAddress',
        label: "logged in account's address",
        category: NodeCategory.Event,
        in: {},
        out: {
          address: 'string'
        },
        initialState: undefined,
        init: ({ write }) => {
          write('address', currentAddress);
        },
        dispose: () => {
          return;
        }
      })
    };
  }, [currentAddress]);
};
