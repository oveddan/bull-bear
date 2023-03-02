// import { Canvas } from '@react-three/fiber';
import { NonEditableScene } from './components/NonEditableScene';
import './app.css';

import catModel from './assets/chewing.glb';

export function App() {
  // const { isConnected } = useAccount();

  return (
    <>
      {/* <h1>wagmi + Vite</h1> */}

      {/* <Connect /> */}

      <NonEditableScene modelUrl={catModel} />
    </>
  );
}
