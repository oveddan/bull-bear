import { OnClickListeners } from '@oveddan-behave-graph/scene';
import { ObjectMap } from '@react-three/fiber';
import { Object3D } from 'three';
import { GLTF } from 'three-stdlib';
import { RegisterOnClickListeners } from '../scene/RegisterOnClickListeners';
import ToggleAnimations from '../scene/ToggleAnimations';
import { AnimationsState } from '../scene/useScene';

export const SceneInner = ({
  onClickListeners,
  gltf,
  animations,
  setMainRef
}: {
  onClickListeners: OnClickListeners;
  gltf: GLTF & ObjectMap;
  animations: AnimationsState;
  setMainRef: (ref: Object3D | null) => void;
}) => {
  // const [mainRef, setMainRef] = useState<Object3D | null>(null);
  return (
    <>
      <primitive object={gltf.scene} ref={setMainRef}>
        <RegisterOnClickListeners
          gltf={gltf}
          onClickListeners={onClickListeners}
        />
      </primitive>
      <ToggleAnimations gltf={gltf} animationsState={animations} />
    </>
  );
};
