import { useSpring } from '@react-spring/three';
import { useTexture } from '@react-three/drei';
import { BigNumber } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import { DoubleSide, Mesh, Object3D } from 'three';
import { useBullBearGetHappiness } from '../generated';
import happyCloud from './Elements/images/happy_cloud.png';

export const UI = ({ tokenId }: { tokenId: BigNumber }) => {
  const cloud = useTexture(happyCloud);

  const { data: happiness } = useBullBearGetHappiness({
    args: [tokenId],
    watch: true
  });

  const [happinessPercentage, setHappinessPercentage] = useState(1);

  useEffect(() => {
    setHappinessPercentage((happiness || 0) / 100);
  }, [happiness]);

  const happinessMesh = useRef<Mesh>(null);

  useSpring({
    from: {
      happiness: 0
    },
    to: {
      happiness: happinessPercentage
    },
    config: {
      duration: 2000
    },
    onChange: ({ value: { happiness } }) => {
      happinessMesh.current?.position.setY(happiness);
    }
  });

  return (
    <>
      <mesh position={[2.5, 3.2, 0]} scale={1.25}>
        <planeBufferGeometry />
        <meshBasicMaterial map={cloud} side={DoubleSide} transparent />
        <mesh
          scale-y={0.8}
          scale-z={0.01}
          // position-y={happinessPercentage}
          ref={happinessMesh}
        >
          <boxBufferGeometry />
          <meshBasicMaterial opacity={0} transparent />
        </mesh>
      </mesh>
    </>
  );
};
