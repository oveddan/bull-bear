// import { Canvas } from '@react-three/fiber';
import { useAccount } from 'wagmi';

import { Account, Connect, Counter, NetworkSwitcher } from './components';
import { Scene } from './components/Scene';
import './app.css';

export function App() {
  const { isConnected } = useAccount();

  return (
    <>
      {/* <h1>wagmi + Vite</h1> */}

      {/* <Connect /> */}

      <Scene />
    </>
  );
}
