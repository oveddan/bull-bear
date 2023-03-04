// import { Canvas } from '@react-three/fiber';
import { NonEditableScene } from './components/NonEditableScene';
import './app.css';

import catGraph from './assets/catGraph.json';
//
// import { WagmiConnect as RainbowKitConnect } from './components/Connect';
import { RainbowKitConnect } from './components/Connect';
import { GraphJSON } from '@oveddan-behave-graph/core';

export function App() {
  // const { isConnected } = useAccount();

  return (
    <>
      {/* <h1>wagmi + Vite</h1> */}

      <RainbowKitConnect />

      <NonEditableScene
        modelUrl={'combined-v2.glb'}
        graphJson={catGraph as unknown as GraphJSON}
      />
    </>
  );
}
