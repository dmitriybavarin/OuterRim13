import { Section, Stack } from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';
import {
  type Objective,
  ObjectivePrintout,
  ReplaceObjectivesButton,
} from './common/Objectives';

const greenText = {
  fontWeight: 'italics',
  color: '#20b142',
};

const redText = {
  fontWeight: 'italics',
  color: '#e03c3c',
};

type Data = {
  antag_name: string;
  uplink_location: string | null;
  objectives: Objective[];
  can_change_objective: BooleanLike;
};

export const AntagInfoSpy = () => {
  const { data } = useBackend<Data>();
  const t = useT();
  const { antag_name, uplink_location, objectives, can_change_objective } =
    data;
  return (
    <Window width={380} height={450} theme="ntos_darkmode">
      <Window.Content
        style={{
          backgroundImage: 'none',
        }}
      >
        <Section title={t('antaginfo-spy-title', { name: antag_name || t('antaginfo-spy-default-name') })}>
          <Stack vertical fill ml={1} mr={1}>
            <Stack.Item fontSize={1.2}>
              {t('antaginfo-spy-uplink', {
                location: uplink_location || t('antaginfo-spy-something'),
              })}
            </Stack.Item>
            <Stack.Item>
              <span style={greenText}>
                <b>{t('antaginfo-spy-use')}</b> {t('antaginfo-spy-access')}{' '}
                <b>{t('antaginfo-spy-right-click')}</b>{' '}
                {t('antaginfo-spy-steal')}
              </span>
            </Stack.Item>
            <Stack.Divider />
            <Stack.Item>
              {t('antaginfo-spy-not-alone')}
            </Stack.Item>
            <Stack.Item>
              {t('antaginfo-spy-choice')}{' '}
              <span style={redText}>{t('antaginfo-spy-bounty-once')}</span>
            </Stack.Item>
            <Stack.Divider />
            <Stack.Item>
              <ObjectivePrintout
                titleMessage={t('antaginfo-spy-mission')}
                objectives={objectives}
              />
            </Stack.Item>
            <Stack.Divider />
            <Stack.Item textAlign="center">
              {
                <ReplaceObjectivesButton
                  can_change_objective={can_change_objective}
                  button_title={t('antaginfo-spy-own-plan')}
                  button_colour={'green'}
                />
              }
            </Stack.Item>
          </Stack>
        </Section>
      </Window.Content>
    </Window>
  );
};
