import {
  makeEventNodeDefinition,
  makeFlowNodeDefinition,
  NodeCategory,
  NodeDefinition,
  SocketsMap
} from '@oveddan-behave-graph/core';
import { prepareWriteContract, readContract, writeContract } from '@wagmi/core';
import { Abi, AbiFunction, AbiParameter } from 'abitype';
import { BigNumber } from 'ethers';

type AbiFunctionThatIsFunction = AbiFunction & { type: 'function' };

const toSocketType = (abiType: string) => {
  if (abiType === 'address' || abiType === 'string') {
    // todo - make an address value type?
    return 'string';
  }
  if (abiType.includes('uint')) return 'integer';
  if (abiType.includes('bytes')) return 'string';
  if (abiType.includes('bool')) return 'boolean';

  throw new Error('unknown abi type of ' + abiType);
};

const toSockets = (abiParameters: readonly AbiParameter[]): SocketsMap => {
  return Object.fromEntries(
    abiParameters.map(
      (x, i) => [getInputName(x, i), toSocketType(x.type)] as const
    )
  );
};

const contractAddressKey = 'contractAddress';

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
    [contractAddressKey]: 'string',
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

function makeSmartContractFunctionNodeDefinitions({
  abi,
  name,
  contractAddress,
  chainId
}: {
  abi: Abi;
  name: string;
  contractAddress: `0x${string}` | undefined;
  chainId: number | undefined;
}) {
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

  const defaultPollInterval = 2;

  const readFunctionDefinitions = readFunctions.map((x) => {
    const typeName = `smartContract/${name}/${x.name}`;

    let pollTimeout = 0;

    const inputs = toSockets(x.inputs);

    return makeEventNodeDefinition({
      typeName: typeName,
      category: NodeCategory.Event,
      label: `Read ${name} contract ${x.name}`,
      in: inputs,
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
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      dispose: () => {
        window.clearTimeout(pollTimeout);
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      init: ({ read, configuration, write, commit }) => {
        if (!contractAddress) {
          console.error('no contract address');
          return;
        }

        const pollInterval = configuration.pollInterval || defaultPollInterval;

        const poll = async () => {
          const inputs = generateInputArgs(x.inputs, read);

          const result = await readContract({
            chainId,
            abi,
            address: contractAddress,
            functionName: x.name,
            args: inputs
          });

          // for now assume result is 1 value
          const asBigNumber = result as BigNumber;
          const toBigInt = asBigNumber.toBigInt();

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          write('0', toBigInt);
          commit('flow');

          // console.log({ result, toBigInt });
          pollTimeout = window.setTimeout(() => {
            // sort alphabetically by input key
            poll();
          }, pollInterval * 1000);
        };

        poll();
      },
      initialState: undefined
    });
  });

  const writeFunctionDefinitions = writeFunctions.map((x) => {
    const typeName = `smartContract/${name}/${x.name}`;
    return makeFlowNodeDefinition({
      typeName,
      category: NodeCategory.Flow,
      in: toExecuteTransactionInputs(x.inputs, x.stateMutability === 'payable'),
      out: {
        started: 'flow',
        succeeded: 'flow',
        failed: 'flow'
      },
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
          console.log('writing to', { contractAddress, name: x.name });
          const config = await prepareWriteContract({
            chainId,
            abi,
            address: contractAddress,
            functionName: x.name,
            args
          });

          try {
            commit('started');
            const { hash, wait } = await writeContract({
              ...config,
              abi
            });
            // console.log({ hash, wait });
            // console.log('waiting');
            await wait();
            commit('succeeded');
            console.log('done');
          } catch (error) {
            console.error(error);
            commit('failed');
          }
        })();
      }
    });
  });

  return [...readFunctionDefinitions, ...writeFunctionDefinitions];
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
  contractAddress,
  chainId
}: {
  abi: Abi;
  contractName: string;
  contractAddress: `0x${string}` | undefined;
  chainId: number | undefined;
}): Record<string, NodeDefinition> {
  // const contractName = abi.e

  const allDefinitions = makeSmartContractFunctionNodeDefinitions({
    abi,
    name,
    contractAddress,
    chainId
  });

  return Object.fromEntries(
    allDefinitions.map((x) => [x.typeName, x] as const)
  );
}
