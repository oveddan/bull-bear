# Chain Behave Graph

This repository enables interactive 3d game asset nfts to be created in the interoperable [behave-graph](https://github.com/bhouston/behave-graph) format. Additionally, it provides an example implementation of a smart contraact and way to build and integrate these behave graphs against the smart contract.

In essence, it is an extension of the [behave-graph](https://github.com/bhouston/behave-graph) - allowing behave graph nodes to be generated off of a smart contract's abi, and allow a 3d model to write to and read from any evm compatible blockchain in an interoperable format that can be imported into open game platofrms.

## Useful code snippets:

[src/nodes/makeSmartContractNodeDefintions.ts](./src/nodes/makeSmartContractNodeDefintions.ts) - This file contains the code that generates behave graph node's from a smart contract's abi.

- For each payable/nonpayable write function, it generates `flow` nodes that can be triggered to write to the corresponding smart contract operation.
- For each view/pure function, it generates `event` nodes that read from the smart contract and emit values whenever data is received.
- For each event, it generates `event` nodes that emit whenever the event is fired.

[src/hooks/useGameContractNodeDefinitions.ts](./src/hooks/useGameContractNodeDefinitions.ts) - This file contains the code that generates the behave graph nodes from the [BullBear.sol](./contracts/src/BullBear.sol) abis.

[src/assets/catGraph.json](./src/assets/catGraph.json) - This is an example of a behave graph that has been created using the nodes generated from the abi of the [BullBear.sol](./contracts/src/BullBear.sol) smart contract.

[src/editor/UpdateBehaveGraph.tsx](./src/editor/UpdateBehaveGraph.tsx) - This file contains the code that saves the curerntly edited behave graph to ipfs, then writes that ipfs hash address to the smart contract, if the connected account is the smart contract owner.

[contracts/src/BullBear.sol](./contracts/src/BullBear.sol) - This is the smart contract that is used in the example behave graph. It has a dynamic happiness value that is computed based on a decay and last time the creature was petted. It also stores the ipfs hash of both the 3d model and behave graph. The behave graph ipfs hash can be updated by the contract owner

[src/components/SceneInner.tsx](src/components/SceneInner.tsx) - This contains the code to render the 3d scene, toggle animations on and off and apply updates to the scene from the graph.

[src/hooks/useModelAndGraphFromToken.ts](./src/hooks/useModelAndGraphFromToken.ts) - This contains the hook that fetches the model and behave graph ipfs hash from the token, and fetches the behave graph json from ipfs.

## Structure/Setup

This is a [wagmi](https://wagmi.sh) + [Foundry](https://book.getfoundry.sh/) + [Vite](https://vitejs.dev/) project.

### Getting Started

Run `yarn` in your terminal, and then open [localhost:5173](http://localhost:5173) in your browser.

Once the webpage has loaded, changes made to files inside the `src/` directory (e.g. `src/App.tsx`) will automatically update the webpage.

### Generating ABIs & React Hooks

This project comes with `@wagmi/cli` built-in, which means you can generate wagmi-compatible (type safe) ABIs & React Hooks straight from the command line.

To generate ABIs & Hooks, follow the steps below.

### Install Foundry

First, you will need to install [Foundry](https://book.getfoundry.sh/getting-started/installation) in order to build your smart contracts. This can be done by running the following command:

```
curl -L https://foundry.paradigm.xyz | bash
```

### Generate code

To generate ABIs & React Hooks from your Foundry project (in `./contracts`), you can run:

```
npm run wagmi
```

This will use the wagmi config (`wagmi.config.ts`) to generate a `src/generated.ts` file which will include your ABIs & Hooks that you can start using in your project.

[Here is an example](./src/components/Counter.tsx) of where Hooks from the generated file is being used.

## Deploying Contracts

## Install Foundry

Make sure you have Foundry installed & set up.

[See the above instructions](#install-foundry).

## Deploy contract

You can now deploy your contract!

```
npm run deploy
```
