import {
  Button,
  LabeledList,
  NumberInput,
  Section,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  on: BooleanLike;
  rate: number;
  max_heat_transfer_rate: number;
};

export const AtmosTempPump = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { on, rate, max_heat_transfer_rate } = data;

  return (
    <Window width={335} height={115}>
      <Window.Content>
        <Section>
          <LabeledList>
            <LabeledList.Item label={t('atmos-power', {}, 'Power')}>
              <Button
                icon={on ? 'power-off' : 'times'}
                content={on ? t('atmos-on', {}, 'On') : t('atmos-off', {}, 'Off')}
                selected={on}
                onClick={() => act('power')}
              />
            </LabeledList.Item>
            <LabeledList.Item label={t('atmostemppump-heat-transfer-rate', {}, 'Heat transfer rate')}>
              <NumberInput
                animated
                value={rate}
                unit="%"
                width="75px"
                minValue={0}
                maxValue={max_heat_transfer_rate}
                step={1}
                onChange={(value) =>
                  act('rate', {
                    rate: value,
                  })
                }
              />
              <Button
                ml={1}
                icon="plus"
                content={t('atmos-max', {}, 'Max')}
                disabled={rate === max_heat_transfer_rate}
                onClick={() =>
                  act('rate', {
                    rate: 'max',
                  })
                }
              />
            </LabeledList.Item>
          </LabeledList>
        </Section>
      </Window.Content>
    </Window>
  );
};
