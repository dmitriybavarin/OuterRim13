import {
  Box,
  Button,
  LabeledList,
  ProgressBar,
  Section,
  Stack,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  animals_max: number;
  animals: number;
  choiceA: string;
  choiceB: string;
  completed: BooleanLike;
  dna_max: number;
  dna: number;
  plants_max: number;
  plants: number;
  used: BooleanLike;
};

export function DnaVault(props) {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const {
    animals_max,
    animals,
    choiceA,
    choiceB,
    completed,
    dna_max,
    dna,
    plants_max,
    plants,
    used,
  } = data;

  return (
    <Window width={350} height={400}>
      <Window.Content>
        <Section title={t('dnavault-title', {}, 'DNA Vault Database')}>
          <LabeledList>
            <LabeledList.Item label={t('dnavault-human', {}, 'Human DNA')}>
              <ProgressBar value={dna / dna_max}>
                {t(
                  'dnavault-samples',
                  { count: dna, max: dna_max },
                  `${dna} / ${dna_max} Samples`,
                )}
              </ProgressBar>
            </LabeledList.Item>
            <LabeledList.Item label={t('dnavault-plant', {}, 'Plant DNA')}>
              <ProgressBar value={plants / plants_max}>
                {t(
                  'dnavault-samples',
                  { count: plants, max: plants_max },
                  `${plants} / ${plants_max} Samples`,
                )}
              </ProgressBar>
            </LabeledList.Item>
            <LabeledList.Item label={t('dnavault-animal', {}, 'Animal DNA')}>
              <ProgressBar value={animals / animals_max}>
                {t(
                  'dnavault-samples',
                  { count: animals, max: animals_max },
                  `${animals} / ${animals_max} Samples`,
                )}
              </ProgressBar>
            </LabeledList.Item>
          </LabeledList>
        </Section>
        {!!(completed && !used) && (
          <Section title={t('dnavault-therapy', {}, 'Personal Gene Therapy')}>
            <Box bold textAlign="center" mb={1}>
              {t('dnavault-applicable', {}, 'Applicable Gene Therapy Treatments')}
            </Box>
            <Stack>
              <Stack.Item grow>
                <Button
                  fluid
                  bold
                  textAlign="center"
                  onClick={() =>
                    act('gene', {
                      choice: choiceA,
                    })
                  }
                >
                  {choiceA}
                </Button>
              </Stack.Item>
              <Stack.Item grow>
                <Button
                  fluid
                  bold
                  textAlign="center"
                  onClick={() =>
                    act('gene', {
                      choice: choiceB,
                    })
                  }
                >
                  {choiceB}
                </Button>
              </Stack.Item>
            </Stack>
          </Section>
        )}
      </Window.Content>
    </Window>
  );
}
