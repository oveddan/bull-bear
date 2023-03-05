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
