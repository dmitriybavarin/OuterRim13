import { type Dispatch, type SetStateAction, useState } from 'react';
import {
  Box,
  Button,
  Input,
  NoticeBox,
  Section,
  Stack,
  Table,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

enum Screen {
  Main,
  MessageLogs,
  RequestLogs,
  Hacked,
}

type Data = {
  screen: Screen;
  status: BooleanLike;
  server_status: BooleanLike;
  auth: BooleanLike;
  password: string;
  is_malf: BooleanLike;
  error_message: string;
  success_message: string;
  notice_message: string;
  requests: Request[];
  messages: Message[];
  is_on_station: BooleanLike;
};

type Request = {
  ref: string;
  message: string;
  stamp: string;
  sender_department: string;
  id_auth: string;
};

type Message = {
  ref: string;
  message: string;
  sender: string;
  recipient: string;
};

const RequestLogsScreen = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { requests = [] } = data;
  return (
    <Stack fill vertical>
      <Stack.Item grow>
        <Section
          fill
          scrollable
          title={t('messagemonitor-requests', {}, 'Requests')}
          buttons={
            <Button
              content={t('messagemonitor-main-menu', {}, 'Main Menu')}
              icon="home"
              onClick={() => act('return_home')}
            />
          }
        >
          <Table>
            <Table.Row header>
              <Table.Cell>{t('messagemonitor-delete', {}, 'Delete')}</Table.Cell>
              <Table.Cell>{t('messagemonitor-message', {}, 'Message')}</Table.Cell>
              <Table.Cell>{t('messagemonitor-stamp', {}, 'Stamp')}</Table.Cell>
              <Table.Cell>{t('messagemonitor-department', {}, 'Department')}</Table.Cell>
              <Table.Cell>
                {t('messagemonitor-authentication', {}, 'Authentication')}
              </Table.Cell>
            </Table.Row>
            {requests?.map((request) => (
              <Table.Row key={request.ref} className="candystripe">
                <Table.Cell>
                  <Button
                    icon="trash"
                    color="red"
                    onClick={() => act('delete_request', { ref: request.ref })}
                  />
                </Table.Cell>
                <Table.Cell>{request.message}</Table.Cell>
                <Table.Cell>{request.stamp}</Table.Cell>
                <Table.Cell>{request.sender_department}</Table.Cell>
                <Table.Cell>{request.id_auth}</Table.Cell>
              </Table.Row>
            ))}
          </Table>
        </Section>
      </Stack.Item>
    </Stack>
  );
};

