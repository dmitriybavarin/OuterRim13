import {
  Button,
  ColorBox,
  Input,
  LabeledList,
  NumberInput,
  Section,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type EyeColorData = {
  mode: BooleanLike;
  hasOwner: BooleanLike;
  left: string;
  right: string;
};

type Data = {
  eyeColor: EyeColorData;
  lightColor: string;
  range: number;
};

enum ToUpdate {
  LightColor,
  LeftEye,
  RightEye,
}

const LightColorDisplay = (props) => {
  const { act, data } = useBackend<Data>();
  const { lightColor } = data;
  const t = useT();
  return (
    <LabeledList.Item label={t('hleyes-color', {}, 'Color')}>
      <ColorBox color={lightColor} />{' '}
      <Button
        icon="palette"
        onClick={() => act('pick_color', { to_update: ToUpdate.LightColor })}
        tooltip={t(
          'hleyes-pick-light-color',
          {},
          'Brings up a color pick window to change the light color.',
        )}
      />
      <Button
        icon="dice"
        onClick={() => act('random_color', { to_update: ToUpdate.LightColor })}
        tooltip={t('hleyes-random-light-color', {}, 'Randomizes the light color.')}
      />
      <Input
        value={lightColor}
        width={6}
        maxLength={7}
        onBlur={(value) =>
          act('enter_color', {
            new_color: value,
            to_update: ToUpdate.LightColor,
          })
        }
      />
    </LabeledList.Item>
  );
};

const RangeDisplay = (props) => {
  const { act, data } = useBackend<Data>();
  const { range } = data;
  const t = useT();
  return (
    <LabeledList.Item label={t('hleyes-range', {}, 'Range')}>
      <Button
        icon="minus-square-o"
        onClick={() => act('set_range', { new_range: range - 1 })}
        tooltip={t('hleyes-range-down', {}, 'Reduces the light range.')}
      />
      <Button
        icon="plus-square-o"
        onClick={() => act('set_range', { new_range: range + 1 })}
        tooltip={t('hleyes-range-up', {}, 'Increases the light range.')}
      />
      <NumberInput
        animated
        tickWhileDragging
        width="35px"
        step={1}
        stepPixelSize={5}
        value={range}
        minValue={0}
        maxValue={5}
        onChange={(value) =>
          act('set_range', {
            new_range: value,
          })
        }
      />
    </LabeledList.Item>
  );
};

const EyeColorDisplay = (props) => {
  const { act, data } = useBackend<Data>();
  const { eyeColor } = data;
  const t = useT();
  return (
    <>
      <LabeledList.Item label={t('hleyes-match-color', {}, 'Match Color')}>
        <Button.Checkbox
          checked={eyeColor.mode}
          onClick={() => act('toggle_eye_color')}
          tooltip={t(
            'hleyes-match-color-tooltip',
            {},
            'Toggles whether eyecolor matches the color of the light.',
          )}
        />
      </LabeledList.Item>
      {!eyeColor.mode && (
        <>
          <LabeledList.Item label={t('hleyes-left-eye', {}, 'Left Eye')}>
            <ColorBox color={eyeColor.left} />{' '}
            <Button
              icon="palette"
              onClick={() => act('pick_color', { to_update: ToUpdate.LeftEye })}
              tooltip={t(
          'hleyes-pick-light-color',
          {},
          'Brings up a color pick window to change the light color.',
        )}
            />
            <Button
              icon="dice"
              onClick={() =>
                act('random_color', { to_update: ToUpdate.LeftEye })
              }
              tooltip={t(
                'hleyes-random-eye-color',
                {},
                'Randomizes the eye color.',
              )}
            />
            <Input
              value={eyeColor.left}
              width={6}
              maxLength={7}
              onBlur={(value) =>
                act('enter_color', {
                  new_color: value,
                  to_update: ToUpdate.LeftEye,
                })
              }
            />
          </LabeledList.Item>
          <LabeledList.Item label={t('hleyes-right-eye', {}, 'Right Eye')}>
            <ColorBox color={eyeColor.right} />{' '}
            <Button
              icon="palette"
              onClick={() =>
                act('pick_color', { to_update: ToUpdate.RightEye })
              }
              tooltip={t(
          'hleyes-pick-light-color',
          {},
          'Brings up a color pick window to change the light color.',
        )}
            />
            <Button
              icon="dice"
              onClick={() =>
                act('random_color', { to_update: ToUpdate.RightEye })
              }
              tooltip={t(
                'hleyes-random-eye-color',
                {},
                'Randomizes the eye color.',
              )}
            />
            <Input
              value={eyeColor.right}
              width={6}
              maxLength={7}
              onBlur={(value) =>
                act('enter_color', {
                  new_color: value,
                  to_update: ToUpdate.RightEye,
                })
              }
            />
          </LabeledList.Item>
        </>
      )}
    </>
  );
};

export const HighLuminosityEyesMenu = (props) => {
  const { act, data } = useBackend<Data>();
  const { eyeColor } = data;
  const t = useT();
  return (
    <Window
      title={t('hleyes-title', {}, 'High Luminosity Eyes')}
      width={eyeColor.hasOwner ? 262 : 225}
      height={eyeColor.hasOwner ? (eyeColor.mode ? 170 : 220) : 135}
    >
      <Window.Content>
        <Section fill title={t('hleyes-settings', {}, 'Settings')}>
          <LabeledList>
            <LightColorDisplay />
            <RangeDisplay />
            {!!eyeColor.hasOwner && <EyeColorDisplay />}
          </LabeledList>
        </Section>
      </Window.Content>
    </Window>
  );
};
