import { Box, Button, Icon, LabeledList, Section } from 'tgui-core/components';

import { useBackend } from '../backend';
import { slugify, useT } from '../i18n';
import { Window } from '../layouts';

type AirlockControllerData = {
  airlockState: string;
  sensorPressure: number;
  pumpStatus: string;
  interiorStatus: string;
  exteriorStatus: string;
};

type AirlockStatus = {
  primary: string;
  icon: string;
  color: string;
};

export const AirlockController = (props) => {
  const { data } = useBackend<AirlockControllerData>();
  const t = useT();
  const { airlockState, pumpStatus, interiorStatus, exteriorStatus } = data;
  const currentStatus: AirlockStatus = getAirlockStatus(airlockState, t);
  const nameToUpperCase = (str: string) =>
    str.replace(/^\w/, (c) => c.toUpperCase());
  const stateText = (status: string) =>
    t(`airlockctl-state-${slugify(status)}`, {}, nameToUpperCase(status));

  return (
    <Window width={500} height={190}>
      <Window.Content>
        <Section title={t('airlockctl-status', {}, 'Airlock Status')} buttons={<AirLockButtons />}>
          <LabeledList>
            <LabeledList.Item label={t('airlockctl-current', {}, 'Current Status')}>
              {currentStatus.primary}
            </LabeledList.Item>
            <LabeledList.Item label={t('airlockctl-pressure', {}, 'Chamber Pressure')}>
              <PressureIndicator currentStatus={currentStatus} />
            </LabeledList.Item>
            <LabeledList.Item label={t('airlockctl-pump', {}, 'Control Pump')}>
              {stateText(pumpStatus)}
            </LabeledList.Item>
            <LabeledList.Item label={t('airlockctl-interior', {}, 'Interior Door')}>
              <Box color={interiorStatus === 'open' && 'good'}>
                {stateText(interiorStatus)}
              </Box>
            </LabeledList.Item>
            <LabeledList.Item label={t('airlockctl-exterior', {}, 'Exterior Door')}>
              <Box color={exteriorStatus === 'open' && 'good'}>
                {stateText(exteriorStatus)}
              </Box>
            </LabeledList.Item>
          </LabeledList>
        </Section>
      </Window.Content>
    </Window>
  );
};

/** Displays the buttons on top of the window to cycle the airlock */
const AirLockButtons = (props) => {
  const { act, data } = useBackend<AirlockControllerData>();
  const t = useT();
  const { airlockState } = data;
  switch (airlockState) {
    case 'pressurize':
    case 'depressurize':
      return (
        <Button icon="stop-circle" onClick={() => act('abort')}>
          {t('airlockctl-abort', {}, 'Abort')}
        </Button>
      );
    case 'closed':
      return (
        <>
          <Button icon="lock-open" onClick={() => act('cycleInterior')}>
            {t('airlockctl-open-interior', {}, 'Open Interior Airlock')}
          </Button>
          <Button icon="lock-open" onClick={() => act('cycleExterior')}>
            {t('airlockctl-open-exterior', {}, 'Open Exterior Airlock')}
          </Button>
        </>
      );
    case 'inopen':
      return (
        <>
          <Button icon="lock" onClick={() => act('cycleClosed')}>
            {t('airlockctl-close-interior', {}, 'Close Interior Airlock')}
          </Button>
          <Button icon="sync" onClick={() => act('cycleExterior')}>
            {t('airlockctl-cycle-exterior', {}, 'Cycle to Exterior Airlock')}
          </Button>
        </>
      );
    case 'outopen':
      return (
        <>
          <Button icon="lock" onClick={() => act('cycleClosed')}>
            {t('airlockctl-close-exterior', {}, 'Close Exterior Airlock')}
          </Button>
          <Button icon="sync" onClick={() => act('cycleInterior')}>
            {t('airlockctl-cycle-interior', {}, 'Cycle to Interior Airlock')}
          </Button>
        </>
      );
    default:
      return null;
  }
};

/** Displays the numeric pressure alongside an icon for the user */
const PressureIndicator = (props) => {
  const { data } = useBackend<AirlockControllerData>();
  const t = useT();
  const { sensorPressure } = data;
  const {
    currentStatus: { icon, color },
  } = props;
  const spin = icon === 'fan';

  return (
    <Box color={color}>
      {sensorPressure} {t('airlockctl-kpa', {}, 'kPa')} {icon && <Icon name={icon} spin={spin} />}
    </Box>
  );
};

/** Displays the current status as two text strings, depending on door state. */
const getAirlockStatus = (
  airlockState,
  t: ReturnType<typeof useT>,
): AirlockStatus => {
  switch (airlockState) {
    case 'inopen':
      return {
        primary: t('airlockctl-st-inopen', {}, 'Interior Airlock Open'),
        icon: '',
        color: 'good',
      };
    case 'pressurize':
      return {
        primary: t('airlockctl-st-pressurize', {}, 'Cycling to Interior Airlock'),
        icon: 'fan',
        color: 'average',
      };
    case 'closed':
      return {
        primary: t('airlockctl-st-closed', {}, 'Inactive'),
        icon: '',
        color: 'white',
      };
    case 'depressurize':
      return {
        primary: t('airlockctl-st-depressurize', {}, 'Cycling to Exterior Airlock'),
        icon: 'fan',
        color: 'average',
      };
    case 'outopen':
      return {
        primary: t('airlockctl-st-outopen', {}, 'Exterior Airlock Open'),
        icon: 'exclamation-triangle',
        color: 'bad',
      };
    default:
      return {
        primary: t('airlockctl-st-unknown', {}, 'Unknown'),
        icon: '',
        color: 'average',
      };
  }
};
