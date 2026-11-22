import { LabeledList, NumberInput } from 'tgui-core/components';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  chem_temp: number;
  target_temperature: number;
  max_volume: number;
  acclimate_state: string;
};

const States = ['Filling', 'Heating', 'Cooling', 'Emptying'] as const;

export const ChemAcclimator = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { chem_temp, target_temperature, max_volume, acclimate_state } = data;
  const state = States[acclimate_state];

  return (
    <Window width={320} height={130}>
      <Window.Content>
        <LabeledList>
          <LabeledList.Item label={t('chemacclimator-current-temperature', {}, 'Current Temperature')}>
            {chem_temp} K
          </LabeledList.Item>
          <LabeledList.Item label={t('chemacclimator-target-temperature', {}, 'Target Temperature')}>
            <NumberInput
              value={target_temperature}
              unit="K"
              width="59px"
              minValue={0}
              maxValue={1000}
              step={5}
              stepPixelSize={2}
              onChange={(value) =>
                act('set_target_temperature', {
                  temperature: value,
                })
              }
            />
          </LabeledList.Item>
          <LabeledList.Item label={t('chemacclimator-buffer', {}, 'Buffer')}>
            <NumberInput
              value={max_volume}
              unit="u"
              width="50px"
              minValue={1}
              maxValue={200}
              step={2}
              stepPixelSize={2}
              onChange={(value) =>
                act('change_volume', {
                  volume: value,
                })
              }
            />
          </LabeledList.Item>
          <LabeledList.Item label={t('chemacclimator-current-state', {}, 'Current State')}>
            {state &&
              t(`chemacclimator-state-${state.toLowerCase()}`, {}, state)}
          </LabeledList.Item>
        </LabeledList>
      </Window.Content>
    </Window>
  );
};
