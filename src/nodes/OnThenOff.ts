// also called "delay"

import {
  makeAsyncNodeDefinition,
  NodeCategory
} from '@oveddan-behave-graph/core';

export const OnThenOff = makeAsyncNodeDefinition({
  typeName: 'time/onThenOff',
  label: 'On then off',
  category: NodeCategory.Time,
  in: {
    flow: 'flow',
    duration: {
      valueType: 'float',
      defaultValue: 1
    }
  },
  out: {
    flow: 'flow',
    on: 'boolean'
  },
  triggered: ({ commit, read, write, finished }) => {
    const duration = (read('duration') || 1000) as number;
    write('on', true);
    commit('flow');
    setTimeout(() => {
      write('on', false);
      commit('flow');
      if (finished) finished();
    }, duration * 1000);
  },
  dispose: () => {
    return null;
  },
  initialState: undefined
});
