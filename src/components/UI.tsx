import { useSpring } from '@react-spring/three';
import { useTexture, Text } from '@react-three/drei';
import { BigNumber } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import { DoubleSide, Mesh } from 'three';
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

  const happinessFilterMesh = useRef<Mesh>(null);

  // animates the filter mesh to go down when happiness goes down.
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
      happinessFilterMesh.current?.position.setY(happiness);
    }
  });

  return (
    <>
      <mesh position={[2.5, 3.2, 0]} scale={1.25}>
        <planeBufferGeometry />

        <meshBasicMaterial map={cloud} side={DoubleSide} transparent />
        <mesh scale-y={0.8} scale-z={0.1} ref={happinessFilterMesh}>
          <boxBufferGeometry />
          <meshBasicMaterial opacity={0} transparent />
        </mesh>
      </mesh>
    </>
  );
};
