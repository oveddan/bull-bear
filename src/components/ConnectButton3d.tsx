import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Html, Billboard } from '@react-three/drei';
import { useContext } from 'react';
import { Context } from 'wagmi';
import { goerli, sepolia } from 'wagmi/chains';
const chains = [goerli, sepolia];
export const ConnectButton3d = () => {
  const x = useContext(Context);
  return (
    <Billboard
      follow={true}
      lockX={false}
      lockY={false}
      lockZ={false} // Lock the rotation on the z axis (default=false)
    >
      <Html>
        <p>Youooo</p>
        {/* <RainbowKitProvider chains={chains}> */}
        <ConnectButton />
        {/* </RainbowKitProvider> */}
      </Html>
    </Billboard>
  );
};
