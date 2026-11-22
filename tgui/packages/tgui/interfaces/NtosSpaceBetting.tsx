import { useState } from 'react';
import {
  Box,
  Button,
  Collapsible,
  Divider,
  Icon,
  Input,
  NumberInput,
  Section,
  Stack,
  TextArea,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { NtosWindow } from '../layouts';

type Data = {
  active_bets: ActiveBets[];
  bank_name: string;
  bank_money: number;
  can_create_bet: BooleanLike;
  max_title_length: number;
  max_description_length: number;
};

type ActiveBets = {
  name: string;
  description: string;
  owner: BooleanLike;
  creator: string;
  current_bets: CurrentBets[];
  locked: BooleanLike;
};

type CurrentBets = {
  option_name: string;
  total_amount: number;
  personally_invested: number;
};

export const NtosSpaceBetting = () => {
  const { act, data } = useBackend<Data>();
  const { bank_name, bank_money, can_create_bet } = data;
  const t = useT();
  return (
    <NtosWindow width={500} height={620}>
      <NtosWindow.Content scrollable>
        <Section title={t('ntosspacebetting-user', {}, 'User Information')}>
          <Stack>
            <Stack.Item mr={1.5}>
              <Icon
                name="id-card"
                size={3}
                mr={1}
                color={bank_name ? 'green' : 'red'}
              />
            </Stack.Item>
            <Stack fill vertical>
              <Stack.Item>
                {t(
                  'ntosspacebetting-username',
                  { name: bank_name },
                  `Username: ${bank_name}`,
                )}
              </Stack.Item>
              <Stack.Item>
                {t(
                  'ntosspacebetting-money',
                  { money: bank_money },
                  `Money Available: ${bank_money}cr`,
                )}
              </Stack.Item>
            </Stack>
          </Stack>
        </Section>
        <PollsSection />
        {!!can_create_bet && <BettingCreation />}
      </NtosWindow.Content>
    </NtosWindow>
  );
};

export const PollsSection = () => {
  const { act, data } = useBackend<Data>();
  const { active_bets = [] } = data;
  const t = useT();
  const [Winner, set_winner] = useState('');
  return (
    <Section>
      {!active_bets.length ? (
        <Box>
          {t(
            'ntosspacebetting-no-polls',
            {},
            "There's currently no active polls to bet on, create one below!",
          )}
        </Box>
      ) : (
        active_bets.map(
          (
            { name, description, owner, creator, current_bets = [], locked },
            index,
          ) => (
            <Section title={t(
                'ntosspacebetting-poll-title',
                { name, creator },
                `${name} - Created by ${creator}`,
              )} key={name}>
              <Stack>
                <Stack.Item grow>
                  <Stack.Item grow>{description}</Stack.Item>
                  <Divider />
                  {current_bets.map(
                    (
                      { option_name, total_amount, personally_invested },
                      index,
                    ) => (
                      <Stack.Item
                        grow
                        key={option_name}
                        className="candystripe"
                        my={1.5}
                      >
                        <Stack.Item>
                          <Stack.Item my={1}>
                            {t(
                              'ntosspacebetting-option',
                              { name: option_name, amount: total_amount || 0 },
                              `${option_name} (Has ${total_amount || 0}cr bet on it)`,
                            )}
                            {!owner ? (
                              <NumberInput
                                value={personally_invested}
                                unit="cr"
                                width="15px"
                                disabled={!!locked}
                                minValue={0}
                                maxValue={10000}
                                step={1}
                                onChange={(value) =>
                                  act('place_bet', {
                                    bet_selected: name,
                                    option_selected: option_name,
                                    money_betting: value,
                                  })
                                }
                              />
                            ) : (
                              <Button.Checkbox
                                tooltip={t(
                                  'ntosspacebetting-winner-tooltip',
                                  {},
                                  'Whether this answer won.',
                                )}
                                checked={Winner === option_name}
                                key={option_name}
                                onClick={() => set_winner(option_name)}
                              />
                            )}
                          </Stack.Item>
                        </Stack.Item>
                      </Stack.Item>
                    ),
                  )}
                  {!!owner &&
                    (!locked ? (
                      <Stack.Item>
                        <Button.Confirm
                          fluid
                          icon="minus"
                          tooltip={t(
                            'ntosspacebetting-lock-tooltip',
                            {},
                            'Lock the ability to place/retract bets. This is irreversible!',
                          )}
                          onClick={() =>
                            act('lock_betting', { bet_selected: name })
                          }
                        >
                          {t('ntosspacebetting-lock', {}, 'Lock Betting')}
                        </Button.Confirm>
                      </Stack.Item>
                    ) : (
                      <Button.Confirm
                        fluid
                        icon="plus"
                        tooltip={t(
                          'ntosspacebetting-finalize-tooltip',
                          {},
                          'Finalize results as the checked answer being the winner.',
                        )}
                        onClick={() =>
                          act('select_winner', {
                            bet_selected: name,
                            winning_answer: Winner,
                          })
                        }
                      >
                        {t(
                          'ntosspacebetting-finalize',
                          {},
                          'Finalize Results',
                        )}
                      </Button.Confirm>
                    ))}
                </Stack.Item>
                <Stack.Item>
                  <Button
                    fluid
                    icon="minus"
                    disabled={locked}
                    tooltip={t(
                      'ntosspacebetting-cancel-tooltip',
                      {},
                      'If you have any bets, this will remove them and refund the money.',
                    )}
                    onClick={() => act('cancel_bet', { bet_selected: name })}
                  >
                    {t('ntosspacebetting-cancel', {}, 'Cancel Bet')}
                  </Button>
                </Stack.Item>
              </Stack>
            </Section>
          ),
        )
      )}
    </Section>
  );
};

export const BettingCreation = () => {
  const { act, data } = useBackend<Data>();
  const { max_title_length, max_description_length } = data;
  const t = useT();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [option4, setOption4] = useState('');

  return (
    <Collapsible title={t('ntosspacebetting-create-title', {}, 'Bet Creation')}>
      <Stack fill vertical>
        <Stack.Item grow>
          <Input
            fluid
            placeholder={t('ntosspacebetting-field-title', {}, 'Title')}
            maxLength={max_title_length}
            onChange={setTitle}
          />
        </Stack.Item>
        <Stack.Item grow>
          <TextArea
            fluid
            placeholder={t(
              'ntosspacebetting-field-description',
              {},
              'Description',
            )}
            height="100px"
            width="100%"
            maxLength={max_description_length}
            backgroundColor="black"
            textColor="white"
            onChange={setDescription}
          />
        </Stack.Item>
        <Input
          fluid
          placeholder={t('ntosspacebetting-option-1', {}, 'Option 1')}
          maxLength={max_title_length}
          onChange={setOption1}
        />
        <Input
          fluid
          placeholder={t('ntosspacebetting-option-2', {}, 'Option 2')}
          maxLength={max_title_length}
          onChange={setOption2}
        />
        <Input
          fluid
          placeholder={t(
            'ntosspacebetting-option-3',
            {},
            'Option 3 (Optional)',
          )}
          maxLength={max_title_length}
          onChange={setOption3}
        />
        <Input
          fluid
          placeholder={t(
            'ntosspacebetting-option-4',
            {},
            'Option 4 (Optional)',
          )}
          maxLength={max_title_length}
          onChange={setOption4}
        />
        <Stack.Item grow>
          <Button
            fluid
            onClick={() =>
              act('create_bet', {
                title,
                description,
                option1,
                option2,
                option3,
                option4,
              })
            }
          >
            {t('ntosspacebetting-create', {}, 'Create Bet!')}
          </Button>
        </Stack.Item>
      </Stack>
    </Collapsible>
  );
};
