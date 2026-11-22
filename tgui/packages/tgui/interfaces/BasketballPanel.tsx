import { Button, NoticeBox, Section, Stack } from 'tgui-core/components';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type BasketballPanelData = {
  total_votes: number;
  players_min: number;
  players_max: number;
  lobbydata: {
    ckey: string;
    status: string;
  }[];
};

export const BasketballPanel = (props) => {
  const { act, data } = useBackend<BasketballPanelData>();
  const t = useT();

  return (
    <Window title={t('basketball-title', {}, 'Basketball')} width={650} height={580}>
      <Window.Content>
        <Stack fill vertical>
          <Stack.Item grow>
            <Section
              fill
              scrollable
              title={t('basketball-lobby', {}, 'Lobby')}
              buttons={
                <>
                  <Button
                    icon="clipboard-check"
                    tooltipPosition="bottom-start"
                    tooltip={t(
                      'basketball-signup-tooltip',
                      {},
                      'Signs you up for the next game. If there is an ongoing one, you will be signed up for the next.',
                    )}
                    content={t('basketball-signup', {}, 'Sign Up')}
                    onClick={() => act('basketball_signup')}
                  />
                  <Button
                    icon="basketball"
                    disabled={data.total_votes < data.players_min}
                    onClick={() => act('basketball_start')}
                  >
                    {t('basketball-start', {}, 'Start')}
                  </Button>
                </>
              }
            >
              <NoticeBox info>
                {t(
                  'basketball-lobby-info',
                  {
                    votes: data.total_votes,
                    min: data.players_min,
                    max: data.players_max,
                  },
                  `The lobby has ${data.total_votes} players signed up. The minigame is for ${data.players_min} to ${data.players_max} players.`,
                )}
              </NoticeBox>

              {data.lobbydata.map((lobbyist) => (
                <Stack
                  key={lobbyist.ckey}
                  className="candystripe"
                  p={1}
                  align="baseline"
                >
                  <Stack.Item grow>{lobbyist.ckey}</Stack.Item>
                  <Stack.Item>{t('basketball-status', {}, 'Status:')}</Stack.Item>
                  <Stack.Item
                    color={lobbyist.status === 'Ready' ? 'green' : 'red'}
                  >
                    {lobbyist.status}
                  </Stack.Item>
                </Stack>
              ))}
            </Section>
          </Stack.Item>
          <Stack.Item />
        </Stack>
      </Window.Content>
    </Window>
  );
};
