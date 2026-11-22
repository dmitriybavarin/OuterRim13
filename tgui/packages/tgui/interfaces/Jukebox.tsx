import { sortBy } from 'es-toolkit';
import {
  Box,
  Button,
  Dropdown,
  Knob,
  LabeledControls,
  LabeledList,
  Section,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Song = {
  name: string;
  length: number;
  beat: number;
};

type Data = {
  active: BooleanLike;
  looping: BooleanLike;
  volume: number;
  track_selected: string | null;
  songs: Song[];
};

export const Jukebox = () => {
  const { act, data } = useBackend<Data>();
  const { active, looping, track_selected, volume, songs } = data;
  const t = useT();

  const songs_sorted: Song[] = sortBy(songs, [(song: Song) => song.name]);
  const song_selected: Song | undefined = songs.find(
    (song) => song.name === track_selected,
  );

  return (
    <Window width={370} height={313}>
      <Window.Content>
        <Section
          title={t('jukebox-player', {}, 'Song Player')}
          buttons={
            <>
              <Button
                icon={active ? 'pause' : 'play'}
                content={
                  active
                    ? t('jukebox-stop', {}, 'Stop')
                    : t('jukebox-play', {}, 'Play')
                }
                selected={active}
                onClick={() => act('toggle')}
              />
              <Button.Checkbox
                icon={'arrow-rotate-left'}
                content={t('jukebox-repeat', {}, 'Repeat')}
                disabled={active}
                checked={looping}
                onClick={() => act('loop', { looping: !looping })}
              />
            </>
          }
        >
          <LabeledList>
            <LabeledList.Item label={t('jukebox-track-selected', {}, 'Track Selected')}>
              <Dropdown
                width="240px"
                options={songs_sorted.map((song) => song.name)}
                disabled={!!active}
                selected={
                  song_selected?.name || t('jukebox-select', {}, 'Select a Track')
                }
                onSelected={(value) =>
                  act('select_track', {
                    track: value,
                  })
                }
              />
            </LabeledList.Item>
            <LabeledList.Item label={t('jukebox-length', {}, 'Track Length')}>
              {song_selected?.length || t('jukebox-none', {}, 'No Track Selected')}
            </LabeledList.Item>
            <LabeledList.Item label={t('jukebox-beat', {}, 'Track Beat')}>
              {song_selected?.beat || t('jukebox-none', {}, 'No Track Selected')}
              {!!song_selected && ' '}
              {!!song_selected &&
                t('jukebox-beats', { count: song_selected.beat }, 'beats')}
            </LabeledList.Item>
          </LabeledList>
        </Section>
        <Section title={t('jukebox-settings', {}, 'Machine Settings')}>
          <LabeledControls justify="center">
            <LabeledControls.Item label={t('jukebox-volume', {}, 'Volume')}>
              <Box position="relative">
                <Knob
                  size={3.2}
                  color={volume >= 25 ? 'red' : 'green'}
                  value={volume}
                  unit="%"
                  minValue={0}
                  maxValue={50}
                  step={1}
                  stepPixelSize={1}
                  onChange={(e, value) =>
                    act('set_volume', {
                      volume: value,
                    })
                  }
                />
                <Button
                  fluid
                  position="absolute"
                  top="-2px"
                  right="-22px"
                  color="transparent"
                  icon="fast-backward"
                  onClick={() =>
                    act('set_volume', {
                      volume: 'min',
                    })
                  }
                />
                <Button
                  fluid
                  position="absolute"
                  top="16px"
                  right="-22px"
                  color="transparent"
                  icon="fast-forward"
                  onClick={() =>
                    act('set_volume', {
                      volume: 'max',
                    })
                  }
                />
                <Button
                  fluid
                  position="absolute"
                  top="34px"
                  right="-22px"
                  color="transparent"
                  icon="undo"
                  onClick={() =>
                    act('set_volume', {
                      volume: 'reset',
                    })
                  }
                />
              </Box>
            </LabeledControls.Item>
          </LabeledControls>
        </Section>
      </Window.Content>
    </Window>
  );
};
