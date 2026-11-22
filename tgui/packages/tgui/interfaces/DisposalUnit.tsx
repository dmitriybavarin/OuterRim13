import {
  Button,
  LabeledList,
  ProgressBar,
  Section,
} from 'tgui-core/components';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type DisposalUnitData = {
  flush: boolean;
  full_pressure: boolean;
  pressure_charging: boolean;
  panel_open: boolean;
  per: number;
  isai: boolean;
};

export const DisposalUnit = (props) => {
  const { act, data } = useBackend<DisposalUnitData>();
  const t = useT();
  const { flush, full_pressure, pressure_charging, panel_open, per, isai } =
    data;
  let stateColor: string;
  let stateText: string;
  if (full_pressure) {
    stateColor = 'good';
    stateText = t('disposal-ready', {}, 'Ready');
  } else if (panel_open) {
    stateColor = 'bad';
    stateText = t('disposal-power-disabled', {}, 'Power Disabled');
  } else if (pressure_charging) {
    stateColor = 'average';
    stateText = t('disposal-pressurizing', {}, 'Pressurizing');
  } else {
    stateColor = 'bad';
    stateText = t('disposal-off', {}, 'Off');
  }
  return (
    <Window width={300} height={180}>
      <Window.Content>
        <Section>
          <LabeledList>
            <LabeledList.Item label={t('disposal-state', {}, 'State')} color={stateColor}>
              {stateText}
            </LabeledList.Item>
            <LabeledList.Item label={t('disposal-pressure', {}, 'Pressure')}>
              <ProgressBar value={per} color="good" />
            </LabeledList.Item>
            <LabeledList.Item label={t('disposal-handle', {}, 'Handle')}>
              <Button
                icon={flush ? 'toggle-on' : 'toggle-off'}
                disabled={isai || panel_open}
                onClick={() => act(flush ? 'handle-0' : 'handle-1')}
              >
                {flush ? t('disposal-disengage', {}, 'Disengage') : t('disposal-engage', {}, 'Engage')}
              </Button>
            </LabeledList.Item>
            <LabeledList.Item label={t('disposal-eject', {}, 'Eject')}>
              <Button
                icon="sign-out-alt"
                disabled={isai}
                onClick={() => act('eject')}
              >
                {t('disposal-eject-contents', {}, 'Eject Contents')}
              </Button>
            </LabeledList.Item>
            <LabeledList.Item label={t('disposal-power', {}, 'Power')}>
              <Button
                icon="power-off"
                disabled={panel_open}
                selected={pressure_charging}
                onClick={() => act(pressure_charging ? 'pump-0' : 'pump-1')}
              />
            </LabeledList.Item>
          </LabeledList>
        </Section>
      </Window.Content>
    </Window>
  );
};
