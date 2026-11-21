import { filter } from 'es-toolkit/compat';
import { useState } from 'react';
import { useBackend } from 'tgui/backend';
import {
  Box,
  Button,
  Floating,
  Icon,
  Input,
  Stack,
  Tooltip,
} from 'tgui-core/components';
import { classes } from 'tgui-core/react';
import { createSearch } from 'tgui-core/string';

import { slugify, useT } from '../../../i18n';
import {
  type PreferencesMenuData,
  type Quirk,
  RandomSetting,
  type ServerData,
} from '../types';
import { useRandomToggleState } from '../useRandomToggleState';
import { useServerPrefs } from '../useServerPrefs';
import { getRandomization, PreferenceList } from './MainPage';
import { PersonalityPage } from './PersonalityPage';
import { requirementText, StatsPanel } from './StatsPanel';

type Translate = ReturnType<typeof useT>;

function quirkName(t: Translate, quirk: Quirk): string {
  return t(`quirk-${slugify(quirk.name)}-name`, {}, quirk.name);
}

function quirkDescription(t: Translate, quirk: Quirk): string {
  return t(`quirk-${slugify(quirk.name)}-desc`, {}, quirk.description);
}

function getColorValueClass(quirk: Quirk) {
  if (quirk.value > 0) {
    return 'positive';
  } else if (quirk.value < 0) {
    return 'negative';
  } else {
    return 'neutral';
  }
}

function getCorrespondingPreferences(
  customization_options: string[],
  relevant_preferences: Record<string, string> = {},
) {
  return Object.fromEntries(
    filter(Object.entries(relevant_preferences), ([key, value]) =>
      customization_options.includes(key),
    ),
  );
}

type QuirkView = Quirk & {
  failTooltip?: string;
  dim?: boolean;
  requirementText?: string;
};

type QuirkEntry = [string, QuirkView];

type QuirkListProps = {
  quirks: QuirkEntry[];
};

type QuirkProps = {
  handleClick: (quirkName: string, quirk: Quirk) => void;
  randomBodyEnabled: boolean;
  selected: boolean;
  serverData: ServerData;
  quirkActionLocked: boolean;
  compact?: boolean;
};

function Chip(props: { label: string; value: string }) {
  return (
    <span className="PreferencesMenu__Quirks__chip">
      <span className="PreferencesMenu__Quirks__chip__label">{props.label}</span>
      <span className="PreferencesMenu__Quirks__chip__value">{props.value}</span>
    </span>
  );
}

function QuirkList(props: QuirkProps & QuirkListProps) {
  const {
    quirks = [],
    selected,
    handleClick,
    serverData,
    randomBodyEnabled,
    quirkActionLocked,
  } = props;

  return (
    <Stack vertical g={0.5} className="PreferencesMenu__Quirks__QuirkList">
      {quirks.map(([quirkKey, quirk]) => (
        <Stack.Item key={quirkKey}>
          <QuirkDisplay
            handleClick={handleClick}
            quirk={quirk}
            quirkKey={quirkKey}
            randomBodyEnabled={randomBodyEnabled}
            selected={selected}
            serverData={serverData}
            quirkActionLocked={quirkActionLocked}
          />
        </Stack.Item>
      ))}
    </Stack>
  );
}

type QuirkDisplayProps = {
  quirk: QuirkView;
  // bugged
  quirkKey: string;
} & QuirkProps;

function QuirkDisplay(props: QuirkDisplayProps) {
  const { quirk, quirkKey, handleClick, selected, quirkActionLocked, compact } =
    props;
  const { icon, value, customizable, failTooltip, dim } = quirk;
  const t = useT();
  const name = quirkName(t, quirk);
  const description = quirkDescription(t, quirk);

  const [customizationExpanded, setCustomizationExpanded] = useState(false);

  const base = 'PreferencesMenu__Quirks__quirk';
  const popper = !!customizable && selected && (
    <QuirkPopper
      {...props}
      customizationExpanded={customizationExpanded}
      setCustomizationExpanded={setCustomizationExpanded}
    />
  );

  const child = (
    <div
      className={classes([
        base,
        `${base}--${getColorValueClass(quirk)}`,
        compact && `${base}--compact`,
      ])}
      style={{
        opacity: quirkActionLocked ? 0.6 : dim ? 0.5 : 1,
        pointerEvents: quirkActionLocked ? 'none' : 'auto',
      }}
      onClick={() => {
        if (quirkActionLocked) {
          return;
        }
        if (selected) {
          setCustomizationExpanded(false);
        }
        handleClick(quirkKey, quirk);
      }}
    >
      <div className={`${base}__icon`}>
        <Icon name={icon} />
      </div>
      <div className={`${base}__body`}>
        <div className={`${base}__head`}>
          <div className={`${base}__name`}>{name}</div>
          {popper}
          <div className={`${base}__cost`}>
            {value > 0 ? `+${value}` : value}
          </div>
        </div>
        <div className={`${base}__desc`}>{description}</div>
        {!!quirk.requirementText && (
          <div className={`${base}__requirement`}>{quirk.requirementText}</div>
        )}
      </div>
    </div>
  );

  if (failTooltip) {
    return <Tooltip content={failTooltip}>{child}</Tooltip>;
  }
  if (compact) {
    return <Tooltip content={description}>{child}</Tooltip>;
  }
  return child;
}

