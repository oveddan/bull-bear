import { useTexture } from '@react-three/drei';
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { DoubleSide } from 'three';
import { useBullBearGetHappiness } from '../generated';

export const UI = ({ tokenId }: { tokenId: BigNumber }) => {
  const cloud = useTexture('/happy_cloud.PNG');

  const { data: happiness } = useBullBearGetHappiness({
    args: [tokenId],
    watch: true
  });

  const [happinessPercentage, setHappinessPercentage] = useState(1);

  useEffect(() => {
    setHappinessPercentage((happiness || 0) / 100);
  }, [happiness]);

  return (
    <>
      <mesh position={[2.5, 3.2, 0]} scale={1.25}>
        <planeBufferGeometry />
        <meshBasicMaterial map={cloud} side={DoubleSide} transparent />
        <mesh scale-y={0.8} scale-z={0.01} position-y={happinessPercentage}>
          <boxBufferGeometry />
          <meshBasicMaterial opacity={0} transparent />
        </mesh>
      </mesh>
    </>
  );
};
