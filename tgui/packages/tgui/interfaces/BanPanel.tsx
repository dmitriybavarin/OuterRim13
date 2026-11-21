import { useState } from 'react';
import {
  Box,
  Button,
  Dropdown,
  Input,
  NoticeBox,
  Section,
  Stack,
  TextArea,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { departmentKey, jobKey, useNumber, useT } from '../i18n';
import { Window } from '../layouts';

type Category = {
  id: string;
  label: string;
  color: string | null;
  kind: 'department' | 'abstract' | 'ghost' | 'antagonist';
  roles: string[];
};

type Data = {
  edit_id: string | null;
  edit_role: string | null;
  server_ban: BooleanLike;
  player_key: string | null;
  player_ip: string | null;
  player_cid: string | null;
  key_check: BooleanLike;
  ip_check: BooleanLike;
  cid_check: BooleanLike;
  last_connection: BooleanLike;
  applies_to_admins: BooleanLike;
  permanent: BooleanLike;
  duration: string | number;
  reason: string | null;
  max_reason: number;
  categories: Category[];
  banned_from: string[];
};

const INTERVALS = [
  'SECOND',
  'MINUTE',
  'HOUR',
  'DAY',
  'WEEK',
  'MONTH',
  'YEAR',
] as const;

const SEVERITIES = ['none', 'minor', 'medium', 'high'] as const;

export const BanPanel = () => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const windowWidth = useNumber('banpanel-window-width', 820);
  const windowHeight = useNumber('banpanel-window-height', 680);
  const editing = !!data.edit_id;

  const [keyCheck, setKeyCheck] = useState(!!data.key_check);
  const [keyText, setKeyText] = useState(data.player_key ?? '');
  const [ipCheck, setIpCheck] = useState(!!data.ip_check);
  const [ipText, setIpText] = useState(data.player_ip ?? '');
  const [cidCheck, setCidCheck] = useState(!!data.cid_check);
  const [cidText, setCidText] = useState(data.player_cid ?? '');
  const [lastConnection, setLastConnection] = useState(!!data.last_connection);
  const [appliesToAdmins, setAppliesToAdmins] = useState(
    !!data.applies_to_admins,
  );
  const [permanent, setPermanent] = useState(!!data.permanent);
  const [duration, setDuration] = useState(String(data.duration ?? ''));
  const [interval, setInterval] = useState<string>('MINUTE');
  const [reason, setReason] = useState(data.reason ?? '');
  const [banType, setBanType] = useState(data.server_ban ? 'server' : 'role');
  const [severity, setSeverity] = useState('');
  const [mirrorEdit, setMirrorEdit] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [tab, setTab] = useState(data.categories[0]?.id ?? '');

  const roleBan = !editing && banType === 'role';
  const currentCategory =
    data.categories.find((category) => category.id === tab) ??
    data.categories[0];

  const warnings: string[] = [];
  if (!reason.trim()) {
    warnings.push(t('banpanel-warning-no-reason'));
  }
  if (!editing && !severity) {
    warnings.push(t('banpanel-warning-no-severity'));
  }
  if (roleBan && roles.length === 0) {
    warnings.push(t('banpanel-warning-no-roles'));
  }
  if (keyCheck && !keyText.trim()) {
    warnings.push(t('banpanel-warning-no-key'));
  }
  if (!lastConnection && ipCheck && !ipText.trim()) {
    warnings.push(t('banpanel-warning-no-ip'));
  }
  if (!lastConnection && cidCheck && !cidText.trim()) {
    warnings.push(t('banpanel-warning-no-cid'));
  }
  if (!permanent && !duration.trim()) {
    warnings.push(t('banpanel-warning-no-duration'));
  }

  const toggleRole = (role: string) =>
    setRoles((current) =>
      current.includes(role)
        ? current.filter((entry) => entry !== role)
        : [...current, role],
    );

  const selectAll = (category: Category) =>
    setRoles((current) => [...new Set([...current, ...category.roles])]);

  const clearAll = (category: Category) =>
    setRoles((current) =>
      current.filter((entry) => !category.roles.includes(entry)),
    );

  const submit = () =>
    act('submit', {
      key_check: keyCheck,
      key_text: keyText,
      ip_check: ipCheck,
      ip_text: ipText,
      cid_check: cidCheck,
      cid_text: cidText,
      last_connection: lastConnection,
      applies_to_admins: appliesToAdmins,
      permanent,
      duration,
      interval,
      reason,
      severity,
      ban_type: banType,
      mirror_edit: mirrorEdit,
      roles,
    });

  const categoryLabel = (category: Category) => {
    if (category.kind === 'department') {
      return t(departmentKey(category.label), {}, category.label);
    }
    return t(`banpanel-category-${category.kind}`, {}, category.label);
  };

  const roleLabel = (category: Category, role: string) =>
    category.kind === 'department'
      ? t(jobKey(role, 'name'), {}, role)
      : role;

  return (
    <Window
      title={t(editing ? 'banpanel-title-edit' : 'banpanel-title')}
      width={windowWidth}
      height={windowHeight}
      theme="admin"
    >
      <Window.Content scrollable>
        <Stack vertical fill>
          <Stack.Item>
            <Section title={t('banpanel-section-target')}>
              <Stack vertical>
                <Stack.Item>
                  <Stack align="center" g={1}>
                    <Stack.Item width="130px" shrink={0}>
                      <Button.Checkbox
                        checked={keyCheck}
                        onClick={() => setKeyCheck(!keyCheck)}
                      >
                        {t('banpanel-label-key')}
                      </Button.Checkbox>
                    </Stack.Item>
                    <Stack.Item grow>
                      <Input
                        fluid
                        value={keyText}
                        disabled={!keyCheck}
                        placeholder={t('banpanel-placeholder-key')}
                        onChange={setKeyText}
                      />
                    </Stack.Item>
                  </Stack>
                </Stack.Item>
                <Stack.Item>
                  <Stack align="center" g={1}>
                    <Stack.Item width="130px" shrink={0}>
                      <Button.Checkbox
                        checked={ipCheck}
                        onClick={() => setIpCheck(!ipCheck)}
                      >
                        {t('banpanel-label-ip')}
                      </Button.Checkbox>
                    </Stack.Item>
                    <Stack.Item grow>
                      <Input
                        fluid
                        value={ipText}
                        disabled={!ipCheck || lastConnection}
                        placeholder={t('banpanel-placeholder-ip')}
                        onChange={setIpText}
                      />
                    </Stack.Item>
                  </Stack>
                </Stack.Item>
                <Stack.Item>
                  <Stack align="center" g={1}>
                    <Stack.Item width="130px" shrink={0}>
                      <Button.Checkbox
                        checked={cidCheck}
                        onClick={() => setCidCheck(!cidCheck)}
                      >
                        {t('banpanel-label-cid')}
                      </Button.Checkbox>
                    </Stack.Item>
                    <Stack.Item grow>
                      <Input
                        fluid
                        value={cidText}
                        disabled={!cidCheck || lastConnection}
                        placeholder={t('banpanel-placeholder-cid')}
                        onChange={setCidText}
                      />
                    </Stack.Item>
                  </Stack>
                </Stack.Item>
                <Stack.Item>
                  <Stack wrap g={1}>
                  <Stack.Item>
                  <Button.Checkbox
                    checked={lastConnection}
                    tooltip={t('banpanel-tooltip-last-connection')}
                    onClick={() => setLastConnection(!lastConnection)}
                  >
                    {t('banpanel-label-last-connection')}
                  </Button.Checkbox>
                  </Stack.Item>
                  <Stack.Item>
                  <Button.Checkbox
                    checked={appliesToAdmins}
                    color={appliesToAdmins ? 'bad' : undefined}
                    onClick={() => setAppliesToAdmins(!appliesToAdmins)}
                  >
                    {t('banpanel-label-applies-to-admins')}
                  </Button.Checkbox>
                  </Stack.Item>
                  </Stack>
                </Stack.Item>
              </Stack>
            </Section>
          </Stack.Item>
          <Stack.Item>
            <Stack>
              <Stack.Item grow basis={0}>
                <Section fill title={t('banpanel-section-duration')}>
                  <Stack vertical>
                    <Stack.Item>
                      <Button.Checkbox
                        checked={permanent}
                        color={permanent ? 'bad' : undefined}
                        onClick={() => setPermanent(!permanent)}
                      >
                        {t('banpanel-label-permanent')}
                      </Button.Checkbox>
                    </Stack.Item>
                    <Stack.Item>
                      <Stack g={1}>
                        <Stack.Item width="90px">
                          <Input
                            fluid
                            value={duration}
                            disabled={permanent}
                            onChange={setDuration}
                          />
                        </Stack.Item>
                        <Stack.Item grow>
                          <Dropdown
                            width="100%"
                            disabled={permanent}
                            selected={interval}
                            displayText={t(
                              `banpanel-interval-${interval.toLowerCase()}`,
                            )}
                            options={INTERVALS.map((entry) => ({
                              value: entry,
                              displayText: t(
                                `banpanel-interval-${entry.toLowerCase()}`,
                              ),
                            }))}
                            onSelected={setInterval}
                          />
                        </Stack.Item>
                      </Stack>
                    </Stack.Item>
                  </Stack>
                </Section>
              </Stack.Item>
              {!editing && (
                <Stack.Item grow basis={0}>
                  <Section fill title={t('banpanel-section-type')}>
                    <Stack vertical>
                      <Stack.Item>
                        <Stack wrap g={0.5}>
                        <Stack.Item>
                        <Button
                          selected={banType === 'server'}
                          onClick={() => setBanType('server')}
                        >
                          {t('banpanel-type-server')}
                        </Button>
                        </Stack.Item>
                        <Stack.Item>
                        <Button
                          selected={banType === 'role'}
                          onClick={() => setBanType('role')}
                        >
                          {t('banpanel-type-role')}
                        </Button>
                        </Stack.Item>
                        </Stack>
                      </Stack.Item>
                      <Stack.Item>
                        <Box color="label" mb={0.5}>
                          {t('banpanel-section-severity')}
                        </Box>
                        <Stack wrap g={0.5}>
                          {SEVERITIES.map((entry) => (
                            <Stack.Item key={entry}>
                              <Button
                                selected={severity === entry}
                                style={{ whiteSpace: 'normal' }}
                                onClick={() => setSeverity(entry)}
                              >
                                {t(`banpanel-severity-${entry}`)}
                              </Button>
                            </Stack.Item>
                          ))}
                        </Stack>
                      </Stack.Item>
                    </Stack>
                  </Section>
                </Stack.Item>
              )}
            </Stack>
          </Stack.Item>
          <Stack.Item>
            <Section
              title={t('banpanel-section-reason')}
              buttons={
                <Box
                  color={reason.length > data.max_reason ? 'bad' : 'label'}
                >
                  {reason.length} / {data.max_reason}
                </Box>
              }
            >
              <TextArea
                fluid
                height="90px"
                value={reason}
                maxLength={data.max_reason}
                placeholder={t('banpanel-placeholder-reason')}
                onChange={setReason}
              />
            </Section>
          </Stack.Item>
          {editing && (
            <Stack.Item>
              <Section title={t('banpanel-section-edit')}>
                <Box color="label" mb={1}>
                  {t('banpanel-edit-role', {
                    role: data.edit_role ?? '',
                  })}
                </Box>
                <Button.Checkbox
                  checked={mirrorEdit}
                  onClick={() => setMirrorEdit(!mirrorEdit)}
                >
                  {t('banpanel-label-mirror-edit')}
                </Button.Checkbox>
                <Box color="label" mt={1}>
                  {t('banpanel-hint-mirror-edit')}
                </Box>
              </Section>
            </Stack.Item>
          )}
          {roleBan && currentCategory && (
            <Stack.Item grow>
              <Section
                fill
                title={t('banpanel-section-roles', { count: roles.length })}
                buttons={
                  <Button
                    icon="eraser"
                    disabled={roles.length === 0}
                    onClick={() => setRoles([])}
                  >
                    {t('banpanel-button-clear-everything')}
                  </Button>
                }
              >
                <Stack wrap g={0.5} mb={1}>
                  {data.categories.map((category) => (
                    <Stack.Item key={category.id}>
                      <Button
                        selected={category.id === currentCategory.id}
                        style={{ whiteSpace: 'normal' }}
                        onClick={() => setTab(category.id)}
                      >
                        {categoryLabel(category)}
                        {category.roles.some((role) => roles.includes(role)) &&
                          ` (${category.roles.filter((role) => roles.includes(role)).length})`}
                      </Button>
                    </Stack.Item>
                  ))}
                </Stack>
                <Stack wrap align="center" g={0.5} mb={1}>
                  <Stack.Item>
                  <Button
                    icon="check-double"
                    onClick={() => selectAll(currentCategory)}
                  >
                    {t('banpanel-button-select-all')}
                  </Button>
                  </Stack.Item>
                  <Stack.Item>
                  <Button
                    icon="xmark"
                    onClick={() => clearAll(currentCategory)}
                  >
                    {t('banpanel-button-clear')}
                  </Button>
                  </Stack.Item>
                  <Stack.Item color="label">
                    {t('banpanel-hint-banned')}
                  </Stack.Item>
                </Stack>
                <Box>
                  {currentCategory.roles.map((role) => {
                    const banned = data.banned_from.includes(role);
                    const selected = roles.includes(role);
                    return (
                      <Button
                        key={role}
                        m={0.25}
                        style={{ whiteSpace: 'normal' }}
                        icon={selected ? 'check-square' : 'square'}
                        color={
                          selected ? 'good' : banned ? 'bad' : 'transparent'
                        }
                        tooltip={
                          banned ? t('banpanel-tooltip-already-banned') : null
                        }
                        onClick={() => toggleRole(role)}
                      >
                        {roleLabel(currentCategory, role)}
                      </Button>
                    );
                  })}
                </Box>
              </Section>
            </Stack.Item>
          )}
          <Stack.Item>
            {appliesToAdmins && (
              <NoticeBox danger>{t('banpanel-notice-admins')}</NoticeBox>
            )}
            {!editing && banType === 'server' && (
              <NoticeBox warning>{t('banpanel-notice-server')}</NoticeBox>
            )}
            {warnings.length > 0 && (
              <NoticeBox info>
                {warnings.map((warning) => (
                  <Box key={warning}>{warning}</Box>
                ))}
              </NoticeBox>
            )}
            <Button
              fluid
              icon="gavel"
              color="bad"
              textAlign="center"
              disabled={warnings.length > 0}
              onClick={submit}
            >
              {t(editing ? 'banpanel-button-save' : 'banpanel-button-ban')}
            </Button>
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
};
