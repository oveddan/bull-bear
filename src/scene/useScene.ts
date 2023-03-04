import { IScene } from '@oveddan-behave-graph/scene';
import { ObjectMap } from '@react-three/fiber';
import { useCallback, useEffect, useState } from 'react';
import { GLTF } from 'three-stdlib';
import { buildScene, OnClickListeners } from './buildScene';
import { useWhyDidYouUpdate } from 'use-why-did-you-update';

export type AnimationsState = { [key: string]: boolean };

export const useScene = (gltf: (GLTF & ObjectMap) | undefined) => {
  const [scene, setScene] = useState<IScene>();

  const [activeAnimations, setActiveAnimations] = useState<AnimationsState>({});
  const [sceneOnClickListeners, setSceneOnClickListeners] =
    useState<OnClickListeners>({});

  useEffect(() => {
    // reset state on new active animations
    setActiveAnimations({});
  }, [gltf]);

  const setAnimationActive = useCallback(
    (animation: string, active: boolean) => {
      setActiveAnimations((existing) => {
        if (!!existing[animation] === active) return existing;

        return {
          ...existing,
          [animation]: active
        };
      });
    },
    []
  );

  useWhyDidYouUpdate('useScene', {
    gltf,
    sceneOnClickListeners,
    setAnimationActive,
    activeAnimations
  });

  useEffect(() => {
    if (!gltf) {
      setScene(undefined);
    } else {
      const setAnimationActive = (animation: string, active: boolean) => {
        setActiveAnimations((existing) => {
          if (!!existing[animation] === active) return existing;

          return {
            ...existing,
            [animation]: active
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
