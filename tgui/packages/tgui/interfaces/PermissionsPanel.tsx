import { useState } from 'react';
import {
  Box,
  Button,
  Dropdown,
  Input,
  NoticeBox,
  Section,
  Stack,
  Table,
  Tabs,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useNumber, useT } from '../i18n';
import { Window } from '../layouts';

type FlagDef = {
  name: string;
  value: number;
};

type AdminEntry = {
  key: string;
  ckey: string;
  rank: string;
  ranks: string[];
  flags: number;
  deadmined: BooleanLike;
  blocked_2fa: BooleanLike;
  online: BooleanLike;
  can_manage: BooleanLike;
  rank_protected: BooleanLike;
  flags_protected: BooleanLike;
};

type RankEntry = {
  name: string;
  source: string;
  held: number;
  flags: number;
  exclude: number;
  edit: number;
  can_modify: BooleanLike;
  can_delete: BooleanLike;
};

type RankOption = {
  name: string;
  permanent_ok: BooleanLike;
};

type InvalidAdmin = {
  key: string;
  rank: string;
};

type LogRow = {
  datetime: string;
  round_id: string;
  admin: string;
  operation: string;
  target: string;
  log: string;
};

type LogFilter = {
  target: string;
  actor: string;
  operation: string;
};

type Data = {
  flags: FlagDef[];
  operations: string[];
  initial_page: number;
  ranks: RankEntry[];
  invalid_admins: InvalidAdmin[];
  unused_ranks: RankEntry[];
  logs: LogRow[];
  log_total: number;
  log_per_page: number;
  log_page: number;
  log_filter: LogFilter;
  db_connected: BooleanLike;
  can_edit_flags: number;
  can_permanent: BooleanLike;
  can_create_rank: BooleanLike;
  legacy_only: BooleanLike;
  self_key: string;
  assignable: RankOption[];
  admins: AdminEntry[];
};

enum Tab {
  Admins,
  Ranks,
  Logging,
  Housekeeping,
}

const NONE_OPERATION = 'none';

const FLAG_KEYS: Record<string, string> = {
  BUILDMODE: 'permissions-flag-buildmode',
  ADMIN: 'permissions-flag-admin',
  BAN: 'permissions-flag-ban',
  FUN: 'permissions-flag-fun',
  SERVER: 'permissions-flag-server',
  DEBUG: 'permissions-flag-debug',
  POSSESS: 'permissions-flag-possess',
  PERMISSIONS: 'permissions-flag-permissions',
  STEALTH: 'permissions-flag-stealth',
  POLL: 'permissions-flag-poll',
  VAREDIT: 'permissions-flag-varedit',
  SOUND: 'permissions-flag-sound',
  SPAWN: 'permissions-flag-spawn',
  AUTOLOGIN: 'permissions-flag-autologin',
  DBRANKS: 'permissions-flag-dbranks',
  ROLEWHITELISTMENU: 'permissions-flag-rolewhitelistmenu',
  ROLEWHITELISTALL: 'permissions-flag-rolewhitelistall',
};

const SOURCE_KEYS: Record<string, string> = {
  rank_local: 'permissions-source-local',
  rank_txt: 'permissions-source-config',
  rank_db: 'permissions-source-database',
  rank_backup: 'permissions-source-backup',
  rank_temp: 'permissions-source-temporary',
};

const OPERATION_KEYS: Record<string, string> = {
  'add admin': 'permissions-op-admin-added',
  'remove admin': 'permissions-op-admin-removed',
  'change admin rank': 'permissions-op-admin-rank-changed',
  'add rank': 'permissions-op-rank-added',
  'remove rank': 'permissions-op-rank-removed',
  'change rank flags': 'permissions-op-rank-changed',
  none: 'permissions-op-none',
};

function useFlagLabel() {
  const t = useT();
  return (name: string) =>
    FLAG_KEYS[name] ? t(FLAG_KEYS[name], {}, name) : name;
}

