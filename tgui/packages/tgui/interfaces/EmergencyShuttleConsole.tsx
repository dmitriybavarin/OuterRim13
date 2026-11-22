import { Box, Button, Section, Stack } from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  authorizations_remaining: number;
  authorizations: Authorization[];
  emagged: BooleanLike;
  enabled: BooleanLike;
  engines_started: BooleanLike;
  timer_str: string;
};

type Authorization = {
  job: string;
  name: string;
};

export function EmergencyShuttleConsole(props) {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const {
    authorizations = [],
    authorizations_remaining,
    emagged,
    enabled,
    engines_started,
    timer_str,
  } = data;

  return (
    <Window width={400} height={350}>
      <Window.Content>
        <Section>
          <Box bold fontSize="40px" textAlign="center" fontFamily="monospace">
            {timer_str}
          </Box>
          <Box textAlign="center" fontSize="16px" mb={1}>
            <Box inline bold>
              {t('shuttleconsole-engines', {}, 'ENGINES:')}
            </Box>
            <Box inline color={engines_started ? 'good' : 'average'} ml={1}>
              {engines_started
                ? t('shuttleconsole-online', {}, 'Online')
                : t('shuttleconsole-idle', {}, 'Idle')}
            </Box>
          </Box>
          <Section
            title={t(
              'shuttleconsole-early-launch',
              {},
              'Early Launch Authorization',
            )}
            buttons={
              <Button
                color="bad"
                disabled={!enabled}
                icon="times"
                onClick={() => act('abort')}
              >
                {t('shuttleconsole-repeal-all', {}, 'Repeal All')}
              </Button>
            }
          >
            <Stack>
              <Stack.Item grow>
                <Button
                  color="good"
                  disabled={!enabled}
                  fluid
                  icon="exclamation-triangle"
                  onClick={() => act('authorize')}
                >
                  {t('shuttleconsole-authorize', {}, 'AUTHORIZE')}
                </Button>
              </Stack.Item>
              <Stack.Item grow>
                <Button
                  disabled={!enabled}
                  fluid
                  icon="minus"
                  onClick={() => act('repeal')}
                >
                  {t('shuttleconsole-repeal', {}, 'REPEAL')}
                </Button>
              </Stack.Item>
            </Stack>
            <Section
              title={t('shuttleconsole-authorizations', {}, 'Authorizations')}
              minHeight="150px"
              buttons={
                <Box inline bold color={emagged ? 'bad' : 'good'}>
                  {emagged
                    ? t('shuttleconsole-error', {}, 'ERROR')
                    : t(
                        'shuttleconsole-remaining',
                        { amount: authorizations_remaining },
                        `Remaining: ${authorizations_remaining}`,
                      )}
                </Box>
              }
            >
              {authorizations.length === 0 ? (
                <Box bold textAlign="center" fontSize="16px" color="average">
                  {t('shuttleconsole-none', {}, 'No Active Authorizations')}
                </Box>
              ) : (
                authorizations.map((authorization) => (
                  <Box
                    key={authorization.name}
                    bold
                    fontSize="16px"
                    className="candystripe"
                  >
                    {authorization.name} ({authorization.job})
                  </Box>
                ))
              )}
            </Section>
          </Section>
        </Section>
      </Window.Content>
    </Window>
  );
}
