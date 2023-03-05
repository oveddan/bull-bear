import { useBullBearModelAndGraphUrls } from '../generated';
import { useFetchGraphJson } from './useFetchJson';

export const useModelAndGraphFromToken = () => {
  const { data } = useBullBearModelAndGraphUrls({
    watch: true
  });

  const fullGraphJsonUrl = data
    ? `https://${data.baseUrl}${data.behaveGraphUrl}`
    : undefined;

  const graphJson = useFetchGraphJson({ url: fullGraphJsonUrl });

  const fullModelUrl = `https://${data?.baseUrl}${data?.modelUrl}`;

  return {
    modelUrl: fullModelUrl,
    graphJson
  };
};
