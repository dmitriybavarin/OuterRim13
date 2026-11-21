import { toMerged } from 'es-toolkit';
import { Color } from 'tgui-core/color';
import {
  Box,
  Button,
  Icon,
  NoticeBox,
  Section,
  Stack,
  StyleableSection,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { departmentKey, jobKey, useNumber, useT } from '../i18n';
import { Window } from '../layouts';

type Job = {
  unavailable_reason: string | null;
  command: BooleanLike;
  open_slots: number;
  used_slots: number;
  prioritized: BooleanLike;
  description: string;
  jobIcon: string;
};

type Department = {
  color: string;
  jobs: Record<string, Job>;
  open_slots: number;
};

type Data = {
  departments_static: Record<string, Department>;
  departments: Record<string, Department>;
  alert_state: string;
  shuttle_status: string;
  disable_jobs_for_non_observers: BooleanLike;
  priority: BooleanLike;
  round_duration: string;
};

type JobEntryProps = {
  jobName: string;
  job: Job;
  department: Department;
  jobIcon: string;
  onClick: () => void;
};

function JobEntry(props: JobEntryProps) {
  const { jobName, job, department, jobIcon, onClick } = props;
  const t = useT();
  const description = t(jobKey(jobName, 'desc'), {}, job.description);
  const shownName = t(jobKey(jobName, 'name'), {}, jobName);

  return (
    <Button
      fluid
      style={{
        // Try not to think too hard about this one.
        backgroundColor: job.unavailable_reason
          ? '#949494' // Grey background
          : job.prioritized
            ? '#16fc0f' // Bright green background
            : Color.fromHex(department.color).darken(10).toString(),
        color: job.unavailable_reason
          ? '#616161' // Dark grey font
          : Color.fromHex(department.color).darken(90).toString(),
        fontSize: '1.1rem',
        cursor: job.unavailable_reason ? 'initial' : 'pointer',
      }}
      tooltip={
        job.unavailable_reason ||
        (job.prioritized ? (
          <>
            <p style={{ marginTop: '0px' }}>
              <b>{t('jobselection-prioritized')}</b>
            </p>
            {description}
          </>
        ) : (
          description
        ))
      }
      tooltipPosition="top"
      onClick={() => {
        !job.unavailable_reason && onClick();
      }}
    >
      <Stack fill>
        {jobIcon && (
          <Stack.Item>
            <Icon name={jobIcon} />
          </Stack.Item>
        )}
        <Stack.Item
          grow
          style={{
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {job.command ? <b>{shownName}</b> : shownName}
        </Stack.Item>
        <Stack.Item style={{ flexShrink: 0 }}>
          <span
            style={{
              whiteSpace: 'nowrap',
            }}
          >
            {job.used_slots} / {job.open_slots}
          </span>
        </Stack.Item>
      </Stack>
    </Button>
  );
}

type DepartmentEntryProps = {
  name: string;
  department: Department;
};

function DepartmentEntry(props: DepartmentEntryProps) {
  const { name, department } = props;
  const { act } = useBackend<Data>();
  const t = useT();

  return (
    <Box minWidth="30%">
      <StyleableSection
        title={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: '0.5em',
            }}
          >
            <span>{t(departmentKey(name), {}, name)}</span>
            <span
              style={{
                fontSize: '1rem',
                whiteSpace: 'nowrap',
                color: Color.fromHex(department.color).darken(60).toString(),
              }}
            >
              {t('jobselection-slots-available', {
                count: department.open_slots,
              })}
            </span>
          </div>
        }
        style={{
          backgroundColor: department.color,
          marginBottom: '1em',
          breakInside: 'avoid-column',
        }}
        titleStyle={{
          'border-bottom-color': Color.fromHex(department.color)
            .darken(50)
            .toString(),
        }}
        textStyle={{
          color: Color.fromHex(department.color).darken(80).toString(),
        }}
      >
        <Stack vertical>
          {Object.entries(department.jobs).map(([name, job]) => (
            <Stack.Item key={name}>
              <JobEntry
                key={name}
                jobName={name}
                job={job}
                jobIcon={job.jobIcon}
                department={department}
                onClick={() => {
                  act('select_job', { job: name });
                }}
              />
            </Stack.Item>
          ))}
        </Stack>
      </StyleableSection>
    </Box>
  );
}

export function JobSelection(props) {
  const { act, data } = useBackend<Data>();
  const t = useT();
  if (!data?.departments_static) {
    return null; // Stop TGUI whitescreens with TGUI-dev!
  }

  const departments: Record<string, Department> = toMerged(
    data.departments,
    data.departments_static,
  );

  const windowWidth = useNumber('jobselection-window-width', 1012);
  const windowHeight = useNumber('jobselection-window-height', 666);

  const { shuttle_status, round_duration } = data;

  return (
    <Window
      title={t('jobselection-title')}
      width={windowWidth}
      height={shuttle_status ? windowHeight + 24 : windowHeight}
    >
      <Window.Content>
        <Section
          buttons={
            <Button
              onClick={() => act('select_job', { job: 'Random' })}
              tooltip={t('jobselection-random-tooltip')}
            >
              {t('jobselection-random-button')}
            </Button>
          }
          fill
          scrollable
          title={
            <>
              {shuttle_status && <NoticeBox info>{shuttle_status}</NoticeBox>}
              <Box as="span" color="label">
                {t('jobselection-round-duration', { time: round_duration })}
              </Box>
            </>
          }
        >
          <Box style={{ columns: '20em' }}>
            {Object.entries(departments).map(([name, department]) => (
              <DepartmentEntry key={name} name={name} department={department} />
            ))}
          </Box>
        </Section>
      </Window.Content>
    </Window>
  );
}
