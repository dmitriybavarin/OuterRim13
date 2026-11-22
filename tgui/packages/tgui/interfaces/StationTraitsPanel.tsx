import { filter, map } from 'es-toolkit/compat';
import { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Dropdown,
  Stack,
  Tabs,
} from 'tgui-core/components';
import { exhaustiveCheck } from 'tgui-core/exhaustive';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type CurrentStationTrait = {
  can_revert: BooleanLike;
  name: string;
  ref: string;
};

type ValidStationTrait = {
  name: string;
  path: string;
};

type StationTraitsData = {
  current_traits: CurrentStationTrait[];
  future_station_traits?: ValidStationTrait[];
  too_late_to_revert: BooleanLike;
  valid_station_traits: ValidStationTrait[];
};

enum Tab {
  SetupFutureStationTraits,
  ViewStationTraits,
}

const FutureStationTraitsPage = (props) => {
  const { act, data } = useBackend<StationTraitsData>();
  const { future_station_traits } = data;
  const t = useT();

  const [selectedTrait, setSelectedTrait] = useState<string>('');

  const traitsByName = Object.fromEntries(
    data.valid_station_traits.map((trait) => {
      return [trait.name, trait.path];
    }),
  );

  const traitNames = Object.keys(traitsByName);
  traitNames.sort();

  return (
    <Box>
      <Stack fill>
        <Stack.Item grow>
          <Dropdown
            onSelected={setSelectedTrait}
            options={traitNames}
            placeholder={t(
              'stationtraits-select',
              {},
              'Select trait to add...',
            )}
            selected={selectedTrait}
            width="100%"
          />
        </Stack.Item>

        <Stack.Item>
          <Button
            color="green"
            icon="plus"
            onClick={() => {
              if (!selectedTrait) {
                return;
              }

              const selectedPath = traitsByName[selectedTrait];

              let newStationTraits = [selectedPath];
              if (future_station_traits) {
                const selectedTraitPaths = future_station_traits.map(
                  (trait) => trait.path,
                );

                if (selectedTraitPaths.indexOf(selectedPath) !== -1) {
                  return;
                }

                newStationTraits = newStationTraits.concat(
                  ...selectedTraitPaths,
                );
              }

              act('setup_future_traits', {
                station_traits: newStationTraits,
              });
            }}
          >
            {t('stationtraits-add', {}, 'Add')}
          </Button>
        </Stack.Item>
      </Stack>

      <Divider />

      {Array.isArray(future_station_traits) ? (
        future_station_traits.length > 0 ? (
          <Stack vertical fill>
            {future_station_traits.map((trait) => (
              <Stack.Item key={trait.path}>
                <Stack fill>
                  <Stack.Item grow>{trait.name}</Stack.Item>

                  <Stack.Item>
                    <Button
                      color="red"
                      icon="times"
                      onClick={() => {
                        act('setup_future_traits', {
                          station_traits: filter(
                            map(future_station_traits, (x) => x.path),
                            (p) => p !== trait.path,
                          ),
                        });
                      }}
                    >
                      {t('stationtraits-delete', {}, 'Delete')}
                    </Button>
                  </Stack.Item>
                </Stack>
              </Stack.Item>
            ))}
          </Stack>
        ) : (
          <>
            <Box>
              {t(
                'stationtraits-none-next',
                {},
                'No station traits will run next round.',
              )}
            </Box>

            <Box>
              <Button
                color="red"
                icon="times"
                tooltip={t(
                  'stationtraits-normal-hint',
                  {},
                  'The next round will roll station traits randomly, just like normal',
                )}
                onClick={() => act('clear_future_traits')}
              >
                {t(
                  'stationtraits-normal',
                  {},
                  'Run Station Traits Normally',
                )}
              </Button>
            </Box>
          </>
        )
      ) : (
        <>
          <Box>
            {t(
              'stationtraits-none-planned',
              {},
              'No future station traits are planned.',
            )}
          </Box>

          <Box>
            <Button
              color="red"
              icon="times"
              onClick={() =>
                act('setup_future_traits', {
                  station_traits: [],
                })
              }
            >
              {t(
                'stationtraits-prevent',
                {},
                'Prevent station traits from running next round',
              )}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

const ViewStationTraitsPage = (props) => {
  const { act, data } = useBackend<StationTraitsData>();
  const t = useT();

  return data.current_traits.length > 0 ? (
    <Stack vertical fill>
      {data.current_traits.map((stationTrait) => (
        <Stack.Item key={stationTrait.ref}>
          <Stack fill>
            <Stack.Item grow>{stationTrait.name}</Stack.Item>

            <Stack.Item>
              <Button.Confirm
                content={t('stationtraits-revert', {}, 'Revert')}
                color="red"
                disabled={data.too_late_to_revert || !stationTrait.can_revert}
                tooltip={
                  (!stationTrait.can_revert &&
                    t(
                      'stationtraits-not-revertable',
                      {},
                      'This trait is not revertable.',
                    )) ||
                  (data.too_late_to_revert &&
                    t(
                      'stationtraits-too-late',
                      {},
                      "It's too late to revert station traits, the round has already started.",
                    ))
                }
                icon="times"
                onClick={() =>
                  act('revert', {
                    ref: stationTrait.ref,
                  })
                }
              />
            </Stack.Item>
          </Stack>
        </Stack.Item>
      ))}
    </Stack>
  ) : (
    <Box>
      {t('stationtraits-no-active', {}, 'There are no active station traits.')}
    </Box>
  );
};

export const StationTraitsPanel = (props) => {
  const t = useT();
  const [currentTab, setCurrentTab] = useState(Tab.ViewStationTraits);

  let currentPage;

  switch (currentTab) {
    case Tab.SetupFutureStationTraits:
      currentPage = <FutureStationTraitsPage />;
      break;
    case Tab.ViewStationTraits:
      currentPage = <ViewStationTraitsPage />;
      break;
    default:
      exhaustiveCheck(currentTab);
  }

  return (
    <Window title={t('stationtraits-title', {}, 'Modify Station Traits')} height={500} width={500}>
      <Window.Content scrollable>
        <Tabs>
          <Tabs.Tab
            icon="eye"
            selected={currentTab === Tab.ViewStationTraits}
            onClick={() => setCurrentTab(Tab.ViewStationTraits)}
          >
            {t('stationtraits-view', {}, 'View')}
          </Tabs.Tab>

          <Tabs.Tab
            icon="edit"
            selected={currentTab === Tab.SetupFutureStationTraits}
            onClick={() => setCurrentTab(Tab.SetupFutureStationTraits)}
          >
            {t('stationtraits-edit', {}, 'Edit')}
          </Tabs.Tab>
        </Tabs>

        <Divider />

        {currentPage}
      </Window.Content>
    </Window>
  );
};
