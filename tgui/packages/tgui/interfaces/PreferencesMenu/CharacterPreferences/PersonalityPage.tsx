import { useState } from 'react';
import { useBackend } from 'tgui/backend';
import {
  Box,
  Button,
  Flex,
  Input,
  Section,
  Stack,
} from 'tgui-core/components';
import { createSearch } from 'tgui-core/string';
import { slugify, useT } from '../../../i18n';
import type { Personality, PreferencesMenuData } from '../types';
import { useServerPrefs } from '../useServerPrefs';

type Translate = ReturnType<typeof useT>;

function personalityText(
  t: Translate,
  personality: Personality,
  field: 'name' | 'desc' | 'pos' | 'neg' | 'neut',
): string {
  const original = {
    name: personality.name,
    desc: personality.description,
    pos: personality.pos_gameplay_description,
    neg: personality.neg_gameplay_description,
    neut: personality.neut_gameplay_description,
  }[field];
  if (!original) {
    return '';
  }
  return t(
    `personality-${slugify(personality.name)}-${field}`,
    {},
    original,
  );
}

type ButtonData = {
  backgroundColor: string;
  borderColor: string;
  tooltip: string | null;
};

function getButtonColors(
  t: Translate,
  selected: boolean | undefined,
  invalid: boolean | string | null | undefined,
  disabled: boolean | undefined,
): ButtonData {
  if (invalid) {
    return {
      backgroundColor: 'rgba(64, 34, 34, 0.5)',
      borderColor: 'darkred',
      tooltip: t(
        'personality-invalid-tooltip',
        { name: invalid },
        `You cannot select this personality with ${invalid}.`,
      ),
    };
  }
  if (disabled) {
    return {
      backgroundColor: 'rgba(64, 64, 64, 0.5)',
      borderColor: '#666666',
      tooltip: t(
        'personality-maximum-tooltip',
        {},
        'You are at the maximum number of personalities.',
      ),
    };
  }
  if (selected) {
    return {
      backgroundColor: 'rgba(34, 64, 34, 0.5)',
      borderColor: 'green',
      tooltip: null,
    };
  }
  return {
    backgroundColor: 'rgba(34, 34, 34, 0.5)',
    borderColor: '#444444',
    tooltip: null,
  };
}

type ButtonProps = {
  personality: Personality;
  selected?: boolean;
  invalid?: string | null;
  disabled?: boolean;
  onClick: () => void;
};

