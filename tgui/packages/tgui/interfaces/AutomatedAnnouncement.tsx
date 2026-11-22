import { sortBy } from 'es-toolkit';
import { filter } from 'es-toolkit/compat';
import { useState } from 'react';
import {
  Button,
  Input,
  LabeledList,
  NoticeBox,
  Section,
  Stack,
  Table,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type AASConfigEntry = {
  name: string;
  entryRef: string;
  enabled: BooleanLike;
  modifiable: BooleanLike;
  announcementLinesMap: Record<string, string>;
  generalTooltip: string;
  varsAndTooltipsMap: Record<string, string>;
};

type Data = {
  config_entries: AASConfigEntry[];
  max_announcement_len: number;
};

export const AutomatedAnnouncement = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { config_entries = [], max_announcement_len } = data;

  const [search, setSearch] = useState('');

  const isEntryMatch = (entry: AASConfigEntry, search: string) => {
    if (!search) return true;
    const { name, announcementLinesMap = [], varsAndTooltipsMap = [] } = entry;
    switch (true) {
      case name?.toLowerCase().includes(search?.toLowerCase()):
      case Object.keys(announcementLinesMap).some((lineKey) =>
        lineKey.toLowerCase().includes(search?.toLowerCase()),
      ):
      case Object.values(announcementLinesMap).some((line) =>
        line.toLowerCase().includes(search?.toLowerCase()),
      ):
      case Object.keys(varsAndTooltipsMap).some((varName) =>
        varName.toLowerCase().includes(search?.toLowerCase()),
      ):
        return true;
      default:
        return false;
    }
  };

  const errorMessage = !config_entries.length
    ? t('aas-no-options', {}, 'No configurable options detected! Please report this to Nanotrasen.')
    : t('aas-no-match', {}, 'No match. Refine your search.');

  const sorted = sortBy(
    filter(config_entries, (entry) => isEntryMatch(entry, search)),
    [(entry) => entry.name],
  );
  return (
    <Window title={t('aas-title', {}, 'Automated Announcement System')} width={500} height={280}>
      <Window.Content>
        <Stack fill vertical>
          <Stack.Item>
            <LabeledList>
              <LabeledList.Item label={t('aas-search', {}, 'Search')}>
                <Input fluid placeholder={t('aas-placeholder', {}, 'Name/Line/Var')} onChange={setSearch} />
              </LabeledList.Item>
            </LabeledList>
          </Stack.Item>
          <Stack.Item grow>
            {!sorted.length ? (
              <NoticeBox>{errorMessage}</NoticeBox>
            ) : (
              <Section fill scrollable>
                {sorted.map((entry, index) => (
                  <Section
                    key={entry.entryRef}
                    title={entry.name}
                    buttons={
                      <>
                        <Button
                          icon="info"
                          tooltip={
                            (entry.generalTooltip
                              ? `${entry.generalTooltip}\n`
                              : '') +
                            Object.entries(entry.varsAndTooltipsMap)
                              .map(
                                ([varName, tooltip]) =>
                                  `%${varName} ${tooltip}`,
                              )
                              .join('\n')
                          }
                          tooltipPosition="left"
                        />
                        <Button
                          icon={entry.enabled ? 'power-off' : 'times'}
                          selected={entry.enabled}
                          disabled={!entry.modifiable}
                          tooltip={
                            !entry.modifiable
                              ? t('aas-locked', {}, 'Editing disabled by CentCom!')
                              : undefined
                          }
                          onClick={() =>
                            act('Toggle', { entryRef: entry.entryRef })
                          }
                        >
                          {entry.enabled
                            ? t('aas-on', {}, 'On')
                            : t('aas-off', {}, 'Off')}
                        </Button>
                      </>
                    }
                  >
                    <Table>
                      {Object.entries(entry.announcementLinesMap).map(
                        ([lineKey, announcementLine]) => (
                          <Table.Row key={lineKey}>
                            <Table.Cell collapsing color="label">
                              {lineKey}:
                            </Table.Cell>
                            <Table.Cell>
                              <Input
                                fluid
                                value={announcementLine}
                                disabled={!entry.modifiable}
                                maxLength={max_announcement_len}
                                onBlur={(value) =>
                                  act('Text', {
                                    entryRef: entry.entryRef,
                                    lineKey,
                                    newText: value,
                                  })
                                }
                              />
                            </Table.Cell>
                          </Table.Row>
                        ),
                      )}
                    </Table>
                  </Section>
                ))}
              </Section>
            )}
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
};
