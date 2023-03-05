import { GraphJSON } from '@oveddan-behave-graph/core';
import { useEffect, useState } from 'react';

export const useFetchGraphJson = ({ url }: { url: string | undefined }) => {
  const [graphJson, setGraphJson] = useState<GraphJSON>();

  useEffect(() => {
    if (!url) {
      setGraphJson(undefined);
      return;
    }

    (async () => {
      const json = await (await fetch(url)).json();
      setGraphJson(json as GraphJSON);
    })();
  }, [url]);

  return graphJson;
};
