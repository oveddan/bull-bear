import { useBullBearModelAndGraphUrls } from '../generated';
import { useFetchGraphJson } from './useFetchJson';
import { useMemo } from 'react';
import { ThirdwebStorage } from '@thirdweb-dev/storage';

export const useModelAndGraphFromToken = () => {
  const { data } = useBullBearModelAndGraphUrls({
    watch: true
  });

  const storage = useMemo(() => new ThirdwebStorage(), []);

  const urls = useMemo(() => {
    if (!data) return undefined;
    const fullGraphJsonUrl = storage.resolveScheme(
      `${data.baseUrl}${data.behaveGraphUrl}`
    );
    const fullModelUrl = storage.resolveScheme(
      `${data.baseUrl}${data.modelUrl}`
    );

    return {
      modelUrl: fullModelUrl,
      graphJsonUrl: fullGraphJsonUrl
    };
  }, [storage, data]);

  if (!data) return undefined;

  const graphJson = useFetchGraphJson({ url: urls?.graphJsonUrl });

  return {
    modelUrl: urls?.modelUrl,
    graphJson
  };
};
