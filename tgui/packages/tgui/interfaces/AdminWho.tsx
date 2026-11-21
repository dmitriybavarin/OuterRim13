import { useState } from 'react';
import { Box, Button, Input, Section, Stack, Table } from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useNumber, useT } from '../i18n';
import { Window } from '../layouts';

type AdminEntry = {
  key: string;
  rank?: string;
  fakekey?: string | null;
  afk?: BooleanLike;
  feedback?: BooleanLike;
  ref?: string;
  status?: string;
};

type Data = {
  is_admin: BooleanLike;
  admins: AdminEntry[];
};

const STATUS_KEYS: Record<string, string> = {
  observing: 'adminwho-status-observing',
  lobby_ready: 'adminwho-status-lobby-ready',
  lobby_unready: 'adminwho-status-lobby-unready',
  lobby: 'adminwho-status-lobby',
  playing: 'adminwho-status-playing',
};

const STATUS_FALLBACKS: Record<string, string> = {
  observing: 'Observing',
  lobby_ready: 'Lobby (Readied)',
  lobby_unready: 'Lobby (Not Readied)',
  lobby: 'Lobby',
  playing: 'Playing',
};

export function AdminWho() {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const windowWidth = useNumber('adminwho-window-width', 520);
  const windowHeight = useNumber('adminwho-window-height', 420);
  const [search, setSearch] = useState('');
  const isAdmin = !!data.is_admin;

  const admins = data.admins
    .filter(
      (admin) =>
        !search ||
        admin.key.toLowerCase().includes(search.toLowerCase()) ||
        (admin.rank ?? '').toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => a.key.localeCompare(b.key));

  return (
    <Window
      title={t('adminwho-title', {}, 'Current Admins')}
      width={windowWidth}
      height={windowHeight}
    >
      <Window.Content scrollable>
        <Stack vertical>
          {data.admins.length > 0 && (
            <Stack.Item>
              <Section>
                <Input
                  fluid
                  value={search}
                  placeholder={t('adminwho-search', {}, 'Search...')}
                  onChange={setSearch}
                />
              </Section>
            </Stack.Item>
          )}
          <Stack.Item>
            <Section
              title={
                data.admins.length > 0
                  ? t('adminwho-header', {}, 'Current Admins')
                  : t('adminwho-header-empty', {}, 'No Admins Currently Online')
              }
            >
              <Table>
                {admins.map((admin) => (
                  <Table.Row key={admin.ref ?? admin.key} className="candystripe">
                    <Table.Cell bold>
                      {admin.feedback ? (
                        <Button
                          icon="link"
                          tooltip={t(
                            'adminwho-feedback',
                            {},
                            'Open the feedback thread',
                          )}
                          onClick={() =>
                            act('open_feedback', { ref: admin.ref })
                          }
                        >
                          {admin.key}
                        </Button>
                      ) : (
                        admin.key
                      )}
                      {!!admin.fakekey && (
                        <Box inline italic ml={1} color="label">
                          {t(
                            'adminwho-fakekey',
                            { name: admin.fakekey },
                            `(as ${admin.fakekey})`,
                          )}
                        </Box>
                      )}
                    </Table.Cell>
                    {isAdmin && (
                      <>
                        <Table.Cell>{admin.rank}</Table.Cell>
                        <Table.Cell color="label">
                          {admin.status && STATUS_KEYS[admin.status]
                            ? t(
                                STATUS_KEYS[admin.status],
                                {},
                                STATUS_FALLBACKS[admin.status],
                              )
                            : null}
                        </Table.Cell>
                        <Table.Cell collapsing color="average">
                          {!!admin.afk && t('adminwho-afk', {}, 'AFK')}
                        </Table.Cell>
                      </>
                    )}
                  </Table.Row>
                ))}
              </Table>
              {!isAdmin && (
                <Box color="label" mt={1}>
                  {t(
                    'adminwho-no-admins-hint',
                    {},
                    'Adminhelps are also sent through TGS to services like IRC and Discord. If no admins are available in game, sending an adminhelp might still be noticed and responded to.',
                  )}
                </Box>
              )}
            </Section>
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
}
