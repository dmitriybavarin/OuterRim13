import {
  Box,
  Button,
  Divider,
  Knob,
  LabeledControls,
  Section,
  Stack,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  movespeed: number;
  range: number;
  moving: BooleanLike;
};

export const TrainingMachine = () => {
  const t = useT();
  return (
    <Window width={230} height={150} title="AURUMILL">
      <Window.Content>
        <Section
          fill
          title={t('trainingmachine-title', {}, 'Training Machine')}
        >
          <TrainingControls />
        </Section>
      </Window.Content>
    </Window>
  );
};

/** Creates a labeledlist of controls */
const TrainingControls = (props) => {
  const { act, data } = useBackend<Data>();
  const { movespeed, range, moving } = data;
  const t = useT();

  return (
    <LabeledControls m={1}>
      <LabeledControls.Item label={t('trainingmachine-speed', {}, 'Speed')}>
        <Knob
          inline
          size={1.2}
          step={0.5}
          stepPixelSize={10}
          value={movespeed}
          minValue={1}
          maxValue={10}
          onChange={(_, value) => act('movespeed', { movespeed: value })}
        />
      </LabeledControls.Item>
      <LabeledControls.Item label={t('trainingmachine-range', {}, 'Range')}>
        <Knob
          inline
          size={1.2}
          step={1}
          stepPixelSize={50}
          value={range}
          minValue={1}
          maxValue={7}
          onChange={(_, value) => act('range', { range: value })}
        />
      </LabeledControls.Item>
      <Stack.Item>
        <Divider vertical />
      </Stack.Item>
      <Stack.Item>
        <Button fluid selected={moving} onClick={() => act('toggle')}>
          <Box bold fontSize="1.4em" lineHeight={3}>
            {moving
              ? t('trainingmachine-end', {}, 'END')
              : t('trainingmachine-begin', {}, 'BEGIN')}
          </Box>
        </Button>
      </Stack.Item>
    </LabeledControls>
  );
};
