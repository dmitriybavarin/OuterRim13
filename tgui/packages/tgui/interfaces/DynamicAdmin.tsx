import { useState } from 'react';
import {
  BlockQuote,
  Box,
  Button,
  Dropdown,
  Flex,
  Input,
  LabeledList,
  NoticeBox,
  Section,
  Stack,
  Tabs,
  Tooltip,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';
import { createSearch } from 'tgui-core/string';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Translate = ReturnType<typeof useT>;

type RulesetCount = Record<string, number>;

type DynamicConfig = Record<string, any>;

type typePath = string;

type Player = {
  key: string;
};

type RulesetReport = RulesetType & {
  index: number;
  selected_players: Player[];
  hidden: BooleanLike;
};

type RulesetType = {
  name: string;
  id: string;
  typepath: typePath;
  admin_disabled: BooleanLike;
};

type Data = {
  current_tier?: {
    number: number;
    name: string;
  };
  ruleset_count?: RulesetCount;
  full_config?: DynamicConfig;
  queued_rulesets: RulesetReport[];
  active_rulesets: RulesetReport[];
  all_rulesets: Record<string, RulesetType[]>;
  time_until_lights: number;
  time_until_heavies: number;
  time_until_latejoins: number;
  time_until_next_midround: number;
  time_until_next_latejoin: number;
  failed_latejoins: number;
  light_midround_chance: number;
  heavy_midround_chance: number;
  latejoin_chance: number;
  roundstarted: BooleanLike;
  config_even_enabled: BooleanLike;
  light_chance_maxxed: BooleanLike;
  heavy_chance_maxxed: BooleanLike;
  latejoin_chance_maxxed: BooleanLike;
  next_dynamic_tick: number;
  antag_events_enabled: BooleanLike;
};

function formatTime(seconds: number, t: Translate): string {
  seconds /= 10;
  if (seconds < 0) {
    return t('dynamicadmin-time-never', {}, 'never');
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);

  return t(
    'dynamicadmin-time-format',
    { hours, minutes, secs },
    `${hours}h ${minutes}m ${secs}s`,
  );
}

function getPlayerString(players: Player[], t: Translate): string {
  if (players.length === 0) {
    return t('dynamicadmin-players-none', {}, 'No one');
  } else if (players.length === 1) {
    return players[0].key;
  } else if (players.length === 2) {
    return t(
      'dynamicadmin-players-two',
      { first: players[0].key, second: players[1].key },
      `${players[0].key} and ${players[1].key}`,
    );
  }
  const keys = players.map((player) => player.key);
  const last = keys.pop() ?? '';
  return t(
    'dynamicadmin-players-many',
    { list: keys.join(', '), last },
    `${keys.join(', ')}, and ${last}`,
  );
}

function readableRulesesetCategory(
  ruleset_category: string,
  t: Translate,
): string {
  const fallback = ruleset_category
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return t(`dynamicadmin-category-${ruleset_category}`, {}, fallback);
}

const StatusPanel = () => {
  const { data, act } = useBackend<Data>();
  const t = useT();
  const {
    current_tier,
    ruleset_count,
    time_until_lights,
    time_until_heavies,
    time_until_latejoins,
    time_until_next_midround,
    time_until_next_latejoin,
    failed_latejoins,
    light_midround_chance,
    heavy_midround_chance,
    latejoin_chance,
    roundstarted,
    light_chance_maxxed,
    heavy_chance_maxxed,
    latejoin_chance_maxxed,
    next_dynamic_tick,
  } = data;

  if (!current_tier) {
    return (
      <LabeledList>
        <LabeledList.Item label={t('dynamicadmin-current-tier', {}, 'Current Tier')}>
          <Button onClick={() => act('set_tier')}>
            {t('dynamicadmin-click-to-set', {}, '(Click to set)')}
          </Button>
        </LabeledList.Item>
      </LabeledList>
    );
  }

  return (
    <LabeledList>
      <LabeledList.Item label={t('dynamicadmin-current-tier', {}, 'Current Tier')}>
        <Box>
          <b>{current_tier.number}</b> ({current_tier.name})
        </Box>
        {!roundstarted && (
          <Button ml={1} onClick={() => act('set_tier')}>
            {t('dynamicadmin-change', {}, '(Change)')}
          </Button>
        )}
      </LabeledList.Item>
      {ruleset_count &&
        Object.entries(ruleset_count).map(([name, count]) => (
          <LabeledList.Item
            key={name}
            label={t(
              'dynamicadmin-ruleset-count',
              { category: readableRulesesetCategory(name, t) },
              `${readableRulesesetCategory(name, t)} Ruleset Count`,
            )}
          >
            <Flex>
              <Flex.Item>{count}</Flex.Item>
              {(name !== 'roundstart' || !roundstarted) && (
                <Flex.Item ml={1}>
                  <Button
                    icon="plus"
                    tooltip={t('dynamicadmin-ruleset-add', {}, 'Add one max ruleset of this type')}
                    tooltipPosition="right"
                    onClick={() =>
                      act('add_ruleset_category_count', {
                        ruleset_category: name,
                      })
                    }
                  />
                </Flex.Item>
              )}
              {(name !== 'roundstart' || !roundstarted) && (
                <Flex.Item ml={0.5}>
                  <Button
                    icon="times"
                    disabled={count === 0}
                    tooltip={t('dynamicadmin-ruleset-clear', {}, 'Set max ruleset of this type to 0')}
                    tooltipPosition="right"
                    onClick={() =>
                      act('set_ruleset_category_count', {
                        ruleset_category: name,
                        ruleset_count: 0,
                      })
                    }
                  />
                </Flex.Item>
              )}
            </Flex>
          </LabeledList.Item>
        ))}
      {time_until_lights > 0 ? (
        <LabeledList.Item label={t('dynamicadmin-light-start', {}, 'Light Midround Start')}>
          <Flex>
            <Flex.Item>
              <Box>{formatTime(time_until_lights, t)}</Box>
            </Flex.Item>
            <Flex.Item>
              <Button ml={1} onClick={() => act('light_start_now')}>
                {t('dynamicadmin-start-now', {}, 'Start Now')}
              </Button>
            </Flex.Item>
          </Flex>
        </LabeledList.Item>
      ) : (
        <>
          <LabeledList.Item label={t('dynamicadmin-light-cooldown', {}, 'Light Midround Cooldown')}>
            <Flex>
              <Flex.Item>
                <Box>
                  {time_until_next_midround > 0
                    ? formatTime(time_until_next_midround, t)
                    : t(
                        'dynamicadmin-next-tick',
                        { time: formatTime(next_dynamic_tick, t) },
                        'Next dynamic tick',
                      )}
                </Box>
              </Flex.Item>
              <Flex.Item>
                <Button
                  ml={1}
                  disabled={time_until_next_midround <= 0}
                  onClick={() => act('reset_midround_cooldown')}
                >
                  {t('dynamicadmin-reset-cooldown', {}, 'Reset Cooldown')}
                </Button>
              </Flex.Item>
            </Flex>
          </LabeledList.Item>
          <LabeledList.Item label={t('dynamicadmin-light-chance', {}, 'Light Midround Chance')}>
            <Flex>
              <Flex.Item>
                <Box
                  inline
                  style={{
                    borderBottom: '2px dotted rgba(255, 255, 255, 0.8)',
                  }}
                >
                  <Tooltip content={t('dynamicadmin-light-chance-tip', {}, 'Chance of a light midround ruleset being selected on next dynamic tick')}>
                    {light_midround_chance}%
                  </Tooltip>
                </Box>
              </Flex.Item>
              <Flex.Item>
                <Button ml={1} onClick={() => act('max_light_chance')}>
                  {light_chance_maxxed ? t('dynamicadmin-reset', {}, 'Reset') : t('dynamicadmin-set-max', {}, 'Set to 100%')}
                </Button>
              </Flex.Item>
            </Flex>
          </LabeledList.Item>
        </>
      )}
      {time_until_heavies > 0 ? (
        <LabeledList.Item label={t('dynamicadmin-heavy-start', {}, 'Heavy Midround Start')}>
          <Flex>
            <Flex.Item>
              <Box>{formatTime(time_until_heavies, t)}</Box>
            </Flex.Item>
            <Flex.Item>
              <Button ml={1} onClick={() => act('heavy_start_now')}>
                {t('dynamicadmin-start-now', {}, 'Start Now')}
              </Button>
            </Flex.Item>
          </Flex>
        </LabeledList.Item>
      ) : (
        <>
          <LabeledList.Item label={t('dynamicadmin-heavy-cooldown', {}, 'Heavy Midround Cooldown')}>
            <Flex>
              <Flex.Item>
                <Box>
                  {time_until_next_midround > 0
                    ? formatTime(time_until_next_midround, t)
                    : t(
                        'dynamicadmin-next-tick',
                        { time: formatTime(next_dynamic_tick, t) },
                        'Next dynamic tick',
                      )}
                </Box>
              </Flex.Item>
              <Flex.Item>
                <Button
                  ml={1}
                  disabled={time_until_next_midround <= 0}
                  onClick={() => act('reset_midround_cooldown')}
                >
                  {t('dynamicadmin-reset-cooldown', {}, 'Reset Cooldown')}
                </Button>
              </Flex.Item>
            </Flex>
          </LabeledList.Item>
          <LabeledList.Item label={t('dynamicadmin-heavy-chance', {}, 'Heavy Midround Chance')}>
            <Flex>
              <Flex.Item>
                <Box
                  inline
                  style={{
                    borderBottom: '2px dotted rgba(255, 255, 255, 0.8)',
                  }}
                >
                  <Tooltip content={t('dynamicadmin-heavy-chance-tip', {}, 'Chance of a heavy midround ruleset being selected on next dynamic tick')}>
                    {heavy_midround_chance}%
                  </Tooltip>
                </Box>
              </Flex.Item>
              <Flex.Item>
                <Button ml={1} onClick={() => act('max_heavy_chance')}>
                  {heavy_chance_maxxed ? t('dynamicadmin-reset', {}, 'Reset') : t('dynamicadmin-set-max', {}, 'Set to 100%')}
                </Button>
              </Flex.Item>
            </Flex>
          </LabeledList.Item>
        </>
      )}
      {time_until_latejoins > 0 ? (
        <LabeledList.Item label={t('dynamicadmin-latejoin-start', {}, 'Latejoin Start')}>
          <Flex>
            <Flex.Item>
              <Box>{formatTime(time_until_latejoins, t)}</Box>
            </Flex.Item>
            <Flex.Item>
              <Button ml={1} onClick={() => act('latejoin_start_now')}>
                {t('dynamicadmin-start-now', {}, 'Start Now')}
              </Button>
            </Flex.Item>
          </Flex>
        </LabeledList.Item>
      ) : (
        <>
          <LabeledList.Item label={t('dynamicadmin-latejoin-cooldown', {}, 'Latejoin Cooldown')}>
            <Flex>
              <Flex.Item>
                <Box>
                  {time_until_next_latejoin
                    ? formatTime(time_until_next_latejoin, t)
                    : t('dynamicadmin-next-latejoin', {}, 'Next latejoin')}
                </Box>
              </Flex.Item>
              <Flex.Item>
                <Button
                  ml={1}
                  disabled={time_until_next_latejoin <= 0}
                  onClick={() => act('reset_latejoin_cooldown')}
                >
                  {t('dynamicadmin-reset-cooldown', {}, 'Reset Cooldown')}
                </Button>
              </Flex.Item>
            </Flex>
          </LabeledList.Item>
          <LabeledList.Item label={t('dynamicadmin-latejoin-chance', {}, 'Latejoin Chance')}>
            <Flex>
              <Flex.Item>
                <Box
                  inline
                  style={{
                    borderBottom: '2px dotted rgba(255, 255, 255, 0.8)',
                  }}
                >
                  <Tooltip
                    content={t('dynamicadmin-latejoin-chance-tip', {}, 'Chance the next person who joins the game will be selected for a latejoin ruleset. Note this does not GUARANTEE a latejoin ruleset is run - if it fails, the chance will increase for the next player who joins.')}
                  >
                    {t(
                      'dynamicadmin-latejoin-chance-value',
                      { chance: latejoin_chance, failed: failed_latejoins },
                      `${latejoin_chance}% (${failed_latejoins} failed attempts)`,
                    )}
                  </Tooltip>
                </Box>
              </Flex.Item>
              <Flex.Item>
                <Button ml={1} onClick={() => act('max_latejoin_chance')}>
                  {latejoin_chance_maxxed ? t('dynamicadmin-reset', {}, 'Reset') : t('dynamicadmin-set-max', {}, 'Set to 100%')}
                </Button>
              </Flex.Item>
            </Flex>
          </LabeledList.Item>
        </>
      )}
    </LabeledList>
  );
};

// This just reports the entire config
const ConfigPanel = () => {
  const { data } = useBackend<Data>();
  const t = useT();
  const { full_config = {} } = data;

  const configKeys = Object.keys(full_config);
  const [shownConfig, setShownConfig] = useState(configKeys[0]);
  // Config given to us is basically just a big json object
  // Future TODO make this a whole functional config editor

  if (configKeys.length === 0) {
    return (
      <NoticeBox>
        {t('dynamicadmin-config-empty', {}, 'No config loaded - refer to repo defaults for reference.')}
      </NoticeBox>
    );
  }

  return (
    <Stack vertical fill>
      <Stack.Item>
        <NoticeBox>
          {t('dynamicadmin-config-hint', {}, 'This is the current config read by the dynamic system when running rulesets. If you want to edit these values temporarily, you can do so via View Variables. (Note: Editing tier configs has no effect after roundstart)')}
        </NoticeBox>
      </Stack.Item>
      <Stack.Item>
        <Dropdown
          options={configKeys}
          selected={shownConfig}
          onSelected={(key) => setShownConfig(key)}
        />
      </Stack.Item>
      <Stack.Item height="180px">
        <Section fill scrollable>
          <LabeledList>
            {Object.entries(full_config[shownConfig]).map(
              ([config_name, config]) => (
                <LabeledList.Item key={config_name} label={config_name}>
                  <Box
                    style={{
                      wordBreak: 'break-all',
                      wordWrap: 'break-word',
                    }}
                  >
                    {JSON.stringify(config)}
                  </Box>
                </LabeledList.Item>
              ),
            )}
          </LabeledList>
        </Section>
      </Stack.Item>
    </Stack>
  );
};

// This is where you can see queued rulesets, active rulesets, and trigger new ones
const RulesetsPanel = () => {
  const { data, act } = useBackend<Data>();
  const t = useT();
  const { all_rulesets, queued_rulesets, active_rulesets, roundstarted } = data;

  const any_admin_disabled = Object.values(all_rulesets).some((ruleset_list) =>
    ruleset_list.some((ruleset) => ruleset.admin_disabled),
  );
  const all_admin_disabled = Object.values(all_rulesets).every((ruleset_list) =>
    ruleset_list.every((ruleset) => ruleset.admin_disabled),
  );

  const [searchText, setSearchText] = useState('');
  const searchFilter = createSearch(
    searchText,
    (ruleset: RulesetType) => ruleset.name,
  );

  return (
    <Stack vertical fill>
      <Stack.Item>
        <Section title={t('dynamicadmin-queued', {}, 'Queued Rulesets')}>
          <Stack vertical>
            {queued_rulesets.length === 0 ? (
              <Stack.Item grow>
                <NoticeBox align="center">{t('dynamicadmin-queued-empty', {}, 'No rulesets queued.')}</NoticeBox>
              </Stack.Item>
            ) : (
              queued_rulesets.map((ruleset) => (
                <Stack.Item key={ruleset.id}>
                  <Button
                    mr={0.5}
                    icon="times"
                    tooltip={t('dynamicadmin-queue-remove', {}, 'Remove from queue')}
                    onClick={() =>
                      act('remove_queued_ruleset', {
                        ruleset_index: ruleset.index,
                      })
                    }
                  />
                  {ruleset.name} ({ruleset.id})
                </Stack.Item>
              ))
            )}
          </Stack>
        </Section>
      </Stack.Item>
      <Stack.Divider />
      <Stack.Item>
        <Section title={t('dynamicadmin-active', {}, 'Active Rulesets')}>
          <Stack vertical>
            {active_rulesets.length === 0 ? (
              <Stack.Item grow>
                <NoticeBox align="center">{t('dynamicadmin-active-empty', {}, 'No rulesets active.')}</NoticeBox>
              </Stack.Item>
            ) : (
              active_rulesets.map((ruleset) => (
                <Stack.Item key={ruleset.id}>
                  <Flex>
                    <Flex.Item
                      style={
                        ruleset.hidden
                          ? { textDecoration: 'line-through' }
                          : undefined
                      }
                    >
                      {ruleset.name} ({ruleset.id})
                    </Flex.Item>
                    <Flex.Item ml={1}>
                      <Button.Checkbox
                        checked={ruleset.hidden}
                        icon="times"
                        tooltip={t('dynamicadmin-hide-tip', {}, 'If checked, this ruleset will not show in the roundend report.')}
                        onClick={() =>
                          act('hide_ruleset', {
                            ruleset_index: ruleset.index,
                          })
                        }
                      />
                    </Flex.Item>
                  </Flex>
                  <BlockQuote>
                    {t(
                      'dynamicadmin-selected',
                      {
                        players: getPlayerString(ruleset.selected_players, t),
                      },
                      'Selected',
                    )}
                  </BlockQuote>
                </Stack.Item>
              ))
            )}
          </Stack>
        </Section>
      </Stack.Item>
      <Stack.Divider />
      <Stack.Item height="330px">
        <Section
          fill
          title={t('dynamicadmin-available', {}, 'Available Rulesets')}
          scrollable
          buttons={
            <>
              <Input
                placeholder={t('dynamicadmin-search', {}, 'Search for ruleset...')}
                onChange={setSearchText}
                expensive
                value={searchText}
              />
              <Button
                disabled={all_admin_disabled}
                onClick={() => act('disable_all')}
              >
                {t('dynamicadmin-disable-all', {}, 'Disable All')}
              </Button>
              <Button
                disabled={!any_admin_disabled}
                onClick={() => act('enable_all')}
              >
                {t('dynamicadmin-enable-all', {}, 'Enable All')}
              </Button>
            </>
          }
        >
          <Stack>
            {Object.entries(all_rulesets).map(
              ([ruleset_category, ruleset_list]) => (
                <Stack.Item key={ruleset_category} grow>
                  <Stack vertical>
                    <Stack.Item align="center">
                      <h4>{readableRulesesetCategory(ruleset_category, t)}</h4>
                    </Stack.Item>
                    {ruleset_list
                      .filter(searchFilter)
                      .sort((a, b) => (a.name > b.name ? 1 : -1))
                      .map((ruleset, index) => (
                        <Stack.Item key={ruleset.id}>
                          <Flex>
                            {ruleset_category === 'roundstart' ||
                            ruleset_category === 'latejoin' ? (
                              <Flex.Item>
                                <Button
                                  icon="plus"
                                  tooltip={
                                    ruleset_category === 'roundstart' &&
                                    roundstarted
                                      ? t('dynamicadmin-round-started', {}, 'Round already started!')
                                      : t('dynamicadmin-queue-add', {}, 'Add to queue')
                                  }
                                  tooltipPosition="right"
                                  disabled={
                                    ruleset_category === 'roundstart' &&
                                    roundstarted
                                  }
                                  onClick={() =>
                                    act('add_queued_ruleset', {
                                      ruleset_type: ruleset.typepath,
                                    })
                                  }
                                />
                              </Flex.Item>
                            ) : (
                              <Flex.Item>
                                <Button
                                  icon="play"
                                  tooltip={t('dynamicadmin-execute', {}, 'Execute this ruleset')}
                                  tooltipPosition="right"
                                  onClick={() =>
                                    act('execute_ruleset', {
                                      ruleset_type: ruleset.typepath,
                                    })
                                  }
                                />
                              </Flex.Item>
                            )}
                            {(ruleset_category !== 'roundstart' ||
                              !roundstarted) && (
                              <Flex.Item>
                                <Button.Checkbox
                                  ml={0.5}
                                  tooltipPosition="right"
                                  tooltip={t('dynamicadmin-disable-tip', {}, 'If checked, this ruleset will never run randomly.')}
                                  checked={ruleset.admin_disabled}
                                  color={
                                    ruleset.admin_disabled ? 'bad' : 'grey'
                                  }
                                  disabled={
                                    ruleset_category === 'roundstart' &&
                                    roundstarted
                                  }
                                  onClick={() =>
                                    act('disable_ruleset', {
                                      ruleset_type: ruleset.typepath,
                                    })
                                  }
                                />
                              </Flex.Item>
                            )}
                            <Flex.Item
                              style={{
                                borderBottom:
                                  '2px dotted rgba(255, 255, 255, 0.8)',
                              }}
                              ml={1}
                            >
                              <Tooltip
                                content={t(
                                  'dynamicadmin-ruleset-id',
                                  { id: ruleset.id },
                                  `ID: ${ruleset.id}`,
                                )}
                              >
                                {ruleset.name}
                              </Tooltip>
                            </Flex.Item>
                          </Flex>
                        </Stack.Item>
                      ))}
                  </Stack>
                </Stack.Item>
              ),
            )}
          </Stack>
        </Section>
      </Stack.Item>
    </Stack>
  );
};

enum TABS {
  Status = 'Status',
  Rulesets = 'Rulesets',
  Config = 'Config',
}

export const DynamicAdmin = () => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { config_even_enabled, antag_events_enabled } = data;

  // disable config tab if config_even_enabled is false
  const tabs_filtered = Object.keys(TABS).filter(
    (tab) => tab !== TABS.Config || config_even_enabled,
  );

  const [currentTab, setCurrentTab] = useState(tabs_filtered[0]);

  let componentShown;

  switch (currentTab) {
    case TABS.Status:
      componentShown = <StatusPanel />;
      break;
    case TABS.Config:
      componentShown = <ConfigPanel />;
      break;
    case TABS.Rulesets:
      componentShown = <RulesetsPanel />;
      break;
    default:
      componentShown = <StatusPanel />;
  }

  return (
    <Window
      title={t('dynamicadmin-title', {}, 'Dynamic Admin Panel')}
      width={currentTab === TABS.Rulesets ? 800 : 500}
      height={currentTab === TABS.Rulesets ? 600 : 400}
    >
      <Window.Content>
        <Section
          title="&nbsp;"
          height="100%"
          width="100%"
          buttons={
            <>
              <Button.Checkbox
                checked={antag_events_enabled}
                tooltip={t('dynamicadmin-antag-events-tip', {}, 'If checked, random events that spawn antags or dynamic rulesets can trigger.')}
                onClick={() => act('toggle_antag_events')}
              >
                {t('dynamicadmin-antag-events', {}, 'Antag Events')}
              </Button.Checkbox>
              <Button
                tooltip={t('dynamicadmin-vv-tip', {}, 'Opens the Dynamic subsystem VV panel.')}
                onClick={() => act('dynamic_vv')}
              >
                VV
              </Button>
            </>
          }
        >
          <Tabs>
            {tabs_filtered.map((tab) => (
              <Tabs.Tab
                key={tab}
                selected={currentTab === tab}
                onClick={() => setCurrentTab(tab)}
              >
                {t(`dynamicadmin-tab-${tab.toLowerCase()}`, {}, tab)}
              </Tabs.Tab>
            ))}
          </Tabs>
          {componentShown}
        </Section>
      </Window.Content>
    </Window>
  );
};
