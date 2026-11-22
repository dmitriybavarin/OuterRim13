import { useState } from 'react';
import {
  Button,
  Dropdown,
  Input,
  Section,
  Stack,
  TextArea,
} from 'tgui-core/components';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  announce_contents: string;
  announcement_color: string;
  announcement_colors: string[];
  announcer_sounds: string[];
  command_name_presets: string[];
  command_name: string;
  command_report_content: string;
  custom_name: string;
  played_sound: string;
  print_report: string;
  subheader: string;
};

export function CommandReport() {
  const t = useT();
  return (
    <Window
      title={t('commandreport-title', {}, 'Create Command Report')}
      width={325}
      height={685}
      theme="admin"
    >
      <Window.Content>
        <Stack fill vertical>
          <Stack.Item>
            <CentComName />
            <AnnouncementColor />
            <AnnouncementSound />
          </Stack.Item>
          <Stack.Item>
            <SubHeader />
          </Stack.Item>
          <Stack.Item grow>
            <ReportText />
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
}

/** Allows the user to set the "sender" of the message via dropdown */
function CentComName(props) {
  const t = useT();
  const { act, data } = useBackend<Data>();
  const { command_name, command_name_presets = [], custom_name } = data;

  const [name, setName] = useState(command_name);

  function sendName(value) {
    setName(value);
    act('update_command_name', {
      updated_name: value,
    });
  }

  return (
    <Section
      title={t('commandreport-section-name', {}, 'Set Central Command name')}
      textAlign="center"
    >
      <Dropdown
        width="100%"
        selected={name}
        options={command_name_presets}
        onSelected={sendName}
      />
      {!!custom_name && (
        <Input fluid mt={1} value={name} onChange={setName} onBlur={sendName} />
      )}
    </Section>
  );
}

/** Allows the user to set the "sender" of the message via dropdown */
function SubHeader(props) {
  const t = useT();
  const { act, data } = useBackend<Data>();
  const { subheader } = data;

  return (
    <Section
      title={t('commandreport-section-subheader', {}, 'Set report subheader')}
      textAlign="center"
    >
      <Input
        fluid
        mt={1}
        value={subheader}
        placeholder={t(
          'commandreport-subheader-placeholder',
          {},
          'Keep blank to not include a subheader',
        )}
        onBlur={(value) =>
          act('set_subheader', {
            new_subheader: value,
          })
        }
      />
    </Section>
  );
}

/** Features a section with dropdown for the announcement colour. */
function AnnouncementColor(props) {
  const t = useT();
  const { act, data } = useBackend<Data>();
  const { announcement_colors = [], announcement_color } = data;

  return (
    <Section
      title={t('commandreport-section-color', {}, 'Set announcement color')}
      textAlign="center"
    >
      <Dropdown
        width="100%"
        selected={announcement_color}
        options={announcement_colors}
        onSelected={(value) =>
          act('update_announcement_color', {
            updated_announcement_color: value,
          })
        }
      />
    </Section>
  );
}

/** Features a section with dropdown for sounds. */
function AnnouncementSound(props) {
  const t = useT();
  const { act, data } = useBackend<Data>();
  const { announcer_sounds = [], played_sound } = data;

  return (
    <Section
      title={t('commandreport-section-sound', {}, 'Set announcement sound')}
      textAlign="center"
    >
      <Dropdown
        width="100%"
        selected={played_sound}
        options={announcer_sounds}
        onSelected={(value) =>
          act('set_report_sound', {
            picked_sound: value,
          })
        }
      />
    </Section>
  );
}

/** Creates the report textarea with a submit button. */
function ReportText(props) {
  const t = useT();
  const { act, data } = useBackend<Data>();
  const { announce_contents, print_report, command_report_content } = data;
  const [commandReport, setCommandReport] = useState(command_report_content);

  return (
    <Section
      fill
      title={t('commandreport-section-text', {}, 'Set report text')}
      textAlign="center"
    >
      <Stack fill vertical>
        <Stack.Item grow>
          <TextArea
            height="100%"
            fluid
            onBlur={setCommandReport}
            value={commandReport}
            placeholder={t(
              'commandreport-text-placeholder',
              {},
              'Enter report text here...',
            )}
          />
        </Stack.Item>
        <Stack.Item>
          <Button.Checkbox
            fluid
            checked={!!announce_contents}
            onClick={() => act('toggle_announce')}
          >
            {t('commandreport-announce', {}, 'Announce Contents')}
          </Button.Checkbox>
        </Stack.Item>
        <Stack.Item>
          <Button.Checkbox
            fluid
            checked={!!print_report || !announce_contents}
            disabled={!announce_contents}
            onClick={() => act('toggle_printing')}
            tooltip={
              !announce_contents &&
              t(
                'commandreport-print-tooltip',
                {},
                "Printing the report is required since we aren't announcing its contents.",
              )
            }
            tooltipPosition="top"
          >
            {t('commandreport-print', {}, 'Print Report')}
          </Button.Checkbox>
        </Stack.Item>
        <Stack.Item>
          <Button.Confirm
            fluid
            icon="check"
            textAlign="center"
            onClick={() => act('submit_report', { report: commandReport })}
          >
            {t('commandreport-submit', {}, 'Submit Report')}
          </Button.Confirm>
        </Stack.Item>
      </Stack>
    </Section>
  );
}
