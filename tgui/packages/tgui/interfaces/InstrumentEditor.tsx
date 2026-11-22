import {
  Box,
  Button,
  Collapsible,
  Divider,
  Dropdown,
  NumberInput,
  Section,
  Stack,
  Input,
  Tooltip,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  id: string;
  using_instrument: string;
  note_shift_min: number;
  note_shift_max: number;
  note_shift: number;
  octaves: number;
  sustain_modes: string[];
  sustain_mode: string;
  sustain_mode_button: string;
  sustain_mode_duration: number;
  instrument_ready: BooleanLike;
  volume: number;
  volume_dropoff_threshold: number;
  min_volume: number;
  max_volume: number;
  sustain_indefinitely: BooleanLike;
  sustain_mode_min: number;
  sustain_mode_max: number;
  playing: BooleanLike;
  max_repeats: number;
  repeat: number;
  bpm: number;
  lines: LineData[];
  can_switch_instrument: BooleanLike;
  possible_instruments: InstrumentData[];
  max_line_chars: number;
  max_lines: number;
};

type InstrumentData = {
  name: string;
  id: string;
};

type LineData = {
  line_count: number;
  line_text: string;
};

export const InstrumentEditor = (props) => {
  const { data } = useBackend<Data>();
  const t = useT();

  return (
    <Window width={750} height={500}>
      <Window.Content scrollable>
        <InstrumentSettings />
        <Collapsible
          open
          title={t('instrument-music-editor', {}, 'Music Editor')}
          icon="pencil"
        >
          <EditingSettings />
        </Collapsible>
        <Collapsible
          title={t('instrument-help-section', {}, 'Help Section')}
          icon="question"
        >
          <HelpSection />
        </Collapsible>
      </Window.Content>
    </Window>
  );
};

const InstrumentSettings = (props) => {
  const { act, data } = useBackend<Data>();
  const {
    id,
    playing,
    repeat,
    max_repeats,
    can_switch_instrument,
    possible_instruments = [],
    instrument_ready,
    using_instrument,
    note_shift_min,
    note_shift_max,
    note_shift,
    octaves,
    sustain_modes,
    sustain_mode,
    sustain_mode_button,
    sustain_mode_duration,
    sustain_indefinitely,
    sustain_mode_min,
    sustain_mode_max,
    volume,
    min_volume,
    max_volume,
    volume_dropoff_threshold,
    lines,
  } = data;
  const t = useT();

  const instrument_id_by_name = (name) => {
    return possible_instruments.find((instrument) => instrument.name === name)
      ?.id;
  };

  return (
    <Section title={t('instrument-settings', {}, 'Settings')}>
      {lines.length > 0 && (
        <Box fontSize="16px" mb={1}>
          <Button onClick={() => act('play_music')}>
            {playing
              ? t('instrument-stop-music', {}, 'Stop Music')
              : t('instrument-start-playing', {}, 'Start Playing')}
          </Button>
        </Box>
      )}
      <Box>
        <Box
          inline
          style={{
            borderBottom: '2px dotted rgba(255, 255, 255, 0.8)',
          }}
          mr={1}
        >
          <Tooltip
            content={t(
              'instrument-id-tooltip',
              {},
              'All nearby instruments with the same ID will start playing the same song when any one starts playing.',
            )}
          >
            {t('instrument-id', {}, 'ID:')}
          </Tooltip>
        </Box>
        <Input
          value={id}
          maxLength={20}
          onChange={(value) => act('set_instrument_id', { id: value })}
        />
      </Box>
      <Box>
        {t('instrument-repeats-left', {}, 'Repeats Left:')}
        <NumberInput
          ml={1}
          step={1}
          minValue={0}
          disabled={!!playing}
          maxValue={max_repeats}
          value={repeat}
          onChange={(value) =>
            act('set_repeat_amount', {
              amount: value,
            })
          }
        />
      </Box>
      <Box>
        {!!can_switch_instrument && (
          <Stack fill>
            <Stack.Item mt={0.5}>
              {t('instrument-using', {}, 'Instrument Using')}
            </Stack.Item>
            <Stack.Item grow>
              <Dropdown
                width="40%"
                selected={using_instrument}
                disabled={!can_switch_instrument}
                options={possible_instruments.map(
                  (instrument) => instrument.name,
                )}
                onSelected={(value) =>
                  act('change_instrument', {
                    new_instrument: instrument_id_by_name(value),
                  })
                }
              />
            </Stack.Item>
          </Stack>
        )}
      </Box>
      <Stack mt={1}>
        <Stack.Item>
          {t('instrument-playback-settings', {}, 'Playback Settings:')}
          <Box>
            <NumberInput
              minValue={note_shift_min}
              maxValue={note_shift_max}
              step={1}
              value={note_shift}
              onChange={(value) =>
                act('set_note_shift', {
                  amount: value,
                })
              }
            />
            {t(
              'instrument-keys-octaves',
              { octaves },
              `keys / ${octaves} octaves`,
            )}
          </Box>
          <Stack>
            <Stack.Item mt={0.5}>{t('instrument-mode', {}, 'Mode:')}</Stack.Item>
            <Stack.Item grow>
              <Dropdown
                width="100%"
                selected={sustain_mode}
                options={sustain_modes}
                onSelected={(value) =>
                  act('set_sustain_mode', {
                    new_mode: value,
                  })
                }
              />
            </Stack.Item>
          </Stack>
          <Box>
            {sustain_mode_button}:
            <NumberInput
              ml={1}
              step={1}
              minValue={sustain_mode_min}
              maxValue={sustain_mode_max}
              value={sustain_mode_duration}
              onChange={(value) =>
                act('edit_sustain_mode', {
                  amount: value,
                })
              }
            />
          </Box>
        </Stack.Item>
        <Divider vertical />
        <Stack.Item>
          <Box>
            {t('instrument-status', {}, 'Status:')}
            {instrument_ready ? (
              <span style={{ color: '#5EFB6E' }}>
                {' '}
                {t('instrument-ready', {}, 'Ready')}
              </span>
            ) : (
              <span style={{ color: '#FF0000' }}>
                {' '}
                {t(
                  'instrument-definition-error',
                  {},
                  'Instrument Definition Error!',
                )}
              </span>
            )}
          </Box>
          <Box>
            {t('instrument-volume', {}, 'Volume:')}
            <NumberInput
              step={1}
              minValue={min_volume}
              maxValue={max_volume}
              value={volume}
              onChange={(value) =>
                act('set_volume', {
                  amount: value,
                })
              }
            />
          </Box>
          <Box>
            {t(
              'instrument-volume-dropoff',
              {},
              'Volume Dropoff Threshold:',
            )}
            <NumberInput
              step={1}
              minValue={1}
              maxValue={100}
              value={volume_dropoff_threshold}
              onChange={(value) =>
                act('set_dropoff_volume', {
                  amount: value,
                })
              }
            />
          </Box>
          <Box>
            <Button onClick={() => act('toggle_sustain_hold_indefinitely')}>
              {sustain_indefinitely
                ? t(
                    'instrument-sustain-on',
                    {},
                    'Sustaining last held note indefinitely',
                  )
                : t(
                    'instrument-sustain-off',
                    {},
                    'Not sustaining last held note indefinitely',
                  )}
            </Button>
          </Box>
        </Stack.Item>
      </Stack>
    </Section>
  );
};

