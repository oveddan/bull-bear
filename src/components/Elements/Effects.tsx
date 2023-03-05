import { Bloom, EffectComposer } from '@react-three/postprocessing';

export const Effects = () => (
  <EffectComposer>
    <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={200} />
  </EffectComposer>
);
