import { GLTF } from 'three-stdlib';
import { ObjectMap } from '@react-three/fiber';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react';
import { Mesh } from 'three';
import { meshBounds, useCursor } from '@react-three/drei';
import { OnClickListener, OnClickListeners } from './buildScene';

const RegisterOnClickListenersOnElements = ({
  jsonPath,
  listeners,
  gltf,
  setHovered
}: {
  jsonPath: string;
  listeners: OnClickListener;
  gltf: GLTF & ObjectMap;
  setHovered: Dispatch<SetStateAction<HoveredState>>;
}) => {
  const [node, setNode] = useState<Mesh>();

  useEffect(() => {
    if (listeners.path.resource === 'nodes') {
      const nodeSource = gltf.nodes[listeners.elementName];
      if (!nodeSource) {
        console.error('no node at path ' + listeners.elementName);
        return;
      }
      const node = nodeSource.clone() as Mesh;
      node.visible = false;

      setNode(node);
      return;
    } else if (listeners.path.resource === 'meshes') {
      let nodeSource: Mesh | undefined = undefined;
      const elementName = listeners.elementName.replace('.', '');
      gltf.scene.traverse((x) => {
        if (x.name.replace('.', '') === elementName) {
          nodeSource = x as Mesh;
        }
      });
      if (!nodeSource) {
        console.error('no mesh at path ' + elementName);
        return;
      }
      const node = (nodeSource as Mesh).clone() as Mesh;

      setNode(node);
      return;
    } else {
      console.error('unknown path resource of ' + listeners.path.resource);
    }

    setNode(undefined);
  }, [listeners.path, gltf]);

  const handleClick = useCallback(() => {
    listeners.callbacks.forEach((cb) => cb(jsonPath));
  }, [listeners.callbacks, jsonPath]);

  const hoveredOn = useCallback(() => {
    setHovered((prev) => ({ ...prev, [jsonPath]: true }));
  }, [jsonPath]);

  const hoveredOff = useCallback(() => {
    setHovered((prev) => ({ ...prev, [jsonPath]: false }));
  }, [jsonPath]);

  if (!node) return null;

  return (
    <primitive
      object={node}
      raycast={meshBounds}
      onClick={handleClick}
      onPointerOver={hoveredOn}
      onPointerOut={hoveredOff}
    />
  );
};

type HoveredState = {
  [key: string]: boolean;
};

export const RegisterOnClickListeners = ({
  onClickListeners,
  gltf
}: {
  onClickListeners: OnClickListeners;
  gltf?: GLTF & ObjectMap;
}) => {
  const [hovered, setHovered] = useState<HoveredState>({});

  const [anyHovered, setAnyHovered] = useState(false);

  useEffect(() => {
    const anyTrue = Object.values(hovered).some((x) => x);
    setAnyHovered(anyTrue);
  }, [hovered]);

  useCursor(anyHovered, 'pointer', 'auto');

  if (!gltf) return null;

  return (
    <>
      {Object.entries(onClickListeners).map(([jsonPath, listeners]) => (
        <RegisterOnClickListenersOnElements
          key={jsonPath}
          gltf={gltf}
          jsonPath={jsonPath}
          listeners={listeners}
          setHovered={setHovered}
        />
      ))}
    </>
  );
};
