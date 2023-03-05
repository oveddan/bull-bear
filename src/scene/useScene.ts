import { IScene } from '@oveddan-behave-graph/scene';
import { ObjectMap } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { GLTF } from 'three-stdlib';
import { buildScene, OnClickListeners } from './buildScene';

export type AnimationsState = {
  [key: string]: {
    playing: boolean;
    loop: boolean;
  };
};

export const useScene = (gltf: (GLTF & ObjectMap) | undefined) => {
  const [scene, setScene] = useState<IScene>();

  const [activeAnimations, setActiveAnimations] = useState<AnimationsState>({});
  const [sceneOnClickListeners, setSceneOnClickListeners] =
    useState<OnClickListeners>({});

  useEffect(() => {
    // reset state on new active animations
    setActiveAnimations({});
  }, [gltf]);

  useEffect(() => {
    if (!gltf) {
      setScene(undefined);
    } else {
      const setAnimationActive = (animation: string, active: boolean) => {
        setActiveAnimations((existing) => {
          if (!!existing[animation]?.playing === active) return existing;

          return {
            ...existing,
            [animation]: {
              ...existing[animation],
              playing: active
            }
          };
        });
      };
      setScene(
        buildScene({
          gltf,
          setOnClickListeners: setSceneOnClickListeners,
          setActiveAnimations: setAnimationActive
        })
      );
    }
  }, [gltf]);

  return {
    scene,
    animations: activeAnimations,
    sceneOnClickListeners
  };
};
