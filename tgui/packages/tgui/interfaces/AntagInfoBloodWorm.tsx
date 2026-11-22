import { LabeledList, Section, Stack } from 'tgui-core/components';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';
import { type Objective, ObjectivePrintout } from './common/Objectives';

type Info = {
  objectives: Objective[];
  team: Team;
};

type Team = {
  blood_consumed_total: number;
  times_reproduced_total: number;
};

const POWERS = [
  'breathless',
  'blood_consumption',
  'growth_stages',
  'ventcrawling',
  'doorcrawling',
  'reproduction',
  'parasitism',
  'regeneration',
  'life_support',
  'alien_mind',
];

const WEAKNESSES = [
  'extreme_cold',
  'high_heat',
  'bleeding',
  'inferior_biology',
  'testing',
];

const TIPS = [
  'stealthy_healing',
  'surprise_worms',
  'door_stalking',
  'meatshields',
  'life_insurance',
  'medbay_buffet',
  'fast_food',
  'nomadic',
  'team_up',
  'jail_time',
  'jumpstart',
];

const BloodWormList = (props: { section: string; entries: string[] }) => {
  const { section, entries } = props;
  const t = useT();
  return (
    <LabeledList>
      {entries.map((entry) => (
        <LabeledList.Item
          key={entry}
          label={t(`antaginfo-bloodworm-${section}-${entry}-name`)}
        >
          {t(`antaginfo-bloodworm-${section}-${entry}-desc`)}
        </LabeledList.Item>
      ))}
    </LabeledList>
  );
};

export const AntagInfoBloodWorm = (props) => {
  const { data } = useBackend<Info>();
  const t = useT();
  const { objectives, team } = data;
  return (
    <Window width={800} height={500}>
      <Window.Content>
        <Section scrollable fill>
          <Stack vertical>
            <Stack.Item textColor="red" fontSize="20px">
              {t('antaginfo-bloodworm-title')}
            </Stack.Item>
            <Stack.Item>
              <ObjectivePrintout objectives={objectives} />
            </Stack.Item>
            <Stack.Item>
              <Stack vertical>
                <Stack.Item bold>{t('antaginfo-bloodworm-team')}</Stack.Item>
                <Stack.Item>
                  - {t('antaginfo-bloodworm-team-blood', {
                    count: team.blood_consumed_total,
                  })}
                  <br />-{' '}
                  {t('antaginfo-bloodworm-team-reproduced', {
                    count: team.times_reproduced_total,
                  })}
                </Stack.Item>
              </Stack>
            </Stack.Item>
            <Stack.Item>
              <Section fill title={t('antaginfo-common-powers')}>
                <BloodWormList section="power" entries={POWERS} />
              </Section>
            </Stack.Item>
            <Stack.Item>
              <Section fill title={t('antaginfo-bloodworm-weaknesses')}>
                <BloodWormList section="weakness" entries={WEAKNESSES} />
              </Section>
            </Stack.Item>
            <Stack.Item>
              <Section fill title={t('antaginfo-bloodworm-tips')}>
                <BloodWormList section="tip" entries={TIPS} />
              </Section>
            </Stack.Item>
          </Stack>
        </Section>
      </Window.Content>
    </Window>
  );
};
