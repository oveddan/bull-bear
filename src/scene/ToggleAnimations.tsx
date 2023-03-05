import { useEffect, useState } from 'react';
import { useAnimations } from '@react-three/drei';
import { AnimationAction } from 'three';
import { ObjectMap } from '@react-three/fiber';
import { GLTF } from 'three-stdlib';
import { AnimationsState } from './useScene';

const PlayAnimation = ({
  name,
  action,
  playing
}: {
  name: string;
  action: AnimationAction;
  playing: boolean;
}) => {
  useEffect(() => {
    // reset animation state on mount
    action.reset();

    // on unmount, stop the animation
    return () => {
      if (!action.paused) action.stop();
    };
  }, [action]);

  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    if (playing) {
      if (!hasPlayed) {
        console.log({ playing, name });
        action.play();
        setHasPlayed(true);
      } else {
        if (action.paused) {
          action.paused = false;
        }
      }
    } else {
      if (!hasPlayed) return;

      console.log({ playing, name });
      action.paused = true;
    }
  }, [name, action, playing, hasPlayed]);

  return null;
};

const ToggleAnimations = ({
  gltf,
  animationsState
}: {
  gltf: GLTF & ObjectMap;
  animationsState: AnimationsState;
}) => {
  const { actions: animationActions } = useAnimations(
    gltf.animations,
    gltf.scene
  );

  return (
    <>
      {Object.entries(animationActions).map(
        ([name, animation]) =>
          animation && (
            <PlayAnimation
              key={name}
              playing={!!animationsState[name]?.playing}
              name={name}
              action={animation}
            />
          )
      )}
    </>
  );
};

export default ToggleAnimations;
