import { useState } from 'react';
import {
  Box,
  Button,
  Input,
  NoticeBox,
  Stack,
  TextArea,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type AdminhelpData = {
  adminCount: number;
  urgentAhelpEnabled: BooleanLike;
  bannedFromUrgentAhelp: BooleanLike;
  urgentAhelpPromptMessage: string;
};

export const Adminhelp = (props) => {
  const t = useT();
  const { act, data } = useBackend<AdminhelpData>();
  const {
    adminCount,
    urgentAhelpEnabled,
    bannedFromUrgentAhelp,
    urgentAhelpPromptMessage,
  } = data;
  const [requestForAdmin, setRequestForAdmin] = useState(false);
  const [currentlyInputting, setCurrentlyInputting] = useState(false);
  const [ahelpMessage, setAhelpMessage] = useState('');

  const confirmationText = 'alert admins';
  return (
    <Window
      title={t('adminhelp-title', {}, 'Create Adminhelp')}
      theme="admin"
      height={300}
      width={500}
    >
      <Window.Content
        style={{
          backgroundImage: 'none',
        }}
      >
        <Stack vertical fill>
          <Stack.Item grow>
            <TextArea
              autoFocus
              height="100%"
              fluid
              placeholder={t('adminhelp-placeholder', {}, 'Admin help')}
              onChange={setAhelpMessage}
            />
          </Stack.Item>
          {urgentAhelpEnabled && adminCount <= 0 && (
            <Stack.Item>
              <NoticeBox info>
                {urgentAhelpPromptMessage}
                {currentlyInputting ? (
                  <Box
                    mt={1}
                    width="100%"
                    fontFamily="arial"
                    backgroundColor="grey"
                    style={{
                      fontStyle: 'normal',
                    }}
                  >
                    {t(
                      'adminhelp-confirm-prompt',
                      { text: confirmationText },
                      `Input '${confirmationText}' to proceed.`,
                    )}
                    <Input
                      placeholder={t(
                        'adminhelp-confirm-placeholder',
                        {},
                        'Confirmation Prompt',
                      )}
                      autoFocus
                      fluid
                      onChange={(value) => {
                        if (value === confirmationText) {
                          setRequestForAdmin(true);
                          setCurrentlyInputting(false);
                        }
                      }}
                    />
                  </Box>
                ) : (
                  <Button
                    mt={1}
                    onClick={() => {
                      if (requestForAdmin) {
                        setRequestForAdmin(false);
                      } else {
                        setCurrentlyInputting(true);
                      }
                    }}
                    color={requestForAdmin ? 'orange' : 'blue'}
                    icon={requestForAdmin ? 'check-square-o' : 'square-o'}
                    disabled={bannedFromUrgentAhelp}
                    tooltip={
                      bannedFromUrgentAhelp
                        ? t(
                            'adminhelp-urgent-banned',
                            {},
                            'You are banned from using urgent ahelps.',
                          )
                        : undefined
                    }
                    fluid
                    textAlign="center"
                  >
                    {t('adminhelp-alert-admins', {}, 'Alert admins?')}
                  </Button>
                )}
              </NoticeBox>
            </Stack.Item>
          )}
          <Stack.Item>
            <Button
              color="good"
              fluid
              textAlign="center"
              onClick={() =>
                act('ahelp', {
                  urgent: requestForAdmin,
                  message: ahelpMessage,
                })
              }
            >
              {t('adminhelp-submit', {}, 'Submit')}
            </Button>
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
};
