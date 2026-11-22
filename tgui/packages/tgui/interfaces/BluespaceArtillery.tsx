import {
  Box,
  Button,
  LabeledList,
  NoticeBox,
  Section,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  connected: BooleanLike;
  notice: string;
  unlocked: BooleanLike;
  visualizing: BooleanLike;
  target: string;
};

export const BluespaceArtillery = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { connected, notice, unlocked, visualizing, target } = data;

  return (
    <Window width={400} height={220}>
      <Window.Content>
        {!!notice && <NoticeBox>{notice}</NoticeBox>}
        {connected ? (
          <>
            <Section
              title={t('bluespaceartillery-target', {}, 'Target')}
              buttons={
                <Button
                  icon="crosshairs"
                  disabled={!unlocked}
                  onClick={() => act('recalibrate')}
                />
              }
            >
              <Box color={target ? 'average' : 'bad'} fontSize="25px">
                {target || t('bluespaceartillery-no-target', {}, 'No Target Set')}
              </Box>
            </Section>
            <Section>
              {unlocked ? (
                <Box style={{ margin: 'auto' }}>
                  <Button
                    fluid
                    content={t('bluespaceartillery-fire', {}, 'FIRE')}
                    color="bad"
                    disabled={!target}
                    fontSize="30px"
                    textAlign="center"
                    lineHeight="46px"
                    onClick={() => act('fire')}
                  />
                </Box>
              ) : (
                <>
                  <Box color="bad" fontSize="18px">
                    {t(
                      'bluespaceartillery-locked',
                      {},
                      'Bluespace artillery is currently locked.',
                    )}
                  </Box>
                  <Box mt={1}>
                    {t(
                      'bluespaceartillery-awaiting',
                      {},
                      'Awaiting authorization via keycard reader from at minimum two station heads.',
                    )}
                  </Box>
                </>
              )}
            </Section>
          </>
        ) : (
          <Section>
            <LabeledList>
              <LabeledList.Item label={t('bluespaceartillery-maintenance', {}, 'Maintenance')}>
                {(visualizing) ? (
                  <>
                    <Button color="good" onClick={() => act('build')}>
                      {t('bluespaceartillery-confirm', {}, 'Confirm Position')}
                    </Button>
                    <Button color="bad" onClick={() => act('unvisualize')}>
                      {t('bluespaceartillery-cancel', {}, 'Cancel')}
                    </Button>
                  </>
                ) : (
                  <Button icon="wrench" onClick={() => act('visualize')}>
                    {t('bluespaceartillery-deploy', {}, 'Begin Deployment')}
                  </Button>
                )}
              </LabeledList.Item>
            </LabeledList>
          </Section>
        )}
      </Window.Content>
    </Window>
  );
};
