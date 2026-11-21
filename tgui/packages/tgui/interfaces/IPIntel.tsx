import { useState } from 'react';
import {
  Box,
  Button,
  Input,
  LabeledList,
  NoticeBox,
  ProgressBar,
  Section,
  Stack,
  Table,
  Tabs,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useNumber, useT } from '../i18n';
import { Window } from '../layouts';

type LookupResult = {
  query: string;
  ckey: string | null;
  address: string;
  found: BooleanLike;
  score: number | null;
  date: string | null;
  checked_by: string | null;
  bad: BooleanLike;
  whitelisted: BooleanLike;
};

type WhitelistEntry = {
  ckey: string;
  admin: string;
};

type HistoryEntry = {
  time: string;
  ckey: string | null;
  address: string;
  state: string;
  score: number | null;
  admin: string | null;
};

type Data = {
  enabled: BooleanLike;
  problems: string[];
  email: string;
  base: string;
  db_online: BooleanLike;
  rate_limit: number;
  rate_used: number;
  cache_days: number;
  cache_memory: number;
  cache_rows: number;
  threshold: number;
  reject_bad: BooleanLike;
  reject_unknown: BooleanLike;
  reject_rate_limited: BooleanLike;
  exempt_playtime: number;
  result: LookupResult | null;
  feedback: string | null;
  last_query: string;
  whitelist: WhitelistEntry[];
  history: HistoryEntry[];
};

enum Tab {
  Status,
  Lookup,
  Whitelist,
  History,
}

function percent(score: number | null): string {
  return score === null || score === undefined
    ? '-'
    : `${Math.round(score * 100)}%`;
}

function useYesNo() {
  const t = useT();
  return (value: BooleanLike) =>
    value ? t('ipintel-yes', {}, 'Yes') : t('ipintel-no', {}, 'No');
}

function StatusTab() {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const yesNo = useYesNo();
  const rateRatio = data.rate_limit > 0 ? data.rate_used / data.rate_limit : 0;

  return (
    <Stack vertical>
      <Stack.Item>
        <Section
          title={t('ipintel-status-title', {}, 'Subsystem')}
          buttons={
            <Button icon="sync" onClick={() => act('reload')}>
              {t('ipintel-reload', {}, 'Reload')}
            </Button>
          }
        >
          <LabeledList>
            <LabeledList.Item label={t('ipintel-status-state', {}, 'State')}>
              <Box color={data.enabled ? 'good' : 'bad'} bold>
                {data.enabled
                  ? t('ipintel-status-enabled', {}, 'Enabled')
                  : t('ipintel-status-disabled', {}, 'Disabled')}
              </Box>
              {data.problems.map((problem) => (
                <Box key={problem} color="bad">
                  {t(`ipintel-problem-${problem}`, {}, problem)}
                </Box>
              ))}
            </LabeledList.Item>
            <LabeledList.Item label={t('ipintel-status-email', {}, 'Contact email')}>
              {data.email || '-'}
            </LabeledList.Item>
            <LabeledList.Item label={t('ipintel-status-base', {}, 'Query host')}>
              {data.base || '-'}
            </LabeledList.Item>
            <LabeledList.Item label={t('ipintel-status-database', {}, 'Database')}>
              <Box color={data.db_online ? 'good' : 'bad'}>
                {data.db_online
                  ? t('ipintel-status-db-online', {}, 'Connected')
                  : t('ipintel-status-db-offline', {}, 'Not connected')}
              </Box>
            </LabeledList.Item>
          </LabeledList>
        </Section>
      </Stack.Item>
      <Stack.Item>
        <Section title={t('ipintel-limits-title', {}, 'Limits and cache')}>
          <LabeledList>
            <LabeledList.Item label={t('ipintel-rate', {}, 'Requests this minute')}>
              <ProgressBar
                value={rateRatio}
                ranges={{
                  good: [-Infinity, 0.6],
                  average: [0.6, 0.9],
                  bad: [0.9, Infinity],
                }}
              >
                {data.rate_used} / {data.rate_limit}
              </ProgressBar>
            </LabeledList.Item>
            <LabeledList.Item label={t('ipintel-cache-memory', {}, 'Cache in memory')}>
              {data.cache_memory}
            </LabeledList.Item>
            <LabeledList.Item label={t('ipintel-cache-rows', {}, 'Records in database')}>
              {data.cache_rows}
            </LabeledList.Item>
            <LabeledList.Item label={t('ipintel-cache-days', {}, 'Cache lifetime')}>
              {t('ipintel-days', { count: data.cache_days }, `${data.cache_days} days`)}
            </LabeledList.Item>
            <LabeledList.Item label={t('ipintel-threshold', {}, 'Risk threshold')}>
              {percent(data.threshold)}
            </LabeledList.Item>
            <LabeledList.Item label={t('ipintel-exempt', {}, 'Exempt after living playtime')}>
              {t('ipintel-minutes', { count: data.exempt_playtime }, `${data.exempt_playtime} min`)}
            </LabeledList.Item>
          </LabeledList>
        </Section>
      </Stack.Item>
      <Stack.Item>
        <Section title={t('ipintel-reject-title', {}, 'Connection rejection')}>
          <LabeledList>
            <LabeledList.Item label={t('ipintel-reject-bad', {}, 'Reject flagged VPNs')}>
              {yesNo(data.reject_bad)}
            </LabeledList.Item>
            <LabeledList.Item label={t('ipintel-reject-unknown', {}, 'Reject on errors')}>
              {yesNo(data.reject_unknown)}
            </LabeledList.Item>
            <LabeledList.Item label={t('ipintel-reject-rate', {}, 'Reject when rate limited')}>
              {yesNo(data.reject_rate_limited)}
            </LabeledList.Item>
          </LabeledList>
        </Section>
      </Stack.Item>
    </Stack>
  );
}

