import {
  Box,
  Button,
  Divider,
  Dropdown,
  Icon,
  LabeledList,
  Modal,
  NoticeBox,
  Section,
  Stack,
  Table,
  Tooltip,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { slugify, useT } from '../i18n';
import { Window } from '../layouts';

const HOST_ACTIONS = ['Kick', 'Transfer host', 'Toggle observe'];

type Player = {
  host: number;
  key: string;
  loadout: string;
  ready: BooleanLike;
  mob: string;
};

type Modifier = {
  desc: string;
  modpath: string;
  name: string;
  player_selectable: BooleanLike;
  player_selected: BooleanLike;
  selectable: BooleanLike;
  selected: BooleanLike;
};

type Map = {
  desc: string;
  max_players: number;
  min_players: number;
  name: string;
  time: number;
};

type Data = {
  active_mods: string;
  admin: BooleanLike;
  host: BooleanLike;
  loadoutdesc: string;
  loadouts: string[];
  map: Map;
  maps: string[];
  mod_menu_open: BooleanLike;
  modifiers: Modifier[];
  observers: Player[];
  players: Player[];
  playing: BooleanLike;
  self: string;
};

export function DeathmatchLobby(props) {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const {
    admin,
    host,
    mod_menu_open,
    observers = [],
    players = [],
    self,
  } = data;

  const allReady = players.every((player) => player.ready);

  const fullAccess = !!host || !!admin;
  const showMenu = fullAccess && !!mod_menu_open;

  const isObserver = observers.find((observer) => observer.key === self);

  return (
    <Window title={t('deathmatchlobby-title', {}, 'Deathmatch Lobby')} width={560} height={480}>
      {showMenu && <ModSelector />}
      <Window.Content>
        <Stack fill vertical>
          <Stack.Item grow>
            <Stack fill>
              <Stack.Item grow={4}>
                <PlayerColumn />
              </Stack.Item>
              <Stack.Item grow={3}>
                <HostControls />
              </Stack.Item>
            </Stack>
          </Stack.Item>
          <Stack.Item>
            <Section>
              <Stack fill>
                <Stack.Item grow>
                  {!!admin && (
                    <Button
                      icon="exclamation"
                      color="caution"
                      onClick={() => act('admin', { func: 'Force start' })}
                    >
                      {t('deathmatchlobby-force-start', {}, 'Force Start')}
                    </Button>
                  )}
                </Stack.Item>
                <Stack.Item>
                  <Button color="caution" onClick={() => act('observe')}>
                    {isObserver
                      ? t('deathmatchlobby-join', {}, 'Join')
                      : t('deathmatchlobby-observe', {}, 'Observe')}
                  </Button>
                  <Button color="bad" onClick={() => act('leave_game')}>
                    {t('deathmatchlobby-leave', {}, 'Leave Game')}
                  </Button>
                  <Button
                    color="good"
                    disabled={!allReady}
                    onClick={() => act('start_game')}
                  >
                    {t('deathmatchlobby-start', {}, 'Start Game')}
                  </Button>
                </Stack.Item>
              </Stack>
            </Section>
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
}

function PlayerColumn(props) {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const {
    admin,
    host,
    loadouts = [],
    observers = [],
    players = [],
    self,
  } = data;

  const allReady = players.every((player) => player.ready);

  const fullAccess = !!host || !!admin;

  return (
    <Section fill scrollable={players.length > 30}>
      <Table>
        <Table.Row header>
          <Table.Cell collapsing />
          <Table.Cell>{t('deathmatchlobby-name', {}, 'Name')}</Table.Cell>
          <Table.Cell>{t('deathmatchlobby-loadout', {}, 'Loadout')}</Table.Cell>
          <Table.Cell collapsing align="center">
            <Tooltip
              content={
                !allReady
                  ? t('deathmatchlobby-preparing', {}, 'Players are preparing')
                  : t('deathmatchlobby-press-start', {}, 'Press start!')
              }
            >
              <Icon
                name={!allReady ? 'check' : 'check-circle'}
                color={allReady && 'green'}
              />
            </Tooltip>
          </Table.Cell>
        </Table.Row>
        {players.map((player) => {
          const isHost = !!player.host;
          const isSelf = player.key === self;
          const canBoot = fullAccess && !isSelf;

          return (
            <Table.Row className="candystripe" key={player.key}>
              <Table.Cell align="center" collapsing verticalAlign="top">
                {isHost && (
                  <Tooltip content={t('deathmatchlobby-host', {}, 'Host')}>
                    <Icon color="gold" name="star" pt={isSelf && 0.5} />
                  </Tooltip>
                )}
                {!host && isSelf && (
                  <Tooltip content={t('deathmatchlobby-you', {}, 'You')}>
                    <Icon color="green" name="arrow-right" pt={0.9} />
                  </Tooltip>
                )}
              </Table.Cell>

              <Table.Cell verticalAlign="top" pt={!isHost && '2px'}>
                {!canBoot ? (
                  <Box color="label">{player.key}</Box>
                ) : (
                  <Dropdown
                    width={9}
                    selected={player.key}
                    displayText={player.key}
                    options={HOST_ACTIONS.map((value) => ({
                      value,
                      displayText: t(`deathmatchlobby-action-${slugify(value)}`, {}, value),
                    }))}
                    onSelected={(value) =>
                      act('host', {
                        id: player.key,
                        func: value,
                      })
                    }
                  />
                )}
              </Table.Cell>

              <Table.Cell>
                {!isSelf ? (
                  <Box color="label">{player.loadout}</Box>
                ) : (
                  <Dropdown
                    width={10}
                    selected={player.loadout}
                    disabled={!host && !isSelf}
                    options={loadouts}
                    onSelected={(value) =>
                      act('change_loadout', {
                        player: player.key,
                        loadout: value,
                      })
                    }
                  />
                )}
              </Table.Cell>

              <Table.Cell align="center" verticalAlign="middle">
                {isSelf ? (
                  <Button.Checkbox
                    disabled={!isSelf}
                    checked={player.ready}
                    onClick={() => act('ready')}
                  />
                ) : (
                  !!player.ready && <Icon name="check" />
                )}
              </Table.Cell>
            </Table.Row>
          );
        })}
        {observers.map((observer) => {
          const isHost = !!observer.host;
          const isSelf = observer.key === self;
          const canBoot = fullAccess && !isSelf;

          return (
            <Table.Row key={observer.key}>
              <Table.Cell
                collapsing
                verticalAlign="top"
                pt={fullAccess && '2px'}
              >
                {isHost ? (
                  <Tooltip content={t('deathmatchlobby-host-lower', {}, 'host')}>
                    <Icon name="star" />
                  </Tooltip>
                ) : (
                  <Icon name="eye" />
                )}
              </Table.Cell>
              <Table.Cell>
                {!canBoot ? (
                  <b>{observer.key}</b>
                ) : (
                  <Dropdown
                    width={9}
                    selected={observer.key}
                    displayText={observer.key}
                    options={HOST_ACTIONS.map((value) => ({
                      value,
                      displayText: t(`deathmatchlobby-action-${slugify(value)}`, {}, value),
                    }))}
                    onSelected={(value) =>
                      act('host', {
                        id: observer.key,
                        func: value,
                      })
                    }
                  />
                )}
              </Table.Cell>
              <Table.Cell color="label">{t('deathmatchlobby-observing', {}, 'Observing')}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table>
    </Section>
  );
}

function HostControls(props) {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { active_mods = [], admin, host, loadoutdesc, playing } = data;

  const fullAccess = !!host || !!admin;

  return (
    <Section fill scrollable>
      <MapInfo />
      <Divider />
      <Box textAlign="center" color="average">
        {active_mods}
      </Box>
      {fullAccess && (
        <>
          <Divider />
          <Button textAlign="center" fluid onClick={() => act('open_mod_menu')}>
            {t('deathmatchlobby-toggle-mods', {}, 'Toggle Modifiers')}
          </Button>
        </>
      )}
      <Divider />
      <NoticeBox info align="center">
        {t('deathmatchlobby-loadout-desc', {}, 'Loadout Description')}
      </NoticeBox>

      <Box textAlign="center">{loadoutdesc}</Box>
      {!!playing && (
        <>
          <Divider />
          <Box textAlign="center">
            {t('deathmatchlobby-in-progress', {}, 'The game is currently in progress, or loading.')}
          </Box>
        </>
      )}
    </Section>
  );
}

const ModSelector = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { modifiers = [] } = data;

  return (
    <Modal>
      <Button fluid color="bad" onClick={() => act('exit_mod_menu')}>
        {t('deathmatchlobby-go-back', {}, 'Go Back')}
      </Button>
      {modifiers.map((mod, index) => (
        <Button.Checkbox
          key={index}
          mb={2}
          checked={mod.selected}
          tooltip={mod.desc}
          color={mod.selected ? 'green' : 'blue'}
          disabled={!mod.selected && !mod.selectable}
          onClick={() =>
            act('toggle_modifier', {
              modpath: mod.modpath,
            })
          }
        >
          {mod.name}
        </Button.Checkbox>
      ))}
    </Modal>
  );
};

function MapInfo(props) {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { host, maps = [], map, players } = data;

  if (!host && !map?.name) {
    return <NoticeBox align="center">{t('deathmatchlobby-no-map', {}, 'No map selected')}</NoticeBox>;
  }

  return (
    <>
      {!host ? (
        <NoticeBox danger>{map.name}</NoticeBox>
      ) : (
        <>
          <Dropdown
            color="average"
            width="100%"
            selected={map.name}
            options={maps}
            onSelected={(value) =>
              act('host', {
                func: 'change_map',
                map: value,
              })
            }
          />
          <Divider />
        </>
      )}
      {map.desc}
      <Divider />
      <LabeledList>
        <LabeledList.Item label={t('deathmatchlobby-max-time', {}, 'Max Play Time')}>
          {t(
            'deathmatchlobby-minutes',
            { minutes: map.time / 600 },
            `${map.time / 600}min`,
          )}
        </LabeledList.Item>
        <LabeledList.Item label={t('deathmatchlobby-min-players', {}, 'Min Players')}>
          {map.min_players}
        </LabeledList.Item>
        <LabeledList.Item label={t('deathmatchlobby-max-players', {}, 'Max Players')}>
          {map.max_players}
        </LabeledList.Item>
        <LabeledList.Item label={t('deathmatchlobby-current-players', {}, 'Current Players')}>
          {players.length}
        </LabeledList.Item>
      </LabeledList>
    </>
  );
}
