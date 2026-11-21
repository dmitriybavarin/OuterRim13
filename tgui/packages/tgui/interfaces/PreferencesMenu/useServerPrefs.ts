import { createContext, useContext } from 'react';

import type { ServerData } from './types';

export const ServerPrefs = createContext<ServerData | undefined>({
  jobs: {
    departments: {},
    jobs: {},
    jobs_sorted: [],
  },
  names: {
    types: {},
  },
  quirks: {
    max_positive_quirks: -1,
    quirk_info: {},
    quirk_blacklist: [],
    points_enabled: false,
    quirk_slots: 3,
    stat_ids: [],
    stat_min: 1,
    stat_max: 10,
    stat_default: 5,
    stat_pool_total: 40,
  },
  personality: {
    personalities: [],
    personality_incompatibilities: {},
  },
  random: {
    randomizable: [],
  },
  loadout: {
    loadout_tabs: [],
  },
  species: {},
});

export function useServerPrefs() {
  return useContext(ServerPrefs);
}