function useOperationLabel() {
  const t = useT();
  return (operation: string) =>
    OPERATION_KEYS[operation]
      ? t(OPERATION_KEYS[operation], {}, operation)
      : operation;
}

function FlagSummary(props: {
  flags: FlagDef[];
  value: number;
  prefix?: string;
}) {
  const { flags, value, prefix = '' } = props;
  const t = useT();
  const label = useFlagLabel();
  const names = flags
    .filter((flag) => value & flag.value)
    .map((flag) => label(flag.name));
  return (
    <>
      {names.length
        ? names.map((name) => `${prefix}${name}`).join(', ')
        : t('permissions-flags-none', {}, 'NONE')}
    </>
  );
}

function FlagPicker(props: {
  flags: FlagDef[];
  value: number;
  allowed: number;
  onChange: (value: number) => void;
}) {
  const { flags, value, allowed, onChange } = props;
  const label = useFlagLabel();
  return (
    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2px',
      }}
    >
      {flags.map((flag) => (
        <Button.Checkbox
          key={flag.name}
          checked={!!(value & flag.value)}
          disabled={!(allowed & flag.value)}
          onClick={() => onChange(value ^ flag.value)}
        >
          {label(flag.name)}
        </Button.Checkbox>
      ))}
    </Box>
  );
}

function RankPicker(props: {
  options: RankOption[];
  chosen: string[];
  onChange: (chosen: string[]) => void;
}) {
  const { options, chosen, onChange } = props;
  return (
    <Stack wrap>
      {options.map((option) => (
        <Stack.Item key={option.name}>
          <Button
            selected={chosen.includes(option.name)}
            onClick={() =>
              onChange(
                chosen.includes(option.name)
                  ? chosen.filter((name) => name !== option.name)
                  : [...chosen, option.name],
              )
            }
          >
            {option.name}
          </Button>
        </Stack.Item>
      ))}
    </Stack>
  );
}

type Editing = {
  key: string;
  mode: 'rank' | 'flags';
  ranks: string[];
  flags: number;
};

