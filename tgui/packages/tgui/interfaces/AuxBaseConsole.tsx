import { useState } from 'react';
import { Button, NoticeBox, Section, Table, Tabs } from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';
import { ShuttleConsoleContent } from './ShuttleConsole';

type Data = {
  type: string;
  blind_drop: BooleanLike;
  turrets: Turret[];
};

type Turret = {
  ref: string;
  key: string;
  name: string;
  integrity: number;
  status: string;
  direction: string;
  distance: number;
};

const STATUS_COLOR_KEYS = {
  ERROR: 'bad',
  Disabled: 'bad',
  Firing: 'average',
  'All Clear': 'good',
} as const;

const STATUS_KEYS: Record<string, string> = {
  ERROR: 'error',
  Disabled: 'disabled',
  Firing: 'firing',
  'All Clear': 'clear',
} as const;

enum TAB {
  Shuttle = 1,
  Aux,
}

export const AuxBaseConsole = (props) => {
  const { data } = useBackend<Data>();
  const [tab, setTab] = useState(TAB.Shuttle);
  const { type, blind_drop, turrets = [] } = data;
  const t = useT();

  return (
    <Window
      width={turrets.length ? 620 : 350}
      height={turrets.length ? 310 : 260}
    >
      <Window.Content scrollable={!!turrets.length}>
        <Tabs>
          <Tabs.Tab
            icon="list"
            lineHeight="23px"
            selected={tab === TAB.Shuttle}
            onClick={() => setTab(TAB.Shuttle)}
          >
            {type === 'shuttle'
              ? t('auxbase-shuttle-launch', {}, 'Shuttle Launch')
              : t('auxbase-base-launch', {}, 'Base Launch')}
          </Tabs.Tab>
          <Tabs.Tab
            icon="list"
            lineHeight="23px"
            selected={tab === TAB.Aux}
            onClick={() => setTab(TAB.Aux)}
          >
            {t(
              'auxbase-turrets-tab',
              { count: turrets.length },
              'Turrets ({ $count })',
            )}
          </Tabs.Tab>
        </Tabs>
        {tab === TAB.Shuttle && (
          <ShuttleConsoleContent type={type} blind_drop={blind_drop} />
        )}
        {tab === TAB.Aux && <AuxBaseConsoleContent />}
      </Window.Content>
    </Window>
  );
};

export const AuxBaseConsoleContent = (props) => {
  const { act, data } = useBackend<Data>();
  const { turrets = [] } = data;
  const t = useT();

  return (
    <Section
      fill
      scrollable
      title={t('auxbase-turret-control', {}, 'Turret Control')}
      buttons={
        !!turrets.length && (
          <Button icon="power-off" onClick={() => act('turrets_power')}>
            {t('auxbase-toggle-power', {}, 'Toggle Power')}
          </Button>
        )
      }
    >
      {!turrets.length ? (
        <NoticeBox>
          {t('auxbase-no-turrets', {}, 'No connected turrets')}
        </NoticeBox>
      ) : (
        <Table>
          <Table.Row header>
            <Table.Cell>{t('auxbase-unit', {}, 'Unit')}</Table.Cell>
            <Table.Cell>{t('auxbase-condition', {}, 'Condition')}</Table.Cell>
            <Table.Cell>{t('auxbase-status', {}, 'Status')}</Table.Cell>
            <Table.Cell>{t('auxbase-direction', {}, 'Direction')}</Table.Cell>
            <Table.Cell>{t('auxbase-distance', {}, 'Distance')}</Table.Cell>
            <Table.Cell>{t('auxbase-power', {}, 'Power')}</Table.Cell>
          </Table.Row>
          {turrets.map((turret) => (
            <Table.Row key={turret.key}>
              <Table.Cell bold>{turret.name}</Table.Cell>
              <Table.Cell>{turret.integrity}%</Table.Cell>
              <Table.Cell color={STATUS_COLOR_KEYS[turret.status] || 'bad'}>
                {STATUS_KEYS[turret.status]
                  ? t(
                      `auxbase-status-${STATUS_KEYS[turret.status]}`,
                      {},
                      turret.status,
                    )
                  : turret.status}
              </Table.Cell>
              <Table.Cell>{turret.direction}</Table.Cell>
              <Table.Cell>
                {turret.distance}
                {t('auxbase-meters', {}, 'm')}
              </Table.Cell>
              <Table.Cell>
                <Button
                  icon="power-off"
                  onClick={() =>
                    act('single_turret_power', {
                      single_turret_power: turret.ref,
                    })
                  }
                >
                  {t('auxbase-toggle', {}, 'Toggle')}
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table>
      )}
    </Section>
  );
};