function LookupTab() {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const yesNo = useYesNo();
  const [query, setQuery] = useState(data.last_query || '');
  const result = data.result;

  return (
    <Stack vertical>
      <Stack.Item>
        <Section title={t('ipintel-lookup-title', {}, 'Search')}>
          <Stack>
            <Stack.Item grow>
              <Input
                fluid
                value={query}
                placeholder={t('ipintel-lookup-placeholder', {}, 'Ckey or IP address')}
                onChange={setQuery}
                onEnter={(value) => act('search', { query: value })}
              />
            </Stack.Item>
            <Stack.Item>
              <Button
                icon="search"
                disabled={!query.trim()}
                onClick={() => act('search', { query })}
              >
                {t('ipintel-lookup-button', {}, 'Search')}
              </Button>
            </Stack.Item>
          </Stack>
          {data.feedback && (
            <NoticeBox mt={1} danger>
              {t(`ipintel-error-${data.feedback}`, {}, data.feedback)}
            </NoticeBox>
          )}
        </Section>
      </Stack.Item>
      {result && (
        <Stack.Item>
          <Section
            title={t('ipintel-result-title', {}, 'Result')}
            buttons={
              <>
                <Button
                  icon="sync"
                  color="average"
                  onClick={() => act('refresh')}
                >
                  {t('ipintel-refresh', {}, 'Refresh')}
                </Button>
                <Button
                  icon="trash"
                  color="bad"
                  disabled={!result.found}
                  onClick={() => act('reset')}
                >
                  {t('ipintel-reset', {}, 'Reset')}
                </Button>
              </>
            }
          >
            <LabeledList>
              <LabeledList.Item label={t('ipintel-result-ckey', {}, 'Ckey')}>
                {result.ckey || '-'}
              </LabeledList.Item>
              <LabeledList.Item label={t('ipintel-result-address', {}, 'IP address')}>
                {result.address}
              </LabeledList.Item>
              <LabeledList.Item label={t('ipintel-result-score', {}, 'Risk score')}>
                {result.found ? (
                  <Box color={result.bad ? 'bad' : 'good'} bold>
                    {percent(result.score)}{' '}
                    {result.bad
                      ? t('ipintel-verdict-bad', {}, '(VPN suspected)')
                      : t('ipintel-verdict-good', {}, '(clean)')}
                  </Box>
                ) : (
                  <Box color="label">
                    {t('ipintel-result-missing', {}, 'No record')}
                  </Box>
                )}
              </LabeledList.Item>
              <LabeledList.Item label={t('ipintel-result-date', {}, 'Checked')}>
                {result.date || '-'}
              </LabeledList.Item>
              <LabeledList.Item label={t('ipintel-result-by', {}, 'Checked by')}>
                {result.checked_by === 'auto'
                  ? t('ipintel-source-auto', {}, 'automatic check')
                  : result.checked_by || '-'}
              </LabeledList.Item>
              <LabeledList.Item label={t('ipintel-result-whitelisted', {}, 'VPN whitelist')}>
                {yesNo(result.whitelisted)}
                {!!result.ckey && (
                  <Button
                    ml={1}
                    icon={result.whitelisted ? 'user-minus' : 'user-plus'}
                    color={result.whitelisted ? 'bad' : 'good'}
                    onClick={() =>
                      act(result.whitelisted ? 'whitelist_remove' : 'whitelist_add', {
                        ckey: result.ckey,
                      })
                    }
                  >
                    {result.whitelisted
                      ? t('ipintel-whitelist-remove', {}, 'Revoke')
                      : t('ipintel-whitelist-add', {}, 'Allow')}
                  </Button>
                )}
              </LabeledList.Item>
            </LabeledList>
          </Section>
        </Stack.Item>
      )}
    </Stack>
  );
}

