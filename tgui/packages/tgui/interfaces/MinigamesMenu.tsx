import { Button, Divider, Section, Stack } from 'tgui-core/components';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

export const MinigamesMenu = (props) => {
  const { act } = useBackend();
  const t = useT();

  return (
    <Window
      title={t('minigames-title', {}, 'Minigames Menu')}
      width={530}
      height={320}
    >
      <Window.Content>
        <Section
          title={t('minigames-select', {}, 'Select Minigame')}
          textAlign="center"
          fill
        >
          <Stack>
            <Stack.Item grow>
              <Button
                content={t('minigames-ctf', {}, 'CTF')}
                fluid
                fontSize={3}
                textAlign="center"
                lineHeight="3"
                onClick={() => act('ctf')}
              />
            </Stack.Item>
            <Stack.Item grow>
              <Button
                content={t('minigames-mafia', {}, 'Mafia')}
                fluid
                fontSize={3}
                textAlign="center"
                lineHeight="3"
                onClick={() => act('mafia')}
              />
            </Stack.Item>
          </Stack>
          <Divider />
          <Stack>
            <Stack.Item grow>
              <Button
                content={t('minigames-basketball', {}, 'Basketball')}
                fluid
                fontSize={3}
                textAlign="center"
                lineHeight="3"
                onClick={() => act('basketball')}
              />
            </Stack.Item>
            <Stack.Item grow>
              <Button
                content={t('minigames-deathmatch', {}, 'Deathmatch')}
                fluid
                fontSize={3}
                textAlign="center"
                lineHeight="3"
                onClick={() => act('deathmatch')}
              />
            </Stack.Item>
          </Stack>
        </Section>
      </Window.Content>
    </Window>
  );
};
