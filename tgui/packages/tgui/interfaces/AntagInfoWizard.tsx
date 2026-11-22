import { Box, Section, Stack } from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';
import {
  type Objective,
  ObjectivePrintout,
  ReplaceObjectivesButton,
} from './common/Objectives';

const teleportstyle = {
  color: 'yellow',
};

const robestyle = {
  color: 'lightblue',
};

const destructionstyle = {
  color: 'red',
};

const defensestyle = {
  color: 'orange',
};

const transportstyle = {
  color: 'yellow',
};

const summonstyle = {
  color: 'cyan',
};

const ritualstyle = {
  color: 'violet',
};

const grandritualstyle = {
  fontWeight: 'bold',
  color: '#bd54e0',
};

type GrandRitual = {
  remaining: number;
  next_area: string;
};

type Info = {
  objectives: Objective[];
  ritual: GrandRitual;
  can_change_objective: BooleanLike;
};

export const AntagInfoWizard = (props) => {
  const { data, act } = useBackend<Info>();
  const t = useT();
  const { ritual, objectives, can_change_objective } = data;

  return (
    <Window width={620} height={630} theme="wizard">
      <Window.Content>
        <Stack vertical fill>
          <Stack.Item grow>
            <Section scrollable fill>
              <Stack vertical>
                <Stack.Item textColor="red" fontSize="20px">
                  {t('antaginfo-wizard-title')}
                </Stack.Item>
                <Stack.Item>
                  <ObjectivePrintout
                    objectives={objectives}
                    titleMessage={t('antaginfo-wizard-tasks')}
                    objectiveFollowup={
                      <ReplaceObjectivesButton
                        can_change_objective={can_change_objective}
                        button_title={t('antaginfo-wizard-quest')}
                        button_colour={'violet'}
                      />
                    }
                  />
                </Stack.Item>
                <Stack.Item>
                  <RitualPrintout ritual={ritual} />
                </Stack.Item>
              </Stack>
            </Section>
          </Stack.Item>
          <Stack.Item>
            <Section fill title={t('antaginfo-wizard-spellbook')}>
              <Stack vertical fill>
                <Stack.Item>
                  {t('antaginfo-wizard-book-intro')}
                  <br />
                  <span style={destructionstyle}>
                    {t('antaginfo-wizard-book-deadly')}
                  </span>
                  <br />
                  <span style={defensestyle}>
                    {t('antaginfo-wizard-book-defensive')}
                  </span>
                  <br />
                  <span style={transportstyle}>
                    {t('antaginfo-wizard-book-transport')}
                  </span>
                  <br />
                  <span style={summonstyle}>
                    {t('antaginfo-wizard-book-summoning')}
                  </span>
                  <br />
                  <span style={ritualstyle}>
                    {t('antaginfo-wizard-book-rituals')}
                  </span>
                </Stack.Item>
                <Stack.Item textColor="lightgreen">
                  {t('antaginfo-wizard-book-hint')}
                </Stack.Item>
              </Stack>
            </Section>
          </Stack.Item>
          <Stack.Item>
            <Section title={t('antaginfo-wizard-gear')}>
              <Stack>
                <Stack.Item>
                  <span style={teleportstyle}>
                    {t('antaginfo-wizard-scroll-name')}
                  </span>{' '}
                  {t('antaginfo-wizard-scroll-desc')}
                  <br />
                  <span style={robestyle}>{t('antaginfo-wizard-robes-name')}</span>{' '}
                  {t('antaginfo-wizard-robes-desc')}
                </Stack.Item>
              </Stack>
            </Section>
          </Stack.Item>
          <Stack.Item>
            <Section textAlign="center" textColor="red" fontSize="20px">
              {t('antaginfo-wizard-reminder')}
            </Section>
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
};

const RitualPrintout = (props: { ritual: GrandRitual }) => {
  const { ritual } = props;
  const t = useT();
  if (!ritual.next_area) {
    return null;
  }
  return (
    <Box>
      {t('antaginfo-wizard-ritual-pre')}{' '}
      <span style={grandritualstyle}>{t('antaginfo-wizard-ritual-name')} </span>
      {t('antaginfo-wizard-ritual-post')}
      <br />
      {t('antaginfo-wizard-ritual-count-pre')}
      <span style={grandritualstyle}> {ritual.remaining}</span>{' '}
      {t('antaginfo-wizard-ritual-count-post', { count: ritual.remaining })}
      <br />
      {t('antaginfo-wizard-ritual-area')}
      <span style={grandritualstyle}> {ritual.next_area}</span>.
    </Box>
  );
};
