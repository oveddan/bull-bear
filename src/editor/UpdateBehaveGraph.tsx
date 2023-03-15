import { useCallback, useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { bullBearABI, useBullBear, useBullBearOwner } from '../generated';
import { prepareWriteContract, writeContract } from '@wagmi/core';
import { GraphJSON, NodeSpecJSON } from '@oveddan-behave-graph/core';
import { Edge, Node } from 'reactflow';
import { flowToBehave } from '@oveddan-behave-graph/flow';
import { ThirdwebStorage } from '@thirdweb-dev/storage';

// source: https://stackoverflow.com/questions/12168909/blob-from-dataurl
async function dataURItoBlob(dataURI: string) {
  return await (await fetch(dataURI)).blob();
}

export const createFileFromUrl = async (dataUri: string, fileName: string) => {
  const blob = await dataURItoBlob(dataUri);

  const file = new File([blob], fileName);

  return file;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const createJsonFileFromObject = (object: Object, fileName: string) => {
  const fileContents = JSON.stringify(object);

  const blob = new Blob([fileContents], { type: 'application/json' });

  const file = new File([blob], fileName);

  return file;
};

const fileName = 'graph.json';

// goes from ipfs://cid/path to ipfs/path
const toIpfsPath = (url: string) => {
  return url.replace('ipfs://', '');
};

const saveToWebIPFS = async (graph: GraphJSON) => {
  const behaviorGraphFile = createJsonFileFromObject(graph, fileName);
  const storage = new ThirdwebStorage();
  // const client = makeWeb3StorageClient();

  const uri = await storage.upload(behaviorGraphFile);
  // const cid = storage.upload
  // const cid = await client.put([behaviorGraphFile]);

  const ipfsPath = toIpfsPath(uri);

  return ipfsPath;
};

const UpdateBehaveGraphInner = ({
  nodes,
  edges,
  nodeSpecJSON
}: {
  nodes: Node[];
  edges: Edge[];
  nodeSpecJSON: NodeSpecJSON[];
}) => {
  const contractAddress = useBullBear()?.address;
  const chainId = useChainId();
  const [updating, setUpdating] = useState(false);
  const handleUpdateToken = useCallback(
    async (e: any) => {
      e.preventDefault();

      if (!contractAddress) return;
      setUpdating(true);
      try {
        const graphJson = flowToBehave(nodes, edges, nodeSpecJSON);
        const ipfsPath = await saveToWebIPFS(graphJson);

        const prepared = await prepareWriteContract({
          abi: bullBearABI,
          address: contractAddress,
          chainId,
          functionName: 'setBehaveGraphURI',
          args: [ipfsPath]
        });

        const tx = await writeContract(prepared);

        await tx.wait();
      } catch (e) {
        console.error(e);
      } finally {
        setUpdating(false);
      }
    },
    [nodes, edges, nodeSpecJSON, contractAddress, chainId]
  );

  return (
    <>
      <button
        onClick={handleUpdateToken}
        disabled={updating}
        className="mx-2 mb-1 italic"
      >
        save
      </button>
    </>
  );
};

export const UpdateBehaveGraph = (props: {
  nodes: Node[];
  edges: Edge[];
  nodeSpecJSON: NodeSpecJSON[];
}) => {
  const account = useAccount();
  const { data: owner } = useBullBearOwner();

  if (account.address !== owner) {
    return null;
  }

  return <UpdateBehaveGraphInner {...props} />;
};