const EditingSettings = (props) => {
  const { act, data } = useBackend<Data>();
  const { bpm, lines } = data;
  const t = useT();

  return (
    <Section>
      <Box>
        <Button onClick={() => act('start_new_song')}>
          {t('instrument-new-song', {}, 'Start a New Song')}
        </Button>
        <Button onClick={() => act('import_song')}>
          {t('instrument-import-song', {}, 'Import a Song')}
        </Button>
      </Box>
      <Box>
        {t('instrument-tempo', {}, 'Tempo:')}{' '}
        <Button
          onClick={() => act('tempo', { tempo_change: 'increase_speed' })}
        >
          -
        </Button>{' '}
        {t('instrument-bpm', { bpm }, `${bpm} BPM`)}{' '}
        <Button
          onClick={() => act('tempo', { tempo_change: 'decrease_speed' })}
        >
          +
        </Button>
      </Box>
      <Box>
        {lines.map((line, index) => (
          <Box key={index} fontSize="11px">
            {t('instrument-line', { index }, `Line ${index}:`)}
            <Button
              onClick={() =>
                act('modify_line', { line_editing: line.line_count })
              }
            >
              {t('instrument-edit', {}, 'Edit')}
            </Button>
            <Button
              onClick={() =>
                act('delete_line', { line_deleted: line.line_count })
              }
            >
              X
            </Button>
            {line.line_text}
          </Box>
        ))}
      </Box>
      <Box>
        <Button onClick={() => act('add_new_line')}>
          {t('instrument-add-line', {}, 'Add Line')}
        </Button>
      </Box>
    </Section>
  );
};

const HelpSection = (props) => {
  const { data } = useBackend<Data>();
  const { max_line_chars, max_lines } = data;
  const t = useT();

  return (
    <Section>
      <Box>
        {t(
          'instrument-help-1',
          {},
          'Lines are a series of chords, separated by commas (,), each with notes separated by hyphens (-).',
        )}
        <br />
        {t(
          'instrument-help-2',
          {},
          'Every note in a chord will play together, with chord timed by the tempo.',
        )}
        <br />
        {t(
          'instrument-help-3',
          {},
          'Notes are played by the names of the note, and optionally, the accidental, and/or the octave number.',
        )}
        <br />
        {t(
          'instrument-help-4',
          {},
          'By default, every note is natural and in octave 3. Defining otherwise is remembered for each note.',
        )}
        <br />
        {t('instrument-help-5-pre', {}, 'Example:')} <i>C,D,E,F,G,A,B</i>{' '}
        {t('instrument-help-5-post', {}, 'will play a C major scale.')}
        <br />
        {t(
          'instrument-help-6-pre',
          {},
          'After a note has an accidental placed, it will be remembered:',
        )}{' '}
        <i>C,C4,C,C3</i> {t('instrument-help-6-mid', {}, 'is')}{' '}
        <i>C3,C4,C4,C3</i>
        <br />
        {t(
          'instrument-help-7',
          {},
          'Chords can be played simply by seperating each note with a hyphon:',
        )}{' '}
        <i>A-C#,Cn-E,E-G#,Gn-B</i>
        <br />
        {t(
          'instrument-help-8',
          {},
          'A pause may be denoted by an empty chord:',
        )}{' '}
        <i>C,E,,C,G</i>
        <br />
        {t(
          'instrument-help-9a',
          {},
          'To make a chord be a different time, end it with /x, where the chord length will be length',
        )}
        <br />
        {t('instrument-help-9b', {}, 'defined by tempo / x:')}{' '}
        <i>C,G/2,E/4</i>
        <br />
        {t('instrument-help-10', {}, 'Combined, an example is:')}{' '}
        <i>E-E4/4,F#/2,G#/8,B/8,E3-E4/4</i>
        <br />
        {t(
          'instrument-help-11',
          { count: max_line_chars },
          `Lines may be up to ${max_line_chars} characters.`,
        )}
        <br />
        {t(
          'instrument-help-12',
          { count: max_lines },
          `A song may only contain up to ${max_lines} lines.`,
        )}
        <br />
      </Box>
    </Section>
  );
};
