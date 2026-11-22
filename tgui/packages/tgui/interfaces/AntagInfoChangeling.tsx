import { useState } from 'react';
import {
  Button,
  Dimmer,
  Dropdown,
  NoticeBox,
  Section,
  Stack,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';
import {
  type Objective,
  ObjectivePrintout,
  ReplaceObjectivesButton,
} from './common/Objectives';

const hivestyle = {
  fontWeight: 'bold',
  color: 'yellow',
};

const absorbstyle = {
  color: 'red',
  fontWeight: 'bold',
};

const revivestyle = {
  color: 'lightblue',
  fontWeight: 'bold',
};

const transformstyle = {
  color: 'orange',
  fontWeight: 'bold',
};

const storestyle = {
  color: 'lightgreen',
  fontWeight: 'bold',
};

const hivemindstyle = {
  color: 'violet',
  fontWeight: 'bold',
};

const fallenstyle = {
  color: 'black',
  fontWeight: 'bold',
};

type Memory = {
  name: string;
  story: string;
};

type Info = {
  true_name: string;
  hive_name: string;
  stolen_antag_info: string;
  memories: Memory[];
  objectives: Objective[];
  can_change_objective: BooleanLike;
  absorbed_dna: number;
};

export const AntagInfoChangeling = (props) => {
  return (
    <Window width={720} height={750}>
      <Window.Content
        style={{
          backgroundImage: 'none',
        }}
      >
        <Stack vertical fill>
          <Stack.Item maxHeight={16}>
            <IntroductionSection />
          </Stack.Item>
          <Stack.Item grow={4}>
            <AbilitiesSection />
          </Stack.Item>
          <BetrayalWarning />
          <Stack.Item grow={3}>
            <Stack fill>
              <Stack.Item grow>
                <MemoriesSection />
              </Stack.Item>
              <Stack.Item grow>
                <VictimPatternsSection />
              </Stack.Item>
            </Stack>
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
};

const IntroductionSection = (props) => {
  const { act, data } = useBackend<Info>();
  const t = useT();
  const {
    true_name,
    hive_name,
    objectives,
    can_change_objective,
    absorbed_dna,
  } = data;
  return (
    <Section
      fill
      title={t('antaginfo-common-intro')}
      style={{ overflowY: 'auto' }}
      buttons={
        <Button
          icon="dna"
          tooltipPosition="left"
          tooltip={t('antaginfo-changeling-absorbed-dna')}
          color="purple"
        >
          {absorbed_dna}
        </Button>
      }
    >
      <Stack vertical fill>
        <Stack.Item fontSize="25px">
          {t('antaginfo-changeling-you-are', { name: true_name })}
          <span style={hivestyle}> {hive_name}</span>.
        </Stack.Item>
        <Stack.Item>
          <ObjectivePrintout
            objectives={objectives}
            objectiveFollowup={
              <ReplaceObjectivesButton
                can_change_objective={can_change_objective}
                button_title={t('antaginfo-changeling-evolve')}
                button_colour={'green'}
              />
            }
          />
        </Stack.Item>
      </Stack>
    </Section>
  );
};

const AbilitiesSection = () => {
  const { act, data } = useBackend<Info>();
  const t = useT();
  const { true_name } = data;
  return (
    <Section fill title={t('antaginfo-changeling-abilities')}>
      <Stack fill>
        <Stack.Item grow>
          <Stack fill vertical>
            <Stack.Item textColor="label" grow>
              {t('antaginfo-changeling-absorb-pre')}
              <span style={absorbstyle}>
                &ensp;{t('antaginfo-changeling-absorb-name')}
              </span>{' '}
              {t('antaginfo-changeling-absorb-mid')}
              <span style={absorbstyle}>
                &ensp;{t('antaginfo-changeling-sting-name')}
              </span>{' '}
              {t('antaginfo-changeling-sting-post')}
            </Stack.Item>
            <Stack.Divider />
            <Stack.Item textColor="label" grow>
              {t('antaginfo-changeling-revive-pre')}
              <span style={revivestyle}>
                &ensp;{t('antaginfo-changeling-revive-name')}
              </span>{' '}
              {t('antaginfo-changeling-revive-post')}
            </Stack.Item>
          </Stack>
        </Stack.Item>
        <Stack.Divider />
        <Stack.Item grow>
          <Stack fill vertical>
            <Stack.Item textColor="label" grow>
              {t('antaginfo-changeling-transform-pre')}
              <span style={transformstyle}>
                &ensp;{t('antaginfo-changeling-transform-name')}
              </span>{' '}
              {t('antaginfo-changeling-transform-post')}
            </Stack.Item>
            <Stack.Divider />
            <Stack.Item textColor="label" grow>
              {t('antaginfo-changeling-emporium-pre')}
              <span style={storestyle}>
                &ensp;{t('antaginfo-changeling-emporium-name')}
              </span>{' '}
              {t('antaginfo-changeling-emporium-post')}
            </Stack.Item>
          </Stack>
        </Stack.Item>
        <Stack.Divider />
        <Stack.Item grow>
          <Stack fill vertical>
            <Stack.Item textColor="label" grow>
              {t('antaginfo-changeling-chems-pre')}{' '}
              <span style={hivemindstyle}>
                {t('antaginfo-changeling-chems-name')}
              </span>
              {t('antaginfo-changeling-chems-mid')}
              <span style={absorbstyle}>
                &ensp;{t('antaginfo-changeling-chems-absorbing')}
              </span>{' '}
              {t('antaginfo-changeling-chems-post')}
            </Stack.Item>
            <Stack.Divider />
            <Stack.Item textColor="label" grow>
              {t('antaginfo-changeling-hive-pre')}{' '}
              <span style={hivemindstyle}>
                {t('antaginfo-changeling-hive-name')}
              </span>
              {t('antaginfo-changeling-hive-mid')}{' '}
              <span style={hivemindstyle}>{true_name}</span>
              {t('antaginfo-changeling-hive-key')}{' '}
              <span style={hivemindstyle}>:g</span>
              {t('antaginfo-changeling-hive-post')}
            </Stack.Item>
          </Stack>
        </Stack.Item>
      </Stack>
    </Section>
  );
};

const BetrayalWarning = (props) => {
  const t = useT();
  return (
    <NoticeBox danger>
      {t('antaginfo-changeling-betrayal-pre')}{' '}
      <span style={fallenstyle}>{t('antaginfo-changeling-betrayal-name')}</span>
      {t('antaginfo-changeling-betrayal-post')}
    </NoticeBox>
  );
};

const MemoriesSection = (props) => {
  const { data } = useBackend<Info>();
  const t = useT();
  const { memories } = data;
  const [selectedMemory, setSelectedMemory] = useState(
    (!!memories && memories[0]) || null,
  );
  const memoryMap = {};
  for (const index in memories) {
    const memory = memories[index];
    memoryMap[memory.name] = memory;
  }

  return (
    <Section
      fill
      scrollable={!!memories && !!memories.length}
      title={t('antaginfo-changeling-memories')}
      buttons={
        <Button
          icon="info"
          tooltipPosition="left"
          tooltip={t('antaginfo-changeling-memories-tooltip')}
        />
      }
    >
      {(!!memories && !memories.length && (
        <Dimmer fontSize="20px">
          {t('antaginfo-changeling-absorb-first')}
        </Dimmer>
      )) || (
        <Stack vertical>
          <Stack.Item>
            <Dropdown
              width="100%"
              selected={selectedMemory?.name}
              options={memories.map((memory) => {
                return memory.name;
              })}
              onSelected={(selected) => setSelectedMemory(memoryMap[selected])}
            />
          </Stack.Item>
          <Stack.Item>{!!selectedMemory && selectedMemory.story}</Stack.Item>
        </Stack>
      )}
    </Section>
  );
};

const VictimPatternsSection = (props) => {
  const { data } = useBackend<Info>();
  const t = useT();
  const { stolen_antag_info } = data;
  return (
    <Section
      fill
      scrollable={!!stolen_antag_info}
      title={t('antaginfo-changeling-additional')}
    >
      {(!!stolen_antag_info && stolen_antag_info) || (
        <Dimmer fontSize="20px">
          {t('antaginfo-changeling-absorb-first')}
        </Dimmer>
      )}
    </Section>
  );
};
