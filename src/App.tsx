// import { Canvas } from '@react-three/fiber';
import { NonEditableSceneWithFilesFromToken } from './components/NonEditableScene';
import './app.css';

//
// import { WagmiConnect as RainbowKitConnect } from './components/Connect';
import { Connect } from './components/Connect';

export function App() {
  // const { isConnected } = useAccount();

  return (
    <>
      {/* <h1>wagmi + Vite</h1> */}

      <Connect />

      <NonEditableSceneWithFilesFromToken />
    </>
  );
}
