import { useGLTF } from '@react-three/drei';

export const HappinessIndicator = ({ happiness }: { happiness: number }) => {
  const cloud = useGLTF('/cloud-b.glb');
  return (
    <>
      <primitive object={cloud.scene} scale={happiness} />
    </>
  );
};
