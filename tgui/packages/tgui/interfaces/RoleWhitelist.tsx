import { useState } from 'react';
import {
  Box,
  Button,
  Dropdown,
  Input,
  Section,
  Stack,
  Table,
  Tabs,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { departmentKey, useT } from '../i18n';
import { Window } from '../layouts';

const OTHER = 'Other';
const NEW_CATEGORY = '__new__';
const DEPARTMENT_PREFIX = 'department:';

type RoleEntry = {
  name: string;
  category: string | null;
  department: string | null;
  restricted: BooleanLike;
  hidden: BooleanLike;
  holders: number;
};

type PlayerEntry = {
  ckey: string;
  roles: string[];
};

type Data = {
  can_edit_all: BooleanLike;
  roles: RoleEntry[];
  categories: string[];
  department_categories: { value: string; name: string }[];
  restricted_roles: string[];
  players: PlayerEntry[];
};

enum Tab {
  Roles,
  Players,
}

function RolesTab() {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const [search, setSearch] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [extraCategories, setExtraCategories] = useState<string[]>([]);
  const editable = !!data.can_edit_all;

  const categories = Array.from(
    new Set([...data.categories, ...extraCategories]),
  ).sort();
  const departmentLabel = (value: string) => {
    const name = value.slice(DEPARTMENT_PREFIX.length);
    return t(departmentKey(name), {}, name);
  };
  const labelOf = (value: string | null) => {
    if (!value) {
      return t('rolewhitelist-category-other');
    }
    return value.startsWith(DEPARTMENT_PREFIX) ? departmentLabel(value) : value;
  };
  const options = [
    { value: OTHER, displayText: t('rolewhitelist-category-other') },
    ...data.department_categories.map((entry) => ({
      value: entry.value,
      displayText: departmentLabel(entry.value),
    })),
    ...categories.map((name) => ({ value: name, displayText: name })),
    { value: NEW_CATEGORY, displayText: t('rolewhitelist-category-create') },
  ];

  const visible = data.roles.filter(
    (role) =>
      !search || role.name.toLowerCase().includes(search.toLowerCase()),
  );
  const groupKeys = [
    ...data.department_categories.map((entry) => entry.value),
    ...categories,
  ];
  const knownKeys = new Set(groupKeys);
  const groups: [string, RoleEntry[]][] = [
    ...groupKeys.map(
      (name) =>
        [name, visible.filter((role) => role.category === name)] as [
          string,
          RoleEntry[],
        ],
    ),
    [
      OTHER,
      visible.filter((role) => !role.category || !knownKeys.has(role.category)),
    ],
  ];

  function update(role: RoleEntry, changes: Partial<Record<string, unknown>>) {
    act('set_role', {
      name: role.name,
      category: role.category ?? '',
      restricted: !!role.restricted,
      hidden: !!role.hidden,
      ...changes,
    });
  }

  return (
    <Stack vertical>
      <Stack.Item>
        <Section>
          <Stack wrap>
            <Stack.Item grow>
              <Input
                fluid
                value={search}
                placeholder={t('rolewhitelist-search')}
                onChange={setSearch}
              />
            </Stack.Item>
            {editable && (
              <>
                <Stack.Item grow>
                  <Input
                    fluid
                    value={newCategory}
                    placeholder={t('rolewhitelist-category-new')}
                    onChange={setNewCategory}
                  />
                </Stack.Item>
                <Stack.Item>
                  <Button
                    icon="plus"
                    color="good"
                    disabled={!newCategory.trim()}
                    onClick={() => {
                      setExtraCategories([...extraCategories, newCategory.trim()]);
                      setNewCategory('');
                    }}
                  >
                    {t('rolewhitelist-category-add')}
                  </Button>
                </Stack.Item>
              </>
            )}
          </Stack>
          <Box color="label" mt={1}>
            {t('rolewhitelist-hint')}
          </Box>
        </Section>
      </Stack.Item>
      {groups.map(([name, roles]) =>
        roles.length === 0 ? null : (
          <Stack.Item key={name}>
            <Section
              title={name === OTHER ? t('rolewhitelist-category-other') : labelOf(name)}
            >
              <Table>
                {roles.map((role) => (
                  <Table.Row key={role.name} className="candystripe">
                    <Table.Cell>{role.name}</Table.Cell>
                    <Table.Cell collapsing>
                      <Button
                        icon={role.restricted ? 'lock' : 'lock-open'}
                        color={role.restricted ? 'bad' : 'good'}
                        disabled={!editable}
                        tooltip={
                          role.restricted
                            ? t('rolewhitelist-locked')
                            : t('rolewhitelist-open')
                        }
                        onClick={() =>
                          update(role, {
                            restricted: !role.restricted,
                            hidden: role.restricted ? false : role.hidden,
                          })
                        }
                      />
                      <Button
                        icon={role.hidden ? 'eye-slash' : 'eye'}
                        color={role.hidden ? 'average' : 'default'}
                        disabled={!editable}
                        tooltip={
                          role.hidden
                            ? t('rolewhitelist-hidden')
                            : t('rolewhitelist-visible')
                        }
                        onClick={() =>
                          update(role, {
                            hidden: !role.hidden,
                            restricted: role.hidden ? role.restricted : true,
                          })
                        }
                      />
                    </Table.Cell>
                    <Table.Cell collapsing width="16em">
                      <Dropdown
                        width="100%"
                        disabled={!editable}
                        options={options}
                        selected={role.category ?? OTHER}
                        displayText={labelOf(role.category)}
                        onSelected={(value) =>
                          update(role, {
                            category: value === OTHER ? '' : value,
                          })
                        }
                      />
                    </Table.Cell>
                    <Table.Cell collapsing color="label">
                      {t('rolewhitelist-holders', { count: role.holders })}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table>
            </Section>
          </Stack.Item>
        ),
      )}
    </Stack>
  );
}

function PlayersTab() {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const [ckey, setCkey] = useState('');
  const [role, setRole] = useState('');
  const [search, setSearch] = useState('');

  const players = data.players.filter(
    (player) =>
      !search || player.ckey.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Stack vertical>
      <Stack.Item>
        <Section title={t('rolewhitelist-grant-title')}>
          <Stack wrap>
            <Stack.Item grow>
              <Input
                fluid
                value={ckey}
                placeholder={t('rolewhitelist-grant-ckey')}
                onChange={setCkey}
              />
            </Stack.Item>
            <Stack.Item grow>
              <Dropdown
                width="100%"
                options={data.restricted_roles}
                selected={role}
                displayText={role || t('rolewhitelist-grant-role')}
                onSelected={setRole}
              />
            </Stack.Item>
            <Stack.Item>
              <Button
                icon="user-plus"
                color="good"
                disabled={!ckey.trim() || !role}
                onClick={() => {
                  act('grant', { ckey, role });
                  setCkey('');
                }}
              >
                {t('rolewhitelist-grant-button')}
              </Button>
            </Stack.Item>
          </Stack>
          {data.restricted_roles.length === 0 && (
            <Box color="label" mt={1}>
              {t('rolewhitelist-empty')}
            </Box>
          )}
        </Section>
      </Stack.Item>
      <Stack.Item>
        <Section
          title={t('rolewhitelist-players-title')}
          buttons={
            <Input
              value={search}
              placeholder={t('rolewhitelist-players-search')}
              onChange={setSearch}
            />
          }
        >
          <Table>
            {players.map((player) => (
              <Table.Row key={player.ckey} className="candystripe">
                <Table.Cell bold>{player.ckey}</Table.Cell>
                <Table.Cell>
                  {player.roles.map((granted) => (
                    <Button
                      key={granted}
                      m={0.25}
                      icon="times"
                      style={{ whiteSpace: 'normal' }}
                      onClick={() =>
                        act('revoke', { ckey: player.ckey, role: granted })
                      }
                    >
                      {granted}
                    </Button>
                  ))}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table>
        </Section>
      </Stack.Item>
    </Stack>
  );
}

export function RoleWhitelist() {
  const t = useT();
  const [tab, setTab] = useState(Tab.Roles);

  return (
    <Window
      title={t('rolewhitelist-title')}
      width={820}
      height={680}
      theme="admin"
    >
      <Window.Content scrollable>
        <Tabs>
          <Tabs.Tab
            selected={tab === Tab.Roles}
            onClick={() => setTab(Tab.Roles)}
          >
            {t('rolewhitelist-tab-roles')}
          </Tabs.Tab>
          <Tabs.Tab
            selected={tab === Tab.Players}
            onClick={() => setTab(Tab.Players)}
          >
            {t('rolewhitelist-tab-players')}
          </Tabs.Tab>
        </Tabs>
        {tab === Tab.Roles ? <RolesTab /> : <PlayersTab />}
      </Window.Content>
    </Window>
  );
}
