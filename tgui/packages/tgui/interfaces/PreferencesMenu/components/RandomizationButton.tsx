import { Dropdown } from 'tgui-core/components';
import { exhaustiveCheck } from 'tgui-core/exhaustive';

import { useT } from '../../../i18n';
import { RandomSetting } from '../types';

const OPTION_KEYS = [
  {
    key: 'character-random-disabled',
    fallback: 'Do not randomize',
    value: RandomSetting.Disabled,
  },

  {
    key: 'character-random-enabled',
    fallback: 'Always randomize',
    value: RandomSetting.Enabled,
  },

  {
    key: 'character-random-antag-only',
    fallback: 'Randomize when antagonist',
    value: RandomSetting.AntagOnly,
  },
];

type Props = {
  dropdownProps?: Record<string, unknown>;
  setValue: (newValue: RandomSetting) => void;
  value: RandomSetting;
};

export function RandomizationButton(props: Props) {
  const { dropdownProps = {}, setValue, value } = props;
  const t = useT();
  const options = OPTION_KEYS.map((option) => ({
    displayText: t(option.key, {}, option.fallback),
    value: option.value,
  }));

  let color;

  switch (value) {
    case RandomSetting.AntagOnly:
      color = 'orange';
      break;
    case RandomSetting.Disabled:
      color = 'red';
      break;
    case RandomSetting.Enabled:
      color = 'green';
      break;
    default:
      exhaustiveCheck(value);
  }

  return (
    <Dropdown
      color={color}
      {...dropdownProps}
      icon="dice-d20"
      iconOnly
      options={options}
      onSelected={setValue}
      menuWidth={20}
      selected="None"
    />
  );
}
