import { useEffect, useState } from 'react';
import { Box, Button, Section, Stack } from 'tgui-core/components';

import { useBackend } from '../backend';
import { useNumber, useT } from '../i18n';
import { Window } from '../layouts';

type Target = {
  ref: string;
  name: string;
  type: string;
  kind: 'mob' | 'obj' | 'turf';
  actions: string[];
  ckey?: string;
};

type Data = {
  serial: number;
  focus: string | null;
  coords?: string;
  targets: Target[];
};

type ActionDef = {
  id: string;
  label: string;
  icon: string;
  group: string;
  color?: string;
  confirm?: boolean;
};

const GROUPS: { id: string; label: string }[] = [
  { id: 'control', label: 'Control' },
  { id: 'move', label: 'Movement' },
  { id: 'messages', label: 'Messages' },
  { id: 'object', label: 'Object' },
  { id: 'player', label: 'Player status' },
];

const ACTIONS: ActionDef[] = [
  { id: 'possess_obj', label: 'Take control', icon: 'ghost', group: 'control', color: 'good', confirm: true },
  { id: 'jump_mob', label: 'Jump to mob', icon: 'plane-arrival', group: 'move' },
  { id: 'get_mob', label: 'Get mob', icon: 'hand-holding', group: 'move' },
  { id: 'send_mob', label: 'Send mob', icon: 'plane-departure', group: 'move' },
  { id: 'admin_pm', label: 'Admin PM', icon: 'envelope', group: 'messages' },
  { id: 'subtle', label: 'Subtle message', icon: 'comment-dots', group: 'messages' },
  { id: 'direct_narrate', label: 'Direct narrate', icon: 'bullhorn', group: 'messages' },
  { id: 'headset', label: 'Headset message', icon: 'headset', group: 'messages' },
  { id: 'narrate', label: 'Local narrate', icon: 'comment', group: 'messages' },
  { id: 'osay', label: 'Say as object', icon: 'comment-dots', group: 'messages' },
  { id: 'examine', label: 'Examine', icon: 'search', group: 'object' },
  { id: 'point', label: 'Point to', icon: 'hand-point-right', group: 'object' },
  { id: 'vv', label: 'View variables', icon: 'list', group: 'object' },
  { id: 'mark', label: 'Mark', icon: 'crosshairs', group: 'object' },
  { id: 'tag', label: 'Tag', icon: 'tag', group: 'object' },
  { id: 'proccall', label: 'Call proc', icon: 'terminal', group: 'object' },
  { id: 'occupants', label: 'Show occupants', icon: 'user', group: 'object' },
  { id: 'tweak', label: 'Tweak components', icon: 'wrench', group: 'object' },
  { id: 'delete', label: 'Delete', icon: 'trash', group: 'object', color: 'bad', confirm: true },
  { id: 'player_panel', label: 'Player panel', icon: 'id-card', group: 'player' },
  { id: 'rejuvenate', label: 'Rejuvenate', icon: 'heart', group: 'player' },
  { id: 'check_contents', label: 'Check contents', icon: 'box-open', group: 'player' },
  { id: 'select_equipment', label: 'Select equipment', icon: 'user-tie', group: 'player' },
  { id: 'smite', label: 'Smite', icon: 'bolt', group: 'player', color: 'bad' },
];

const KIND_ICON = { mob: 'user', obj: 'cube', turf: 'th-large' };

const actionKey = (id: string) => `admincontext-action-${id.replace(/_/g, '-')}`;

export function AdminContext() {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const width = useNumber('admincontext-window-width', 340);
  const height = useNumber('admincontext-window-height', 520);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [data.serial]);

  const targets = (Array.isArray(data.targets) ? data.targets : []).filter(
    (target) => target && typeof target === 'object',
  );
  const current =
    targets.find((target) => target.ref === selected) ??
    targets.find((target) => target.ref === data.focus) ??
    targets[0];
  const currentActions = Array.isArray(current?.actions) ? current.actions : [];

  const renderAction = (action: ActionDef) => (
    <Button
      fluid
      key={action.id}
      icon={action.icon}
      color={action.color}
      confirmContent={
        action.confirm ? t('admincontext-confirm', {}, 'Are you sure?') : undefined
      }
      onClick={() => act(action.id, { ref: current?.ref })}
    >
      {t(actionKey(action.id), {}, action.label)}
    </Button>
  );

  return (
    <Window
      title={t('admincontext-title', {}, 'Admin context menu')}
      width={width}
      height={height}
      theme="admin"
    >
      <Window.Content scrollable>
        <Stack vertical>
          <Stack.Item>
            <Section
              title={t('admincontext-targets', {}, 'Targets on tile')}
              buttons={<Box color="label">{data.coords}</Box>}
            >
              {targets.length === 0 && (
                <Box color="label">
                  {t('admincontext-empty', {}, 'Nothing here')}
                </Box>
              )}
              <Box maxHeight="110px" overflowY="auto">
                <Stack vertical>
                  {targets.map((target) => (
                    <Stack.Item key={target.ref}>
                      <Button
                        fluid
                        ellipsis
                        icon={KIND_ICON[target.kind]}
                        selected={current?.ref === target.ref}
                        tooltip={target.type}
                        onClick={() => setSelected(target.ref)}
                      >
                        {target.name}
                        {target.ckey ? ` (${target.ckey})` : ''}
                      </Button>
                    </Stack.Item>
                  ))}
                </Stack>
              </Box>
            </Section>
          </Stack.Item>
          {!current && (
            <Stack.Item>
              <Box color="label">
                {t('admincontext-no-target', {}, 'No target')}
              </Box>
            </Stack.Item>
          )}
          {current && (
            <Stack.Item>
              <Stack vertical>
                <Stack.Item>
                  <Box bold fontSize="14px" color="label" mb={0.5}>
                    {current.name}
                  </Box>
                  {currentActions.includes('possess_mob') && (
                    <Button
                      fluid
                      icon="ghost"
                      color="good"
                      confirmContent={t('admincontext-confirm', {}, 'Are you sure?')}
                      onClick={() => act('possess_mob', { ref: current.ref })}
                      style={{
                        fontSize: '15px',
                        lineHeight: '34px',
                        textAlign: 'center',
                      }}
                    >
                      {t('admincontext-action-possess-mob', {}, 'Take control')}
                    </Button>
                  )}
                </Stack.Item>
                {GROUPS.map((group) => {
                  const items = ACTIONS.filter(
                    (action) =>
                      action.group === group.id &&
                      currentActions.includes(action.id),
                  );
                  if (items.length === 0) {
                    return null;
                  }
                  return (
                    <Stack.Item key={group.id}>
                      <Section
                        title={t(`admincontext-group-${group.id}`, {}, group.label)}
                      >
                        <Stack vertical>
                          {items.map((action) => (
                            <Stack.Item key={action.id}>
                              {renderAction(action)}
                            </Stack.Item>
                          ))}
                        </Stack>
                      </Section>
                    </Stack.Item>
                  );
                })}
              </Stack>
            </Stack.Item>
          )}
        </Stack>
      </Window.Content>
    </Window>
  );
}
