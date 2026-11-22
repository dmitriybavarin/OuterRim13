import {
  Button,
  Dropdown,
  Input,
  LabeledList,
  Section,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  loud: BooleanLike;
  name: string;
  on: BooleanLike;
  say_verb: string;
  selected: string;
  voices: string[];
};

export function AiVoiceChanger(props) {
  const { act, data } = useBackend<Data>();
  const { loud, name, on, say_verb, voices, selected } = data;
  const t = useT();

  return (
    <Window
      title={t('aivoice-title', {}, 'Voice changer settings')}
      width={400}
      height={200}
    >
      <Section fill>
        <LabeledList>
          <LabeledList.Item label={t('aivoice-power', {}, 'Power')}>
            <Button
              icon={on ? 'power-off' : 'times'}
              selected={!!on}
              onClick={() => act('power')}
            >
              {on ? t('aivoice-on', {}, 'On') : t('aivoice-off', {}, 'Off')}
            </Button>
          </LabeledList.Item>
          <LabeledList.Item label={t('aivoice-accent', {}, 'Accent')}>
            <Dropdown
              options={voices}
              onSelected={(value) => {
                act('look', {
                  look: value,
                });
              }}
              selected={selected}
            />
          </LabeledList.Item>
          <LabeledList.Item label={t('aivoice-verb', {}, 'Verb')}>
            <Input
              value={say_verb}
              onBlur={(value) =>
                act('verb', {
                  verb: value,
                })
              }
            />
          </LabeledList.Item>
          <LabeledList.Item label={t('aivoice-volume', {}, 'Volume')}>
            <Button
              icon={loud ? 'power-off' : 'times'}
              selected={!!loud}
              onClick={() => act('loud')}
            >
              {loud
                ? t('aivoice-loud-on', {}, 'Loudmode on')
                : t('aivoice-loud-off', {}, 'Loudmode Off')}
            </Button>
          </LabeledList.Item>
          <LabeledList.Item label={t('aivoice-fake-name', {}, 'Fake name')}>
            <Input
              value={name}
              onBlur={(value) =>
                act('name', {
                  name: value,
                })
              }
            />
          </LabeledList.Item>
        </LabeledList>
      </Section>
    </Window>
  );
}
