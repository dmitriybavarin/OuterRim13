import { useState } from 'react';
import {
  Box,
  Button,
  Dropdown,
  Input,
  LabeledList,
  Section,
  Stack,
  TextArea,
} from 'tgui-core/components';

import { useBackend } from '../backend';
import { useNumber, useT } from '../i18n';
import { Window } from '../layouts';

type HistoryEntry = {
  time: string;
  admin: string;
  kind: string;
  audience: string;
  sender: string;
  title: string;
  text: string;
  sound: string;
  color: string;
};

type Data = {
  sounds: string[];
  colors: string[];
  max_length: number;
  sender_default: string;
  command_name: string;
  history: HistoryEntry[];
  players_all: number;
  players_station: number;
};

const KINDS = ['server', 'command', 'captain', 'syndicate', 'custom'] as const;
const AUDIENCES = ['all', 'station'] as const;

const COLOR_HEX: Record<string, string> = {
  default: '#4c6fb0',
  green: '#2f8f4a',
  blue: '#2f6fd0',
  pink: '#d05fa0',
  yellow: '#c8b21f',
  orange: '#d9822b',
  red: '#c0392b',
  purple: '#8e44ad',
};

export function AdminAnnounce() {
  const { act, data: raw } = useBackend<Partial<Data>>();
  const data: Data = {
    sounds: raw.sounds ?? [],
    colors: raw.colors ?? ['default'],
    max_length: raw.max_length ?? 2000,
    sender_default: raw.sender_default ?? '',
    command_name: raw.command_name ?? '',
    history: raw.history ?? [],
    players_all: raw.players_all ?? 0,
    players_station: raw.players_station ?? 0,
  };
  const t = useT();
  const width = useNumber('adminannounce-window-width', 640);
  const height = useNumber('adminannounce-window-height', 760);

  const [kind, setKind] = useState<string>('command');
  const [audience, setAudience] = useState<string>('all');
  const [sender, setSender] = useState('');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [sound, setSound] = useState('default');
  const [color, setColor] = useState('default');

  const isServer = kind === 'server';
  const canSend =
    text.trim().length > 0 && (kind !== 'custom' || sender.trim().length > 0);

  const senderLabel = () => {
    switch (kind) {
      case 'server':
        return t('adminannounce-sender-server', { sender: data.sender_default });
      case 'command':
        return t('adminannounce-sender-command', { name: data.command_name });
      case 'captain':
        return t('adminannounce-sender-captain');
      case 'syndicate':
        return t('adminannounce-sender-syndicate');
      default:
        return sender || t('adminannounce-sender-empty');
    }
  };

  const soundOptions = [
    { value: 'default', displayText: t('adminannounce-sound-default') },
    ...(isServer
      ? [{ value: 'none', displayText: t('adminannounce-sound-none') }]
      : []),
    ...(isServer
      ? []
      : data.sounds.map((name) => ({ value: name, displayText: name }))),
  ];
  const soundValue = soundOptions.some((option) => option.value === sound)
    ? sound
    : 'default';

  const colorOptions = data.colors.map((name) => ({
    value: name,
    displayText: t(`adminannounce-color-${name}`, {}, name),
  }));

  function loadEntry(entry: HistoryEntry) {
    setKind(entry.kind || 'command');
    setAudience(entry.audience || 'all');
    setSender(entry.sender || '');
    setTitle(entry.title || '');
    setText(entry.text || '');
    setSound(entry.sound || 'default');
    setColor(entry.color || 'default');
  }

  return (
    <Window
      title={t('adminannounce-title')}
      width={width}
      height={height}
      theme="admin"
    >
      <Window.Content scrollable>
        <Stack vertical>
          <Stack.Item>
            <Section title={t('adminannounce-section-message')}>
              <LabeledList>
                <LabeledList.Item label={t('adminannounce-kind')}>
                  <Dropdown
                    width="100%"
                    options={KINDS.map((value) => ({
                      value,
                      displayText: t(`adminannounce-kind-${value}`),
                    }))}
                    selected={kind}
                    displayText={t(`adminannounce-kind-${kind}`)}
                    onSelected={setKind}
                  />
                </LabeledList.Item>
                {kind === 'custom' && (
                  <LabeledList.Item label={t('adminannounce-sender')}>
                    <Input
                      fluid
                      maxLength={100}
                      value={sender}
                      placeholder={t('adminannounce-sender-placeholder')}
                      onChange={(value) => setSender(value ?? '')}
                    />
                  </LabeledList.Item>
                )}
                <LabeledList.Item label={t('adminannounce-audience')}>
                  <Dropdown
                    width="100%"
                    options={AUDIENCES.map((value) => ({
                      value,
                      displayText: t(`adminannounce-audience-${value}`, {
                        count:
                          value === 'all'
                            ? data.players_all
                            : data.players_station,
                      }),
                    }))}
                    selected={audience}
                    displayText={t(`adminannounce-audience-${audience}`, {
                      count:
                        audience === 'all'
                          ? data.players_all
                          : data.players_station,
                    })}
                    onSelected={setAudience}
                  />
                </LabeledList.Item>
                <LabeledList.Item label={t('adminannounce-sound')}>
                  <Dropdown
                    width="100%"
                    options={soundOptions}
                    selected={soundValue}
                    displayText={
                      soundOptions.find((option) => option.value === soundValue)
                        ?.displayText
                    }
                    onSelected={setSound}
                  />
                </LabeledList.Item>
                {!isServer && (
                  <LabeledList.Item label={t('adminannounce-color')}>
                    <Dropdown
                      width="100%"
                      options={colorOptions}
                      selected={color}
                      displayText={
                        colorOptions.find((option) => option.value === color)
                          ?.displayText
                      }
                      onSelected={setColor}
                    />
                  </LabeledList.Item>
                )}
                <LabeledList.Item label={t('adminannounce-title-label')}>
                  <Input
                    fluid
                    maxLength={200}
                    value={title}
                    placeholder={t('adminannounce-title-placeholder')}
                    onChange={(value) => setTitle(value ?? '')}
                  />
                </LabeledList.Item>
              </LabeledList>
              <TextArea
                mt={1}
                fluid
                height="9em"
                maxLength={data.max_length}
                value={text}
                placeholder={t('adminannounce-text-placeholder')}
                onChange={(value) => setText(value ?? '')}
              />
              {isServer && (
                <Box color="label" mt={1}>
                  {t('adminannounce-server-hint')}
                </Box>
              )}
            </Section>
          </Stack.Item>
          <Stack.Item>
            <Section title={t('adminannounce-section-preview')}>
              <Box
                p={1}
                style={{
                  borderLeft: `4px solid ${
                    isServer ? '#4c6fb0' : (COLOR_HEX[color] ?? '#4c6fb0')
                  }`,
                  background: 'rgba(255, 255, 255, 0.05)',
                }}
              >
                <Box bold fontSize="1.3em" color="bad">
                  {senderLabel()}
                </Box>
                {!!title && (
                  <Box bold mt={0.5}>
                    {title}
                  </Box>
                )}
                <Box mt={0.5} preserveWhitespace>
                  {text || t('adminannounce-preview-empty')}
                </Box>
              </Box>
              <Box color="label" mt={1}>
                {t('adminannounce-audience-summary', {
                  count:
                    audience === 'all' ? data.players_all : data.players_station,
                })}
              </Box>
            </Section>
          </Stack.Item>
          <Stack.Item>
            <Button
              fluid
              icon="bullhorn"
              color="bad"
              textAlign="center"
              disabled={!canSend}
              confirmContent={t('adminannounce-send-confirm')}
              onClick={() =>
                act('send', {
                  kind,
                  audience,
                  sender,
                  title,
                  text,
                  sound: soundValue,
                  color,
                })
              }
            >
              {t('adminannounce-send')}
            </Button>
          </Stack.Item>
          <Stack.Item>
            <Section title={t('adminannounce-section-history')}>
              {data.history.length === 0 && (
                <Box color="label">{t('adminannounce-history-empty')}</Box>
              )}
              {data.history.map((entry, index) => (
                <Stack key={index} align="center" className="candystripe" p={0.5}>
                  <Stack.Item color="label">{entry.time}</Stack.Item>
                  <Stack.Item bold>{entry.admin}</Stack.Item>
                  <Stack.Item color="label">
                    {t(`adminannounce-kind-${entry.kind}`)}
                  </Stack.Item>
                  <Stack.Item grow basis={0} style={{ overflow: 'hidden' }}>
                    <Box nowrap style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {entry.title ? `${entry.title}: ` : ''}
                      {entry.text}
                    </Box>
                  </Stack.Item>
                  <Stack.Item>
                    <Button
                      icon="redo"
                      tooltip={t('adminannounce-history-reuse')}
                      onClick={() => loadEntry(entry)}
                    />
                  </Stack.Item>
                </Stack>
              ))}
            </Section>
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
}
