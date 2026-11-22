import {
  Box,
  Collapsible,
  Divider,
  LabeledList,
  Section,
  Stack,
} from 'tgui-core/components';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';
import type { Objective } from './common/Objectives';

type Data = {
  color: string;
  description: string;
  effects: string;
  name: string;
  objectives: Objective[];
};

const BLOB_COLOR = '#556b2f';

const SHORTCUTS = ['click', 'middle', 'ctrl', 'alt'];

const STRUCTURES = ['strong', 'reflective', 'resource', 'factory', 'node'];

export const AntagInfoBlob = (props) => {
  return (
    <Window width={400} height={550}>
      <Window.Content>
        <Section fill scrollable>
          <Overview />
          <Divider />
          <Basics />
          <Structures />
          <Minions />
          <ObjectiveDisplay />
        </Section>
      </Window.Content>
    </Window>
  );
};

const Overview = (props) => {
  const { data } = useBackend<Data>();
  const t = useT();
  const { color, description, effects, name } = data;

  if (!name) {
    return (
      <Stack vertical>
        <Stack.Item bold fontSize="14px" textColor={BLOB_COLOR}>
          {t('antaginfo-blob-unrevealed-title')}
        </Stack.Item>
        <Stack.Item>{t('antaginfo-blob-unrevealed-desc')}</Stack.Item>
      </Stack>
    );
  }

  return (
    <Stack vertical>
      <Stack.Item bold fontSize="24px" textColor={BLOB_COLOR}>
        {t('antaginfo-blob-title')}
      </Stack.Item>
      <Stack.Item>{t('antaginfo-blob-overmind')}</Stack.Item>
      <Stack.Item>
        {t('antaginfo-blob-reagent-is')}{' '}
        <span
          style={{
            color,
          }}
        >
          {name}
        </span>
      </Stack.Item>
      <Stack.Item>
        {t('antaginfo-blob-reagent-pre')}{' '}
        <span
          style={{
            color,
          }}
        >
          {name}
        </span>{' '}
        {t('antaginfo-blob-reagent-post')} {description}
      </Stack.Item>
      {effects && (
        <Stack.Item>
          {t('antaginfo-blob-reagent-pre')}{' '}
          <span
            style={{
              color,
            }}
          >
            {name}
          </span>{' '}
          {t('antaginfo-blob-reagent-post')} {effects}
        </Stack.Item>
      )}
    </Stack>
  );
};

const Basics = (props) => {
  const t = useT();
  return (
    <Collapsible title={t('antaginfo-blob-basics')}>
      <LabeledList>
        <LabeledList.Item label={t('antaginfo-blob-attacking-name')}>
          {t('antaginfo-blob-attacking-desc')}
        </LabeledList.Item>
        <LabeledList.Item label={t('antaginfo-blob-placement-name')}>
          {t('antaginfo-blob-placement-core')} <br />
          <br />
          {t('antaginfo-blob-placement-infection')}
        </LabeledList.Item>
        <LabeledList.Item label={t('antaginfo-blob-hud-name')}>
          {t('antaginfo-blob-hud-desc')}
        </LabeledList.Item>
        <LabeledList.Item label={t('antaginfo-blob-shortcuts-name')}>
          {SHORTCUTS.map((shortcut) => (
            <span key={shortcut}>
              {t(`antaginfo-blob-shortcut-${shortcut}`)} <br />
            </span>
          ))}
        </LabeledList.Item>
        <LabeledList.Item label={t('antaginfo-blob-comms-name')}>
          {t('antaginfo-blob-comms-desc')}
        </LabeledList.Item>
      </LabeledList>
    </Collapsible>
  );
};

const Minions = (props) => {
  const t = useT();
  return (
    <Collapsible title={t('antaginfo-blob-minions')}>
      <LabeledList>
        <LabeledList.Item label={t('antaginfo-blob-blobbernauts-name')}>
          {t('antaginfo-blob-blobbernauts-desc')}
        </LabeledList.Item>
        <LabeledList.Item label={t('antaginfo-blob-spores-name')}>
          {t('antaginfo-blob-spores-desc')}
        </LabeledList.Item>
      </LabeledList>
    </Collapsible>
  );
};

const Structures = (props) => {
  const t = useT();
  return (
    <Collapsible title={t('antaginfo-blob-structures')}>
      <Box>{t('antaginfo-blob-structures-intro')}</Box>
      <br />
      <Box>{t('antaginfo-blob-structures-upgrade')}</Box>
      <Divider />
      <LabeledList>
        {STRUCTURES.map((structure) => (
          <LabeledList.Item
            key={structure}
            label={t(`antaginfo-blob-structure-${structure}-name`)}
          >
            {t(`antaginfo-blob-structure-${structure}-desc`)}
          </LabeledList.Item>
        ))}
      </LabeledList>
    </Collapsible>
  );
};

const ObjectiveDisplay = (props) => {
  const { data } = useBackend<Data>();
  const t = useT();
  const { color, objectives } = data;

  return (
    <Collapsible title={t('antaginfo-blob-objectives')}>
      <LabeledList>
        {objectives.map(({ explanation }, index) => (
          <LabeledList.Item
            color={color ?? 'white'}
            key={index}
            label={(index + 1).toString()}
          >
            {explanation}
          </LabeledList.Item>
        ))}
      </LabeledList>
    </Collapsible>
  );
};
