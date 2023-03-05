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
