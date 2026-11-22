import { useState } from 'react';
import {
  Button,
  Dropdown,
  LabeledList,
  NoticeBox,
  ProgressBar,
  Section,
  Stack,
} from 'tgui-core/components';
import { toFixed } from 'tgui-core/math';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  transportId: string;
  controllerActive: number;
  controllerOperational: BooleanLike;
  travelDirection: number;
  destinationPlatform: string;
  idlePlatform: string;
  recoveryMode: BooleanLike;
  currentSpeed: number;
  currentLoad: number;
  statusSF: BooleanLike;
  statusCE: BooleanLike;
  statusES: BooleanLike;
  statusPD: BooleanLike;
  statusDR: BooleanLike;
  statusCL: BooleanLike;
  statusBS: BooleanLike;
  destinations: TramDestination[];
};

type TramDestination = {
  name: string;
  dest_icons: string[];
  id: number;
};

export const TramController = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();

  const {
    transportId,
    controllerActive,
    controllerOperational,
    travelDirection,
    destinationPlatform,
    idlePlatform,
    recoveryMode,
    currentSpeed,
    currentLoad,
    statusSF,
    statusCE,
    statusES,
    statusPD,
    statusDR,
    statusCL,
    statusBS,
    destinations = [],
  } = data;

  const [tripDestination, setTripDestination] = useState('');

  return (
    <Window title={t('tram-title', {}, 'Tram Controller')} width={778} height={327} theme="dark">
      <Window.Content>
        <Stack>
          <Stack.Item grow={4}>
            <Section title={t('tram-system-status', {}, 'System Status')}>
              <LabeledList>
                <LabeledList.Item label={t('tram-system-id', {}, 'System ID')}>
                  {transportId}
                </LabeledList.Item>
                <LabeledList.Item
                  label={t('tram-queue', {}, 'Controller Queue')}
                  color={controllerActive ? 'blue' : 'good'}
                >
                  {controllerActive
                    ? t('tram-processing', {}, 'Processing')
                    : t('tram-ready', {}, 'Ready')}
                </LabeledList.Item>
                <LabeledList.Item
                  label={t('tram-mechanical', {}, 'Mechanical Status')}
                  color={controllerOperational ? 'good' : 'bad'}
                >
                  {controllerOperational
                    ? t('tram-normal', {}, 'Normal')
                    : t('tram-fault', {}, 'Fault')}
                </LabeledList.Item>
                <LabeledList.Item
                  label={t('tram-processor-status', {}, 'Processor Status')}
                  color={recoveryMode ? 'average' : 'good'}
                >
                  {recoveryMode
                    ? t('tram-overload', {}, 'Overload')
                    : t('tram-normal', {}, 'Normal')}
                </LabeledList.Item>
                <LabeledList.Item label={t('tram-processor-load', {}, 'Processor Load')}>
                  <ProgressBar
                    value={currentLoad}
                    minValue={0}
                    maxValue={15}
                    ranges={{
                      good: [-Infinity, 5],
                      average: [5, 7.5],
                      bad: [7.5, Infinity],
                    }}
                  />
                </LabeledList.Item>
                <LabeledList.Item label={t('tram-speed', {}, 'Current Speed')}>
                  <ProgressBar
                    value={currentSpeed}
                    minValue={0}
                    maxValue={32}
                    ranges={{
                      good: [28, Infinity],
                      average: [24, 28],
                      bad: [0.1, 24],
                      white: [-Infinity, 0],
                    }}
                  >
                    {t(
                      'tram-speed-value',
                      { speed: toFixed(currentSpeed * 2.25, 0) },
                      `${toFixed(currentSpeed * 2.25, 0)} km/h`,
                    )}
                  </ProgressBar>
                </LabeledList.Item>
              </LabeledList>
            </Section>
            <Section title={t('tram-location', {}, 'Location Data')}>
              <LabeledList>
                <LabeledList.Item label={t('tram-direction', {}, 'Direction')}>
                  {travelDirection === 4
                    ? t('tram-outbound', {}, 'Outbound')
                    : t('tram-inbound', {}, 'Inbound')}
                </LabeledList.Item>
                <LabeledList.Item
                  label={t('tram-idle-platform', {}, 'Idle Platform')}
                  color={controllerActive ? '' : 'blue'}
                >
                  {idlePlatform}
                </LabeledList.Item>
                <LabeledList.Item
                  label={t('tram-destination-platform', {}, 'Destination Platform')}
                  color={controllerActive ? 'blue' : ''}
                >
                  {destinationPlatform}
                </LabeledList.Item>
              </LabeledList>
            </Section>
          </Stack.Item>
          <Stack.Item grow={6}>
            <Section title={t('tram-controls', {}, 'Controls')}>
              <NoticeBox>
                {t(
                  'tram-disclaimer',
                  {},
                  'Nanotrasen is not responsible for any injuries or fatalities caused by usage of the tram.',
                )}
              </NoticeBox>
              <Button
                icon="arrows-rotate"
                color="yellow"
                my={1}
                lineHeight={2}
                width="28%"
                minHeight={2}
                textAlign="center"
                onClick={() => act('reset', {})}
              >
                {t('tram-reset', {}, 'Reset/Enable')}
              </Button>
              <Button
                icon="square"
                color="bad"
                my={1}
                lineHeight={2}
                width="28%"
                minHeight={2}
                textAlign="center"
                onClick={() => act('estop', {})}
              >
                {t('tram-estop', {}, 'E-Stop/Disable')}
              </Button>
              <Button
                icon="play"
                color="green"
                disabled={statusES || statusSF}
                my={1}
                lineHeight={2}
                width="42%"
                minHeight={2}
                textAlign="center"
                onClick={() =>
                  act('dispatch', {
                    tripDestination: tripDestination,
                  })
                }
              >
                {t('tram-start', {}, 'Start: Destination')}
              </Button>
              <Dropdown
                width="98.5%"
                options={destinations.map((id) => id.name)}
                selected={tripDestination}
                placeholder={t('tram-pick', {}, 'Pick a Destination')}
                onSelected={(value) => setTripDestination(value)}
              />
              <Button
                icon="bars"
                color="blue"
                my={1}
                lineHeight={2}
                width="25%"
                minHeight={2}
                textAlign="center"
                onClick={() => act('dopen', {})}
              >
                {t('tram-open-doors', {}, 'Open Doors')}
              </Button>
              <Button
                icon="bars"
                color="blue"
                my={1}
                lineHeight={2}
                width="25%"
                minHeight={2}
                textAlign="center"
                onClick={() => act('dclose', {})}
              >
                {t('tram-close-doors', {}, 'Close Doors')}
              </Button>
              <Button
                icon="bars"
                color={statusBS ? 'good' : 'bad'}
                my={1}
                lineHeight={2}
                width="48%"
                minHeight={2}
                textAlign="center"
                onClick={() => act('togglesensors', {})}
              >
                {t('tram-bypass', {}, 'Bypass Door Sensors')}
              </Button>
            </Section>
            <Section title={t('tram-operational', {}, 'Operational')}>
              <Button
                color={statusES ? 'red' : 'transparent'}
                my={1}
                lineHeight={2}
                width="16%"
                minHeight={2}
                textAlign="center"
              >
                {t('tram-lamp-estop', {}, 'ESTOP')}
              </Button>
              <Button
                color={statusSF ? 'yellow' : 'transparent'}
                my={1}
                lineHeight={2}
                width="16%"
                minHeight={2}
                textAlign="center"
              >
                {t('tram-lamp-fault', {}, 'FAULT')}
              </Button>
              <Button
                color={statusCE ? 'teal' : 'transparent'}
                my={1}
                lineHeight={2}
                width="16%"
                minHeight={2}
                textAlign="center"
              >
                {t('tram-lamp-comms', {}, 'COMMS')}
              </Button>
              <Button
                color={statusPD ? 'blue' : 'transparent'}
                my={1}
                lineHeight={2}
                width="16%"
                minHeight={2}
                textAlign="center"
              >
                {t('tram-lamp-rqst', {}, 'RQST')}
              </Button>
              <Button
                color={statusDR ? 'transparent' : 'blue'}
                my={1}
                lineHeight={2}
                width="16%"
                minHeight={2}
                textAlign="center"
              >
                {t('tram-lamp-doors', {}, 'DOORS')}
              </Button>
              <Button
                color={statusCL ? 'blue' : 'transparent'}
                my={1}
                lineHeight={2}
                width="16%"
                minHeight={2}
                textAlign="center"
              >
                {t('tram-lamp-busy', {}, 'BUSY')}
              </Button>
            </Section>
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
};
