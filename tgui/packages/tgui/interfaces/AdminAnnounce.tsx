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
  header_command: string;
  header_captain: string;
  header_syndicate: string;
  history: HistoryEntry[];
  players_all: number;
  players_station: number;
};

const KINDS = ['server', 'command', 'captain', 'syndicate', 'custom'] as const;
const AUDIENCES = ['all', 'station'] as const;

type AlertStyle = {
  stripe: string;
  alt: string;
  header: string;
  sub: string;
  body: string;
};

const SUB_PINK = 'hsl(336.1, 100%, 66.1%)';
const SUB_CYAN = 'hsl(192.4, 100%, 60%)';

const ALERT_STYLES: Record<string, AlertStyle> = {
  default: { stripe: 'hsl(198.6, 100%, 11.4%)', alt: 'hsl(198.3, 100%, 13.5%)', header: 'hsl(192.4, 100%, 60%)', sub: SUB_PINK, body: 'hsl(198.6, 100%, 6.4%)' },
  blue: { stripe: 'hsl(198.6, 100%, 11.4%)', alt: 'hsl(198.3, 100%, 13.5%)', header: 'hsl(192.4, 100%, 60%)', sub: SUB_PINK, body: 'hsl(198.6, 100%, 6.4%)' },
  green: { stripe: 'hsl(120, 100%, 12%)', alt: 'hsl(120, 100%, 13.9%)', header: 'hsl(150.1, 100%, 50%)', sub: 'hsl(336.4, 100%, 76.1%)', body: 'hsl(120, 100%, 7%)' },
  pink: { stripe: 'hsl(326.2, 100%, 9.4%)', alt: 'hsl(325.3, 100%, 12.5%)', header: 'hsl(336.1, 100%, 66.1%)', sub: SUB_CYAN, body: 'hsl(326.2, 100%, 4.4%)' },
  yellow: { stripe: 'hsl(51, 100%, 17.1%)', alt: 'hsl(50.6, 100%, 15.1%)', header: 'hsl(38.7, 100%, 93.9%)', sub: SUB_CYAN, body: 'hsl(51, 100%, 12.1%)' },
  orange: { stripe: 'hsl(35.1, 100%, 17.5%)', alt: 'hsl(37, 100%, 21%)', header: 'hsl(20.9, 92%, 95.1%)', sub: SUB_CYAN, body: 'hsl(35.1, 100%, 12.5%)' },
  red: { stripe: 'hsl(0, 100%, 12.9%)', alt: 'hsl(0, 100%, 16.1%)', header: 'hsl(336.1, 100%, 66.1%)', sub: SUB_CYAN, body: 'hsl(0, 100%, 7.9%)' },
  purple: { stripe: 'hsl(295, 100%, 9.4%)', alt: 'hsl(295.1, 100%, 12%)', header: 'hsl(266.5, 84.3%, 80%)', sub: SUB_CYAN, body: 'hsl(295, 100%, 4.4%)' },
  white: { stripe: 'hsl(0, 0%, 22%)', alt: 'hsl(0, 0%, 26%)', header: 'hsl(0, 0%, 100%)', sub: SUB_CYAN, body: 'hsl(0, 0%, 17%)' },
  grey: { stripe: 'hsl(0, 0%, 14.5%)', alt: 'hsl(0, 0%, 16.1%)', header: 'hsl(336.1, 100%, 66.1%)', sub: SUB_CYAN, body: 'hsl(0, 0%, 9.5%)' },
};

function AlertPreview(props: {
  style: AlertStyle;
  header: string;
  title: string;
  text: string;
}) {
  const { style, header, title, text } = props;
  return (
    <Box
      style={{
        fontWeight: 'bold',
        borderWidth: '4px',
        borderStyle: 'solid',
        borderImage: `repeating-linear-gradient(-45deg, ${style.alt}, ${style.alt} 10px, ${style.stripe} 10px, ${style.stripe} 20px) 4 fill / 4px / 0 repeat`,
      }}
    >
      <Box p="0.5rem 0">
        <Box px={1} style={{ fontSize: '175%', lineHeight: '100%', color: style.header }}>
          {header}
        </Box>
        {!!title && (
          <Box px={1} pt={0.5} style={{ fontSize: '125%', lineHeight: '100%', color: style.sub }}>
            {title}
          </Box>
        )}
      </Box>
      <Box p="0.5rem" preserveWhitespace style={{ background: style.body, color: 'hsl(0, 0%, 91.8%)' }}>
        {text}
      </Box>
    </Box>
  );
}

export function AdminAnnounce() {
  const { act, data: raw } = useBackend<Partial<Data>>();
  const data: Data = {
    sounds: raw.sounds ?? [],
    colors: raw.colors ?? ['default'],
    max_length: raw.max_length ?? 2000,
    sender_default: raw.sender_default ?? '',
    command_name: raw.command_name ?? '',
    header_command: raw.header_command ?? '',
    header_captain: raw.header_captain ?? '',
    header_syndicate: raw.header_syndicate ?? '',
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
        return (
          data.header_command ||
          t('adminannounce-sender-command', { name: data.command_name })
        );
      case 'captain':
        return data.header_captain || t('adminannounce-sender-captain');
      case 'syndicate':
        return data.header_syndicate || t('adminannounce-sender-syndicate');
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
              {isServer ? (
                <Box
                  p={1}
                  style={{
                    background: 'hsl(50.6, 100%, 15.1%)',
                    border: '1px solid hsl(47.9, 100%, 40%)',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  <Box style={{ color: 'hsl(47.9, 100%, 40%)' }}>
                    {senderLabel()}
                  </Box>
                  {!!title && <Box mt={0.5}>{title}</Box>}
                  <Box mt={0.5} preserveWhitespace>
                    {text || t('adminannounce-preview-empty')}
                  </Box>
                </Box>
              ) : (
                <AlertPreview
                  style={ALERT_STYLES[color] ?? ALERT_STYLES.default}
                  header={senderLabel()}
                  title={title}
                  text={text || t('adminannounce-preview-empty')}
                />
              )}
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