function PersonalityButton(props: ButtonProps) {
  const { personality, selected, invalid, disabled, onClick } = props;
  const t = useT();

  const { backgroundColor, borderColor, tooltip } = getButtonColors(
    t,
    selected,
    invalid,
    disabled,
  );
  const isDisabled = disabled || invalid || false;
  return (
    <Button
      onClick={isDisabled ? undefined : onClick}
      p={1}
      pt={0.2}
      style={{
        cursor: isDisabled ? undefined : 'pointer',
        borderColor: borderColor,
        borderStyle: 'solid',
        borderWidth: '0.2em',
        borderRadius: '0.33em',
      }}
      fluid
      height="auto"
      minHeight="180px"
      backgroundColor={backgroundColor}
      tooltip={tooltip}
    >
      <Stack vertical wrap justify="center">
        <Stack.Item
          textAlign="center"
          bold
          fontSize="16px"
          inline
          p={0.5}
          style={{
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            paddingLeft: '0.5em',
          }}
        >
          {personalityText(t, personality, 'name')}
        </Stack.Item>
        <Stack.Item
          color="#999999"
          mt={-1}
          pt={0.2}
          style={{
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            borderTop: '0.2em solid #444444',
            borderLeft: '0.2em solid #444444',
            paddingLeft: '0.5em',
          }}
        >
          {personalityText(t, personality, 'desc')}
        </Stack.Item>
        {personality.pos_gameplay_description && (
          <Stack.Item
            mt={-0.8}
            color="green"
            style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
          >
            + {personalityText(t, personality, 'pos')}
          </Stack.Item>
        )}
        {personality.neg_gameplay_description && (
          <Stack.Item
            mt={-0.8}
            color="red"
            style={{
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}
          >
            - {personalityText(t, personality, 'neg')}
          </Stack.Item>
        )}
        {personality.neut_gameplay_description && (
          <Stack.Item
            mt={-0.8}
            color="yellow"
            style={{
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}
          >
            ± {personalityText(t, personality, 'neut')}
          </Stack.Item>
        )}
      </Stack>
    </Button>
  );
}

// Sort by selected first, then by name
function sortPersonalities(
  t: Translate,
  a: Personality,
  b: Personality,
  selectedPersonalities: string[] | null,
) {
  const aSelected = selectedPersonalities?.includes(a.path);
  const bSelected = selectedPersonalities?.includes(b.path);

  if (aSelected && !bSelected) return -1;
  if (!aSelected && bSelected) return 1;

  return personalityText(t, a, 'name') < personalityText(t, b, 'name')
    ? -1
    : 1;
}

// Checks if the passed personality is incompatible with the selected personalities
// Returns the name of the incompatible personality or null if there is no incompatibility
function isIncompatible(
  t: Translate,
  personality: Personality,
  allPersonalities: Personality[],
  selectedPersonalities: string[] | null,
  personalityIncompatibilities: Record<string, string[]>,
): string | null {
  if (!selectedPersonalities || !personality.groups) return null;
  // personalityIncompatibilities is keyed by group -
  // where value is a list of incompatible personality typePaths
  for (const group of personality.groups) {
    for (const selectedTypePath of selectedPersonalities) {
      if (selectedTypePath === personality.path) continue;
      if (personalityIncompatibilities[group].includes(selectedTypePath)) {
        return (
          getPersonalityName(t, allPersonalities, selectedTypePath) ||
          t('personality-unknown', {}, 'an unknown personality')
        );
      }
    }
  }

  return null;
}

// Checks if the passed personality is disabled
function isDisabled(
  selectedPersonalities: string[] | null,
  personality: Personality,
  maxPersonalities: number,
): boolean {
  if (!selectedPersonalities) {
    return false;
  }
  if (
    maxPersonalities !== -1 &&
    selectedPersonalities.length < maxPersonalities
  ) {
    return false;
  }
  return !selectedPersonalities.includes(personality.path);
}

// Takes a typePath, returns the name of the personality
function getPersonalityName(
  t: Translate,
  allPersonalities: Personality[],
  personalityPath: string,
): string | undefined {
  for (const personality of allPersonalities) {
    if (personality.path === personalityPath) {
      return personalityText(t, personality, 'name');
    }
  }
  return undefined;
}

// Returns a string of all selected personalities formatted in a readable way
function getAllSelectedPersonalitiesString(
  t: Translate,
  allPersonalities: Personality[],
  selectedPersonalities: string[] | null,
) {
  const personalityNames: string[] = [];
  for (const personality of allPersonalities) {
    if (selectedPersonalities?.includes(personality.path)) {
      personalityNames.push(personalityText(t, personality, 'name'));
    }
  }
  if (personalityNames.length === 0) {
    return t('personality-none', {}, 'You have no personality.');
  }
  personalityNames.sort((a, b) => (a < b ? -1 : 1));
  let list = personalityNames[0];
  if (personalityNames.length === 2) {
    list = t(
      'personality-join-two',
      { first: personalityNames[0], second: personalityNames[1] },
      `${personalityNames[0]} and ${personalityNames[1]}`,
    );
  } else if (personalityNames.length > 2) {
    const head = personalityNames.slice(0, -1).join(', ');
    const last = personalityNames[personalityNames.length - 1];
    list = t(
      'personality-join-more',
      { head, last },
      `${head}, and ${last}`,
    );
  }
  return t('personality-list', { list }, `You are ${list}.`);
}

export function PersonalityPage() {
  const { act, data } = useBackend<PreferencesMenuData>();
  const t = useT();

  const server_data = useServerPrefs();
  if (!server_data) return;

  const personalities = server_data.personality.personalities;
  const personalityIncompatibilities =
    server_data.personality.personality_incompatibilities;

  const [searchQuery, setSearchQuery] = useState('');
  const personalitySearch = createSearch(
    searchQuery,
    (personality: Personality) =>
      personalityText(t, personality, 'name') +
      personalityText(t, personality, 'desc') +
      personalityText(t, personality, 'pos') +
      personalityText(t, personality, 'neg') +
      personalityText(t, personality, 'neut'),
  );
  const selectedPersonalities = data.selected_personalities;
  const filteredPersonalities = personalities
    .filter(personalitySearch)
    .sort((a, b) => sortPersonalities(t, a, b, selectedPersonalities));

  return (
    <Section fill>
      <Stack vertical fill>
        <Stack.Item
          align="center"
          textAlign="center"
          fontSize="20px"
          bold
          width="100%"
          maxHeight="50px"
          style={{
            whiteSpace: 'normal',
            wordBreak: 'break-word',
          }}
        >
          <Flex height="100%" align="center">
            <Flex.Item grow>
              {getAllSelectedPersonalitiesString(
                t,
                personalities,
                selectedPersonalities,
              )}
            </Flex.Item>
            <Flex.Item width="120px">
              <Box className="PreferencesMenu__Quirks__chip" bold>
                {selectedPersonalities?.length || 0} /{' '}
                {data.max_personalities === -1 ? '∞' : data.max_personalities}
              </Box>
            </Flex.Item>
            <Flex.Item ml={1}>
              <Button
                color="red"
                icon="trash"
                disabled={!selectedPersonalities?.length}
                style={{
                  cursor: selectedPersonalities?.length ? 'pointer' : undefined,
                }}
                onClick={() => {
                  act('clear_personalities');
                }}
              />
            </Flex.Item>
          </Flex>
        </Stack.Item>
        <Stack.Item mb={1}>
          <Input
            fluid
            placeholder={t('preferences-search-placeholder')}
            value={searchQuery}
            onChange={(v) => setSearchQuery(v)}
          />
        </Stack.Item>
        <Stack.Item grow>
          <Section fill scrollable>
            <Flex wrap width="100%">
              {filteredPersonalities.map((personality) => (
                <Flex.Item
                  key={personality.name}
                  mr={0.5}
                  mb={0.5}
                  width="32.9%"
                >
                  <PersonalityButton
                    personality={personality}
                    selected={selectedPersonalities?.includes(personality.path)}
                    invalid={isIncompatible(
                      t,
                      personality,
                      personalities,
                      selectedPersonalities,
                      personalityIncompatibilities,
                    )}
                    disabled={isDisabled(
                      selectedPersonalities,
                      personality,
                      data.max_personalities,
                    )}
                    onClick={() => {
                      act('handle_personality', {
                        personality_type: personality.path,
                      });
                    }}
                  />
                </Flex.Item>
              ))}
            </Flex>
          </Section>
        </Stack.Item>
      </Stack>
    </Section>
  );
}
