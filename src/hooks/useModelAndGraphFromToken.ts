import { useBullBearModelAndGraphUrls } from '../generated';
import { useFetchGraphJson } from './useFetchJson';
import { useMemo } from 'react';
import { ThirdwebStorage } from '@thirdweb-dev/storage';

const useGatewayUrl = <T extends string | undefined>(url: T): T => {
  const storage = useMemo(() => new ThirdwebStorage(), []);

  return url ? (storage.resolveScheme(url) as T) : url;
};

export const useModelAndGraphFromToken = () => {
  const { data } = useBullBearModelAndGraphUrls({
    watch: true
  });

  const fullGraphJsonUrl = useGatewayUrl(
    data ? `${data.baseUrl}${data.behaveGraphUrl}` : undefined
  );

  const graphJson = useFetchGraphJson({ url: fullGraphJsonUrl });

  const fullModelUrl = useGatewayUrl(`${data!.baseUrl}${data!.modelUrl}`);

  return {
    modelUrl: fullModelUrl,
    graphJson
  };
};
