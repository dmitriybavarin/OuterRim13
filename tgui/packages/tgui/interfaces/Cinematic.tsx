import { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Section,
  Stack,
  Tabs,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useNumber, useT } from '../i18n';
import { Window } from '../layouts';

type Entry = {
  id: string;
  category: string;
  preview: string;
};

type Player = {
  ckey: string;
  name: string;
  living: BooleanLike;
};

type Active = {
  ref: string;
  id: string;
  global: BooleanLike;
  watchers: number;
};

type Data = {
  entries: Entry[];
  players: Player[];
  active: Active[];
};

const ALL = 'all';
const CATEGORIES = ['nuke', 'cult', 'ai', 'fake', 'other'];
const MODES = ['all', 'self', 'living', 'observers', 'admins', 'players'];

function Card(props: {
  entry: Entry;
  selected: boolean;
  onSelect: () => void;
}) {
  const { entry, selected, onSelect } = props;
  const t = useT();
  return (
    <Box
      className="candystripe"
      p={1}
      mb={1}
      style={{
        cursor: 'pointer',
        border: selected ? '1px solid #4c9a4c' : '1px solid transparent',
      }}
      onClick={onSelect}
    >
      <Stack>
        <Stack.Item>
          <Box
            as="img"
            src={`data:image/png;base64,${entry.preview}`}
            width="64px"
            height="64px"
            style={{ imageRendering: 'pixelated', objectFit: 'contain' }}
          />
        </Stack.Item>
        <Stack.Item grow>
          <Box bold>
            {t(`cinematic-entry-${entry.id}-name`, {}, entry.id)}
          </Box>
          <Box color="label">
            {t(`cinematic-entry-${entry.id}-desc`, {}, '')}
          </Box>
        </Stack.Item>
        <Stack.Item>
          <Box color="grey" fontSize="0.85em">
            {t(`cinematic-category-${entry.category}`, {}, entry.category)}
          </Box>
        </Stack.Item>
      </Stack>
    </Box>
  );
}

function Library(props: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  const { data } = useBackend<Data>();
  const t = useT();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(ALL);
  const needle = search.trim().toLowerCase();

  const visible = data.entries.filter((entry) => {
    if (category !== ALL && entry.category !== category) {
      return false;
    }
    if (!needle) {
      return true;
    }
    const name = t(`cinematic-entry-${entry.id}-name`, {}, entry.id);
    const desc = t(`cinematic-entry-${entry.id}-desc`, {}, '');
    return (
      entry.id.includes(needle) ||
      name.toLowerCase().includes(needle) ||
      desc.toLowerCase().includes(needle)
    );
  });

  return (
    <Section fill scrollable title={t('cinematic-library-title', {}, 'Cinematics')}>
      <Input
        fluid
        value={search}
        placeholder={t('cinematic-search', {}, 'Search...')}
        onChange={setSearch}
      />
      <Tabs mt={1}>
        {[ALL, ...CATEGORIES].map((name) => (
          <Tabs.Tab
            key={name}
            selected={category === name}
            onClick={() => setCategory(name)}
          >
            {name === ALL
              ? t('cinematic-category-all', {}, 'All')
              : t(`cinematic-category-${name}`, {}, name)}
          </Tabs.Tab>
        ))}
      </Tabs>
      {visible.length === 0 && (
        <Box color="label">{t('cinematic-empty', {}, 'Nothing found')}</Box>
      )}
      {visible.map((entry) => (
        <Card
          key={entry.id}
          entry={entry}
          selected={props.selected === entry.id}
          onSelect={() => props.onSelect(entry.id)}
        />
      ))}
    </Section>
  );
}

