import {
  Box,
  Button,
  Flex,
  Icon,
  Knob,
  LabeledControls,
  LabeledList,
  RoundGauge,
  Section,
  Tooltip,
} from 'tgui-core/components';
import { formatSiUnit } from 'tgui-core/format';
import { toFixed } from 'tgui-core/math';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

const formatPressure = (value: number) => {
  if (value < 10000) {
    return `${toFixed(value)} kPa`;
  }
  return formatSiUnit(value * 1000, 1, 'Pa');
};

type HoldingTank = {
  name: string;
  tankPressure: number;
};

type Data = {
  portConnected: BooleanLike;
  tankPressure: number;
  releasePressure: number;
  defaultReleasePressure: number;
  minReleasePressure: number;
  maxReleasePressure: number;
  hasHypernobCrystal: BooleanLike;
  cellCharge: number;
  pressureLimit: number;
  valveOpen: BooleanLike;
  holdingTank: HoldingTank;
  holdingTankLeakPressure: number;
  holdingTankFragPressure: number;
  shielding: BooleanLike;
  reactionSuppressionEnabled: BooleanLike;
};

export const Canister = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const {
    shielding,
    holdingTank,
    pressureLimit,
    valveOpen,
    tankPressure,
    releasePressure,
    defaultReleasePressure,
    minReleasePressure,
    maxReleasePressure,
    portConnected,
    cellCharge,
    hasHypernobCrystal,
    reactionSuppressionEnabled,
    holdingTankFragPressure,
    holdingTankLeakPressure,
  } = data;

  return (
    <Window width={350} height={335}>
      <Window.Content>
        <Flex direction="column" height="100%">
          <Flex.Item mb={1}>
            <Section
              title={t('canister-title', {}, 'Canister')}
              buttons={
                <>
                  <Button
                    icon={shielding ? 'power-off' : 'times'}
                    content={
                      shielding
                        ? t('canister-shielding-on', {}, 'Shielding-ON')
                        : t('canister-shielding-off', {}, 'Shielding-OFF')
                    }
                    selected={shielding}
                    onClick={() => act('shielding')}
                  />
                  <Button
                    icon="pencil-alt"
                    content={t('canister-relabel', {}, 'Relabel')}
                    onClick={() => act('relabel')}
                  />
                  <Button icon="palette" onClick={() => act('recolor')} />
                </>
              }
            >
              <LabeledControls>
                <LabeledControls.Item
                  minWidth="66px"
                  label={t('canister-pressure', {}, 'Pressure')}
                >
                  <RoundGauge
                    size={1.75}
                    value={tankPressure}
                    minValue={0}
                    maxValue={pressureLimit}
                    alertAfter={pressureLimit * 0.7}
                    ranges={{
                      good: [0, pressureLimit * 0.7],
                      average: [pressureLimit * 0.7, pressureLimit * 0.85],
                      bad: [pressureLimit * 0.85, pressureLimit],
                    }}
                    format={formatPressure}
                  />
                </LabeledControls.Item>
                <LabeledControls.Item label={t('canister-regulator', {}, 'Regulator')}>
                  <Box position="relative" left="-8px">
                    <Knob
                      size={1.25}
                      color={!!valveOpen && 'yellow'}
                      value={releasePressure}
                      unit="kPa"
                      minValue={minReleasePressure}
                      maxValue={maxReleasePressure}
                      step={5}
                      stepPixelSize={1}
                      onChange={(e, value) =>
                        act('pressure', {
                          pressure: value,
                        })
                      }
                    />
                    <Button
                      fluid
                      position="absolute"
                      top="-2px"
                      right="-20px"
                      color="transparent"
                      icon="fast-forward"
                      onClick={() =>
                        act('pressure', {
                          pressure: maxReleasePressure,
                        })
                      }
                    />
                    <Button
                      fluid
                      position="absolute"
                      top="16px"
                      right="-20px"
                      color="transparent"
                      icon="undo"
                      onClick={() =>
                        act('pressure', {
                          pressure: defaultReleasePressure,
                        })
                      }
                    />
                  </Box>
                </LabeledControls.Item>
                <LabeledControls.Item label={t('canister-valve', {}, 'Valve')}>
                  <Button
                    my={0.5}
                    width="50px"
                    lineHeight={2}
                    fontSize="11px"
                    color={
                      valveOpen ? (holdingTank ? 'caution' : 'danger') : null
                    }
                    content={
                      valveOpen
                        ? t('canister-valve-open', {}, 'Open')
                        : t('canister-valve-closed', {}, 'Closed')
                    }
                    onClick={() => act('valve')}
                  />
                </LabeledControls.Item>
                <LabeledControls.Item mr={1} label={t('canister-port', {}, 'Port')}>
                  <Tooltip
                    content={
                      portConnected
                        ? t('canister-connected', {}, 'Connected')
                        : t('canister-disconnected', {}, 'Disconnected')
                    }
                    position="top"
                  >
                    <Box position="relative">
                      <Icon
                        size={1.25}
                        name={portConnected ? 'plug' : 'times'}
                        color={portConnected ? 'good' : 'bad'}
                      />
                    </Box>
                  </Tooltip>
                </LabeledControls.Item>
              </LabeledControls>
            </Section>
            <Section>
              <LabeledList>
                <LabeledList.Item label={t('canister-cell-charge', {}, 'Cell Charge')}>
                  {cellCharge > 0 ? `${cellCharge}%` : t('canister-cell-missing', {}, 'Missing Cell')}
                </LabeledList.Item>
                {!!hasHypernobCrystal && (
                  <LabeledList.Item label={t('canister-suppression', {}, 'Reaction Suppression')}>
                    <Button
                      icon={reactionSuppressionEnabled ? 'snowflake' : 'times'}
                      content={
                        reactionSuppressionEnabled
                          ? t('canister-suppression-enabled', {}, 'Enabled')
                          : t('canister-suppression-disabled', {}, 'Disabled')
                      }
                      selected={reactionSuppressionEnabled}
                      onClick={() => act('reaction_suppression')}
                    />
                  </LabeledList.Item>
                )}
              </LabeledList>
            </Section>
          </Flex.Item>
          <Flex.Item grow={1}>
            <Section
              height="100%"
              title={t('canister-holding-tank', {}, 'Holding Tank')}
              buttons={
                !!holdingTank && (
                  <Button
                    icon="eject"
                    color={valveOpen && 'danger'}
                    content={t('canister-eject', {}, 'Eject')}
                    onClick={() => act('eject')}
                  />
                )
              }
            >
              {!!holdingTank && (
                <LabeledList>
                  <LabeledList.Item label={t('canister-label', {}, 'Label')}>
                    {holdingTank.name}
                  </LabeledList.Item>
                  <LabeledList.Item label={t('canister-pressure', {}, 'Pressure')}>
                    <RoundGauge
                      value={holdingTank.tankPressure}
                      minValue={0}
                      maxValue={holdingTankFragPressure * 1.15}
                      alertAfter={holdingTankLeakPressure}
                      ranges={{
                        good: [0, holdingTankLeakPressure],
                        average: [
                          holdingTankLeakPressure,
                          holdingTankFragPressure,
                        ],
                        bad: [
                          holdingTankFragPressure,
                          holdingTankFragPressure * 1.15,
                        ],
                      }}
                      format={formatPressure}
                      size={1.75}
                    />
                  </LabeledList.Item>
                </LabeledList>
              )}
              {!holdingTank && <Box color="average">
                  {t('canister-no-holding-tank', {}, 'No Holding Tank')}
                </Box>}
            </Section>
          </Flex.Item>
        </Flex>
      </Window.Content>
    </Window>
  );
};
