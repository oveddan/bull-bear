export const Floor = () => (
  <mesh rotation-x={-Math.PI / 2}>
    <planeGeometry args={[100, 100]} />
    <meshPhysicalMaterial color={'white'} />
  </mesh>
);
