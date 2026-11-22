import { sortBy } from 'es-toolkit';
import { useState } from 'react';
import { Box, Button, LabeledList, Section, Stack } from 'tgui-core/components';
import { classes } from 'tgui-core/react';
import { capitalize } from 'tgui-core/string';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type FishingTips = {
  spots: string;
  difficulty: string;
  favorite_bait: string;
  disliked_bait: string;
  traits: string[];
};

type FishInfo = {
  name: string;
  desc: string;
  fluid: string;
  temp_min: number;
  temp_max: number;
  feed: string;
  source: string;
  fishing_tips: FishingTips;
  weight: string;
  size: string;
  icon: string;
  beauty: string;
};

type FishCatalogData = {
  fish_info: FishInfo[] | null;
  sponsored_by: string;
};

export const FishCatalog = (props) => {
  const { act, data } = useBackend<FishCatalogData>();
  const t = useT();
  const { fish_info, sponsored_by } = data;
  const fish_by_name = sortBy(fish_info || [], [(fish: FishInfo) => fish.name]);
  const [currentFish, setCurrentFish] = useState<FishInfo | null>(null);
  return (
    <Window width={500} height={300}>
      <Window.Content>
        <Stack fill>
          <Stack.Item width="140px">
            <Section fill scrollable>
              {fish_by_name.map((f) => (
                <Button
                  key={f.name}
                  fluid
                  color="transparent"
                  selected={f === currentFish}
                  onClick={() => {
                    setCurrentFish(f);
                  }}
                >
                  {f.name}
                </Button>
              ))}
            </Section>
          </Stack.Item>
          <Stack.Item grow basis={0}>
            <Section
              fill
              scrollable
              title={
                currentFish
                  ? capitalize(currentFish.name)
                  : t(
                      'fishcatalog-index-title',
                      { sponsor: sponsored_by },
                      `${sponsored_by} Fish Index`,
                    )
              }
            >
              {currentFish && (
                <LabeledList>
                  <LabeledList.Item label={t('fishcatalog-description', {}, 'Description')}>
                    {currentFish.desc}
                  </LabeledList.Item>
                  <LabeledList.Item label={t('fishcatalog-water-type', {}, 'Water type')}>
                    {currentFish.fluid}
                  </LabeledList.Item>
                  <LabeledList.Item label={t('fishcatalog-temperature', {}, 'Temperature')}>
                    {t(
                      'fishcatalog-temperature-range',
                      { min: currentFish.temp_min, max: currentFish.temp_max },
                      `${currentFish.temp_min} to ${currentFish.temp_max}`,
                    )}
                  </LabeledList.Item>
                  <LabeledList.Item label={t('fishcatalog-feeding', {}, 'Feeding')}>
                    {currentFish.feed}
                  </LabeledList.Item>
                  <LabeledList.Item label={t('fishcatalog-acquisition', {}, 'Acquisition')}>
                    {currentFish.source}
                  </LabeledList.Item>
                  <LabeledList.Item label={t('fishcatalog-average-size', {}, 'Average size')}>
                    {t(
                      'fishcatalog-size-value',
                      { size: currentFish.size },
                      `${currentFish.size} cm`,
                    )}
                  </LabeledList.Item>
                  <LabeledList.Item label={t('fishcatalog-average-weight', {}, 'Average weight')}>
                    {t(
                      'fishcatalog-weight-value',
                      { weight: currentFish.weight },
                      `${currentFish.weight} kiloclam`,
                    )}
                  </LabeledList.Item>
                  <LabeledList.Item label={t('fishcatalog-beauty', {}, 'Aquarium Beauty Score')}>
                    {currentFish.beauty}
                  </LabeledList.Item>
                  <LabeledList.Item label={t('fishcatalog-tips', {}, 'Fishing and Aquarium tips')}>
                    <LabeledList>
                      <LabeledList.Item label={t('fishcatalog-fishing-locations', {}, 'Fishing locations')}>
                        {currentFish.fishing_tips.spots}
                      </LabeledList.Item>
                      <LabeledList.Item label={t('fishcatalog-favorite-bait', {}, 'Favourite bait')}>
                        {currentFish.fishing_tips.favorite_bait}
                      </LabeledList.Item>
                      <LabeledList.Item label={t('fishcatalog-disliked-bait', {}, 'Disliked bait')}>
                        {currentFish.fishing_tips.disliked_bait}
                      </LabeledList.Item>
                      <LabeledList.Item label={t('fishcatalog-behavior', {}, 'Behavior')}>
                        {currentFish.fishing_tips.traits}
                      </LabeledList.Item>
                    </LabeledList>
                  </LabeledList.Item>
                  <LabeledList.Item label={t('fishcatalog-illustration', {}, 'Illustration')}>
                    <Box className={classes(['fish32x32', currentFish.icon])} />
                  </LabeledList.Item>
                </LabeledList>
              )}
            </Section>
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
};
