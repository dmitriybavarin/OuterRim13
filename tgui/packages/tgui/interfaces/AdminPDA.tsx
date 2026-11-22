import { useState } from 'react';
import {
  Box,
  Button,
  Dropdown,
  Input,
  Section,
  TextArea,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type UserList = Record<string, User>;

type User = {
  ref: string;
  username: string;
  invisible: BooleanLike;
};

type Data = {
  users: UserList;
};

export function AdminPDA(props) {
  const t = useT();
  const jobState = useState('');
  const nameState = useState('');
  const spamState = useState(false);
  const userState = useState('');
  const invisibleState = useState<BooleanLike>(0);

  return (
    <Window
      title={t('adminpda-title', {}, 'Send PDA Message')}
      width={300}
      height={575}
      theme="admin"
    >
      <Window.Content>
        <ReceiverChoice
          invisibleState={invisibleState}
          spamState={spamState}
          userState={userState}
        />
        <SenderInfo jobState={jobState} nameState={nameState} />
        <MessageInput
          invisibleState={invisibleState}
          jobState={jobState}
          nameState={nameState}
          spamState={spamState}
          userState={userState}
        />
      </Window.Content>
    </Window>
  );
}

type ReceiverProps = {
  invisibleState: [BooleanLike, (value: BooleanLike) => void];
  userState: [string, (value: string) => void];
  spamState: [boolean, (value: boolean) => void];
};

function ReceiverChoice(props: ReceiverProps) {
  const t = useT();
  const { data } = useBackend<Data>();
  const { users } = data;

  const [user, setUser] = props.userState;
  const [spam, setSpam] = props.spamState;
  const [showInvisible, setShowInvisible] = props.invisibleState;

  const receivers = Array.from(Object.values(users));
  const dropdownOptions = receivers
    .filter((rcvr) => showInvisible || !rcvr.invisible)
    .map((rcvr) => ({
      displayText: rcvr.username,
      value: rcvr.ref,
    }));

  return (
    <Section title={t('adminpda-section-to', {}, 'To Who?')} textAlign="center">
      <Dropdown
        disabled={spam}
        selected={user}
        displayText={users[user]?.username}
        placeholder={t('adminpda-pick-user', {}, 'Pick a user...')}
        options={dropdownOptions}
        width="275px"
        mb={1}
        onSelected={(value) => {
          setUser(value);
        }}
      />
      <Box>
        <Button.Checkbox
          checked={showInvisible}
          fluid
          onClick={() => setShowInvisible(!showInvisible)}
        >
          {t('adminpda-include-invisible', {}, 'Include invisible?')}
        </Button.Checkbox>
        <Button.Checkbox checked={spam} fluid onClick={() => setSpam(!spam)}>
          {t('adminpda-send-everyone', {}, 'Should it be sent to everyone?')}
        </Button.Checkbox>
      </Box>
    </Section>
  );
}

type SenderInfoProps = {
  nameState: [string, (value: string) => void];
  jobState: [string, (value: string) => void];
};

function SenderInfo(props: SenderInfoProps) {
  const t = useT();
  const [_name, setName] = props.nameState;
  const [_job, setJob] = props.jobState;

  return (
    <Section
      title={t('adminpda-section-from', {}, 'From Who?')}
      textAlign="center"
    >
      <Box fontSize="14px">
        <Input
          placeholder={t('adminpda-sender-name', {}, 'Sender name...')}
          fluid
          onChange={setName}
        />
      </Box>
      <Box fontSize="14px" pt="10px">
        <Input
          placeholder={t('adminpda-sender-job', {}, "Sender's job...")}
          fluid
          onChange={setJob}
        />
      </Box>
    </Section>
  );
}

type MessageInputProps = {
  jobState: [string, (value: string) => void];
  nameState: [string, (value: string) => void];
  spamState: [boolean, (value: boolean) => void];
  userState: [string, (value: string) => void];
  invisibleState: [BooleanLike, (value: BooleanLike) => void];
};

function getErrorText(
  t: ReturnType<typeof useT>,
  name: string,
  job: string,
  message: string,
  target: boolean,
) {
  const reasonList: string[] = [];
  if (!target) reasonList.push(t('adminpda-missing-target', {}, 'target'));
  if (!name) reasonList.push(t('adminpda-missing-name', {}, 'name'));
  if (!job) reasonList.push(t('adminpda-missing-job', {}, 'job'));
  if (!message) {
    reasonList.push(t('adminpda-missing-message', {}, 'message text'));
  }
  return reasonList.join(', ');
}

function MessageInput(props: MessageInputProps) {
  const t = useT();
  const { act } = useBackend();

  const [messageText, setMessageText] = useState('');
  const [force, setForce] = useState(false);

  const [user] = props.userState;
  const [name] = props.nameState;
  const [job] = props.jobState;
  const [spam] = props.spamState;
  const [showInvisible] = props.invisibleState;

  const blocked = !name || !job || !messageText;

  return (
    <Section
      title={t('adminpda-section-message', {}, 'Message')}
      textAlign="center"
    >
      <Box>
        <TextArea
          fluid
          placeholder={t(
            'adminpda-message-placeholder',
            {},
            'Type the message you want to send...',
          )}
          height="200px"
          mb={1}
          onChange={setMessageText}
        />
      </Box>
      <Box>
        <Button.Checkbox
          fluid
          checked={force}
          tooltip={t(
            'adminpda-force-tooltip',
            {},
            'This will immediately broadcast the message, bypassing telecomms altogether.',
          )}
          onClick={() => setForce(!force)}
        >
          {t('adminpda-force', {}, 'Force send the message?')}
        </Button.Checkbox>
        <Button
          tooltip={
            blocked
              ? t(
                  'adminpda-fill-fields',
                  {
                    fields: getErrorText(
                      t,
                      name,
                      job,
                      messageText,
                      spam || !!user,
                    ),
                  },
                  `Fill in the following lines: ${getErrorText(t, name, job, messageText, spam || !!user)}`,
                )
              : t('adminpda-send-tooltip', {}, 'Send message to user(s)')
          }
          fluid
          disabled={blocked}
          icon="envelope-open-text"
          onClick={() =>
            act('sendMessage', {
              force: force,
              include_invisible: showInvisible,
              job: job,
              message: messageText,
              name: name,
              ref: user,
              spam: spam,
            })
          }
        >
          {t('adminpda-send', {}, 'Send Message')}
        </Button>
      </Box>
    </Section>
  );
}