const MessageLogsScreen = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { messages = [] } = data;
  return (
    <Stack fill vertical>
      <Stack.Item grow>
        <Section
          fill
          scrollable
          title={t('messagemonitor-stored', {}, 'Stored Messages')}
          buttons={
            <Button
              content={t('messagemonitor-main-menu', {}, 'Main Menu')}
              icon="home"
              onClick={() => act('return_home')}
            />
          }
        >
          <Table>
            <Table.Row header>
              <Table.Cell>{t('messagemonitor-delete', {}, 'Delete')}</Table.Cell>
              <Table.Cell>{t('messagemonitor-sender', {}, 'Sender')}</Table.Cell>
              <Table.Cell>{t('messagemonitor-recipient', {}, 'Recipient')}</Table.Cell>
              <Table.Cell>{t('messagemonitor-message', {}, 'Message')}</Table.Cell>
            </Table.Row>
            {messages?.map((message) => (
              <Table.Row key={message.ref} className="candystripe">
                <Table.Cell>
                  <Button
                    icon="trash"
                    color="red"
                    onClick={() => act('delete_message', { ref: message.ref })}
                  />
                </Table.Cell>
                <Table.Cell>{message.sender}</Table.Cell>
                <Table.Cell>{message.recipient}</Table.Cell>
                <Table.Cell>
                  <Box
                    as="span"
                    dangerouslySetInnerHTML={{ __html: message.message }}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table>
        </Section>
      </Stack.Item>
    </Stack>
  );
};

const HackedScreen = (props) => {
  return (
    <Stack.Item grow>
      <Stack fill vertical>
        <Stack.Item grow />
        <Stack.Item align="center" grow>
          <Box color="red" fontSize="18px" bold mt={5}>
            E%*#OR: CRIT#%^CAL Ss&@STEM Fai++~|URE...
          </Box>
          <Box color="red" fontSize="18px" bold mt={5}>
            EN*bLING u&*E REB-00T ProT/.\;L...
          </Box>
        </Stack.Item>
      </Stack>
    </Stack.Item>
  );
};

const MainScreenAuth = (props: AuthScreenProps) => {
  const t = useT();
  const { auth_password, setPassword } = props;

  const { act, data } = useBackend<Data>();
  const { status, is_malf, is_on_station } = data;

  return (
    <>
      <Stack.Item>
        <Section>
          <Input
            value={auth_password}
            onChange={setPassword}
            placeholder={t('messagemonitor-password', {}, 'Password')}
          />
          <Button
            content={t('messagemonitor-logout', {}, 'Logout')}
            onClick={() => act('auth', { auth_password: auth_password })}
          />
          <Button
            icon={status ? 'power-off' : 'times'}
            content={
              status
                ? t('messagemonitor-on', {}, 'ON')
                : t('messagemonitor-off', {}, 'OFF')
            }
            color={status ? 'green' : 'red'}
            onClick={() => act('turn_server')}
          />
          {is_malf === 1 && (
            <Button
              icon="terminal"
              content={t('messagemonitor-hack', {}, 'Hack')}
              color="red"
              disabled
              onClick={() => act('hack')}
            />
          )}
        </Section>
      </Stack.Item>
      <Table>
        <Table.Row header>
          <Table.Cell>{t('messagemonitor-option', {}, 'Option')}</Table.Cell>
          <Table.Cell>
            {t('messagemonitor-description', {}, 'Description')}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <Button
              content={t('messagemonitor-view-messages', {}, 'View Message Logs')}
              onClick={() => act('view_message_logs')}
            />
          </Table.Cell>
          <Table.Cell>
            {t(
              'messagemonitor-view-messages-desc',
              {},
              'Shows all messages that have been sent',
            )}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <Button
              content={t(
                'messagemonitor-view-requests',
                {},
                'View Request Console Logs',
              )}
              onClick={() => act('view_request_logs')}
            />
          </Table.Cell>
          <Table.Cell>
            {t(
              'messagemonitor-view-requests-desc',
              {},
              'Shows all orders that were made in the cargo department',
            )}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <Button.Confirm
              content={t('messagemonitor-clear-messages', {}, 'Clear Message Logs')}
              onClick={() => act('clear_message_logs')}
            />
          </Table.Cell>
          <Table.Cell>
            {t('messagemonitor-clear-messages-desc', {}, 'Clears message logs')}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <Button.Confirm
              content={t(
                'messagemonitor-clear-requests',
                {},
                'Clear Request Console Logs',
              )}
              onClick={() => act('clear_request_logs')}
            />
          </Table.Cell>
          <Table.Cell>
            {t(
              'messagemonitor-clear-requests-desc',
              {},
              'Clears request console logs',
            )}
          </Table.Cell>
        </Table.Row>
        {!!is_on_station && (
          <Table.Row>
            <Table.Cell>
              <Button
                content={t('messagemonitor-set-key', {}, 'Set Custom Key')}
                onClick={() => act('set_key')}
              />
            </Table.Cell>
            <Table.Cell>
              {t('messagemonitor-set-key-desc', {}, 'Changes decryption key')}
            </Table.Cell>
          </Table.Row>
        )}
        <Table.Row>
          <Table.Cell>
            <Button
              content={t('messagemonitor-send-admin', {}, 'Send Admin Message')}
              onClick={() => act('send_fake_message')}
            />
          </Table.Cell>
          <Table.Cell>
            {t(
              'messagemonitor-send-admin-desc',
              {},
              "Sends a custom message to the user's PDA",
            )}
          </Table.Cell>
        </Table.Row>
      </Table>
    </>
  );
};

type AuthScreenProps = {
  auth_password: string;
  setPassword: Dispatch<SetStateAction<string>>;
};

const MainScreenNotAuth = (props: AuthScreenProps) => {
  const t = useT();
  const { auth_password, setPassword } = props;
  const { act, data } = useBackend<Data>();
  const { status, is_malf } = data;

  return (
    <>
      <Stack.Item>
        <Section>
          <Input
            value={auth_password}
            onChange={setPassword}
            placeholder={t('messagemonitor-password', {}, 'Password')}
          />
          <Button onClick={() => act('auth', { auth_password: auth_password })}>
            {t('messagemonitor-auth', {}, 'Auth')}
          </Button>
          <Button
            icon={status ? 'power-off' : 'times'}
            color={status ? 'green' : 'red'}
            disabled
            onClick={() => act('turn_server')}
          >
            {status
              ? t('messagemonitor-on', {}, 'ON')
              : t('messagemonitor-off', {}, 'OFF')}
          </Button>
          {!!is_malf && (
            <Button color="red" onClick={() => act('hack')}>
              {t('messagemonitor-hack', {}, 'Hack')}
            </Button>
          )}
        </Section>
      </Stack.Item>
      <Stack.Item grow>
        <Section fill scrollable title={t('messagemonitor-choose', {}, 'Choose Option')}>
          <Table>
            <Table.Row header>
              <Table.Cell>{t('messagemonitor-option', {}, 'Option')}</Table.Cell>
              <Table.Cell>
            {t('messagemonitor-description', {}, 'Description')}
          </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <Button
                  content={t('messagemonitor-link', {}, 'Link Server')}
                  onClick={() => act('link_server')}
                />
              </Table.Cell>
              <Table.Cell>
                {t('messagemonitor-link-desc', {}, 'Connects to the server')}
              </Table.Cell>
            </Table.Row>
          </Table>
        </Section>
      </Stack.Item>
    </>
  );
};

const MainScreen = (props) => {
  const { data } = useBackend<Data>();
  const { auth, password } = data;

  const [auth_password, setPassword] = useState(password);

  return (
    <Stack fill vertical>
      {auth ? (
        <MainScreenAuth
          auth_password={auth_password}
          setPassword={setPassword}
        />
      ) : (
        <MainScreenNotAuth
          auth_password={auth_password}
          setPassword={setPassword}
        />
      )}
    </Stack>
  );
};

export const MessageMonitor = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const {
    screen,
    error_message,
    success_message,
    notice_message,
    server_status,
  } = data;
  return (
    <Window width={700} height={400}>
      <Window.Content>
        <Stack vertical fill>
          {server_status ? (
            <>
              <Stack.Item>
                {!!error_message && (
                  <NoticeBox color="red">{error_message}</NoticeBox>
                )}
              </Stack.Item>
              <Stack.Item>
                {!!success_message && (
                  <NoticeBox color="green">{success_message}</NoticeBox>
                )}
              </Stack.Item>
              <Stack.Item grow>
                {(screen === Screen.Main && <MainScreen />) ||
                  (screen === Screen.MessageLogs && <MessageLogsScreen />) ||
                  (screen === Screen.RequestLogs && <RequestLogsScreen />) ||
                  (screen === Screen.Hacked && <HackedScreen />)}
              </Stack.Item>
              <Stack.Item>
                {!!notice_message && (
                  <NoticeBox color="yellow">{notice_message}</NoticeBox>
                )}
              </Stack.Item>
              <label>
                {t(
                  'messagemonitor-regulation',
                  {},
                  'Reg. #514 forbids sending messages to a Head of Staff containing Erotic Rendering Properties.',
                )}
              </label>
            </>
          ) : (
            <>
              <Stack.Item>
                <NoticeBox color="red">
                  {t(
                    'messagemonitor-no-server',
                    {},
                    'Server not found, click button to scan the network',
                  )}
                </NoticeBox>
              </Stack.Item>
              <Stack.Item>
                <Button
                  content={t('messagemonitor-connect', {}, 'Connect to server')}
                  onClick={() => act('connect_server')}
                />
              </Stack.Item>
            </>
          )}
        </Stack>
      </Window.Content>
    </Window>
  );
};