function Launcher(props: { selected: string }) {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const [mode, setMode] = useState('all');
  const [lock, setLock] = useState(true);
  const [ckeys, setCkeys] = useState<string[]>([]);
  const [playerSearch, setPlayerSearch] = useState('');

  const needle = playerSearch.trim().toLowerCase();
  const players = data.players.filter(
    (player) =>
      !needle ||
      player.ckey.toLowerCase().includes(needle) ||
      player.name.toLowerCase().includes(needle),
  );
  const entry = data.entries.find((item) => item.id === props.selected);
  const ready = !!entry && (mode !== 'players' || ckeys.length > 0);

  function toggle(ckey: string) {
    setCkeys(
      ckeys.includes(ckey)
        ? ckeys.filter((item) => item !== ckey)
        : [...ckeys, ckey],
    );
  }

  return (
    <Stack vertical fill>
      <Stack.Item>
        <Section title={t('cinematic-selected-title', {}, 'Selected')}>
          {entry ? (
            <Stack>
              <Stack.Item>
                <Box
                  as="img"
                  src={`data:image/png;base64,${entry.preview}`}
                  width="96px"
                  height="96px"
                  style={{ imageRendering: 'pixelated', objectFit: 'contain' }}
                />
              </Stack.Item>
              <Stack.Item grow>
                <Box bold>
                  {t(`cinematic-entry-${entry.id}-name`, {}, entry.id)}
                </Box>
                <Box color="label">
                  {t(`cinematic-entry-${entry.id}-desc`, {}, '')}
                </Box>
              </Stack.Item>
            </Stack>
          ) : (
            <Box color="label">
              {t('cinematic-selected-none', {}, 'Pick a cinematic from the list')}
            </Box>
          )}
        </Section>
      </Stack.Item>
      <Stack.Item>
        <Section title={t('cinematic-viewers-title', {}, 'Viewers')}>
          <Stack wrap>
            {MODES.map((name) => (
              <Stack.Item key={name}>
                <Button
                  selected={mode === name}
                  onClick={() => setMode(name)}
                >
                  {t(`cinematic-mode-${name}`, {}, name)}
                </Button>
              </Stack.Item>
            ))}
          </Stack>
          <Box color="label" mt={1}>
            {t(`cinematic-mode-${mode}-hint`, {}, '')}
          </Box>
          <Button.Checkbox
            mt={1}
            checked={lock}
            onClick={() => setLock(!lock)}
          >
            {t('cinematic-lock', {}, 'Lock viewer controls while it plays')}
          </Button.Checkbox>
        </Section>
      </Stack.Item>
      {mode === 'players' && (
        <Stack.Item grow basis={0}>
          <Section
            fill
            scrollable
            title={t('cinematic-players-title', {}, 'Players')}
            buttons={
              <Input
                value={playerSearch}
                placeholder={t('cinematic-search', {}, 'Search...')}
                onChange={setPlayerSearch}
              />
            }
          >
            {players.length === 0 && (
              <Box color="label">
                {t('cinematic-players-empty', {}, 'No players online')}
              </Box>
            )}
            {players.map((player) => (
              <Box key={player.ckey} className="candystripe" p={0.5}>
                <Button.Checkbox
                  checked={ckeys.includes(player.ckey)}
                  onClick={() => toggle(player.ckey)}
                >
                  {player.ckey}
                  {player.name ? ` (${player.name})` : ''}
                </Button.Checkbox>
              </Box>
            ))}
          </Section>
        </Stack.Item>
      )}
      <Stack.Item>
        <Button
          fluid
          icon="play"
          color="good"
          disabled={!ready}
          onClick={() =>
            act('play', {
              id: props.selected,
              mode,
              lock: lock ? 1 : 0,
              ckeys: ckeys.join(','),
            })
          }
        >
          {t('cinematic-play', {}, 'Play')}
        </Button>
      </Stack.Item>
    </Stack>
  );
}

function ActiveList() {
  const { act, data } = useBackend<Data>();
  const t = useT();
  return (
    <Section
      title={t('cinematic-active-title', {}, 'Playing now')}
      buttons={
        <Button
          icon="stop"
          color="bad"
          disabled={data.active.length === 0}
          onClick={() => act('stop_all')}
        >
          {t('cinematic-stop-all', {}, 'Stop all')}
        </Button>
      }
    >
      {data.active.length === 0 && (
        <Box color="label">{t('cinematic-active-none', {}, 'Nothing is playing')}</Box>
      )}
      {data.active.map((item) => (
        <Stack key={item.ref} className="candystripe" p={0.5} align="center">
          <Stack.Item grow>
            {t(`cinematic-entry-${item.id}-name`, {}, item.id)}
          </Stack.Item>
          <Stack.Item color="label">
            {item.global
              ? t('cinematic-active-global', {}, 'everyone')
              : t(
                  'cinematic-active-watchers',
                  { count: item.watchers },
                  `${item.watchers} viewers`,
                )}
          </Stack.Item>
          <Stack.Item>
            <Button
              icon="stop"
              color="bad"
              onClick={() => act('stop', { ref: item.ref })}
            >
              {t('cinematic-stop', {}, 'Stop')}
            </Button>
          </Stack.Item>
        </Stack>
      ))}
    </Section>
  );
}

export function Cinematic() {
  const t = useT();
  const width = useNumber('cinematic-window-width', 900);
  const height = useNumber('cinematic-window-height', 680);
  const [selected, setSelected] = useState('');

  return (
    <Window
      title={t('cinematic-title', {}, 'Cinematic')}
      width={width}
      height={height}
      theme="admin"
    >
      <Window.Content>
        <Stack fill vertical>
          <Stack.Item grow basis={0}>
            <Stack fill>
              <Stack.Item grow basis={0}>
                <Library selected={selected} onSelect={setSelected} />
              </Stack.Item>
              <Stack.Item width="45%">
                <Launcher selected={selected} />
              </Stack.Item>
            </Stack>
          </Stack.Item>
          <Stack.Item>
            <ActiveList />
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
}
