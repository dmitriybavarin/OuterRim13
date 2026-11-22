import { Button, Stack, Table } from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type CircuitAdminPanelData = {
  circuits: {
    ref: string;
    name: string;
    creator: string;
    has_inserter: BooleanLike;
  }[];
};

export const CircuitAdminPanel = (props) => {
  const { act, data } = useBackend<CircuitAdminPanelData>();
  const t = useT();

  return (
    <Window
      title={t('circuitadmin-title', {}, 'Circuit Admin Panel')}
      width={1200}
      height={500}
    >
      <Window.Content>
        <Stack vertical>
          <Stack.Item>
            <Stack>
              <Stack.Item grow />
              <Stack.Item>
                <Button
                  onClick={() => {
                    act('disable_circuit_sound');
                  }}
                >
                  {t(
                    'circuitadmin-disable-sound',
                    {},
                    'Disable all circuit sound emitters',
                  )}
                </Button>
              </Stack.Item>
            </Stack>
          </Stack.Item>
          <Stack.Item>
            <Table>
              <Table.Row header>
                <Table.Cell>
                  {t('circuitadmin-col-name', {}, 'Circuit name')}
                </Table.Cell>

                <Table.Cell>
                  {t('circuitadmin-col-creator', {}, 'Creator')}
                </Table.Cell>

                <Table.Cell>
                  {t('circuitadmin-col-actions', {}, 'Actions')}
                </Table.Cell>
              </Table.Row>

              {data.circuits.map((circuit) => {
                const createAct = (action: string) => () => {
                  act(action, { circuit: circuit.ref });
                };

                return (
                  <Table.Row key={circuit.ref}>
                    <Table.Cell>{circuit.name}</Table.Cell>

                    <Table.Cell>{circuit.creator}</Table.Cell>

                    <Table.Cell>
                      <Button onClick={createAct('follow_circuit')}>
                        {t('circuitadmin-follow', {}, 'Follow')}
                      </Button>

                      <Button onClick={createAct('open_circuit')}>
                        {t('circuitadmin-open', {}, 'Open')}
                      </Button>

                      <Button onClick={createAct('vv_circuit')}>
                        {t('circuitadmin-vv', {}, 'VV')}
                      </Button>

                      <Button onClick={createAct('save_circuit')}>
                        {t('circuitadmin-save', {}, 'Save')}
                      </Button>

                      <Button onClick={createAct('duplicate_circuit')}>
                        {t('circuitadmin-duplicate', {}, 'Duplicate')}
                      </Button>

                      {!!circuit.has_inserter && (
                        <Button onClick={createAct('open_player_panel')}>
                          {t('circuitadmin-player-panel', {}, 'Player Panel')}
                        </Button>
                      )}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table>
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
};
