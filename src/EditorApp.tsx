// import { Canvas } from '@react-three/fiber';
import './editor.css';
import { FlowAndScene } from './components/editor/FlowAndScene';

import catModel from './assets/chewing.glb';
import catGraphJson from './assets/catGraph.json';

export function EditorApp() {
  // const { isConnected } = useAccount();

  return (
    <>
      {/* <h1>wagmi + Vite</h1> */}

      {/* <Connect /> */}

      <FlowAndScene initialGraphJSON={catGraphJson} modelUrl={catModel} />
    </>
  );
}
