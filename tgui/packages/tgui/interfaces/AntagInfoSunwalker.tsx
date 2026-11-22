import { BlockQuote, LabeledList, Section, Stack } from 'tgui-core/components';

import { useT } from '../i18n';
import { Window } from '../layouts';

const tipstyle = {
  color: 'white',
};

const noticestyle = {
  color: 'lightblue',
};

const POWERS = [
  'space_dive',
  'burning_slash',
  'burning_physiology',
  'stellar_charge',
];

export const AntagInfoSunwalker = (props) => {
  const t = useT();
  return (
    <Window width={660} height={300}>
      <Window.Content backgroundColor="#0d0d0d">
        <Stack fill>
          <Stack.Item width="40%">
            <Section fill>
              <Stack vertical fill>
                <Stack.Item fontSize="25px">
                  {t('antaginfo-sunwalker-title')}
                </Stack.Item>
                <Stack.Item>
                  <BlockQuote>{t('antaginfo-sunwalker-intro-1')}</BlockQuote>
                  <BlockQuote>{t('antaginfo-sunwalker-intro-2')}</BlockQuote>
                </Stack.Item>
                <Stack.Divider />
              </Stack>
            </Section>
          </Stack.Item>
          <Stack.Item width="60%">
            <Section fill title={t('antaginfo-common-powers')}>
              <LabeledList>
                {POWERS.map((power) => (
                  <LabeledList.Item
                    key={power}
                    label={t(`antaginfo-sunwalker-power-${power}-name`)}
                  >
                    {t(`antaginfo-sunwalker-power-${power}-desc`)}
                  </LabeledList.Item>
                ))}
              </LabeledList>
            </Section>
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
};
