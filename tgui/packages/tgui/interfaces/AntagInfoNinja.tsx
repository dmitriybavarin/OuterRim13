import { Icon, Section, Stack } from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';
import {
  type Objective,
  ObjectivePrintout,
  ReplaceObjectivesButton,
} from './common/Objectives';

const ninja_emphasis = {
  color: 'red',
};

type NinjaInfo = {
  objectives: Objective[];
  can_change_objective: BooleanLike;
};

export const AntagInfoNinja = (props) => {
  const { data } = useBackend<NinjaInfo>();
  const t = useT();
  const { objectives, can_change_objective } = data;
  return (
    <Window width={550} height={450} theme="hackerman">
      <Window.Content>
        <Icon
          size={30}
          name="spider"
          color="#003300"
          position="absolute"
          top="10%"
          left="10%"
        />
        <Section scrollable fill>
          <Stack vertical textColor="green">
            <Stack.Item textAlign="center" fontSize="20px">
              {t('antaginfo-ninja-intro')}
              <br />
              {t('antaginfo-ninja-title-prefix')}{' '}
              <span style={ninja_emphasis}>{t('antaginfo-ninja-title-name')}</span>!
            </Stack.Item>
            <Stack.Item textAlign="center" italic>
              {t('antaginfo-ninja-motto')}
            </Stack.Item>
            <Stack.Item>
              <Section fill>
                {t('antaginfo-ninja-suit')}
                <br />
                {t('antaginfo-ninja-recharge')}
                <br />
                {t('antaginfo-ninja-hack')}
              </Section>
            </Stack.Item>
            <Stack.Item>
              <ObjectivePrintout
                objectives={objectives}
                objectiveFollowup={
                  <ReplaceObjectivesButton
                    can_change_objective={can_change_objective}
                    button_title={t('antaginfo-ninja-adapt')}
                    button_colour={'green'}
                  />
                }
              />
            </Stack.Item>
          </Stack>
        </Section>
      </Window.Content>
    </Window>
  );
};
