import { type ReactNode, useState } from 'react';
import {
  Box,
  Button,
  LabeledList,
  NoticeBox,
  ProgressBar,
  Section,
  Stack,
  Tabs,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useNumber, useT } from '../i18n';
import { Window } from '../layouts';

type Limb = { name: string; brute: number; burn: number; max: number };
type Organ = { name: string; damage: number; max: number; failing: BooleanLike };

type Status = {
  stat: number;
  health: number;
  max_health: number;
  brute: number;
  burn: number;
  tox: number;
  oxy: number;
  stamina: number;
};

type Data = {
  gone: BooleanLike;
  ckey?: string;
  key?: string;
  name?: string;
  real_name?: string;
  mob_type?: string;
  job?: string | null;
  old_names?: string;
  rank?: string | null;
  join_date?: string;
  account_date?: string;
  account_age?: number;
  player_age?: number;
  ping?: number;
  byond_version?: string;
  playtime?: string;
  ip?: string;
  cid?: string;
  muted?: number;
  centcom_enabled?: BooleanLike;
  has_client?: BooleanLike;
  has_mind?: BooleanLike;
  is_new_player?: BooleanLike;
  is_ghost?: BooleanLike;
  is_living?: BooleanLike;
  is_human?: BooleanLike;
  is_cyborg?: BooleanLike;
  is_ai?: BooleanLike;
  is_monkey?: BooleanLike;
  can_admin?: BooleanLike;
  can_ban?: BooleanLike;
  can_fun?: BooleanLike;
  can_spawn?: BooleanLike;
  status?: Status;
  limbs?: Limb[];
  organs?: Organ[];
  antags?: string[];
};

type Tab = 'info' | 'actions' | 'status' | 'roles' | 'notes';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'info', label: 'Info', icon: 'info-circle' },
  { id: 'actions', label: 'Actions', icon: 'bolt' },
  { id: 'status', label: 'Status', icon: 'heartbeat' },
  { id: 'roles', label: 'Roles', icon: 'user-secret' },
  { id: 'notes', label: 'Notes and bans', icon: 'gavel' },
];

const MUTES: { id: string; bit: number; label: string }[] = [
  { id: 'ic', bit: 1, label: 'IC' },
  { id: 'ooc', bit: 2, label: 'OOC' },
  { id: 'pray', bit: 4, label: 'Pray' },
  { id: 'adminhelp', bit: 8, label: 'Adminhelp' },
  { id: 'deadchat', bit: 16, label: 'Deadchat' },
  { id: 'webreq', bit: 32, label: 'Web requests' },
  { id: 'all', bit: 16777215, label: 'All' },
];

const STAT_LABELS = [
  'Conscious',
  'Soft crit',
  'Unconscious',
  'Hard crit',
  'Dead',
];

const asList = <T,>(value: unknown): T[] =>
  Array.isArray(value) ? (value as T[]) : [];

const show = (value: unknown) =>
  value === undefined || value === null || value === '' ? '-' : String(value);