function AdminsTab() {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const [search, setSearch] = useState('');
  const [adding, setAdding] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newRanks, setNewRanks] = useState<string[]>([]);
  const [permanent, setPermanent] = useState(false);
  const [editing, setEditing] = useState<Editing | null>(null);

  const permanentMode = !!data.can_permanent && permanent;
  const options = data.assignable.filter(
    (rank) => !permanentMode || rank.permanent_ok,
  );
  const allowedNames = options.map((rank) => rank.name);

  const admins = data.admins
    .filter(
      (admin) =>
        !search ||
        admin.key.toLowerCase().includes(search.toLowerCase()) ||
        admin.rank.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => a.key.localeCompare(b.key));

  return (
    <Stack vertical>
      {!!data.legacy_only && (
        <Stack.Item>
          <NoticeBox warning>
            {t(
              'permissions-legacy-only',
              {},
              'Database rank loading is disabled, only temporary changes can be made.',
            )}
          </NoticeBox>
        </Stack.Item>
      )}
      <Stack.Item>
        <Section
          title={t('permissions-admins-title', {}, 'Admins')}
          buttons={
            <>
              {!!data.can_permanent && (
                <Button.Checkbox
                  checked={permanent}
                  tooltip={t(
                    'permissions-permanent-hint',
                    {},
                    'Permanent changes are saved to the database for future rounds, temporary ones affect only the current round',
                  )}
                  onClick={() => {
                    setPermanent(!permanent);
                    setNewRanks([]);
                  }}
                >
                  {t('permissions-permanent', {}, 'Permanent')}
                </Button.Checkbox>
              )}
              <Button
                icon="user-plus"
                color="good"
                selected={adding}
                onClick={() => setAdding(!adding)}
              >
                {t('permissions-admin-add', {}, 'Add admin')}
              </Button>
            </>
          }
        >
          <Input
            fluid
            value={search}
            placeholder={t(
              'permissions-admins-search',
              {},
              'Search by key or rank...',
            )}
            onChange={setSearch}
          />
        </Section>
      </Stack.Item>
      {adding && (
        <Stack.Item>
          <Section title={t('permissions-admin-add', {}, 'Add admin')}>
            <Stack vertical>
              <Stack.Item>
                <Input
                  fluid
                  value={newKey}
                  placeholder={t(
                    'permissions-admin-key',
                    {},
                    'Key of the new admin',
                  )}
                  onChange={setNewKey}
                />
              </Stack.Item>
              <Stack.Item>
                <Box color="label" mb={1}>
                  {t('permissions-ranks-pick', {}, 'Ranks')}
                </Box>
                <RankPicker
                  options={options}
                  chosen={newRanks.filter((name) => allowedNames.includes(name))}
                  onChange={setNewRanks}
                />
              </Stack.Item>
              <Stack.Item>
                <Button
                  icon="check"
                  color="good"
                  disabled={!newKey.trim() || !newRanks.length}
                  onClick={() => {
                    act('rights', {
                      task: 'add',
                      key: newKey.trim(),
                      ranks: newRanks.filter((name) =>
                        allowedNames.includes(name),
                      ),
                      permanent: permanentMode,
                    });
                    setNewKey('');
                    setNewRanks([]);
                    setAdding(false);
                  }}
                >
                  {t('permissions-admin-add-confirm', {}, 'Add')}
                </Button>
              </Stack.Item>
            </Stack>
          </Section>
        </Stack.Item>
      )}
      {editing && (
        <Stack.Item>
          <Section
            title={
              editing.mode === 'rank'
                ? t(
                    'permissions-edit-rank-title',
                    { key: editing.key },
                    `Ranks of ${editing.key}`,
                  )
                : t(
                    'permissions-edit-flags-title',
                    { key: editing.key },
                    `Rights of ${editing.key}`,
                  )
            }
            buttons={
              <Button icon="times" onClick={() => setEditing(null)}>
                {t('permissions-cancel', {}, 'Cancel')}
              </Button>
            }
          >
            {editing.mode === 'rank' ? (
              <Stack vertical>
                <Stack.Item>
                  <RankPicker
                    options={options}
                    chosen={editing.ranks.filter((name) =>
                      allowedNames.includes(name),
                    )}
                    onChange={(ranks) => setEditing({ ...editing, ranks })}
                  />
                </Stack.Item>
                <Stack.Item>
                  <Button
                    icon="check"
                    color="good"
                    disabled={
                      !editing.ranks.filter((name) =>
                        allowedNames.includes(name),
                      ).length
                    }
                    onClick={() => {
                      act('rights', {
                        task: 'rank',
                        key: editing.key,
                        ranks: editing.ranks.filter((name) =>
                          allowedNames.includes(name),
                        ),
                        permanent: permanentMode,
                      });
                      setEditing(null);
                    }}
                  >
                    {t('permissions-save', {}, 'Save')}
                  </Button>
                </Stack.Item>
              </Stack>
            ) : (
              <Stack vertical>
                <Stack.Item>
                  <Box color="label" mb={1}>
                    {t(
                      'permissions-flags-temporary',
                      {},
                      'This affects only this admin and only the current round.',
                    )}
                  </Box>
                  <FlagPicker
                    flags={data.flags}
                    value={editing.flags}
                    allowed={data.can_edit_flags}
                    onChange={(flags) => setEditing({ ...editing, flags })}
                  />
                </Stack.Item>
                <Stack.Item>
                  <Button
                    icon="check"
                    color="good"
                    onClick={() => {
                      act('rights', {
                        task: 'permissions',
                        key: editing.key,
                        flags: editing.flags,
                      });
                      setEditing(null);
                    }}
                  >
                    {t('permissions-save', {}, 'Save')}
                  </Button>
                </Stack.Item>
              </Stack>
            )}
          </Section>
        </Stack.Item>
      )}
      <Stack.Item>
        <Section>
          <Table>
            <Table.Row header>
              <Table.Cell>{t('permissions-col-key', {}, 'CKEY')}</Table.Cell>
              <Table.Cell>{t('permissions-col-rank', {}, 'RANK')}</Table.Cell>
              <Table.Cell>
                {t('permissions-col-rights', {}, 'PERMISSIONS')}
              </Table.Cell>
              <Table.Cell collapsing />
            </Table.Row>
            {admins.map((admin) => (
              <Table.Row key={admin.ckey} className="candystripe">
                <Table.Cell bold verticalAlign="top">
                  <Box color={admin.online ? 'good' : 'label'}>
                    {admin.key}
                  </Box>
                  {!!admin.deadmined && (
                    <Box color="average" fontSize="0.85em">
                      {t('permissions-deadmined', {}, 'Deadmined')}
                    </Box>
                  )}
                </Table.Cell>
                <Table.Cell verticalAlign="top">{admin.rank}</Table.Cell>
                <Table.Cell verticalAlign="top" color="label">
                  <FlagSummary flags={data.flags} value={admin.flags} />
                </Table.Cell>
                <Table.Cell collapsing verticalAlign="top">
                  <Button
                    icon="user-tag"
                    disabled={!admin.can_manage || !!admin.rank_protected}
                    tooltip={t(
                      'permissions-action-rank',
                      {},
                      'Change rank',
                    )}
                    onClick={() =>
                      setEditing({
                        key: admin.key,
                        mode: 'rank',
                        ranks: admin.ranks,
                        flags: admin.flags,
                      })
                    }
                  />
                  <Button
                    icon="key"
                    disabled={!admin.can_manage || !!admin.flags_protected}
                    tooltip={t(
                      'permissions-action-flags',
                      {},
                      'Change rights',
                    )}
                    onClick={() =>
                      setEditing({
                        key: admin.key,
                        mode: 'flags',
                        ranks: admin.ranks,
                        flags: admin.flags,
                      })
                    }
                  />
                  <Button
                    icon={admin.deadmined ? 'user-shield' : 'user-slash'}
                    disabled={!admin.can_manage}
                    tooltip={
                      admin.deadmined
                        ? t('permissions-action-readmin', {}, 'Readmin')
                        : t('permissions-action-deadmin', {}, 'Deadmin')
                    }
                    onClick={() =>
                      act('rights', {
                        task: admin.deadmined ? 'activate' : 'deactivate',
                        key: admin.key,
                      })
                    }
                  />
                  <Button
                    icon="sync"
                    tooltip={t(
                      'permissions-action-sync',
                      {},
                      'Sync with the database',
                    )}
                    onClick={() =>
                      act('rights', { task: 'sync', key: admin.key })
                    }
                  />
                  {!!admin.blocked_2fa && (
                    <Button
                      icon="lock-open"
                      color="average"
                      tooltip={t(
                        'permissions-action-verify',
                        {},
                        'Verify 2FA',
                      )}
                      onClick={() =>
                        act('rights', { task: 'verify', key: admin.key })
                      }
                    />
                  )}
                  <Button.Confirm
                    icon="trash"
                    color="bad"
                    disabled={!admin.can_manage}
                    tooltip={t('permissions-action-remove', {}, 'Remove admin')}
                    confirmContent={t(
                      'permissions-confirm',
                      {},
                      'Are you sure?',
                    )}
                    onClick={() =>
                      act('rights', {
                        task: 'remove',
                        key: admin.key,
                        permanent: permanentMode,
                      })
                    }
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table>
        </Section>
      </Stack.Item>
    </Stack>
  );
}

function RankDetails(props: { rank: RankEntry; flags: FlagDef[] }) {
  const { rank, flags } = props;
  const t = useT();
  return (
    <Box color="label">
      <Box>
        {t('permissions-rank-permissions', {}, 'Permissions')}
        {': '}
        <FlagSummary flags={flags} value={rank.flags} prefix="+" />
      </Box>
      <Box>
        {t('permissions-rank-denied', {}, 'Denied')}
        {': '}
        <FlagSummary flags={flags} value={rank.exclude} prefix="-" />
      </Box>
      <Box>
        {t('permissions-rank-edit', {}, 'Allowed to edit')}
        {': '}
        <FlagSummary flags={flags} value={rank.edit} prefix="*" />
      </Box>
    </Box>
  );
}

type RankDraft = {
  name: string;
  flags: number;
  exclude: number;
  edit: number;
};

function RanksTab() {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const [permanent, setPermanent] = useState(false);
  const [draft, setDraft] = useState<RankDraft>({
    name: '',
    flags: 0,
    exclude: 0,
    edit: 0,
  });
  const [editing, setEditing] = useState<RankDraft | null>(null);

  const sections: [string, string, keyof RankDraft][] = [
    ['Rights', t('permissions-rank-permissions', {}, 'Permissions'), 'flags'],
    ['Excluded Rights', t('permissions-rank-denied', {}, 'Denied'), 'exclude'],
    ['Edit Rights', t('permissions-rank-edit', {}, 'Allowed to edit'), 'edit'],
  ];

  const ranks = data.ranks.filter(
    (rank) => !search || rank.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Stack vertical>
      <Stack.Item>
        <Section
          title={t('permissions-ranks-title', {}, 'Ranks')}
          buttons={
            <>
              {!!data.can_permanent && !data.legacy_only && (
                <Button.Checkbox
                  checked={permanent}
                  onClick={() => setPermanent(!permanent)}
                >
                  {t('permissions-permanent', {}, 'Permanent')}
                </Button.Checkbox>
              )}
              {!!data.can_create_rank && (
                <Button
                  icon="plus"
                  color="good"
                  selected={creating}
                  onClick={() => setCreating(!creating)}
                >
                  {t('permissions-rank-create', {}, 'Create rank')}
                </Button>
              )}
            </>
          }
        >
          <Input
            fluid
            value={search}
            placeholder={t('permissions-ranks-search', {}, 'Search ranks...')}
            onChange={setSearch}
          />
        </Section>
      </Stack.Item>
      {creating && (
        <Stack.Item>
          <Section title={t('permissions-rank-create', {}, 'Create rank')}>
            <Stack vertical>
              <Stack.Item>
                <Input
                  fluid
                  value={draft.name}
                  placeholder={t(
                    'permissions-rank-name',
                    {},
                    'Name of the new rank',
                  )}
                  onChange={(name) => setDraft({ ...draft, name })}
                />
              </Stack.Item>
              {sections.map(([, title, field]) => (
                <Stack.Item key={field}>
                  <Box color="label" mb={1}>
                    {title}
                  </Box>
                  <FlagPicker
                    flags={data.flags}
                    value={draft[field] as number}
                    allowed={data.can_edit_flags}
                    onChange={(value) => setDraft({ ...draft, [field]: value })}
                  />
                </Stack.Item>
              ))}
              <Stack.Item>
                <Button
                  icon="check"
                  color="good"
                  disabled={!draft.name.trim()}
                  onClick={() => {
                    act('add_rank', {
                      name: draft.name.trim(),
                      flags: draft.flags,
                      exclude: draft.exclude,
                      edit: draft.edit,
                      permanent: !!data.can_permanent && permanent,
                    });
                    setDraft({ name: '', flags: 0, exclude: 0, edit: 0 });
                    setCreating(false);
                  }}
                >
                  {t('permissions-rank-create-confirm', {}, 'Create')}
                </Button>
              </Stack.Item>
            </Stack>
          </Section>
        </Stack.Item>
      )}
      {editing && (
        <Stack.Item>
          <Section
            title={t(
              'permissions-rank-editing',
              { name: editing.name },
              `Editing ${editing.name}`,
            )}
            buttons={
              <Button icon="times" onClick={() => setEditing(null)}>
                {t('permissions-close', {}, 'Close')}
              </Button>
            }
          >
            <Stack vertical>
              {sections.map(([what, title, field]) => (
                <Stack.Item key={field}>
                  <Stack>
                    <Stack.Item grow>
                      <Box color="label" mb={1}>
                        {title}
                      </Box>
                      <FlagPicker
                        flags={data.flags}
                        value={editing[field] as number}
                        allowed={data.can_edit_flags}
                        onChange={(value) =>
                          setEditing({ ...editing, [field]: value })
                        }
                      />
                    </Stack.Item>
                    <Stack.Item>
                      <Button
                        icon="check"
                        color="good"
                        onClick={() =>
                          act('edit_rank', {
                            name: editing.name,
                            what,
                            flags: editing[field],
                          })
                        }
                      >
                        {t('permissions-save', {}, 'Save')}
                      </Button>
                    </Stack.Item>
                  </Stack>
                </Stack.Item>
              ))}
            </Stack>
          </Section>
        </Stack.Item>
      )}
      <Stack.Item>
        <Section>
          <Table>
            {ranks.map((rank) => (
              <Table.Row key={rank.name} className="candystripe">
                <Table.Cell verticalAlign="top">
                  <Box bold>{rank.name}</Box>
                  <Box color="label">
                    {t('permissions-rank-source', {}, 'Source')}
                    {': '}
                    {SOURCE_KEYS[rank.source]
                      ? t(SOURCE_KEYS[rank.source], {}, rank.source)
                      : rank.source}
                  </Box>
                  <Box color="label">
                    {t('permissions-rank-held', { count: rank.held }, 'Held by: ' + rank.held)}
                  </Box>
                </Table.Cell>
                <Table.Cell verticalAlign="top">
                  <RankDetails rank={rank} flags={data.flags} />
                </Table.Cell>
                <Table.Cell collapsing verticalAlign="top">
                  {!!rank.can_modify && (
                    <Button
                      icon="edit"
                      onClick={() =>
                        setEditing({
                          name: rank.name,
                          flags: rank.flags,
                          exclude: rank.exclude,
                          edit: rank.edit,
                        })
                      }
                    >
                      {t('permissions-edit', {}, 'Edit')}
                    </Button>
                  )}
                  {!!rank.can_delete && (
                    <Button.Confirm
                      icon="trash"
                      color="bad"
                      confirmContent={t(
                        'permissions-confirm',
                        {},
                        'Are you sure?',
                      )}
                      onClick={() => act('delete_rank', { name: rank.name })}
                    >
                      {t('permissions-delete', {}, 'Delete')}
                    </Button.Confirm>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table>
        </Section>
      </Stack.Item>
    </Stack>
  );
}

function LoggingTab() {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const operationLabel = useOperationLabel();
  const [target, setTarget] = useState(data.log_filter.target);
  const [actor, setActor] = useState(data.log_filter.actor);
  const [operation, setOperation] = useState(data.log_filter.operation);

  const pages = Math.max(1, Math.ceil(data.log_total / data.log_per_page));

  function search(page: number) {
    act('log_search', { target, actor, operation, page });
  }

  const operations = data.operations.map((value) => ({
    value,
    displayText: operationLabel(value),
  }));

  return (
    <Stack vertical>
      <Stack.Item>
        <Section title={t('permissions-log-title', {}, 'Logging')}>
          {!data.db_connected && (
            <NoticeBox warning>
              {t(
                'permissions-log-no-db',
                {},
                'The database is not connected.',
              )}
            </NoticeBox>
          )}
          <Stack wrap>
            <Stack.Item grow>
              <Input
                fluid
                value={target}
                placeholder={t(
                  'permissions-log-target',
                  {},
                  'Ckey modified',
                )}
                onChange={setTarget}
              />
            </Stack.Item>
            <Stack.Item grow>
              <Input
                fluid
                value={actor}
                placeholder={t('permissions-log-actor', {}, 'Acting admin')}
                onChange={setActor}
              />
            </Stack.Item>
            <Stack.Item grow>
              <Dropdown
                width="100%"
                options={operations}
                selected={operation || NONE_OPERATION}
                displayText={operationLabel(operation || NONE_OPERATION)}
                onSelected={setOperation}
              />
            </Stack.Item>
            <Stack.Item>
              <Button icon="search" onClick={() => search(0)}>
                {t('permissions-log-search', {}, 'Search')}
              </Button>
            </Stack.Item>
          </Stack>
        </Section>
      </Stack.Item>
      {pages > 1 && (
        <Stack.Item>
          <Section>
            <Button
              icon="chevron-left"
              disabled={data.log_page <= 0}
              onClick={() => search(data.log_page - 1)}
            />
            <Box inline mx={1}>
              {t(
                'permissions-log-page',
                { page: data.log_page + 1, pages },
                `Page ${data.log_page + 1} of ${pages}`,
              )}
            </Box>
            <Button
              icon="chevron-right"
              disabled={data.log_page + 1 >= pages}
              onClick={() => search(data.log_page + 1)}
            />
          </Section>
        </Stack.Item>
      )}
      <Stack.Item>
        <Section>
          {data.logs.length === 0 ? (
            <Box color="label">
              {t('permissions-log-empty', {}, 'No records found.')}
            </Box>
          ) : (
            <Table>
              {data.logs.map((row, index) => (
                <Table.Row key={index} className="candystripe">
                  <Table.Cell>
                    <Box bold>
                      {t(
                        'permissions-log-header',
                        {
                          datetime: row.datetime,
                          round: row.round_id,
                          admin: row.admin,
                          operation: operationLabel(row.operation),
                          target: row.target,
                        },
                        `${row.datetime} | Round ID ${row.round_id} | Admin ${row.admin} | Operation ${row.operation} on ${row.target}`,
                      )}
                    </Box>
                    <Box color="label">{row.log}</Box>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table>
          )}
        </Section>
      </Stack.Item>
    </Stack>
  );
}

function HousekeepingTab() {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const [fixing, setFixing] = useState<{ key: string; ranks: string[] } | null>(
    null,
  );

  const options = data.assignable.filter((rank) => rank.permanent_ok);

  return (
    <Stack vertical>
      <Stack.Item>
        <Section
          title={t('permissions-house-invalid', {}, 'Admin ckeys with invalid ranks')}
        >
          {data.invalid_admins.length === 0 ? (
            <Box color="label">
              {t('permissions-house-invalid-none', {}, 'No invalid ranks found.')}
            </Box>
          ) : (
            <Table>
              {data.invalid_admins.map((admin) => (
                <Table.Row
                  key={`${admin.key}-${admin.rank}`}
                  className="candystripe"
                >
                  <Table.Cell>
                    {t(
                      'permissions-house-invalid-line',
                      { key: admin.key, rank: admin.rank },
                      `${admin.key} has the non-existent rank ${admin.rank}`,
                    )}
                  </Table.Cell>
                  <Table.Cell collapsing>
                    <Button
                      icon="user-tag"
                      onClick={() => setFixing({ key: admin.key, ranks: [] })}
                    >
                      {t('permissions-action-rank', {}, 'Change rank')}
                    </Button>
                    <Button.Confirm
                      icon="trash"
                      color="bad"
                      confirmContent={t(
                        'permissions-confirm',
                        {},
                        'Are you sure?',
                      )}
                      onClick={() =>
                        act('housekeep_remove', { key: admin.key })
                      }
                    >
                      {t('permissions-delete', {}, 'Delete')}
                    </Button.Confirm>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table>
          )}
        </Section>
      </Stack.Item>
      {fixing && (
        <Stack.Item>
          <Section
            title={t(
              'permissions-edit-rank-title',
              { key: fixing.key },
              `Ranks of ${fixing.key}`,
            )}
            buttons={
              <Button icon="times" onClick={() => setFixing(null)}>
                {t('permissions-cancel', {}, 'Cancel')}
              </Button>
            }
          >
            <Stack vertical>
              <Stack.Item>
                <RankPicker
                  options={options}
                  chosen={fixing.ranks}
                  onChange={(ranks) => setFixing({ ...fixing, ranks })}
                />
              </Stack.Item>
              <Stack.Item>
                <Button
                  icon="check"
                  color="good"
                  disabled={!fixing.ranks.length}
                  onClick={() => {
                    act('housekeep_rank', {
                      key: fixing.key,
                      ranks: fixing.ranks,
                    });
                    setFixing(null);
                  }}
                >
                  {t('permissions-save', {}, 'Save')}
                </Button>
              </Stack.Item>
            </Stack>
          </Section>
        </Stack.Item>
      )}
      <Stack.Item>
        <Section
          title={t('permissions-house-unused', {}, 'Unused database ranks')}
        >
          {data.unused_ranks.length === 0 ? (
            <Box color="label">
              {t('permissions-house-unused-none', {}, 'No unused ranks found.')}
            </Box>
          ) : (
            <Table>
              {data.unused_ranks.map((rank) => (
                <Table.Row key={rank.name} className="candystripe">
                  <Table.Cell verticalAlign="top">
                    <Box bold>
                      {t(
                        'permissions-house-unused-line',
                        { rank: rank.name },
                        `Rank ${rank.name} is not held by any admin`,
                      )}
                    </Box>
                    <RankDetails rank={rank} flags={data.flags} />
                  </Table.Cell>
                  <Table.Cell collapsing verticalAlign="top">
                    {!!rank.can_delete && (
                      <Button.Confirm
                        icon="trash"
                        color="bad"
                        confirmContent={t(
                          'permissions-confirm',
                          {},
                          'Are you sure?',
                        )}
                        onClick={() => act('delete_rank', { name: rank.name })}
                      >
                        {t('permissions-delete', {}, 'Delete')}
                      </Button.Confirm>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table>
          )}
        </Section>
      </Stack.Item>
    </Stack>
  );
}

export function PermissionsPanel() {
  const { data } = useBackend<Data>();
  const t = useT();
  const windowWidth = useNumber('permissions-window-width', 980);
  const windowHeight = useNumber('permissions-window-height', 680);
  const [tab, setTab] = useState<Tab>(
    Math.min(Math.max((data.initial_page ?? 1) - 1, 0), Tab.Housekeeping),
  );

  return (
    <Window
      title={t('permissions-title', {}, 'Permissions Panel')}
      width={windowWidth}
      height={windowHeight}
      theme="admin"
    >
      <Window.Content scrollable>
        <Tabs>
          <Tabs.Tab
            selected={tab === Tab.Admins}
            onClick={() => setTab(Tab.Admins)}
          >
            {t('permissions-tab-admins', {}, 'Permissions')}
          </Tabs.Tab>
          <Tabs.Tab
            selected={tab === Tab.Ranks}
            onClick={() => setTab(Tab.Ranks)}
          >
            {t('permissions-tab-ranks', {}, 'Ranks')}
          </Tabs.Tab>
          <Tabs.Tab
            selected={tab === Tab.Logging}
            onClick={() => setTab(Tab.Logging)}
          >
            {t('permissions-tab-logging', {}, 'Logging')}
          </Tabs.Tab>
          <Tabs.Tab
            selected={tab === Tab.Housekeeping}
            onClick={() => setTab(Tab.Housekeeping)}
          >
            {t('permissions-tab-housekeeping', {}, 'Housekeeping')}
          </Tabs.Tab>
        </Tabs>
        {tab === Tab.Admins && <AdminsTab />}
        {tab === Tab.Ranks && <RanksTab />}
        {tab === Tab.Logging && <LoggingTab />}
        {tab === Tab.Housekeeping && <HousekeepingTab />}
      </Window.Content>
    </Window>
  );
}
