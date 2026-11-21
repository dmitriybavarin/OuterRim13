import { useBackend } from 'tgui/backend';
import { Box, Button, ProgressBar, Stack, Tooltip } from 'tgui-core/components';

import { useT } from '../../../i18n';
import type { PreferencesMenuData } from '../types';
import { useServerPrefs } from '../useServerPrefs';

type Translate = ReturnType<typeof useT>;

const STAT_FALLBACKS: Record<string, [string, string]> = {
  strength: ['Strength', 'Raw physical power.'],
  perception: ['Perception', 'Awareness and attention to detail.'],
  endurance: ['Endurance', 'Toughness and stamina.'],
  charisma: ['Charisma', 'Force of personality and ability to win people over.'],
  intelligence: ['Intelligence', 'Mental acuity and learning.'],
  agility: ['Agility', 'Speed, reflexes and coordination.'],
  luck: ['Luck', 'Fortune and chance.'],
};

export function statName(t: Translate, id: string): string {
  return t(`stat-${id}-name`, {}, STAT_FALLBACKS[id]?.[0] ?? id);
}

export function statDescription(t: Translate, id: string): string {
  return t(`stat-${id}-desc`, {}, STAT_FALLBACKS[id]?.[1] ?? '');
}

export function requirementText(
  t: Translate,
  requirements: Record<string, number> | undefined,
): string {
  return Object.entries(requirements ?? {})
    .map(([id, value]) =>
      t(
        'stats-requirement',
        { stat: statName(t, id), value },
        `Needs ${statName(t, id)} ${value}`,
      ),
    )
    .join(', ');
}

export function StatsPanel() {
  const { act, data } = useBackend<PreferencesMenuData>();
  const t = useT();
  const serverData = useServerPrefs();
  if (!serverData) {
    return null;
  }

  const {
    stat_ids: statIds,
    stat_min: statMin,
    stat_max: statMax,
    stat_default: statDefault,
    stat_pool_total: poolTotal,
  } = serverData.quirks;
  const stats = data.stats ?? {};

  let used = 0;
  for (const id of statIds) {
    used += stats[id] ?? statDefault;
  }
  const left = poolTotal - used;

  return (
    <Stack vertical fill g={1.5}>
      <Stack.Item>
        <Box bold fontSize="1.3em" textAlign="center">
          {t('stats-title', {}, 'Stats')}
        </Box>
      </Stack.Item>
      <Stack.Item>
        <Stack align="center" g={1}>
          <Stack.Item grow>
            <Box className="PreferencesMenu__Quirks__chip" width="100%">
              <Box
                as="span"
                bold
                style={{ whiteSpace: 'normal' }}
                width="100%"
                textAlign="center"
              >
                {t(
                  'stats-points-left',
                  { amount: left },
                  `Points left: ${left}`,
                )}
              </Box>
            </Box>
          </Stack.Item>
          <Stack.Item>
            <Button icon="undo" onClick={() => act('reset_stats')}>
              {t('stats-reset', {}, 'Reset')}
            </Button>
          </Stack.Item>
        </Stack>
      </Stack.Item>
      <Stack.Item grow style={{ minHeight: 0, overflowY: 'auto' }}>
        <Stack vertical g={1.5}>
          {statIds.map((id) => {
            const value = stats[id] ?? statDefault;
            return (
              <Stack.Item key={id}>
                <Tooltip content={statDescription(t, id)}>
                  <Box>
                    <Box bold mb={0.5} style={{ lineHeight: 1.3 }}>
                      {statName(t, id)}
                    </Box>
                    <Stack align="center" g={1}>
                      <Stack.Item>
                        <Button
                          icon="minus"
                          disabled={value <= statMin}
                          onClick={() =>
                            act('set_stat', { stat: id, value: value - 1 })
                          }
                        />
                      </Stack.Item>
                      <Stack.Item grow>
                        <ProgressBar
                          minValue={statMin}
                          maxValue={statMax}
                          value={value}
                          color="good"
                        >
                          <Box textAlign="center">{value}</Box>
                        </ProgressBar>
                      </Stack.Item>
                      <Stack.Item>
                        <Button
                          icon="plus"
                          disabled={value >= statMax || left <= 0}
                          onClick={() =>
                            act('set_stat', { stat: id, value: value + 1 })
                          }
                        />
                      </Stack.Item>
                    </Stack>
                  </Box>
                </Tooltip>
              </Stack.Item>
            );
          })}
        </Stack>
      </Stack.Item>
    </Stack>
  );
}
