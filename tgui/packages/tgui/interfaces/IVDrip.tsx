import {
  Box,
  Button,
  LabeledList,
  NoticeBox,
  ProgressBar,
  Section,
  Slider,
  Tooltip,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type IVDripData = {
  hasInternalStorage: BooleanLike;
  hasContainer: BooleanLike;
  canRemoveContainer: BooleanLike;
  mode: BooleanLike;
  canDraw: BooleanLike;
  injectFromPlumbing: BooleanLike;
  canAdjustTransfer: BooleanLike;
  transferRate: number;
  transferStep: number;
  minTransferRate: number;
  maxTransferRate: number;
  hasObjectAttached: BooleanLike;
  objectName: string;
  containerReagentColor: string;
  containerCurrentVolume: number;
  containerMaxVolume: number;
};

enum MODE {
  drawing,
  injecting,
}

export const IVDrip = (props) => {
  const { act, data } = useBackend<IVDripData>();
  const t = useT();
  const {
    hasContainer,
    canRemoveContainer,
    mode,
    canDraw,
    hasInternalStorage,
    transferRate,
    transferStep,
    maxTransferRate,
    minTransferRate,
    hasObjectAttached,
    objectName,
    containerCurrentVolume,
    containerMaxVolume,
    containerReagentColor,
  } = data;
  return (
    <Window width={400} height={220}>
      <Window.Content>
        <Section fill>
          <LabeledList>
            <LabeledList.Item
              label={t('ivdrip-flow-rate', {}, 'Flow Rate')}
              buttons={
                <Box>
                  <Button
                    width={4}
                    lineHeight={2}
                    align="center"
                    icon="angles-left"
                    onClick={() =>
                      act('changeRate', {
                        rate: minTransferRate,
                      })
                    }
                  />
                  <Button
                    width={4}
                    lineHeight={2}
                    align="center"
                    icon="angles-right"
                    onClick={() =>
                      act('changeRate', {
                        rate: maxTransferRate,
                      })
                    }
                  />
                </Box>
              }
            >
              <Slider
                step={transferStep}
                my={1}
                value={transferRate}
                minValue={minTransferRate}
                maxValue={maxTransferRate}
                unit={t('ivdrip-unit-rate', {}, 'units/sec.')}
                onChange={(e, value) =>
                  act('changeRate', {
                    rate: value,
                  })
                }
              />
            </LabeledList.Item>
            <LabeledList.Item
              label={t('ivdrip-direction', {}, 'Direction')}
              color={!mode ? 'bad' : ''}
              buttons={
                <Button
                  my={1}
                  width={8}
                  lineHeight={2}
                  align="center"
                  disabled={!canDraw}
                  color={!mode && 'bad'}
                  content={
                    mode
                      ? t('ivdrip-injecting', {}, 'Injecting')
                      : t('ivdrip-draining', {}, 'Draining')
                  }
                  icon={mode ? 'syringe' : 'droplet'}
                  onClick={() => act('changeMode')}
                />
              }
            >
              {mode
                ? hasInternalStorage
                  ? t('ivdrip-from-network', {}, 'Reagents from network')
                  : t('ivdrip-from-container', {}, 'Reagents from container')
                : t('ivdrip-blood-into-container', {}, 'Blood into container')}
            </LabeledList.Item>
            {hasContainer || hasInternalStorage ? (
              <LabeledList.Item
                label={t('ivdrip-container', {}, 'Container')}
                buttons={
                  !hasInternalStorage &&
                  !!canRemoveContainer && (
                    <Button
                      my={1}
                      width={8}
                      lineHeight={2}
                      align="center"
                      icon="eject"
                      content={t('ivdrip-eject', {}, 'Eject')}
                      onClick={() => act('eject')}
                    />
                  )
                }
              >
                <ProgressBar
                  value={containerCurrentVolume}
                  minValue={0}
                  maxValue={containerMaxVolume}
                  color={containerReagentColor}
                >
                  <span
                    style={{
                      textShadow: '1px 1px 0 black',
                    }}
                  >
                    {t(
                      'ivdrip-container-volume',
                      {
                        current: containerCurrentVolume,
                        max: containerMaxVolume,
                      },
                      `${containerCurrentVolume} of ${containerMaxVolume} units`,
                    )}
                  </span>
                </ProgressBar>
              </LabeledList.Item>
            ) : (
              <LabeledList.Item label={t('ivdrip-container', {}, 'Container')}>
                <Tooltip
                  content={t(
                    'ivdrip-attach-container-hint',
                    {},
                    'Click the drip with a container in hand to attach.',
                  )}
                >
                  <NoticeBox my={0.7}>
                    {t(
                      'ivdrip-no-container',
                      {},
                      'No container attached.',
                    )}
                  </NoticeBox>
                </Tooltip>
              </LabeledList.Item>
            )}
            {hasObjectAttached ? (
              <LabeledList.Item
                label={t('ivdrip-object', {}, 'Object')}
                buttons={
                  <Button
                    disabled={!hasObjectAttached}
                    my={1}
                    width={8}
                    lineHeight={2}
                    align="center"
                    icon="ban"
                    content={t('ivdrip-disconnect', {}, 'Disconnect')}
                    onClick={() => act('detach')}
                  />
                }
              >
                <Box maxHeight={'45px'} overflow={'hidden'}>
                  {objectName}
                </Box>
              </LabeledList.Item>
            ) : (
              <LabeledList.Item label={t('ivdrip-object', {}, 'Object')}>
                <Tooltip
                  content={t(
                    'ivdrip-attach-object-hint',
                    {},
                    'Drag the cursor from the drip and drop it on an object to connect.',
                  )}
                >
                  <NoticeBox my={0.7}>
                    {t('ivdrip-no-object', {}, 'No object attached.')}
                  </NoticeBox>
                </Tooltip>
              </LabeledList.Item>
            )}
          </LabeledList>
        </Section>
      </Window.Content>
    </Window>
  );
};
