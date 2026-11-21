import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dropdown,
  Input,
  NumberInput,
  Section,
  Stack,
  Table,
  TextArea,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useNumber, useT } from '../i18n';
import { Window } from '../layouts';

type Template = {
  id: string;
  name: string;
  code: string;
  teamsize: number;
  mission: string;
  polldesc: string;
  open_armory: BooleanLike;
  leader_experience: BooleanLike;
  random_names: BooleanLike;
  spawn_admin: BooleanLike;
  use_custom_shuttle: BooleanLike;
  has_shuttle: BooleanLike;
  enforce_human: BooleanLike;
  mob_type: string;
};

type Ghost = {
  name: string;
  ckey: string;
  minutes: number;
  banned: BooleanLike;
};

type PreviewEntry = {
  role: string;
  leader: BooleanLike;
  image: string;
};

type Data = {
  templates: Template[];
  mob_types: string[];
  max_teamsize: number;
  max_text: number;
  busy: BooleanLike;
  spawn_points: number;
  user_is_ghost: BooleanLike;
  ghosts: Ghost[];
  preview?: PreviewEntry[];
  preview_busy?: BooleanLike;
};

export function SummonERT() {
  const { act, data: raw } = useBackend<Partial<Data>>();
  const data: Data = {
    templates: raw.templates ?? [],
    mob_types: raw.mob_types ?? [],
    max_teamsize: raw.max_teamsize ?? 50,
    max_text: raw.max_text ?? 500,
    busy: raw.busy ?? 0,
    spawn_points: raw.spawn_points ?? 0,
    user_is_ghost: raw.user_is_ghost ?? 0,
    ghosts: raw.ghosts ?? [],
    preview: raw.preview ?? [],
    preview_busy: raw.preview_busy ?? 0,
  };
  const t = useT();
  const width = useNumber('summonert-window-width', 720);
  const height = useNumber('summonert-window-height', 780);

  const first = data.templates[0];
  const [templateId, setTemplateId] = useState(first?.id ?? '');
  const [teamsize, setTeamsize] = useState(first?.teamsize ?? 1);
  const [mission, setMission] = useState(first?.mission ?? '');
  const [polldesc, setPolldesc] = useState(first?.polldesc ?? '');
  const [openArmory, setOpenArmory] = useState(!!first?.open_armory);
  const [leaderExperience, setLeaderExperience] = useState(
    !!first?.leader_experience,
  );
  const [randomNames, setRandomNames] = useState(!!first?.random_names);
  const [spawnAdmin, setSpawnAdmin] = useState(!!first?.spawn_admin);
  const [customShuttle, setCustomShuttle] = useState(
    !!first?.use_custom_shuttle,
  );
  const [enforceHuman, setEnforceHuman] = useState(!!first?.enforce_human);
  const [mobType, setMobType] = useState(first?.mob_type ?? '');
  const [ghostSearch, setGhostSearch] = useState('');

  const template = data.templates.find((entry) => entry.id === templateId);

  function typeName(entry: Template) {
    return t(
      `summonert-type-${entry.name.replace(/\//g, '_')}`,
      {},
      entry.code ? `${entry.name} (${entry.code})` : entry.name,
    );
  }

  const hasTemplate = !!template;
  useEffect(() => {
    if (!hasTemplate) {
      return;
    }
    act('preview', {
      template: templateId,
      mob_type: mobType,
      enforce_human: enforceHuman ? 1 : 0,
    });
  }, [templateId, mobType, enforceHuman, hasTemplate]);

  function selectTemplate(id: string) {
    const entry = data.templates.find((item) => item.id === id);
    if (!entry) {
      return;
    }
    setTemplateId(id);
    setTeamsize(entry.teamsize);
    setMission(entry.mission);
    setPolldesc(entry.polldesc);
    setOpenArmory(!!entry.open_armory);
    setLeaderExperience(!!entry.leader_experience);
    setRandomNames(!!entry.random_names);
    setSpawnAdmin(!!entry.spawn_admin);
    setCustomShuttle(!!entry.use_custom_shuttle);
    setEnforceHuman(!!entry.enforce_human);
    setMobType(entry.mob_type);
  }

  const mobOptions = [
    { value: '', displayText: t('summonert-species-default') },
    ...data.mob_types.map((value) => ({
      value,
      displayText: value.replace('/mob/living/carbon/human/', ''),
    })),
  ];

  const ghosts = data.ghosts.filter(
    (ghost) =>
      !ghostSearch ||
      ghost.name.toLowerCase().includes(ghostSearch.toLowerCase()) ||
      ghost.ckey.toLowerCase().includes(ghostSearch.toLowerCase()),
  );
  const eligible = data.ghosts.filter((ghost) => !ghost.banned).length;

  const canSummon =
    !!template && !data.busy && data.spawn_points > 0 && teamsize > 0;

  return (
    <Window
      title={t('summonert-title')}
      width={width}
      height={height}
      theme="admin"
    >
      <Window.Content scrollable>
        <Stack vertical g={1}>
          <Stack.Item>
            <Section title={t('summonert-section-team')}>
              <Stack vertical>
                <Stack.Item>
                  <Stack align="center">
                    <Stack.Item basis="9em" color="label">
                      {t('summonert-template')}
                    </Stack.Item>
                    <Stack.Item grow>
                      <Dropdown
                        width="100%"
                        options={data.templates.map((entry) => ({
                          value: entry.id,
                          displayText: typeName(entry),
                        }))}
                        selected={templateId}
                        displayText={template ? typeName(template) : ''}
                        onSelected={selectTemplate}
                      />
                    </Stack.Item>
                  </Stack>
                </Stack.Item>
                <Stack.Item>
                  <Stack align="center">
                    <Stack.Item basis="9em" color="label">
                      {t('summonert-teamsize')}
                    </Stack.Item>
                    <Stack.Item>
                      <NumberInput
                        value={teamsize}
                        minValue={1}
                        maxValue={data.max_teamsize}
                        step={1}
                        width="5em"
                        onChange={setTeamsize}
                      />
                    </Stack.Item>
                  </Stack>
                </Stack.Item>
                <Stack.Item>
                  <Stack align="center">
                    <Stack.Item basis="9em" color="label">
                      {t('summonert-species')}
                    </Stack.Item>
                    <Stack.Item grow>
                      <Dropdown
                        width="100%"
                        options={mobOptions}
                        selected={mobType}
                        displayText={
                          mobOptions.find((option) => option.value === mobType)
                            ?.displayText
                        }
                        onSelected={setMobType}
                      />
                    </Stack.Item>
                  </Stack>
                </Stack.Item>
                <Stack.Item>
                  <Box color="label" mb={0.5}>
                    {t('summonert-mission')}
                  </Box>
                  <TextArea
                    fluid
                    height="5em"
                    maxLength={data.max_text}
                    value={mission}
                    onChange={setMission}
                  />
                </Stack.Item>
                <Stack.Item>
                  <Box color="label" mb={0.5}>
                    {t('summonert-polldesc')}
                  </Box>
                  <Input
                    fluid
                    maxLength={data.max_text}
                    value={polldesc}
                    onChange={setPolldesc}
                  />
                </Stack.Item>
              </Stack>
            </Section>
          </Stack.Item>
          <Stack.Item>
            <Section title={t('summonert-section-preview')}>
              {data.preview_busy ? (
                <Box color="label">{t('summonert-preview-loading')}</Box>
              ) : data.preview?.length ? (
                <Stack wrap>
                  {data.preview.map((entry) => (
                    <Stack.Item key={entry.role} m={0.5}>
                      <Box textAlign="center">
                        <Box
                          as="img"
                          src={`data:image/png;base64,${entry.image}`}
                          style={{ imageRendering: 'pixelated' }}
                        />
                        <Box bold={!!entry.leader} mt={0.5}>
                          {entry.role}
                        </Box>
                        {!!entry.leader && (
                          <Box color="label">
                            {t('summonert-preview-leader')}
                          </Box>
                        )}
                      </Box>
                    </Stack.Item>
                  ))}
                </Stack>
              ) : (
                <Box color="label">{t('summonert-preview-empty')}</Box>
              )}
            </Section>
          </Stack.Item>
          <Stack.Item>
            <Section title={t('summonert-section-options')}>
              <Stack vertical>
                <Stack.Item>
                  <Button.Checkbox
                    checked={openArmory}
                    onClick={() => setOpenArmory(!openArmory)}
                  >
                    {t('summonert-opt-armory')}
                  </Button.Checkbox>
                </Stack.Item>
                <Stack.Item>
                  <Button.Checkbox
                    checked={leaderExperience}
                    onClick={() => setLeaderExperience(!leaderExperience)}
                  >
                    {t('summonert-opt-leader')}
                  </Button.Checkbox>
                </Stack.Item>
                <Stack.Item>
                  <Button.Checkbox
                    checked={randomNames}
                    onClick={() => setRandomNames(!randomNames)}
                  >
                    {t('summonert-opt-names')}
                  </Button.Checkbox>
                </Stack.Item>
                <Stack.Item>
                  <Button.Checkbox
                    checked={enforceHuman}
                    onClick={() => setEnforceHuman(!enforceHuman)}
                  >
                    {t('summonert-opt-human')}
                  </Button.Checkbox>
                </Stack.Item>
                <Stack.Item>
                  <Button.Checkbox
                    checked={spawnAdmin}
                    disabled={!data.user_is_ghost}
                    tooltip={
                      data.user_is_ghost
                        ? undefined
                        : t('summonert-opt-admin-ghost')
                    }
                    onClick={() => setSpawnAdmin(!spawnAdmin)}
                  >
                    {t('summonert-opt-admin')}
                  </Button.Checkbox>
                </Stack.Item>
                <Stack.Item>
                  <Button.Checkbox
                    checked={customShuttle}
                    disabled={!template?.has_shuttle}
                    tooltip={
                      template?.has_shuttle
                        ? undefined
                        : t('summonert-opt-shuttle-none')
                    }
                    onClick={() => setCustomShuttle(!customShuttle)}
                  >
                    {t('summonert-opt-shuttle')}
                  </Button.Checkbox>
                </Stack.Item>
              </Stack>
            </Section>
          </Stack.Item>
          <Stack.Item>
            <Section
              title={t('summonert-section-ghosts', {
                count: eligible,
                total: data.ghosts.length,
              })}
              buttons={
                <Input
                  value={ghostSearch}
                  placeholder={t('summonert-ghosts-search')}
                  onChange={setGhostSearch}
                />
              }
            >
              <Box color="label" mb={1}>
                {t('summonert-ghosts-hint')}
              </Box>
              {ghosts.length === 0 ? (
                <Box color="label">{t('summonert-ghosts-empty')}</Box>
              ) : (
                <Table>
                  {ghosts.map((ghost) => (
                    <Table.Row key={ghost.ckey} className="candystripe">
                      <Table.Cell>{ghost.name}</Table.Cell>
                      <Table.Cell color="label">{ghost.ckey}</Table.Cell>
                      <Table.Cell collapsing color="label">
                        {t('summonert-ghost-playtime', {
                          minutes: ghost.minutes,
                        })}
                      </Table.Cell>
                      <Table.Cell collapsing>
                        {!!ghost.banned && (
                          <Box color="bad">{t('summonert-ghost-banned')}</Box>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table>
              )}
            </Section>
          </Stack.Item>
          <Stack.Item>
            {data.spawn_points === 0 && (
              <Box color="bad" mb={1}>
                {t('summonert-no-spawn')}
              </Box>
            )}
            {!!data.busy && (
              <Box color="average" mb={1}>
                {t('summonert-busy')}
              </Box>
            )}
            <Button
              fluid
              icon="user-shield"
              color="bad"
              textAlign="center"
              disabled={!canSummon}
              confirmContent={t('summonert-summon-confirm')}
              onClick={() =>
                act('summon', {
                  template: templateId,
                  teamsize,
                  mission,
                  polldesc,
                  open_armory: openArmory,
                  leader_experience: leaderExperience,
                  random_names: randomNames,
                  spawn_admin: spawnAdmin,
                  use_custom_shuttle: customShuttle,
                  enforce_human: enforceHuman,
                  mob_type: mobType,
                })
              }
            >
              {t('summonert-summon')}
            </Button>
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
}
