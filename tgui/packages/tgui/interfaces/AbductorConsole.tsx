import {
  Button,
  LabeledList,
  NoticeBox,
  Section,
  Tabs,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend, useSharedState } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';
import { GenericUplink, type Item } from './Uplink/GenericUplink';

type AbductorConsoleData = {
  categories: { name: string; items: ConsoleItem[] }[];

  compactMode: BooleanLike;
  experiment: BooleanLike;
  points?: number;
  credits?: number;
  pad: BooleanLike;
  gizmo: BooleanLike;
  vest: BooleanLike;
  vest_mode?: number;
  vest_lock?: BooleanLike;
};

type ConsoleItem = {
  name: string;
  cost: number;
  desc: string;
  icon: string;
  icon_state: string;
};

export const AbductorConsole = (props) => {
  const [tab, setTab] = useSharedState('tab', 1);
  const t = useT();

  return (
    <Window theme="abductor" width={600} height={532}>
      <Window.Content scrollable>
        <Tabs>
          <Tabs.Tab
            icon="list"
            lineHeight="23px"
            selected={tab === 1}
            onClick={() => setTab(1)}
          >
            Abductsoft 3000
          </Tabs.Tab>
          <Tabs.Tab
            icon="list"
            lineHeight="23px"
            selected={tab === 2}
            onClick={() => setTab(2)}
          >
            {t('abductor-mission', {}, 'Mission Settings')}
          </Tabs.Tab>
        </Tabs>
        {tab === 1 && <Abductsoft />}
        {tab === 2 && (
          <>
            <EmergencyTeleporter />
            <VestSettings />
          </>
        )}
      </Window.Content>
    </Window>
  );
};

const Abductsoft = (props) => {
  const { act, data } = useBackend<AbductorConsoleData>();
  const t = useT();
  const { experiment, points, credits, categories } = data;

  if (!experiment) {
    return <NoticeBox danger>{t('abductor-no-experiment', {}, 'No Experiment Machine Detected')}</NoticeBox>;
  }

  const categoriesList: string[] = [];
  const items: Item[] = [];
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    categoriesList.push(category.name);
    for (let itemIndex = 0; itemIndex < category.items.length; itemIndex++) {
      const item = category.items[itemIndex];
      items.push({
        id: item.name,
        name: item.name,
        category: category.name,
        cost: t('abductor-credits', { amount: item.cost }, `${item.cost} Credits`),
        desc: item.desc,
        disabled: (credits || 0) < item.cost,
        icon: item.icon,
        icon_state: item.icon_state,
        population_tooltip: '',
        insufficient_population: false,
      });
    }
  }

  return (
    <>
      <Section>
        <LabeledList>
          <LabeledList.Item label={t('abductor-samples', {}, 'Collected Samples')}>
            {points}
          </LabeledList.Item>
        </LabeledList>
      </Section>
      <GenericUplink
        currency={t(
          'abductor-credits',
          { amount: credits ?? 0 },
          `${credits} Credits`,
        )}
        categories={categoriesList}
        items={items}
        handleBuy={(item) => act('buy', { name: item.name })}
      />
    </>
  );
};

const EmergencyTeleporter = (props) => {
  const { act, data } = useBackend<AbductorConsoleData>();
  const t = useT();
  const { pad, gizmo } = data;

  if (!pad) {
    return <NoticeBox danger>{t('abductor-no-telepad', {}, 'No Telepad Detected')}</NoticeBox>;
  }

  return (
    <Section
      title={t('abductor-teleport', {}, 'Emergency Teleport')}
      buttons={
        <Button
          icon="exclamation-circle"
          content={t('abductor-activate', {}, 'Activate')}
          color="bad"
          onClick={() => act('teleporter_send')}
        />
      }
    >
      <LabeledList>
        <LabeledList.Item label={t('abductor-mark', {}, 'Mark Retrieval')}>
          <Button
            icon={gizmo ? 'user-plus' : 'user-slash'}
            disabled={!gizmo}
            onClick={() => act('teleporter_retrieve')}
          >
            {gizmo
              ? t('abductor-retrieve', {}, 'Retrieve')
              : t('abductor-no-mark', {}, 'No Mark')}
          </Button>
        </LabeledList.Item>
      </LabeledList>
    </Section>
  );
};

const VestSettings = (props) => {
  const { act, data } = useBackend<AbductorConsoleData>();
  const t = useT();
  const { vest, vest_mode, vest_lock } = data;

  if (!vest) {
    return <NoticeBox danger>{t('abductor-no-vest', {}, 'No Agent Vest Detected')}</NoticeBox>;
  }

  return (
    <Section
      title={t('abductor-vest', {}, 'Agent Vest Settings')}
      buttons={
        <Button
          icon={vest_lock ? 'lock' : 'unlock'}
          onClick={() => act('toggle_vest')}
        >
          {vest_lock
            ? t('abductor-locked', {}, 'Locked')
            : t('abductor-unlocked', {}, 'Unlocked')}
        </Button>
      }
    >
      <LabeledList>
        <LabeledList.Item label={t('abductor-mode', {}, 'Mode')}>
          <Button
            icon={vest_mode === 1 ? 'eye-slash' : 'fist-raised'}
            onClick={() => act('flip_vest')}
          >
            {vest_mode === 1
              ? t('abductor-stealth', {}, 'Stealth')
              : t('abductor-combat', {}, 'Combat')}
          </Button>
        </LabeledList.Item>
        <LabeledList.Item label={t('abductor-disguise', {}, 'Disguise')}>
          <Button icon="user-secret" onClick={() => act('select_disguise')}>
            {t('abductor-select', {}, 'Select')}
          </Button>
        </LabeledList.Item>
      </LabeledList>
    </Section>
  );
};
