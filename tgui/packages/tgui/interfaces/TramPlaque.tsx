import { LabeledList, NoticeBox, Section, Stack } from 'tgui-core/components';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  currentTram: Tram[];
  previousTrams: Tram[];
};

type Tram = {
  serialNumber: string;
  mfgDate: string;
  distanceTravelled: number;
  tramCollisions: number;
};

export const TramPlaque = (props) => {
  const { data } = useBackend<Data>();
  const t = useT();
  const { currentTram = [], previousTrams = [] } = data;

  return (
    <Window
      title={t('tramplaque-title', {}, 'Tram Information Plaque')}
      width={600}
      height={360}
      theme="dark"
    >
      <Window.Content>
        <NoticeBox info>{t('tramplaque-brand', {}, 'SkyyTram Mk VI by Nakamura Engineering')}</NoticeBox>
        <Section
          title={t(
            'tramplaque-constructed',
            {
              serial: String(
                currentTram.map((serialNumber) => serialNumber.serialNumber),
              ),
              date: String(
                currentTram.map((serialNumber) => serialNumber.mfgDate),
              ),
            },
            'Constructed',
          )}
        >
          <LabeledList>
            <LabeledList.Item label={t('tramplaque-distance-travelled', {}, 'Distance Travelled')}>
              {currentTram.map(
                (serialNumber) => serialNumber.distanceTravelled / 1000,
              )}{' '}
              {t('tramplaque-km', {}, 'km')}
            </LabeledList.Item>
            <LabeledList.Item label={t('tramplaque-collisions', {}, 'Collisions')}>
              {currentTram.map((serialNumber) => serialNumber.tramCollisions)}
            </LabeledList.Item>
          </LabeledList>
        </Section>
        <Section title={t('tramplaque-history', {}, 'Tram History')}>
          <Stack fill g={0}>
            <Stack.Item m={1} grow>
              <b>{t('tramplaque-serial', {}, 'Serial')}</b>
            </Stack.Item>
            <Stack.Item m={1} grow>
              <b>{t('tramplaque-constructed-col', {}, 'Constructed')}</b>
            </Stack.Item>
            <Stack.Item m={1} grow>
              <b>{t('tramplaque-distance', {}, 'Distance')}</b>
            </Stack.Item>
            <Stack.Item m={1} grow>
              <b>{t('tramplaque-collisions', {}, 'Collisions')}</b>
            </Stack.Item>
          </Stack>
          <Stack vertical fill>
            {previousTrams.map((tram_entry) => (
              <Stack.Item key={tram_entry.serialNumber}>
                <Stack fill g={0}>
                  <Stack.Item m={1} grow>
                    {tram_entry.serialNumber}
                  </Stack.Item>
                  <Stack.Item m={1} grow>
                    {tram_entry.mfgDate}
                  </Stack.Item>
                  <Stack.Item m={1} grow>
                    {tram_entry.distanceTravelled / 1000} {t('tramplaque-km', {}, 'km')}
                  </Stack.Item>
                  <Stack.Item m={1} grow>
                    {tram_entry.tramCollisions}
                  </Stack.Item>
                </Stack>
              </Stack.Item>
            ))}
          </Stack>
        </Section>
      </Window.Content>
    </Window>
  );
};