type QuirkPopperProps = {
  customizationExpanded: boolean;
  setCustomizationExpanded: (expanded: boolean) => void;
} & QuirkDisplayProps;

function QuirkPopper(props: QuirkPopperProps) {
  const { act, data } = useBackend<PreferencesMenuData>();
  const t = useT();
  const {
    customizationExpanded,
    quirk,
    randomBodyEnabled,
    selected,
    serverData,
    setCustomizationExpanded,
  } = props;

  const { customizable, customization_options } = quirk;

  const { character_preferences } = data;

  const hasExpandableCustomization =
    customizable &&
    selected &&
    customization_options &&
    Object.entries(customization_options).length > 0;

  return (
    <Floating
      stopChildPropagation
      placement="bottom-end"
      onOpenChange={setCustomizationExpanded}
      content={
        hasExpandableCustomization && (
          <Box
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{
              boxShadow: '0px 4px 8px 3px rgba(0, 0, 0, 0.7)',
            }}
          >
            <Stack maxWidth="300px" backgroundColor="black" px="5px" py="3px">
              <Stack.Item>
                <PreferenceList
                  preferences={getCorrespondingPreferences(
                    customization_options,
                    character_preferences.manually_rendered_features,
                  )}
                  randomizations={getRandomization(
                    getCorrespondingPreferences(
                      customization_options,
                      character_preferences.manually_rendered_features,
                    ),
                    serverData,
                    randomBodyEnabled,
                  )}
                  maxHeight="100px"
                />
              </Stack.Item>
            </Stack>
          </Box>
        )
      }
    >
      <div>
        <Button
          selected={customizationExpanded}
          icon="cog"
          tooltip={t('quirks-customize', {}, 'Customize')}
        />
      </div>
    </Floating>
  );
}

type QuirkFilter = 'all' | 'positive' | 'negative' | 'available';