export function PlayerPanel() {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const width = useNumber('playerpanel-window-width', 520);
  const height = useNumber('playerpanel-window-height', 620);
  const [tab, setTab] = useState<Tab>('info');

  const limbs = asList<Limb>(data.limbs);
  const organs = asList<Organ>(data.organs);
  const antags = asList<string>(data.antags);
  const muted = Number(data.muted) || 0;
  const hasClient = !!data.has_client;
  const living = !!data.is_living;
  const canAdmin = !!data.can_admin;
  const canBan = !!data.can_ban;
  const canFun = !!data.can_fun;

  const button = (
    id: string,
    icon: string,
    label: string,
    options: {
      color?: string;
      confirm?: boolean;
      disabled?: boolean;
      params?: Record<string, string | number>;
      selected?: boolean;
    } = {},
  ) => (
    <Button
      key={`${id}-${options.params ? JSON.stringify(options.params) : ''}`}
      icon={icon}
      color={options.color}
      selected={options.selected}
      disabled={options.disabled}
      confirmContent={
        options.confirm ? t('playerpanel-confirm', {}, 'Are you sure?') : undefined
      }
      onClick={() => act(id, options.params)}
    >
      {label}
    </Button>
  );

  const group = (title: string, items: (ReactNode | null)[]) => (
    <Section title={title}>
      <Box>
        {items.filter(Boolean).map((item, index) => (
          <Box key={index} inline mr={1} mb={1}>
            {item}
          </Box>
        ))}
      </Box>
    </Section>
  );

  if (data.gone) {
    return (
      <Window
        title={t('playerpanel-title', {}, 'Player panel')}
        width={width}
        height={height}
        theme="admin"
      >
        <Window.Content>
          <NoticeBox danger>
            {t('playerpanel-gone', {}, 'This mob no longer exists.')}
          </NoticeBox>
          {!!data.ckey && (
            <Button icon="sync" onClick={() => act('refresh')}>
              {t('playerpanel-find-new', {}, 'Find updated mob')}
            </Button>
          )}
        </Window.Content>
      </Window>
    );
  }

  const header = (
    <Section>
      <Stack align="center">
        <Stack.Item grow>
          <Box bold fontSize="16px">
            {show(data.key || data.ckey)}
          </Box>
          <Box color="label">
            {show(data.real_name || data.name)}
            {data.job ? ` | ${data.job}` : ''}
          </Box>
        </Stack.Item>
        <Stack.Item>
          <Box color="label" textAlign="right">
            {data.account_age !== undefined && data.account_age >= 0 && (
              <Box>
                {t('playerpanel-account-age', { days: data.account_age }, 'Account age')}
              </Box>
            )}
            {hasClient && (
              <Box>
                {t('playerpanel-ping', { ms: data.ping ?? 0 }, 'Ping')}
              </Box>
            )}
            {canBan && !!data.ip && (
              <Box>
                {data.ip} / {data.cid}
              </Box>
            )}
          </Box>
        </Stack.Item>
        <Stack.Item>
          <Button
            icon="sync"
            tooltip={t('playerpanel-find-new', {}, 'Find updated mob')}
            onClick={() => act('refresh')}
          />
        </Stack.Item>
      </Stack>
    </Section>
  );

  const infoTab = (
    <Section>
      <LabeledList>
        <LabeledList.Item label={t('playerpanel-field-ckey', {}, 'Key')}>
          {show(data.key || data.ckey)}
        </LabeledList.Item>
        <LabeledList.Item label={t('playerpanel-field-name', {}, 'Mob name')}>
          {show(data.name)}
        </LabeledList.Item>
        <LabeledList.Item label={t('playerpanel-field-real-name', {}, 'Real name')}>
          {show(data.real_name)}
        </LabeledList.Item>
        <LabeledList.Item label={t('playerpanel-field-job', {}, 'Role')}>
          {show(data.job)}
        </LabeledList.Item>
        <LabeledList.Item label={t('playerpanel-field-mob-type', {}, 'Mob type')}>
          {show(data.mob_type)}
        </LabeledList.Item>
        <LabeledList.Item label={t('playerpanel-field-rank', {}, 'Admin rank')}>
          {show(data.rank)}
        </LabeledList.Item>
        {hasClient && (
          <>
            <LabeledList.Item label={t('playerpanel-field-first-seen', {}, 'First seen')}>
              {show(data.join_date)}
            </LabeledList.Item>
            <LabeledList.Item label={t('playerpanel-field-account-date', {}, 'BYOND account registered')}>
              {show(data.account_date)}
            </LabeledList.Item>
            <LabeledList.Item label={t('playerpanel-field-player-age', {}, 'Days since first seen')}>
              {show(data.player_age)}
            </LabeledList.Item>
            <LabeledList.Item label={t('playerpanel-field-playtime', {}, 'Living playtime')}>
              {show(data.playtime)}
            </LabeledList.Item>
            <LabeledList.Item label={t('playerpanel-field-byond', {}, 'BYOND version')}>
              {show(data.byond_version)}
            </LabeledList.Item>
            <LabeledList.Item label={t('playerpanel-field-ping', {}, 'Ping')}>
              {show(data.ping)}
            </LabeledList.Item>
            {canBan && (
              <>
                <LabeledList.Item label="IP">{show(data.ip)}</LabeledList.Item>
                <LabeledList.Item label="CID">{show(data.cid)}</LabeledList.Item>
              </>
            )}
          </>
        )}
        <LabeledList.Item label={t('playerpanel-field-old-names', {}, 'Old names')}>
          {show(data.old_names)}
        </LabeledList.Item>
      </LabeledList>
    </Section>
  );

  const actionsTab = (
    <Stack vertical>
      <Stack.Item>
        {group(t('playerpanel-group-contact', {}, 'Contact'), [
          button('pm', 'envelope', t('playerpanel-act-pm', {}, 'PM'), { disabled: !hasClient }),
          button('subtle', 'comment-dots', t('playerpanel-act-subtle', {}, 'Subtle message')),
          button('narrate', 'bullhorn', t('playerpanel-act-narrate', {}, 'Narrate')),
          data.is_human
            ? button('headset', 'headset', t('playerpanel-act-headset', {}, 'Headset message'))
            : null,
          button('playsound', 'volume-up', t('playerpanel-act-playsound', {}, 'Play sound')),
          button('rpreminder', 'book', t('playerpanel-act-rpreminder', {}, 'Roleplay reminder')),
        ])}
      </Stack.Item>
      <Stack.Item>
        {group(t('playerpanel-group-move', {}, 'Movement'), [
          button('jump', 'plane-arrival', t('playerpanel-act-jump', {}, 'Jump to')),
          button('get', 'hand-holding', t('playerpanel-act-get', {}, 'Get')),
          button('send', 'plane-departure', t('playerpanel-act-send', {}, 'Send to')),
          button('follow', 'eye', t('playerpanel-act-follow', {}, 'Follow')),
          button('possess', 'ghost', t('playerpanel-act-possess', {}, 'Take control'), {
            color: 'good',
            confirm: true,
          }),
        ])}
      </Stack.Item>
      <Stack.Item>
        {group(t('playerpanel-group-health', {}, 'Health and fun'), [
          living
            ? button('rejuvenate', 'heart', t('playerpanel-act-rejuvenate', {}, 'Rejuvenate'), {
                color: 'good',
              })
            : null,
          living
            ? button('heal', 'medkit', t('playerpanel-act-heal', {}, 'Heal'), { color: 'good' })
            : null,
          living
            ? button('smite', 'bolt', t('playerpanel-act-smite', {}, 'Smite'), {
                color: 'bad',
                disabled: !canFun,
              })
            : null,
          button('forcesay', 'comment', t('playerpanel-act-forcesay', {}, 'Force say'), {
            disabled: !canFun,
          }),
          button('equipment', 'user-tie', t('playerpanel-act-equipment', {}, 'Select equipment'), {
            disabled: !canFun,
          }),
          living
            ? button('contents', 'box-open', t('playerpanel-act-contents', {}, 'Check contents'))
            : null,
        ])}
      </Stack.Item>
      <Stack.Item>
        {group(t('playerpanel-group-moderation', {}, 'Moderation'), [
          button('kick', 'user-slash', t('playerpanel-act-kick', {}, 'Kick'), {
            color: 'bad',
            disabled: !hasClient,
          }),
          button('ban', 'gavel', t('playerpanel-act-ban', {}, 'Ban'), {
            color: 'bad',
            disabled: !canBan,
          }),
          button('prison', 'lock', t('playerpanel-act-prison', {}, 'Prison'), {
            disabled: !hasClient,
          }),
          button('lobby', 'door-open', t('playerpanel-act-lobby', {}, 'Send to lobby'), {
            disabled: !hasClient,
          }),
          button('commend', 'thumbs-up', t('playerpanel-act-commend', {}, 'Commend behavior'), {
            disabled: !hasClient,
          }),
        ])}
      </Stack.Item>
      {hasClient && (
        <Stack.Item>
          {group(
            t('playerpanel-group-mute', {}, 'Mute'),
            MUTES.map((mute) =>
              button(
                'mute',
                'volume-mute',
                t(`playerpanel-mute-${mute.id}`, {}, mute.label),
                {
                  selected: mute.id === 'all' ? muted === mute.bit : (muted & mute.bit) !== 0,
                  color: (muted & mute.bit) !== 0 ? 'bad' : undefined,
                  params: { type: mute.bit },
                },
              ),
            ),
          )}
        </Stack.Item>
      )}
      {hasClient && !data.is_new_player && (
        <Stack.Item>
          {group(t('playerpanel-group-transform', {}, 'Transform'), [
            button('transform', 'ghost', t('playerpanel-transform-observer', {}, 'Ghost'), {
              params: { kind: 'observer' },
              disabled: !!data.is_ghost,
            }),
            button('transform', 'user', t('playerpanel-transform-human', {}, 'Human'), {
              params: { kind: 'human' },
              disabled: !!data.is_human && !data.is_monkey,
            }),
            button('transform', 'paw', t('playerpanel-transform-monkey', {}, 'Monkey'), {
              params: { kind: 'monkey' },
              disabled: !!data.is_monkey,
            }),
            button('transform', 'robot', t('playerpanel-transform-robot', {}, 'Cyborg'), {
              params: { kind: 'robot' },
              disabled: !!data.is_cyborg,
            }),
            button('transform', 'microchip', t('playerpanel-transform-ai', {}, 'AI'), {
              params: { kind: 'ai' },
              disabled: !!data.is_ai,
            }),
          ])}
        </Stack.Item>
      )}
      {hasClient && !data.is_new_player && (
        <Stack.Item>
          {group(t('playerpanel-group-other', {}, 'Other'), [
            button('language', 'language', t('playerpanel-act-language', {}, 'Language menu')),
            button('quirks', 'sync', t('playerpanel-act-quirks', {}, 'Apply client quirks')),
            button('tdome1', 'dumbbell', t('playerpanel-act-tdome1', {}, 'Thunderdome 1')),
            button('tdome2', 'dumbbell', t('playerpanel-act-tdome2', {}, 'Thunderdome 2')),
            button('tdomeadmin', 'dumbbell', t('playerpanel-act-tdomeadmin', {}, 'Thunderdome admin')),
            button('tdomeobserve', 'dumbbell', t('playerpanel-act-tdomeobserve', {}, 'Thunderdome observer')),
          ])}
        </Stack.Item>
      )}
    </Stack>
  );

  const statusTab = !living || !data.status ? (
    <NoticeBox>
      {t('playerpanel-not-living', {}, 'This mob has no health status.')}
    </NoticeBox>
  ) : (
    <Stack vertical>
      <Stack.Item>
        <Section title={t('playerpanel-status-title', {}, 'Condition')}>
          <ProgressBar
            value={Math.max(0, data.status.health)}
            minValue={0}
            maxValue={Math.max(1, data.status.max_health)}
            ranges={{
              good: [data.status.max_health * 0.5, Infinity],
              average: [data.status.max_health * 0.2, data.status.max_health * 0.5],
              bad: [-Infinity, data.status.max_health * 0.2],
            }}
          >
            {data.status.health} / {data.status.max_health}
          </ProgressBar>
          <Box mt={1}>
            <LabeledList>
              <LabeledList.Item label={t('playerpanel-status-state', {}, 'State')}>
                {t(
                  `playerpanel-stat-${data.status.stat}`,
                  {},
                  STAT_LABELS[data.status.stat] ?? String(data.status.stat),
                )}
              </LabeledList.Item>
              <LabeledList.Item label={t('playerpanel-status-brute', {}, 'Brute')}>
                <Box color="bad">{data.status.brute}</Box>
              </LabeledList.Item>
              <LabeledList.Item label={t('playerpanel-status-burn', {}, 'Burn')}>
                <Box color="orange">{data.status.burn}</Box>
              </LabeledList.Item>
              <LabeledList.Item label={t('playerpanel-status-tox', {}, 'Toxin')}>
                <Box color="green">{data.status.tox}</Box>
              </LabeledList.Item>
              <LabeledList.Item label={t('playerpanel-status-oxy', {}, 'Oxygen')}>
                <Box color="blue">{data.status.oxy}</Box>
              </LabeledList.Item>
              <LabeledList.Item label={t('playerpanel-status-stamina', {}, 'Stamina')}>
                {data.status.stamina}
              </LabeledList.Item>
            </LabeledList>
          </Box>
        </Section>
      </Stack.Item>
      {limbs.length > 0 && (
        <Stack.Item>
          <Section title={t('playerpanel-status-limbs', {}, 'Limbs')}>
            <LabeledList>
              {limbs.map((limb) => (
                <LabeledList.Item key={limb.name} label={limb.name}>
                  <Box inline color="bad" mr={2}>
                    {limb.brute}
                  </Box>
                  <Box inline color="orange" mr={2}>
                    {limb.burn}
                  </Box>
                  <Box inline color="label">
                    / {limb.max}
                  </Box>
                </LabeledList.Item>
              ))}
            </LabeledList>
          </Section>
        </Stack.Item>
      )}
      {organs.length > 0 && (
        <Stack.Item>
          <Section title={t('playerpanel-status-organs', {}, 'Organs')}>
            <LabeledList>
              {organs.map((organ) => (
                <LabeledList.Item key={organ.name} label={organ.name}>
                  <Box inline color={organ.failing ? 'bad' : organ.damage > 0 ? 'average' : 'good'}>
                    {organ.failing
                      ? t('playerpanel-status-failing', {}, 'Failing')
                      : `${organ.damage} / ${organ.max}`}
                  </Box>
                </LabeledList.Item>
              ))}
            </LabeledList>
          </Section>
        </Stack.Item>
      )}
    </Stack>
  );

  const rolesTab = (
    <Stack vertical>
      <Stack.Item>
        <Section title={t('playerpanel-roles-title', {}, 'Role and antagonists')}>
          <LabeledList>
            <LabeledList.Item label={t('playerpanel-field-job', {}, 'Role')}>
              {show(data.job)}
            </LabeledList.Item>
            <LabeledList.Item label={t('playerpanel-roles-antags', {}, 'Antagonist roles')}>
              {antags.length === 0
                ? t('playerpanel-roles-none', {}, 'None')
                : antags.join(', ')}
            </LabeledList.Item>
          </LabeledList>
        </Section>
      </Stack.Item>
      <Stack.Item>
        {group(t('playerpanel-group-panels', {}, 'Panels'), [
          data.has_mind
            ? button('traitor', 'user-secret', t('playerpanel-act-traitor', {}, 'Traitor panel'))
            : button('initmind', 'brain', t('playerpanel-act-initmind', {}, 'Init mind'), {
                disabled: !canAdmin,
              }),
          data.has_mind
            ? button('skills', 'star', t('playerpanel-act-skills', {}, 'Skills'))
            : null,
          data.is_cyborg
            ? button('borgpanel', 'robot', t('playerpanel-act-borgpanel', {}, 'Borg panel'))
            : null,
          button('vv', 'list', t('playerpanel-act-vv', {}, 'View variables')),
        ])}
      </Stack.Item>
    </Stack>
  );

  const notesTab = (
    <Stack vertical>
      <Stack.Item>
        {group(t('playerpanel-group-notes', {}, 'Notes and messages'), [
          button('notes', 'sticky-note', t('playerpanel-act-notes', {}, 'Notes, messages, watchlist')),
          button('logs', 'file-alt', t('playerpanel-act-logs', {}, 'Logs')),
        ])}
      </Stack.Item>
      <Stack.Item>
        {group(t('playerpanel-group-bans', {}, 'Bans'), [
          button('ban', 'gavel', t('playerpanel-act-ban', {}, 'Ban'), {
            color: 'bad',
            disabled: !canBan,
          }),
          button('unbans', 'search', t('playerpanel-act-unbans', {}, 'Ban history'), {
            disabled: !canBan,
          }),
          data.centcom_enabled
            ? button('centcom', 'globe', t('playerpanel-act-centcom', {}, 'CentCom ban database'))
            : null,
        ])}
      </Stack.Item>
      {hasClient && (
        <Stack.Item>
          {group(t('playerpanel-group-related', {}, 'Related accounts'), [
            button('related', 'fingerprint', t('playerpanel-act-related-cid', {}, 'By CID'), {
              params: { by: 'cid' },
            }),
            button('related', 'network-wired', t('playerpanel-act-related-ip', {}, 'By IP'), {
              params: { by: 'ip' },
            }),
          ])}
        </Stack.Item>
      )}
    </Stack>
  );

  return (
    <Window
      title={`${t('playerpanel-title', {}, 'Player panel')}: ${show(data.key || data.ckey)}`}
      width={width}
      height={height}
      theme="admin"
    >
      <Window.Content scrollable>
        <Stack vertical>
          <Stack.Item>{header}</Stack.Item>
          <Stack.Item>
            <Tabs>
              {TABS.map((entry) => (
                <Tabs.Tab
                  key={entry.id}
                  icon={entry.icon}
                  selected={tab === entry.id}
                  onClick={() => setTab(entry.id)}
                >
                  {t(`playerpanel-tab-${entry.id}`, {}, entry.label)}
                </Tabs.Tab>
              ))}
            </Tabs>
          </Stack.Item>
          <Stack.Item>
            {tab === 'info' && infoTab}
            {tab === 'actions' && actionsTab}
            {tab === 'status' && statusTab}
            {tab === 'roles' && rolesTab}
            {tab === 'notes' && notesTab}
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
}
