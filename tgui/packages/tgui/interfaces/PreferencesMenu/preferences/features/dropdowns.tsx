import { type ComponentProps, type ReactNode } from 'react';
import { Box, Dropdown, Stack } from 'tgui-core/components';
import { classes } from 'tgui-core/react';
import { capitalizeFirst } from 'tgui-core/string';

import { useT } from '../../../../i18n';
import { choiceText } from '../text';
import type {
  Feature,
  FeatureChoicedServerData,
  FeatureValueProps,
} from './base';

export type DropdownInputProps = FeatureValueProps<
  string,
  string,
  FeatureChoicedServerData
> &
  Partial<{
    disabled: boolean;
    buttons: boolean;
  }>;

type IconnedDropdownInputProps = FeatureValueProps<
  string,
  string,
  FeatureChoicedServerData
>;

export type FeatureWithIcons<T> = Feature<string, T, FeatureChoicedServerData>;

export type DropdownOptions = ComponentProps<typeof Dropdown>['options'];

type DropdownEntry = {
  displayText: ReactNode;
  value: string | number;
};

export function generateOptions(
  serverData: FeatureChoicedServerData,
  translate?: (choice: string, fallback: string) => string,
): DropdownEntry[] {
  const { choices = [] } = serverData;

  const newOptions: DropdownEntry[] = [];

  for (const choice of choices) {
    const original = serverData.display_names
      ? serverData.display_names[choice]
      : capitalizeFirst(choice);
    const displayText: ReactNode = translate
      ? translate(choice, original)
      : original;

    newOptions.push({
      displayText,
      value: choice,
    });
  }

  return newOptions;
}

export function useChoiceTranslate(featureId: string) {
  const t = useT();
  return (choice: string, fallback: string) =>
    choiceText(t, featureId, choice, fallback);
}

export function FeatureDropdownInput(props: DropdownInputProps) {
  const { serverData, disabled, buttons, handleSetValue, value, featureId } =
    props;
  const translate = useChoiceTranslate(featureId);
  const dropdownOptions = serverData
    ? generateOptions(serverData, translate)
    : [];
  const displayText = translate(
    value,
    serverData?.display_names?.[value] || String(value),
  );
  return (
    <Dropdown
      buttons={buttons}
      disabled={disabled || !serverData}
      onSelected={handleSetValue}
      displayText={displayText ? capitalizeFirst(displayText) : ''}
      options={dropdownOptions}
      selected={value}
      width="100%"
    />
  );
}

export type FeatureDropdownInputCoreProps = DropdownInputProps & {
  populateOptions: (serverData: FeatureChoicedServerData) => DropdownOptions;
};

export function FeatureDropdownInputCore(props: FeatureDropdownInputCoreProps) {
  const {
    serverData,
    disabled,
    buttons,
    handleSetValue,
    value,
    populateOptions,
    featureId,
  } = props;
  const translate = useChoiceTranslate(featureId);
  const dropdownOptions = serverData ? populateOptions(serverData) : [];
  const displayText = translate(
    value,
    serverData?.display_names?.[value] || String(value),
  );

  return (
    <Dropdown
      buttons={buttons}
      disabled={disabled || !serverData}
      onSelected={handleSetValue}
      displayText={displayText ? capitalizeFirst(displayText) : ''}
      options={dropdownOptions}
      selected={value}
      width="100%"
    />
  );
}


export function FeatureIconnedDropdownInput(props: IconnedDropdownInputProps) {
  const { serverData, handleSetValue, value, featureId } = props;
  const translate = useChoiceTranslate(featureId);

  function buildOptions(): DropdownOptions {
    if (!serverData) return [];
    const { icons = {}, choices = [] } = serverData;

    const newOptions: DropdownOptions = [];

    for (const choice of choices) {
      let displayText: ReactNode = translate(
        choice,
        serverData.display_names?.[choice]
          ? serverData.display_names[choice]
          : capitalizeFirst(choice),
      );

      if (serverData.icons?.[choice]) {
        displayText = (
          <Stack>
            <Stack.Item>
              <Box
                className={classes(['preferences32x32', icons[choice]])}
                style={{ transform: 'scale(0.8)' }}
              />
            </Stack.Item>
            <Stack.Item grow>{displayText}</Stack.Item>
          </Stack>
        );
      }

      newOptions.push({
        displayText,
        value: choice,
      });
    }

    return newOptions;
  }

  const dropdownOptions = buildOptions();

  const displayText = translate(
    value,
    serverData?.display_names?.[value] || String(value),
  );

  return (
    <Dropdown
      buttons
      displayText={displayText ? capitalizeFirst(displayText) : ''}
      onSelected={handleSetValue}
      options={dropdownOptions}
      selected={value}
      width="100%"
      menuWidth="max-content"
    />
  );
}
