import { Backdrop, useTexture } from '@react-three/drei';
import background from './images/background.jpg';

export const Background = () => {
  const backgroundImage = useTexture(background);

  return (
    // @ts-ignore
    <Backdrop
      floor={0.25} // Stretches the floor segment, 0.25 by default
      segments={20} // Mesh-resolution, 20 by default
      scale-z={20}
      scale-y={20}
      scale-x={100}
      position-z={-5}
      position-y={-2}
    >
      <meshBasicMaterial map={backgroundImage} />
    </Backdrop>
  );
};
