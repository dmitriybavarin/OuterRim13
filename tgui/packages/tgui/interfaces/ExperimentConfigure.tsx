import {
  Box,
  Button,
  Icon,
  LabeledList,
  Section,
  Stack,
  Table,
  Tooltip,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';
import { useBackend } from '../backend';
import { useNumber, useT } from '../i18n';
import { Window } from '../layouts';

export type Techweb = {
  all_servers: string[];
  ref: string;
  selected: number;
  web_id: string;
  web_org: string;
};

export type ExperimentData = {
  description: string;
  name: string;
  performance_hint: string;
  progress: Stage[];
  ref: string;
  selected?: BooleanLike;
  completed?: BooleanLike;
  tag: string;
};

// Value type, Description, Value, AltValue
type Stage = [string, string, number, number];

type Data = {
  always_active: boolean;
  experiments: ExperimentData[];
  has_start_callback: boolean;
  techwebs: Techweb[];
};

type ExperimentStageRowProps = {
  stage: Stage;
};

function ExperimentStageRow(props: ExperimentStageRowProps) {
  const [type, description, value, altValue] = props.stage;

  // Determine completion based on type of stage
  let completion = false;
  switch (type) {
    case 'bool':
    case 'detail':
      completion = !!value;
      break;
    case 'integer':
      completion = value === altValue;
      break;
    case 'float':
      completion = value >= 1;
      break;
  }

  return (
    <Table.Row
      className={`ExperimentStage__StageContainer
        ${completion ? 'complete' : 'incomplete'}`}
    >
      <Table.Cell
        collapsing
        className={`ExperimentStage__Indicator ${type}`}
        color={completion ? 'good' : 'bad'}
      >
        {(type === 'bool' && <Icon name={value ? 'check' : 'times'} />) ||
          (type === 'integer' && `${value}/${altValue}`) ||
          (type === 'float' && `${value * 100}%`) ||
          (type === 'detail' && '⤷')}
      </Table.Cell>
      <Table.Cell className="ExperimentStage__Description">
        {description}
      </Table.Cell>
    </Table.Row>
  );
}

type TechwebServerProps = {
  techwebs: Techweb[];
  can_select?: boolean;
};

export function TechwebServer(props: TechwebServerProps) {
  const { act } = useBackend<Data>();
  const t = useT();
  const { techwebs, can_select = true } = props;

  return techwebs.map((server, index) => (
    <Box key={index} m={1} className="ExperimentTechwebServer__Web">
      <Stack
        align="center"
        justify="space-between"
        className="ExperimentTechwebServer__WebHeader"
      >
        <Stack.Item className="ExperimentTechwebServer__WebName">
          {server.web_id} / {server.web_org}
        </Stack.Item>
        {can_select && (
          <Stack.Item>
            <Button
              onClick={() =>
                server.selected
                  ? act('clear_server')
                  : act('select_server', { ref: server.ref })
              }
              backgroundColor={server.selected ? 'good' : 'rgba(0, 0, 0, 0.4)'}
              className="ExperimentTechwebServer__ConnectButton"
            >
              {server.selected
                ? t('research-experiment-disconnect', {}, 'Disconnect')
                : t('research-experiment-connect', {}, 'Connect')}
            </Button>
          </Stack.Item>
        )}
      </Stack>
      <Box className="ExperimentTechwebServer__WebContent">
        <span>
          {t(
            'research-experiment-connectivity',
            {},
            'Connectivity to this web is maintained by the following servers...',
          )}
        </span>
        <LabeledList>
          {server.all_servers.map((individual_servers, new_index) => (
            <Box key={new_index}>{individual_servers}</Box>
          ))}
        </LabeledList>
      </Box>
    </Box>
  ));
}

type ExperimentTitleElementProps = {
  selected: boolean;
  ref: string;
  can_select?: boolean;
  children?: React.ReactNode;
};

function ExperimentTitleElement(props: ExperimentTitleElementProps) {
  const { act } = useBackend<Data>();
  const { selected, ref, can_select = true, children } = props;

  if (!can_select) {
    return (
      <Box className="ExperimentConfigure__ExperimentNameFakeButton">
        {children}
      </Box>
    );
  }

  return (
    <Button
      fluid
      onClick={() =>
        selected
          ? act('clear_experiment')
          : act('select_experiment', { ref: ref })
      }
      selected={selected}
      className="ExperimentConfigure__ExperimentName"
    >
      {children}
    </Button>
  );
}

type ExperimentProps = {
  exp: ExperimentData;
  children?: React.ReactNode;
  can_select?: boolean;
};

export function Experiment(props: ExperimentProps) {
  const { exp, children, can_select } = props;
  const { name, description, tag, selected, progress, performance_hint, ref } =
    exp;

  return (
    <Box
      m={1}
      key={ref}
      className={`ExperimentConfigure__ExperimentPanel${selected ? '--selected' : ''}`}
    >
      <ExperimentTitleElement
        selected={!!selected}
        ref={ref}
        can_select={can_select}
      >
        <Stack>
          <Stack.Item>{name}</Stack.Item>
          <Stack.Item color="rgba(255, 255, 255, 0.5)">
            <div className="ExperimentConfigure__TagContainer">
              <Stack>
                <Stack.Item>{tag}</Stack.Item>
                <Stack.Item>
                  <Tooltip content={performance_hint} position="bottom-start">
                    <Icon name="question-circle" mx={0.5} />
                    <div className="ExperimentConfigure__PerformanceHint" />
                  </Tooltip>
                </Stack.Item>
              </Stack>
            </div>
          </Stack.Item>
        </Stack>
      </ExperimentTitleElement>
      <div className="ExperimentConfigure__ExperimentContent">
        <Box mb={1}>{description}</Box>
        {children}
        <Table ml={2} className="ExperimentStage__Table">
          {progress.map((stage, idx) => (
            <ExperimentStageRow key={idx} stage={stage} />
          ))}
        </Table>
      </div>
    </Box>
  );
}

export function ExperimentConfigure(props) {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const width = useNumber('experimentconfigure-window-width', 600);
  const height = useNumber('experimentconfigure-window-height', 735);
  const { always_active, has_start_callback } = data;

  const techwebs = data.techwebs ?? [];

  const experiments = data.experiments.sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  // Group servers together by web
  const webs = new Map();
  for (const x of techwebs) {
    if (x.web_id !== null) {
      if (!webs.has(x.web_id)) {
        webs.set(x.web_id, []);
      }
      webs.get(x.web_id).push(x);
    }
  }

  let textContent = '';
  if (experiments.length === 0) {
    textContent = t(
      'research-experiment-none',
      {},
      'No experiments found on this web',
    );
  } else if (always_active) {
    textContent = t(
      'research-experiment-always-active',
      {},
      'This device is configured to attempt to perform all available experiments, so no further configuration is necessary.',
    );
  } else {
    textContent = t(
      'research-experiment-select',
      {},
      'Select one of the following experiments...',
    );
  }

  return (
    <Window width={width} height={height}>
      <Window.Content scrollable>
        <Section title={t('research-experiment-servers', {}, 'Servers')}>
          <Box color="label">
            {webs.size > 0
              ? t(
                  'research-experiment-select-web',
                  {},
                  'Please select a techweb to connect to...',
                )
              : t(
                  'research-experiment-no-servers',
                  {},
                  'Found no servers connected to a techweb!',
                )}
          </Box>
          {webs.size > 0 &&
            Array.from(webs, ([techweb, techwebs]) => (
              <TechwebServer key={techweb} techwebs={techwebs} />
            ))}
        </Section>
        <Stack vertical>
          {techwebs.some((e) => e.selected) && (
            <Stack.Item>
              <Section
                title={t('research-experiment-title', {}, 'Experiments')}
                className="ExperimentConfigure__ExperimentsContainer"
                fill
              >
                <Box mb={1} color="label">
                  {textContent}
                </Box>
                {experiments.map((exp, i) => (
                  <Experiment key={i} exp={exp} />
                ))}
              </Section>
            </Stack.Item>
          )}

          {!!has_start_callback && (
            <Stack.Item>
              <Button
                fluid
                className="ExperimentConfigure__PerformExperiment"
                onClick={() => act('start_experiment_callback')}
                disabled={!experiments.some((e) => e.selected)}
                icon="flask"
              >
                {t('research-experiment-perform', {}, 'Perform Experiment')}
              </Button>
            </Stack.Item>
          )}
        </Stack>
      </Window.Content>
    </Window>
  );
}