function WhitelistTab() {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const [ckey, setCkey] = useState('');
  const [search, setSearch] = useState('');
  const needle = search.trim().toLowerCase();
  const entries = data.whitelist.filter(
    (entry) => !needle || entry.ckey.toLowerCase().includes(needle),
  );

  return (
    <Stack vertical>
      <Stack.Item>
        <Section title={t('ipintel-whitelist-title', {}, 'Allow a player')}>
          {data.feedback && (
            <NoticeBox danger>
              {t(`ipintel-error-${data.feedback}`, {}, data.feedback)}
            </NoticeBox>
          )}
          <Stack>
            <Stack.Item grow>
              <Input
                fluid
                value={ckey}
                placeholder={t('ipintel-whitelist-ckey', {}, 'Player ckey')}
                onChange={setCkey}
              />
            </Stack.Item>
            <Stack.Item>
              <Button
                icon="user-plus"
                color="good"
                disabled={!ckey.trim()}
                onClick={() => {
                  act('whitelist_add', { ckey });
                  setCkey('');
                }}
              >
                {t('ipintel-whitelist-add', {}, 'Allow')}
              </Button>
            </Stack.Item>
          </Stack>
        </Section>
      </Stack.Item>
      <Stack.Item>
        <Section
          title={t('ipintel-whitelist-list', {}, 'Whitelisted players')}
          buttons={
            <Input
              value={search}
              placeholder={t('ipintel-search', {}, 'Search...')}
              onChange={setSearch}
            />
          }
        >
          {entries.length === 0 && (
            <Box color="label">
              {t('ipintel-whitelist-empty', {}, 'Nobody is whitelisted')}
            </Box>
          )}
          <Table>
            {entries.map((entry) => (
              <Table.Row key={entry.ckey} className="candystripe">
                <Table.Cell bold>{entry.ckey}</Table.Cell>
                <Table.Cell color="label">
                  {t('ipintel-whitelist-by', { admin: entry.admin }, `added by ${entry.admin}`)}
                </Table.Cell>
                <Table.Cell collapsing>
                  <Button
                    icon="times"
                    color="bad"
                    onClick={() => act('whitelist_remove', { ckey: entry.ckey })}
                  >
                    {t('ipintel-whitelist-remove', {}, 'Revoke')}
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table>
        </Section>
      </Stack.Item>
    </Stack>
  );
}

function HistoryTab(props: { onOpen: () => void }) {
  const { act, data } = useBackend<Data>();
  const t = useT();

  return (
    <Section title={t('ipintel-history-title', {}, 'Recent checks')}>
      {data.history.length === 0 && (
        <Box color="label">{t('ipintel-history-empty', {}, 'No checks yet')}</Box>
      )}
      <Table>
        {data.history.length > 0 && (
          <Table.Row header>
            <Table.Cell>{t('ipintel-history-time', {}, 'Time')}</Table.Cell>
            <Table.Cell>{t('ipintel-history-player', {}, 'Player')}</Table.Cell>
            <Table.Cell>{t('ipintel-history-address', {}, 'IP address')}</Table.Cell>
            <Table.Cell>{t('ipintel-history-score', {}, 'Score')}</Table.Cell>
            <Table.Cell>{t('ipintel-history-state', {}, 'Verdict')}</Table.Cell>
            <Table.Cell>{t('ipintel-history-source', {}, 'Source')}</Table.Cell>
            <Table.Cell collapsing />
          </Table.Row>
        )}
        {data.history.map((entry, index) => (
          <Table.Row key={index} className="candystripe">
            <Table.Cell>{entry.time}</Table.Cell>
            <Table.Cell>{entry.ckey || '-'}</Table.Cell>
            <Table.Cell>{entry.address}</Table.Cell>
            <Table.Cell>{percent(entry.score)}</Table.Cell>
            <Table.Cell
              color={
                entry.state === 'good_ip'
                  ? 'good'
                  : entry.state === 'bad_ip'
                    ? 'bad'
                    : 'average'
              }
            >
              {t(`ipintel-state-${entry.state}`, {}, entry.state)}
            </Table.Cell>
            <Table.Cell>
              {entry.admin ?? t('ipintel-source-auto', {}, 'automatic check')}
            </Table.Cell>
            <Table.Cell collapsing>
              <Button
                icon="search"
                onClick={() => {
                  act('search', { query: entry.address });
                  props.onOpen();
                }}
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </Section>
  );
}

export function IPIntel() {
  const t = useT();
  const width = useNumber('ipintel-window-width', 760);
  const height = useNumber('ipintel-window-height', 640);
  const [tab, setTab] = useState(Tab.Status);

  return (
    <Window
      title={t('ipintel-title', {}, 'IPIntel')}
      width={width}
      height={height}
      theme="admin"
    >
      <Window.Content scrollable>
        <Tabs>
          <Tabs.Tab selected={tab === Tab.Status} onClick={() => setTab(Tab.Status)}>
            {t('ipintel-tab-status', {}, 'Status')}
          </Tabs.Tab>
          <Tabs.Tab selected={tab === Tab.Lookup} onClick={() => setTab(Tab.Lookup)}>
            {t('ipintel-tab-lookup', {}, 'Lookup')}
          </Tabs.Tab>
          <Tabs.Tab
            selected={tab === Tab.Whitelist}
            onClick={() => setTab(Tab.Whitelist)}
          >
            {t('ipintel-tab-whitelist', {}, 'Whitelist')}
          </Tabs.Tab>
          <Tabs.Tab selected={tab === Tab.History} onClick={() => setTab(Tab.History)}>
            {t('ipintel-tab-history', {}, 'History')}
          </Tabs.Tab>
        </Tabs>
        {tab === Tab.Status && <StatusTab />}
        {tab === Tab.Lookup && <LookupTab />}
        {tab === Tab.Whitelist && <WhitelistTab />}
        {tab === Tab.History && (
          <HistoryTab onOpen={() => setTab(Tab.Lookup)} />
        )}
      </Window.Content>
    </Window>
  );
}
