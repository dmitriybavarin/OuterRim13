import { type ReactNode, useState } from 'react';
import {
  Box,
  Button,
  Dropdown,
  Input,
  ProgressBar,
  Section,
  Stack,
  Tooltip,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { Direction } from '../constants';
import { useT } from '../i18n';
import { Window } from '../layouts';

type AreaData = { name: string; ref: string };

type VisualizationToggleProps = { visualizing: BooleanLike };

type ShuttleConstructionUnieuqData = {
  linkedShuttle: 0;
  tooManyShuttles: BooleanLike;
  onCustomShuttle: BooleanLike;
};

type ShuttleConfigurationUniqueData = {
  linkedShuttle: string;
  onShuttle: BooleanLike;
  inDefaultArea: BooleanLike;
  currentArea: AreaData;
  defaultApc: BooleanLike;
  apcInMergeRegion: BooleanLike;
  apcs: Record<string, BooleanLike>;
  neighboringAreas: Record<string, string>;
  idle: BooleanLike;
};

type ShuttleBlueprintsData = {
  shuttles?: Record<string, string>;
  visualizing: BooleanLike;
  masterExists: BooleanLike;
  isMaster: BooleanLike;
  maxShuttleSize: number;
} & (OnShuttleFrameData | OffShuttleFrameData) &
  (ShuttleConstructionUnieuqData | ShuttleConfigurationUniqueData);

type OnShuttleFrameData = {
  onShuttleFrame: 1;
  size: number;
  problems: number;
};

type OffShuttleFrameData = {
  onShuttleFrame: 0;
  size: undefined;
  problems: undefined;
};

type DirectionPadProps = {
  title: string;
  tooltip?: ReactNode;
  enabledDirections: Direction;
  selectedDirection: Direction;
  onSelect: (direction: Direction) => void;
};

const directionData: [Direction, string][] = [
  [Direction.NORTH, 'up'],
  [Direction.SOUTH, 'down'],
  [Direction.EAST, 'right'],
  [Direction.WEST, 'left'],
];

type ProblemsTooltipProps = {
  description: string;
  problemHeader: string;
  problems: number;
  problemStrings: string[];
};

const DirectionPad = (props: DirectionPadProps) => {
  const { title, tooltip, enabledDirections, selectedDirection, onSelect } =
    props;
  const [north, south, east, west] = directionData.map(
    ([direction, icon_suffix], i) => (
      <Stack.Item key={i}>
        <Button
          fluid
          m={0}
          icon={`arrow-${icon_suffix}`}
          selected={selectedDirection & direction}
          disabled={!(enabledDirections & direction)}
          onClick={() => onSelect(direction)}
        />
      </Stack.Item>
    ),
  );
  const titleNode = (
    <Box width="100%" textAlign="center">
      {title}
    </Box>
  );
  return (
    <Section
      fill
      title={
        tooltip ? <Tooltip content={tooltip}>{titleNode}</Tooltip> : titleNode
      }
    >
      <Stack fill vertical align="center" justify="center">
        {north}
        <Stack.Item>
          <Stack>
            {west}
            <Stack.Item width="1rem" mx={1} />
            {east}
          </Stack>
        </Stack.Item>
        {south}
      </Stack>
    </Section>
  );
};

const VisualizationToggle = (props: VisualizationToggleProps) => {
  const { visualizing } = props;
  const { act } = useBackend<ShuttleBlueprintsData>();
  const t = useT();
  return (
    <Tooltip
      content={t(
        'shuttlebp-visualization-hint',
        {},
        'Toggle a visualization of shuttle frames you can use to construct a shuttle. Red tiles indicate frame parts built in invalid areas, or parts of suitable areas that need frame parts built on them.',
      )}
    >
      <Box inline>
        {t('shuttlebp-visualization', {}, 'Visualization:')}
        <Button
          color="transparent"
          icon={visualizing ? 'toggle-on' : 'toggle-off'}
          onClick={() => act('toggleVisualization')}
        />
      </Box>
    </Tooltip>
  );
};

const ProblemsTooltip = (props: ProblemsTooltipProps) => {
  const { description, problemHeader, problems, problemStrings } = props;

  const problemElements: React.ReactElement[] = [];
  for (let i = 0; i < problemStrings.length; i++) {
    if (problems & (1 << i)) {
      problemElements.push(<Box key={i}>{`● ${problemStrings[i]}`}</Box>);
    }
  }

  return (
    <Box>
      {description}
      {problems ? (
        <>
          <Box>{problemHeader}</Box>
          {problemElements}
        </>
      ) : undefined}
    </Box>
  );
};

const ShuttleConstruction = () => {
  const [shuttleDirection, setShuttleDirection] = useState<Direction>(
    Direction.NORTH,
  );
  const { act, data } = useBackend<ShuttleBlueprintsData>();
  const t = useT();
  if (data.linkedShuttle !== 0) {
    throw new Error('type guard failure - linkedShuttle must be 0');
  }
  const {
    onShuttleFrame,
    visualizing,
    tooManyShuttles,
    onCustomShuttle,
    masterExists,
    size,
    maxShuttleSize,
    problems,
  } = data;
  return (
    <Stack justify="space-around">
      <Stack.Item grow>
        <DirectionPad
          title={t('shuttlebp-direction', {}, 'Shuttle Direction')}
          tooltip={t(
            'shuttlebp-direction-hint',
            {},
            'This specifies the direction that the shuttle being built is facing.',
          )}
          enabledDirections={Direction.ALL}
          selectedDirection={shuttleDirection}
          onSelect={(dir) => setShuttleDirection(dir)}
        />
      </Stack.Item>
      <Stack.Item>
        <Stack fill vertical align="end" justify="space-between">
          <Stack.Item>
            <VisualizationToggle visualizing={visualizing} />
          </Stack.Item>
          <Stack.Item>
            <Stack vertical>
              <Stack.Item>
                <Button.Confirm
                  disabled={!onShuttleFrame || tooManyShuttles || problems}
                  tooltip={
                    <ProblemsTooltip
                      description={t(
                        'shuttlebp-new-description',
                        {},
                        'Create a new shuttle using a shuttle frame.',
                      )}
                      problemHeader={t(
                        'shuttlebp-new-problem-header',
                        {},
                        'The following problems prevent you from creating a shuttle with this frame.',
                      )}
                      problems={problems ?? 0}
                      problemStrings={[
                        t(
                          'shuttlebp-new-problem-no-frame',
                          {},
                          'You are not on a shuttle frame.',
                        ),
                        t(
                          'shuttlebp-new-problem-too-many',
                          {},
                          'There are too many custom shuttles currently.',
                        ),
                        t(
                          'shuttlebp-problem-too-large',
                          {},
                          'This frame is too large.',
                        ),
                        t(
                          'shuttlebp-problem-apc-partial',
                          {},
                          'This frame includes the APC of a custom area, but does not enclose the entire area. Remove the APC or add the rest of the area to the frame.',
                        ),
                        t(
                          'shuttlebp-problem-encroach',
                          {},
                          'This frame encroaches on an area custom shuttles may not dock at.',
                        ),
                        t(
                          'shuttlebp-problem-apc-foreign',
                          {},
                          'This frame includes an APC belonging to a non-custom area.',
                        ),
                      ]}
                    />
                  }
                  onClick={() =>
                    act('tryBuildShuttle', { dir: shuttleDirection })
                  }
                >
                  {t('shuttlebp-build-new', {}, 'Build New Shuttle')}
                </Button.Confirm>
              </Stack.Item>
              {onShuttleFrame ? (
                <Stack.Item>
                  <ProgressBar
                    value={size}
                    maxValue={maxShuttleSize}
                    ranges={{
                      green: [0, maxShuttleSize * 0.5],
                      yellow: [maxShuttleSize * 0.5, maxShuttleSize * 0.75],
                      orange: [maxShuttleSize * 0.75, maxShuttleSize],
                      red: [maxShuttleSize, Infinity],
                    }}
                  >
                    {`${size}/${maxShuttleSize}`}
                  </ProgressBar>
                </Stack.Item>
              ) : undefined}
            </Stack>
          </Stack.Item>
          <Stack.Item>
            <Button.Confirm
              disabled={!onCustomShuttle || masterExists}
              tooltip={
                onCustomShuttle
                  ? masterExists
                    ? t(
                        'shuttlebp-master-exists',
                        {},
                        'The master blueprint for this shuttle still exists. Whoever has it can copy it to this set of blueprints.',
                      )
                    : null
                  : t(
                      'shuttlebp-need-custom',
                      {},
                      'You must be on a custom shuttle to do this.',
                    )
              }
              onClick={() => act('tryLinkShuttle')}
            >
              {t('shuttlebp-connect', {}, 'Connect To Existing Shuttle')}
            </Button.Confirm>
          </Stack.Item>
        </Stack>
      </Stack.Item>
    </Stack>
  );
};

const ShuttleConfiguration = () => {
  const [name, setName] = useState('');
  const [mergeArea = { name: '', ref: '' }, setMergeArea] =
    useState<AreaData>();
  const { act, data } = useBackend<ShuttleBlueprintsData>();
  const t = useT();
  if (data.linkedShuttle === 0) {
    throw new Error('type guard failure - linkedShuttle must be non-zero');
  }
  const {
    visualizing,
    onShuttleFrame,
    onShuttle,
    inDefaultArea,
    currentArea = { name: '', ref: '' },
    neighboringAreas = {},
    apcs = {},
    defaultApc,
    apcInMergeRegion,
    idle,
    isMaster,
    size,
    maxShuttleSize,
    problems,
  } = data;
  const { name: currentAreaName, ref: currentAreaRef } = currentArea;
  const { name: mergeAreaName, ref: mergeAreaRef } = mergeArea;
  const removalApcConflict = defaultApc && apcs[currentAreaRef];
  const mergeApcConflict = apcInMergeRegion && apcs[mergeAreaRef];
  const tooLarge = (size ?? 0) > maxShuttleSize;
  return (
    <Stack fill vertical align="center" justify="space-around">
      <Stack.Item textAlign="center">
        <h2>{t('shuttlebp-current-area', {}, 'Current Area:')}</h2>
        <h3>
          {onShuttle
            ? inDefaultArea
              ? t('shuttlebp-default-area', {}, 'Default Area')
              : currentAreaName
            : t('shuttlebp-not-on-shuttle', {}, 'Not on Shuttle')}
        </h3>
      </Stack.Item>
      <Stack.Item>
        <Input
          fluid
          placeholder={t('shuttlebp-new-area-name', {}, 'New Area Name')}
          onChange={setName}
        />
        <Stack>
          <Stack.Item>
            <Button.Confirm
              disabled={!(onShuttle && inDefaultArea)}
              tooltip={
                onShuttle
                  ? inDefaultArea
                    ? t(
                        'shuttlebp-designate-hint',
                        {},
                        'Designate a room within the shuttle as its own area.',
                      )
                    : t(
                        'shuttlebp-designate-only-default',
                        {},
                        'You can only designate a new area from the default area.',
                      )
                  : t(
                      'shuttlebp-need-linked',
                      {},
                      'You must be on the linked shuttle to do this.',
                    )
              }
              onClick={() => act('createNewArea', { name: name })}
            >
              {t('shuttlebp-designate', {}, 'Designate New Area')}
            </Button.Confirm>
          </Stack.Item>
          <Stack.Item>
            <Button.Confirm
              disabled={!onShuttle || inDefaultArea}
              tooltip={
                onShuttle
                  ? inDefaultArea
                    ? t(
                        'shuttlebp-rename-default',
                        {},
                        'You cannot rename the default area.',
                      )
                    : null
                  : t(
                      'shuttlebp-need-linked',
                      {},
                      'You must be on the linked shuttle to do this.',
                    )
              }
              onClick={() => act('renameArea', { name: name })}
            >
              {t('shuttlebp-rename', {}, 'Rename Current Area')}
            </Button.Confirm>
          </Stack.Item>
        </Stack>
      </Stack.Item>
      <Stack.Item width="100%">
        <Stack fill justify="center">
          <Stack.Item>
            <Dropdown
              placeholder={t('shuttlebp-select-area', {}, 'Select Area')}
              options={Object.entries(neighboringAreas).map(([ref, name]) => {
                return {
                  displayText: name,
                  value: ref,
                };
              })}
              selected={mergeAreaName}
              onSelected={(value) =>
                setMergeArea({ name: neighboringAreas[value], ref: value })
              }
            />
          </Stack.Item>
          <Stack.Item>
            <Button.Confirm
              disabled={
                !(onShuttle && inDefaultArea && mergeArea) || mergeApcConflict
              }
              tooltip={
                t(
                  'shuttlebp-expand-hint',
                  {},
                  'Expand the selected area with the connected section of the default area.',
                ) +
                (onShuttle
                  ? mergeArea
                    ? inDefaultArea
                      ? mergeApcConflict
                        ? `\n${t(
                            'shuttlebp-expand-both-apc',
                            {},
                            'Both the selected area and the region that it would expand into have APCs. You must remove one first.',
                          )}`
                        : ''
                      : `\n${t(
                          'shuttlebp-expand-only-default',
                          {},
                          'You can only expand the selected area into the default area.',
                        )}`
                    : ''
                  : `\n${t(
                      'shuttlebp-need-linked',
                      {},
                      'You must be on the linked shuttle to do this.',
                    )}`)
              }
              onClick={() => act('mergeIntoArea', { area: mergeAreaRef })}
            >
              {t('shuttlebp-expand-area', {}, 'Expand Area')}
            </Button.Confirm>
          </Stack.Item>
        </Stack>
      </Stack.Item>
      <Stack.Item>
        <Stack vertical>
          <Stack.Item>
            <Stack>
              <Stack.Item>
                <Button.Confirm
                  disabled={!(idle && onShuttleFrame) || problems || tooLarge}
                  tooltip={
                    <ProblemsTooltip
                      description={t(
                        'shuttlebp-expand-description',
                        {},
                        'Expand the linked shuttle with an adjacent shuttle frame.',
                      )}
                      problemHeader={t(
                        'shuttlebp-expand-problem-header',
                        {},
                        'The following problems prevent you from expanding the shuttle.',
                      )}
                      problems={problems ?? 0}
                      problemStrings={[
                        t(
                          'shuttlebp-expand-problem-no-frame',
                          {},
                          'You must be standing on the shuttle frame you wish to expand the shuttle with.',
                        ),
                        t(
                          'shuttlebp-expand-problem-not-adjacent',
                          {},
                          'This frame is not adjacent to the linked shuttle.',
                        ),
                        t(
                          'shuttlebp-problem-too-large',
                          {},
                          'This frame is too large.',
                        ),
                        t(
                          'shuttlebp-problem-apc-partial',
                          {},
                          'This frame includes the APC of a custom area, but does not enclose the entire area. Remove the APC or add the rest of the area to the frame.',
                        ),
                        t(
                          'shuttlebp-problem-encroach',
                          {},
                          'This frame encroaches on an area custom shuttles may not dock at.',
                        ),
                        t(
                          'shuttlebp-problem-apc-foreign',
                          {},
                          'This frame includes an APC belonging to a non-custom area.',
                        ),
                      ]}
                    />
                  }
                  onClick={() => act('expandWithFrame')}
                >
                  {t(
                    'shuttlebp-expand-frame',
                    {},
                    'Expand Shuttle With Connected Frame',
                  )}
                </Button.Confirm>
              </Stack.Item>
              <Stack.Item>
                <VisualizationToggle visualizing={visualizing} />
              </Stack.Item>
            </Stack>
          </Stack.Item>
          <Stack.Item>
            {onShuttleFrame ? (
              <Stack.Item>
                <ProgressBar
                  value={size}
                  maxValue={maxShuttleSize}
                  ranges={{
                    green: [0, maxShuttleSize * 0.5],
                    yellow: [maxShuttleSize * 0.5, maxShuttleSize * 0.75],
                    orange: [maxShuttleSize * 0.75, maxShuttleSize],
                    red: [maxShuttleSize, Infinity],
                  }}
                >
                  {`${size}/${maxShuttleSize}`}
                </ProgressBar>
              </Stack.Item>
            ) : undefined}
          </Stack.Item>
        </Stack>
      </Stack.Item>
      <Stack.Item>
        <Button.Confirm
          disabled={!onShuttle || inDefaultArea || removalApcConflict}
          tooltip={
            t(
              'shuttlebp-undesignate-hint',
              {},
              'Merge the current area into the default area.',
            ) +
            (onShuttle
              ? inDefaultArea
                ? `\n${t(
                    'shuttlebp-undesignate-already',
                    {},
                    'You are already in the default area.',
                  )}`
                : removalApcConflict
                  ? `\n${t(
                      'shuttlebp-undesignate-both-apc',
                      {},
                      'Both the current and default areas have APCs. You must remove one first.',
                    )}`
                  : ''
              : `\n${t(
                  'shuttlebp-need-linked',
                  {},
                  'You must be on the linked shuttle to do this.',
                )}`)
          }
          onClick={() => act('releaseArea')}
        >
          {t('shuttlebp-undesignate', {}, 'Undesignate Area')}
        </Button.Confirm>
      </Stack.Item>
      <Stack.Item>
        <Button.Confirm
          disabled={!idle || !isMaster}
          tooltip={`${t(
            'shuttlebp-cleanup-hint',
            {},
            'Remove all empty space from the shuttle.',
          )}${
            isMaster
              ? idle
                ? `\n${t(
                    'shuttlebp-cleanup-delete',
                    {},
                    'This will delete any areas left without any space, and will decommission the shuttle entirely if there is nothing left of it.',
                  )}`
                : `\n${t(
                    'shuttlebp-cleanup-idle',
                    {},
                    'The shuttle must be idle to do this.',
                  )}`
              : `\n${t(
                  'shuttlebp-cleanup-master',
                  {},
                  'Only the master blueprint can do this.',
                )}`
          }`}
          onClick={() => act('cleanupEmptyTurfs')}
        >
          {t('shuttlebp-cleanup', {}, 'Clean Up Empty Space')}
        </Button.Confirm>
      </Stack.Item>
    </Stack>
  );
};

export const ShuttleBlueprints = (props) => {
  const { act, data } = useBackend<ShuttleBlueprintsData>();
  const { linkedShuttle, shuttles, masterExists, isMaster } = data;
  const t = useT();
  return (
    <Window width={450} height={340}>
      <Window.Content>
        <Section
          fill
          buttons={
            <>
              {shuttles && (
                <Dropdown
                  options={[
                    { displayText: t('shuttlebp-none', {}, 'None'), value: 0 },
                    ...Object.entries(shuttles).map(
                      ([ref, name]: [string, string]) => {
                        return { displayText: name, value: ref };
                      },
                    ),
                  ]}
                  selected={
                    linkedShuttle
                      ? shuttles[linkedShuttle]
                      : t('shuttlebp-none', {}, 'None')
                  }
                  onSelected={(value) => {
                    if (value === 0) {
                      act('unsetShuttle');
                    } else {
                      act('switchShuttle', { ref: value });
                    }
                  }}
                />
              )}
              {!!linkedShuttle && !masterExists && !isMaster && (
                <Button.Confirm onClick={() => act('promoteToMaster')}>
                  {t('shuttlebp-promote', {}, 'Promote To Master Blueprint')}
                </Button.Confirm>
              )}
            </>
          }
        >
          {linkedShuttle ? <ShuttleConfiguration /> : <ShuttleConstruction />}
        </Section>
      </Window.Content>
    </Window>
  );
};
