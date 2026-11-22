import {
  Box,
  Button,
  LabeledList,
  Modal,
  NumberInput,
  ProgressBar,
  Section,
  Stack,
} from 'tgui-core/components';
import { formatPower } from 'tgui-core/format';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type TurbineInfo = {
  connected: BooleanLike;
  active: BooleanLike;
  rpm: number;
  power: number;
  temp: number;
  integrity: number;
  max_rpm: number;
  max_temperature: number;
  regulator: number;
};

const TurbineDisplay = (props) => {
  const { act, data } = useBackend<TurbineInfo>();
  const t = useT();

  return (
    <Section
      title={t('turbine-status', {}, 'Status')}
      buttons={
        <Button
          icon={data.active ? 'power-off' : 'times'}
          selected={data.active}
          disabled={!!(data.rpm >= 1000)}
          onClick={() => act('toggle_power')}
        >
          {data.active
            ? t('turbine-online', {}, 'Online')
            : t('turbine-offline', {}, 'Offline')}
        </Button>
      }
    >
      <LabeledList>
        <LabeledList.Item label={t('turbine-intake-regulator', {}, 'Intake Regulator')}>
          <NumberInput
            animated
            tickWhileDragging
            value={data.regulator * 100}
            unit="%"
            step={1}
            minValue={1}
            maxValue={100}
            onChange={(value) =>
              act('regulate', {
                regulate: value * 0.01,
              })
            }
          />
        </LabeledList.Item>
        <LabeledList.Item label={t('turbine-integrity', {}, 'Turbine Integrity')}>
          <ProgressBar
            value={data.integrity}
            minValue={0}
            maxValue={100}
            ranges={{
              good: [60, 100],
              average: [40, 59],
              bad: [0, 39],
            }}
          />
        </LabeledList.Item>
        <LabeledList.Item label={t('turbine-speed', {}, 'Turbine Speed')}>
          {t('turbine-rpm', { value: data.rpm }, '{ $value } RPM')}
        </LabeledList.Item>
        <LabeledList.Item label={t('turbine-max-speed', {}, 'Max Turbine Speed')}>
          {t('turbine-rpm', { value: data.max_rpm }, '{ $value } RPM')}
        </LabeledList.Item>
        <LabeledList.Item label={t('turbine-input-temperature', {}, 'Input Temperature')}>
          {data.temp} K
        </LabeledList.Item>
        <LabeledList.Item label={t('turbine-max-temperature', {}, 'Max Temperature')}>
          {data.max_temperature} K
        </LabeledList.Item>
        <LabeledList.Item label={t('turbine-generated-power', {}, 'Generated Power')}>
          {formatPower(data.power)}
        </LabeledList.Item>
      </LabeledList>
    </Section>
  );
};

const OutOfService = (props) => {
  const t = useT();
  return (
    <Modal>
      <Stack fill vertical>
        <Stack.Item textAlign="center">
          <Box style={{ margin: 'auto' }} textAlign="center" width="300px">
            {t(
              'turbine-not-connected',
              {},
              'Parts not connected, close all mantainence panels/use a multitool on the rotor before trying again',
            )}
          </Box>
        </Stack.Item>
      </Stack>
    </Modal>
  );
};

export const TurbineComputer = (props) => {
  const { data } = useBackend<TurbineInfo>();

  return (
    <Window width={310} height={240}>
      <Window.Content>
        {data.connected ? <TurbineDisplay /> : <OutOfService />}
      </Window.Content>
    </Window>
  );
};
