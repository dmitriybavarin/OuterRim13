import { BlockQuote, LabeledList, Section, Stack } from 'tgui-core/components';

import { useT } from '../i18n';
import { Window } from '../layouts';

const tipstyle = {
  color: 'white',
};

const noticestyle = {
  color: 'lightblue',
};

const TIPS = ['survive', 'hunt', 'abduct', 'reap'];

const POWERS = [
  'space_dive',
  'draining_slash',
  'cosmic_physiology',
  'unsettle',
  'cosmic_dash',
  'expand',
];

export const AntagInfoVoidwalker = (props) => {
  const t = useT();
  return (
    <Window width={660} height={660}>
      <Window.Content backgroundColor="#0d0d0d">
        <Stack fill>
          <Stack.Item width="50%">
            <Section fill>
              <Stack vertical fill>
                <Stack.Item fontSize="25px">
                  {t('antaginfo-voidwalker-title')}
                </Stack.Item>
                <Stack.Item>
                  <BlockQuote>{t('antaginfo-voidwalker-intro')}</BlockQuote>
                </Stack.Item>
                <Stack.Divider />
                <Stack.Item textColor="label">
                  {TIPS.map((tip, index) => (
                    <span key={tip}>
                      {index > 0 && (
                        <>
                          <br />
                          <br />
                        </>
                      )}
                      <span style={tipstyle}>
                        {t(`antaginfo-voidwalker-tip-${tip}-label`)}&ensp;
                      </span>
                      {t(`antaginfo-voidwalker-tip-${tip}`)}
                    </span>
                  ))}
                </Stack.Item>
              </Stack>
            </Section>
          </Stack.Item>
          <Stack.Item width="50%">
            <Section fill title={t('antaginfo-common-powers')}>
              <LabeledList>
                {POWERS.map((power) => (
                  <LabeledList.Item
                    key={power}
                    label={t(`antaginfo-voidwalker-power-${power}-name`)}
                  >
                    {t(`antaginfo-voidwalker-power-${power}-desc`)}
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
