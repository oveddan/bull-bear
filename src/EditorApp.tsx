// import { Canvas } from '@react-three/fiber';
import { EditableScene } from './editor/EditableScene';
// import './app.css';

// import catModel from './assets/combined-v2.glb';
import catGraph from './assets/catGraph.json';
import { useGameContractNodeDefinitions } from './hooks/useGameContractNodeDefinitions';
import { Connect } from './components/Connect';
import { GraphJSON } from '@oveddan-behave-graph/core';

export function EditorApp() {
  // const { isConnected } = useAccount();

  const gameSmartContractDefinitions = useGameContractNodeDefinitions();

  return (
    <>
      {/* <h1>wagmi + Vite</h1> */}

      <div className="absolute z-20 top-2">
        <Connect />
      </div>

      <EditableScene
        modelUrl={'/combined-v3.glb'}
        initialGraphJson={catGraph as unknown as GraphJSON}
        additionalNodeDefinitions={gameSmartContractDefinitions}
      />
    </>
  );
}
