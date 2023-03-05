// import { Canvas } from '@react-three/fiber';
// import './app.css';

// import catModel from './assets/combined-v2.glb';
import { useAccount } from 'wagmi';
import { Connect } from './components/Connect';
import { EdibleSceneWithFilesFromToken } from './editor/EditableScene';

export function EditorApp() {
  return (
    <>
      {/* <h1>wagmi + Vite</h1> */}

      <div className="absolute z-20 top-2">
        <Connect />
      </div>

      <EdibleSceneWithFilesFromToken />
    </>
  );
}