function QuirkPage() {
  const { act, data } = useBackend<PreferencesMenuData>();
  const t = useT();

  const [randomToggleEnabled] = useRandomToggleState();
  const randomBodyEnabled =
    data.character_preferences.non_contextual.random_body !==
      RandomSetting.Disabled || randomToggleEnabled;

  const selectedQuirks = data.selected_quirks;
  function setSelectedQuirks(selected_quirks) {
    data.selected_quirks = selected_quirks;
  }

  const [quirkActionLocked, setQuirkActionLocked] = useState(false);

  function withQuirkDebounce(debounce: () => void, delay = 200) {
    if (quirkActionLocked) return;

    setQuirkActionLocked(true);
    debounce();

    setTimeout(() => {
      setQuirkActionLocked(false);
    }, delay);
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<QuirkFilter>('all');
  const server_data = useServerPrefs();
  if (!server_data) return;
  const quirkSearch = createSearch(
    searchQuery,
    (quirk: Quirk) => `${quirk.name} ${quirkName(t, quirk)}`,
  );
  const {
    quirk_blacklist: quirkBlacklist,
    quirk_info: quirkInfo,
    quirk_slots: quirkSlots,
    stat_default: statDefault,
    max_positive_quirks: maxPositiveQuirks,
    points_enabled: pointsEnabled,
  } = server_data.quirks;
  const stats = data.stats ?? {};

  const quirks = Object.entries(quirkInfo);
  quirks.sort(([_, quirkA], [__, quirkB]) => {
    if (quirkA.value === quirkB.value) {
      return quirkName(t, quirkA) > quirkName(t, quirkB) ? 1 : -1;
    } else {
      return quirkA.value - quirkB.value;
    }
  });

  const filledSlots = selectedQuirks.filter((key) => !!quirkInfo[key]);
  const usedSlots = filledSlots.length;

  let balance = -(data.default_quirk_balance ?? 0);
  let positiveQuirks = 0;
  for (const key of filledSlots) {
    const value = quirkInfo[key].value;
    if (value > 0) {
      positiveQuirks += 1;
    }
    balance += value;
  }
  const pointsLeft = Math.max(0, -balance);
  const positiveLimited = maxPositiveQuirks > 0;

  function meetsStats(quirk: Quirk) {
    return Object.entries(quirk.stat_requirements ?? {}).every(
      ([id, value]) => (stats[id] ?? statDefault) >= value,
    );
  }

  function getReasonToNotAdd(quirkKey: string) {
    const quirk = quirkInfo[quirkKey];

    if (!meetsStats(quirk)) {
      return requirementText(t, quirk.stat_requirements);
    }

    if (usedSlots >= quirkSlots) {
      return t(
        'quirks-reason-slots-full',
        {},
        'All addition slots are taken. Click a filled slot to free it.',
      );
    }

    if (quirk.value > 0) {
      if (maxPositiveQuirks !== -1 && positiveQuirks >= maxPositiveQuirks) {
        return t(
          'quirks-reason-positive-limit',
          {},
          "You can't have any more positive quirks!",
        );
      }
      if (pointsEnabled && balance + quirk.value > 0) {
        return t(
          'quirks-reason-points',
          {},
          'Not enough points: take a negative quirk to balance this out.',
        );
      }
    }

    const selectedQuirkNames = filledSlots.map((key) => quirkInfo[key].name);

    for (const blacklist of quirkBlacklist) {
      if (blacklist.indexOf(quirk.name) === -1) {
        continue;
      }

      for (const incompatibleQuirk of blacklist) {
        if (
          incompatibleQuirk !== quirk.name &&
          selectedQuirkNames.indexOf(incompatibleQuirk) !== -1
        ) {
          const incompatibleInfo = Object.values(quirkInfo).find(
            (info) => info.name === incompatibleQuirk,
          );
          const incompatibleName = incompatibleInfo
            ? quirkName(t, incompatibleInfo)
            : incompatibleQuirk;
          return t(
            'quirks-reason-incompatible',
            { name: incompatibleName },
            `This is incompatible with ${incompatibleQuirk}!`,
          );
        }
      }
    }
    if (data.species_disallowed_quirks.includes(quirk.name)) {
      return t(
        'quirks-reason-species',
        {},
        'This quirk is incompatible with your selected species.',
      );
    }
    return;
  }

  function getReasonToNotRemove(quirkKey: string) {
    const quirk = quirkInfo[quirkKey];
    if (pointsEnabled && balance - quirk.value > 0) {
      return t(
        'quirks-reason-remove-first',
        {},
        'You need to remove a positive quirk first!',
      );
    }
    return;
  }

  function passesFilter(quirkKey: string) {
    const quirk = quirkInfo[quirkKey];
    switch (filterMode) {
      case 'positive':
        return quirk.value > 0;
      case 'negative':
        return quirk.value < 0;
      case 'available':
        return getReasonToNotAdd(quirkKey) === undefined;
      default:
        return true;
    }
  }

  const filters: [QuirkFilter, string][] = [
    ['all', t('quirks-filter-all', {}, 'All')],
    ['positive', t('quirks-filter-positive', {}, 'Positive')],
    ['negative', t('quirks-filter-negative', {}, 'Negative')],
    ['available', t('quirks-filter-available', {}, 'Available')],
  ];

  const slotIndexes: number[] = [];
  for (let i = 0; i < quirkSlots; i++) {
    slotIndexes.push(i);
  }

  return (
    <Stack fill g={2}>
      <Stack.Item basis="270px" shrink={0}>
        <StatsPanel />
      </Stack.Item>

      <Stack.Item grow basis={0}>
        <Stack vertical fill g={1}>
          <Stack.Item>
            <Stack align="center" wrap g={1}>
              <Stack.Item grow>
                <Box as="b" fontSize="1.3em">
                  {t('quirks-slots-title', {}, 'Additions')}
                </Box>
              </Stack.Item>
              <Stack.Item>
                <Chip
                  label={t('quirks-slots-label', {}, 'Slots')}
                  value={`${usedSlots} / ${quirkSlots}`}
                />
              </Stack.Item>
              {!!pointsEnabled && (
                <Stack.Item>
                  <Chip
                    label={t('quirks-points-label', {}, 'Points')}
                    value={`${pointsLeft}`}
                  />
                </Stack.Item>
              )}
              {positiveLimited && (
                <Stack.Item>
                  <Chip
                    label={t('quirks-positive-label', {}, 'Positive')}
                    value={t(
                      'quirks-positive-count',
                      { used: positiveQuirks, max: maxPositiveQuirks },
                      `${positiveQuirks} / ${maxPositiveQuirks}`,
                    )}
                  />
                </Stack.Item>
              )}
            </Stack>
          </Stack.Item>

          <Stack.Item>
            <Stack vertical g={0.5} className="PreferencesMenu__Quirks__Slots">
              {slotIndexes.map((index) => {
                const quirkKey = filledSlots[index];
                const quirk = quirkKey ? quirkInfo[quirkKey] : undefined;
                return (
                  <Stack.Item key={index}>
                    {quirk && quirkKey ? (
                      <QuirkDisplay
                        compact
                        handleClick={(name, q) => {
                          if (getReasonToNotRemove(name) !== undefined) {
                            return;
                          }
                          withQuirkDebounce(() => {
                            setSelectedQuirks(
                              selectedQuirks.filter((other) => name !== other),
                            );
                            act('remove_quirk', { quirk: q.name });
                          });
                        }}
                        quirk={{
                          ...quirk,
                          failTooltip: getReasonToNotRemove(quirkKey),
                          dim: getReasonToNotRemove(quirkKey) !== undefined,
                        }}
                        quirkKey={quirkKey}
                        randomBodyEnabled={randomBodyEnabled}
                        selected
                        serverData={server_data}
                        quirkActionLocked={quirkActionLocked}
                      />
                    ) : (
                      <div className="PreferencesMenu__Quirks__slotEmpty">
                        {t('quirks-slot-empty', {}, 'Empty slot')}
                      </div>
                    )}
                  </Stack.Item>
                );
              })}
            </Stack>
          </Stack.Item>

          <Stack.Item>
            <Stack align="center">
              <Stack.Item>
                <Box as="b" fontSize="1.3em">
                  {t('quirks-available', {}, 'Available Quirks')}
                </Box>
              </Stack.Item>
              <Stack.Item grow>
                <Input
                  fluid
                  placeholder={t(
                    'quirks-search-placeholder',
                    {},
                    'Search quirks...',
                  )}
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
              </Stack.Item>
            </Stack>
          </Stack.Item>

          <Stack.Item>
            <Stack>
              {filters.map(([mode, label]) => (
                <Stack.Item key={mode} grow>
                  <Button
                    fluid
                    align="center"
                    selected={filterMode === mode}
                    onClick={() => setFilterMode(mode)}
                  >
                    {label}
                  </Button>
                </Stack.Item>
              ))}
            </Stack>
          </Stack.Item>

          <Stack.Item grow style={{ minHeight: 0 }}>
            <QuirkList
              selected={false}
              quirkActionLocked={quirkActionLocked}
              handleClick={(quirkKey, quirk) => {
                if (getReasonToNotAdd(quirkKey) !== undefined) {
                  return;
                }

                withQuirkDebounce(() => {
                  setSelectedQuirks(selectedQuirks.concat(quirkKey));
                  act('give_quirk', { quirk: quirk.name });
                });
              }}
              quirks={quirks
                .filter(([quirkKey, _]) => {
                  return (
                    selectedQuirks.indexOf(quirkKey) === -1 &&
                    quirkSearch(quirkInfo[quirkKey]) &&
                    passesFilter(quirkKey)
                  );
                })
                .map(([quirkKey, quirk]): QuirkEntry => {
                  const reason = getReasonToNotAdd(quirkKey);
                  return [
                    quirkKey,
                    {
                      ...quirk,
                      failTooltip: reason,
                      dim: reason !== undefined,
                      requirementText: meetsStats(quirk)
                        ? undefined
                        : requirementText(t, quirk.stat_requirements),
                    },
                  ];
                })}
              serverData={server_data}
              randomBodyEnabled={randomBodyEnabled}
            />
          </Stack.Item>
        </Stack>
      </Stack.Item>
    </Stack>
  );
}

export function QuirkPersonalityPage() {
  const t = useT();
  const [contentPage, setContentPage] = useState<'quirks' | 'personality'>(
    'quirks',
  );

  return (
    <Stack fill vertical>
      <Stack.Item>
        <Stack>
          <Stack.Item grow>
            <Button
              selected={contentPage === 'quirks'}
              onClick={() => setContentPage('quirks')}
              fluid
              align="center"
              fontSize="14px"
            >
              {t('quirks-tab-quirks', {}, 'Quirks')}
            </Button>
          </Stack.Item>
          <Stack.Item grow>
            <Button
              selected={contentPage === 'personality'}
              onClick={() => setContentPage('personality')}
              fluid
              align="center"
              fontSize="14px"
            >
              {t('quirks-tab-personality', {}, 'Personality')}
            </Button>
          </Stack.Item>
        </Stack>
      </Stack.Item>
      <Stack.Item grow>
        {contentPage === 'personality' ? <PersonalityPage /> : <QuirkPage />}
      </Stack.Item>
    </Stack>
  );
}
