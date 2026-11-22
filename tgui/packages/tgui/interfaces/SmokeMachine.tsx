import {
  AnimatedNumber,
  Box,
  Button,
  LabeledList,
  ProgressBar,
  Section,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';
import type { Beaker } from './common/BeakerDisplay';

type Data = {
  active: BooleanLike;
  maxSetting: number;
  setting: number;
  tank: Beaker;
};

export const SmokeMachine = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { tank, active, setting, maxSetting } = data;

  return (
    <Window width={350} height={350}>
      <Window.Content>
        <Section
          title={t('smokemachine-dispersal-tank', {}, 'Dispersal Tank')}
          buttons={
            <Button
              icon={active ? 'power-off' : 'times'}
              selected={active}
              onClick={() => act('power')}
            >
              {active
                ? t('chemistry-on', {}, 'On')
                : t('chemistry-off', {}, 'Off')}
            </Button>
          }
        >
          <ProgressBar
            value={tank.currentVolume / tank.maxVolume}
            ranges={{
              bad: [-Infinity, 0.3],
            }}
          >
            <AnimatedNumber initial={0} value={tank.currentVolume || 0} />
            {` / ${tank.maxVolume}`}
          </ProgressBar>
          <Box mt={1}>
            <LabeledList>
              <LabeledList.Item label={t('smokemachine-range', {}, 'Range')}>
                {[1, 2, 3, 4, 5].map((amount) => (
                  <Button
                    disabled={maxSetting < amount}
                    icon="plus"
                    key={amount}
                    onClick={() => act('setting', { amount })}
                    selected={setting === amount}
                  >
                    {amount * 3}
                  </Button>
                ))}
              </LabeledList.Item>
            </LabeledList>
          </Box>
        </Section>
        <Section
          title={t('smokemachine-contents', {}, 'Contents')}
          buttons={
            <Button icon="trash" onClick={() => act('purge')}>
              {t('smokemachine-purge', {}, 'Purge')}
            </Button>
          }
        >
          {tank.contents.map((chemical) => (
            <Box key={chemical.name} color="label">
              <AnimatedNumber initial={0} value={chemical.volume} />{' '}
              {t(
                'smokemachine-units-of',
                { name: chemical.name },
                'units of { $name }',
              )}
            </Box>
          ))}
        </Section>
      </Window.Content>
    </Window>
  );
};
