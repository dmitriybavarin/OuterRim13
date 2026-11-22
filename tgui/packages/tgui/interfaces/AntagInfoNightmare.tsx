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
  'shadow_dance',
  'shadow_walk',
  'heart_of_darkness',
  'light_eater',
];

export const AntagInfoNightmare = (props) => {
  const t = useT();
  return (
    <Window width={620} height={380}>
      <Window.Content backgroundColor="#0d0d0d">
        <Stack fill>
          <Stack.Item width="46.2%">
            <Section fill>
              <Stack vertical fill>
                <Stack.Item fontSize="25px">
                  {t('antaginfo-nightmare-title')}
                </Stack.Item>
                <Stack.Item>
                  <BlockQuote>
                    {t('antaginfo-nightmare-intro-pre')}
                    <span style={noticestyle}>
                      &ensp;{t('antaginfo-nightmare-intro-light-eater')}
                    </span>{' '}
                    {t('antaginfo-nightmare-intro-post')}
                  </BlockQuote>
                </Stack.Item>
                <Stack.Divider />
                <Stack.Item textColor="label">
                  <span style={tipstyle}>
                    {t('antaginfo-nightmare-tip-1-label')}&ensp;
                  </span>
                  {t('antaginfo-nightmare-tip-1')}
                  <br />
                  <span style={tipstyle}>
                    {t('antaginfo-nightmare-tip-2-label')}&ensp;
                  </span>
                  {t('antaginfo-nightmare-tip-2')}
                  <br />
                  <span style={tipstyle}>
                    {t('antaginfo-nightmare-tip-3-label')}&ensp;
                  </span>
                  {t('antaginfo-nightmare-tip-3')}
                </Stack.Item>
              </Stack>
            </Section>
          </Stack.Item>
          <Stack.Item width="53%">
            <Section fill title={t('antaginfo-common-powers')}>
              <LabeledList>
                {POWERS.map((power) => (
                  <LabeledList.Item
                    key={power}
                    label={t(`antaginfo-nightmare-power-${power}-name`)}
                  >
                    {t(`antaginfo-nightmare-power-${power}-desc`)}
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
