import { useState } from 'react';
import {
  Box,
  Button,
  Dropdown,
  LabeledList,
  NumberInput,
  Section,
  Stack,
  Tabs,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { slugify, useT } from '../i18n';
import { Window } from '../layouts';
import { type ActiveReaction, ReactionDisplay } from './ChemHeater';
import { type Beaker, BeakerSectionDisplay } from './common/BeakerDisplay';

const kebab = (text: string) => slugify(text).replace(/_/g, '-');

const TEMP_MODES = [
  'Reaction Temp',
  'Forced Temp',
  'Minimum Temp',
  'Optimal Temp',
  'Overheat Temp',
];
const REACTION_MODES = ['Next Reaction', 'Previous Reaction', 'Pick Reaction'];
const REACTION_VARS = [
  'Required Temp',
  'Optimal Temp',
  'Overheat Temp',
  'Optimal Min Ph',
  'Optimal Max Ph',
  'Ph Range',
  'Temp Exp Factor',
  'Ph Exp Factor',
  'Thermic Constant',
  'H Ion Release',
  'Rate Up Limit',
  'Purity Min',
];

type BeakerDebug = Beaker & {
  currentTemp: number;
  purity: number;
};

type Reaction = {
  name: string;
  editVar: string;
  editValue: number;
};

type Data = {
  forced_temp: number;
  temp_mode: number;
  forced_ph: number;
  use_forced_ph: BooleanLike;
  forced_purity: number;
  use_forced_purity: number;
  volume_multiplier: number;
  isReacting: BooleanLike;
  current_reaction_name: string;
  current_reaction_mode: number;
  beaker: BeakerDebug;
  isFlashing: number;
  activeReactions: ActiveReaction[];
  editReaction: Reaction;
};

export const ChemRecipeDebug = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const [controlState, setControlState] = useState('Environment');
  const {
    forced_temp,
    temp_mode,
    forced_ph,
    use_forced_ph,
    forced_purity,
    use_forced_purity,
    volume_multiplier,
    isReacting,
    current_reaction_name,
    current_reaction_mode,
    beaker,
    isFlashing,
    activeReactions,
    editReaction,
  } = data;
  return (
    <Window width={500} height={600}>
      <Window.Content scrollable>
        <Section title={t('chemdebug-controls', {}, 'Controls')}>
          <Tabs>
            <Tabs.Tab
              key={'Environment'}
              selected={controlState === 'Environment'}
              onClick={() => setControlState('Environment')}
            >
              {t('chemdebug-tab-environment', {}, 'Environment')}
            </Tabs.Tab>
            <Tabs.Tab
              key={'Reactions'}
              selected={controlState === 'Reactions'}
              onClick={() => setControlState('Reactions')}
            >
              {t('chemdebug-tab-reactions', {}, 'Reactions')}
            </Tabs.Tab>
            <Tabs.Tab
              key={'Editing'}
              selected={controlState === 'Editing'}
              onClick={() => setControlState('Editing')}
            >
              {t('chemdebug-tab-edit', {}, 'Edit Reactions')}
            </Tabs.Tab>
          </Tabs>
          {controlState === 'Environment' && (
            <Section>
              <Stack vertical={false}>
                <Stack.Item>
                  <LabeledList>
                    <LabeledList.Item
                      label={t('chemdebug-temperature', {}, 'Temperature')}
                    >
                      <NumberInput
                        tickWhileDragging
                        width="65px"
                        step={1}
                        stepPixelSize={3}
                        value={forced_temp}
                        minValue={0}
                        maxValue={1000}
                        onChange={(value) =>
                          act('forced_temp', {
                            target: value,
                          })
                        }
                      />
                    </LabeledList.Item>
                  </LabeledList>
                </Stack.Item>
                <Stack.Item ml="20px">
                  <LabeledList>
                    <LabeledList.Item
                      label={
                        <Box
                          style={{
                            transform: 'translate(0%, -15%)',
                          }}
                        >
                          {t('chemdebug-temp-mode', {}, 'Temp Mode:')}
                        </Box>
                      }
                    >
                      <Dropdown
                        width="100%"
                        selected={TEMP_MODES[temp_mode]}
                        displayText={t(
                          `chemdebug-temp-mode-${kebab(TEMP_MODES[temp_mode])}`,
                          {},
                          TEMP_MODES[temp_mode],
                        )}
                        options={TEMP_MODES.map((mode) => ({
                          value: mode,
                          displayText: t(
                            `chemdebug-temp-mode-${kebab(mode)}`,
                            {},
                            mode,
                          ),
                        }))}
                        onSelected={(value) =>
                          act('temp_mode', {
                            target: value,
                          })
                        }
                      />
                    </LabeledList.Item>
                  </LabeledList>
                </Stack.Item>
              </Stack>
              <Stack vertical={false} mt="10px">
                <Stack.Item>
                  <LabeledList>
                    <LabeledList.Item label={<Box width="82px">{t('chemdebug-ph', {}, 'PH:')}</Box>}>
                      <NumberInput
                        tickWhileDragging
                        width="65px"
                        step={1}
                        stepPixelSize={3}
                        value={forced_ph}
                        minValue={0}
                        maxValue={14}
                        onChange={(value) =>
                          act('forced_ph', {
                            target: value,
                          })
                        }
                      />
                    </LabeledList.Item>
                  </LabeledList>
                </Stack.Item>
                <Stack.Item ml="20px">
                  <LabeledList>
                    <LabeledList.Item label={t('chemdebug-force-ph', {}, 'Force Ph')}>
                      <Button.Checkbox
                        checked={use_forced_ph}
                        onClick={() => act('toggle_forced_ph')}
                        ml="20px"
                      >
                        {use_forced_ph
                          ? t('chemdebug-disable', {}, 'Disable')
                          : t('chemdebug-enable', {}, 'Enable')}
                      </Button.Checkbox>
                    </LabeledList.Item>
                  </LabeledList>
                </Stack.Item>
              </Stack>
              <Stack vertical={false} mt="10px">
                <Stack.Item>
                  <LabeledList>
                    <LabeledList.Item label={<Box width="82px">{t('chemdebug-purity', {}, 'Purity:')}</Box>}>
                      <NumberInput
                        tickWhileDragging
                        width="65px"
                        step={0.01}
                        stepPixelSize={3}
                        value={forced_purity}
                        minValue={0}
                        maxValue={1}
                        onChange={(value) =>
                          act('forced_purity', {
                            target: value,
                          })
                        }
                      />
                    </LabeledList.Item>
                  </LabeledList>
                </Stack.Item>
                <Stack.Item ml="20px">
                  <LabeledList>
                    <LabeledList.Item
                      label={t('chemdebug-force-purity', {}, 'Force Purity')}
                    >
                      <Button.Checkbox
                        checked={use_forced_purity}
                        onClick={() => act('toggle_forced_purity')}
                      >
                        {use_forced_purity
                          ? t('chemdebug-disable', {}, 'Disable')
                          : t('chemdebug-enable', {}, 'Enable')}
                      </Button.Checkbox>
                    </LabeledList.Item>
                  </LabeledList>
                </Stack.Item>
              </Stack>
              <Stack vertical={false} mt="10px">
                <Stack.Item>
                  <LabeledList>
                    <LabeledList.Item
                      label={t('chemdebug-volume-mulx', {}, 'Volume Mulx')}
                    >
                      <NumberInput
                        tickWhileDragging
                        width="65px"
                        step={1}
                        stepPixelSize={3}
                        value={volume_multiplier}
                        minValue={1}
                        maxValue={1000}
                        unit="x"
                        onChange={(value) =>
                          act('volume_multiplier', {
                            target: value,
                          })
                        }
                      />
                    </LabeledList.Item>
                  </LabeledList>
                </Stack.Item>
              </Stack>
            </Section>
          )}
          {controlState === 'Reactions' && (
            <Section>
              <Stack vertical>
                <Stack.Item>
                  <LabeledList>
                    <LabeledList.Item label={t('chemdebug-reagent', {}, 'Reagent')}>
                      <Button
                        color="green"
                        onClick={() => act('pick_reaction')}
                      >
                        {t('chemdebug-select-reaction', {}, 'Select Reaction')}
                      </Button>
                    </LabeledList.Item>
                  </LabeledList>
                </Stack.Item>
                <Stack.Item mt="20px">
                  <LabeledList>
                    <LabeledList.Item label={t('chemdebug-reaction', {}, 'Reaction')}>
                      {current_reaction_name}
                    </LabeledList.Item>
                  </LabeledList>
                </Stack.Item>
                <Stack.Item mt="20px">
                  <LabeledList>
                    <LabeledList.Item
                      label={
                        <Box
                          style={{
                            transform: 'translate(0%, -10%)',
                          }}
                        >
                          {t('chemdebug-direction', {}, 'Direction:')}
                        </Box>
                      }
                    >
                      <Dropdown
                        width="35%"
                        selected={REACTION_MODES[current_reaction_mode]}
                        displayText={t(
                          `chemdebug-reaction-mode-${kebab(REACTION_MODES[current_reaction_mode])}`,
                          {},
                          REACTION_MODES[current_reaction_mode],
                        )}
                        options={REACTION_MODES.map((mode) => ({
                          value: mode,
                          displayText: t(
                            `chemdebug-reaction-mode-${kebab(mode)}`,
                            {},
                            mode,
                          ),
                        }))}
                        disabled={current_reaction_name === 'N/A'}
                        onSelected={(value) =>
                          act('reaction_mode', {
                            target: value,
                          })
                        }
                      />
                    </LabeledList.Item>
                  </LabeledList>
                </Stack.Item>
                <Stack.Item mt="20px">
                  <LabeledList>
                    <LabeledList.Item label={<Box width="60px">{t('chemdebug-process', {}, 'Process:')}</Box>}>
                      <Button
                        color="green"
                        icon="play"
                        disabled={isReacting || current_reaction_name === 'N/A'}
                        onClick={() => act('start_reaction')}
                      >
                        {t('chemdebug-play', {}, 'Play')}
                      </Button>
                    </LabeledList.Item>
                  </LabeledList>
                </Stack.Item>
              </Stack>
            </Section>
          )}
          {controlState === 'Editing' && (
            <Section>
              <Stack vertical>
                <Stack.Item>
                  <LabeledList>
                    <LabeledList.Item label={t('chemdebug-reaction', {}, 'Reaction')}>
                      <Button
                        color="green"
                        icon="flask"
                        onClick={() => act('edit_reaction')}
                      >
                        {editReaction?.name ||
                          t('chemdebug-edit-reaction', {}, 'Edit Reaction')}
                      </Button>
                    </LabeledList.Item>
                  </LabeledList>
                </Stack.Item>
                <Stack.Item mt="20px">
                  <LabeledList>
                    <LabeledList.Item
                      label={
                        <Box
                          style={{
                            transform: 'translate(0%, -10%)',
                            width: '57px',
                          }}
                        >
                          {t('chemdebug-param', {}, 'Param:')}
                        </Box>
                      }
                    >
                      <Dropdown
                        width="40%"
                        selected={editReaction?.editVar || REACTION_VARS[1]}
                        displayText={t(
                          `chemdebug-var-${kebab(editReaction?.editVar || REACTION_VARS[1])}`,
                          {},
                          editReaction?.editVar || REACTION_VARS[1],
                        )}
                        options={REACTION_VARS.map((variable) => ({
                          value: variable,
                          displayText: t(
                            `chemdebug-var-${kebab(variable)}`,
                            {},
                            variable,
                          ),
                        }))}
                        onSelected={(value) =>
                          act('edit_var', { target: value })
                        }
                        disabled={editReaction === null}
                      />
                    </LabeledList.Item>
                  </LabeledList>
                </Stack.Item>
                <Stack.Item mt="20px">
                  <LabeledList>
                    <LabeledList.Item label={<Box width="57px">{t('chemdebug-value', {}, 'Value:')}</Box>}>
                      <NumberInput
                        tickWhileDragging
                        width="65px"
                        step={0.1}
                        stepPixelSize={3}
                        value={editReaction?.editValue || 0}
                        minValue={-1000}
                        maxValue={1000}
                        disabled={editReaction === null}
                        onChange={(value) =>
                          act('edit_value', {
                            target: value,
                          })
                        }
                      />
                      <Button
                        color="green"
                        icon="sync"
                        tooltip={t('chemdebug-reset-value', {}, 'Reset Value')}
                        disabled={editReaction === null}
                        onClick={() => act('reset_value')}
                      />
                    </LabeledList.Item>
                  </LabeledList>
                </Stack.Item>
                <Stack.Item mt="20px">
                  <LabeledList>
                    <LabeledList.Item label={<Box width="57px">{t('chemdebug-export-label', {}, 'Export:')}</Box>}>
                      <Button
                        color="green"
                        icon="save"
                        onClick={() => act('export')}
                        disabled={editReaction === null}
                      >
                        {t('chemdebug-export', {}, 'Export')}
                      </Button>
                    </LabeledList.Item>
                  </LabeledList>
                </Stack.Item>
              </Stack>
            </Section>
          )}
        </Section>
        {beaker && (
          <Section title={t('chemdebug-variables', {}, 'Variables')}>
            <LabeledList>
              <LabeledList.Item
                label={t('chemdebug-temperature', {}, 'Temperature')}
              >
                {beaker.currentTemp}
              </LabeledList.Item>
              <LabeledList.Item label={t('chemdebug-purity-label', {}, 'Purity')}>
                {beaker.purity}
              </LabeledList.Item>
            </LabeledList>
          </Section>
        )}
        {beaker && (
          <ReactionDisplay
            beaker={beaker}
            isFlashing={isFlashing}
            activeReactions={activeReactions}
            highQualityDisplay
            highDangerDisplay
          />
        )}
        <BeakerSectionDisplay
          title_label={t('chemdebug-internal-buffer', {}, 'Internal Buffer')}
          beaker={beaker}
          showpH={false}
        />
      </Window.Content>
    </Window>
  );
};
