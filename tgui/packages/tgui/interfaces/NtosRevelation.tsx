import { Button, LabeledList, Section } from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { NtosWindow } from '../layouts';

type Data = {
  armed: BooleanLike;
};

export const NtosRevelation = (props) => {
  const { act, data } = useBackend<Data>();
  const { armed } = data;
  const t = useT();

  return (
    <NtosWindow width={400} height={250}>
      <NtosWindow.Content>
        <Section>
          <Button.Input
            fluid
            buttonText={t('ntosrevelation-obfuscate', {}, 'Obfuscate Name...')}
            onCommit={(value) =>
              act('PRG_obfuscate', {
                new_name: value,
              })
            }
            mb={1}
          />
          <LabeledList>
            <LabeledList.Item
              label={t('ntosrevelation-payload-status', {}, 'Payload Status')}
              buttons={
                <Button
                  content={
                    armed
                      ? t('ntosrevelation-armed', {}, 'ARMED')
                      : t('ntosrevelation-disarmed', {}, 'DISARMED')
                  }
                  color={armed ? 'bad' : 'average'}
                  onClick={() => act('PRG_arm')}
                />
              }
            />
          </LabeledList>
          <Button
            fluid
            bold
            content={t('ntosrevelation-activate', {}, 'ACTIVATE')}
            textAlign="center"
            color="bad"
            disabled={!armed}
            onClick={() => act('PRG_activate')}
          />
        </Section>
      </NtosWindow.Content>
    </NtosWindow>
  );
};
