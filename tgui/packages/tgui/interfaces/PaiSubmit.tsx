import { useState } from 'react';
import { Box, Button, Input, Section, Stack } from 'tgui-core/components';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  comments: string;
  description: string;
  name: string;
};

const PAI_DESCRIPTION = `Personal AIs are advanced models capable of nuanced
interaction. They are designed to assist their masters in their work. They
do not possess hands, thus they cannot interact with equipment or items. While
in hologram form, you cannot be directly killed, but you may be incapacitated.`;

const PAI_RULES = `You are expected to role play to some degree. Keep in mind:
Not entering information may lead to you not being selected. Press submit to
alert pAI cards of your candidacy.`;

export const PaiSubmit = (props) => {
  const { data } = useBackend<Data>();
  const { comments, description, name } = data;
  const t = useT();
  const [input, setInput] = useState({
    comments,
    description,
    name,
  });

  return (
    <Window
      width={400}
      height={460}
      title={t('paisubmit-title', {}, 'pAI Candidacy Menu')}
    >
      <Window.Content>
        <Stack fill vertical>
          <Stack.Item grow>
            <DetailsDisplay />
          </Stack.Item>
          <Stack.Item>
            <InputDisplay input={input} setInput={setInput} />
          </Stack.Item>
          <Stack.Item>
            <ButtonsDisplay input={input} />
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
};

/** Displays basic info about playing pAI */
const DetailsDisplay = (props) => {
  const t = useT();
  return (
    <Section
      fill
      scrollable
      title={t('paisubmit-details', {}, 'Details')}
    >
      <Box color="label">
        {t('paisubmit-description', {}, PAI_DESCRIPTION)}
        <br />
        <br />
        {t('paisubmit-rules', {}, PAI_RULES)}
      </Box>
    </Section>
  );
};

/** Input boxes for submission details */
const InputDisplay = (props) => {
  const { input, setInput } = props;
  const { name, description, comments } = input;
  const t = useT();

  return (
    <Section fill title={t('paisubmit-input', {}, 'Input')}>
      <Stack fill vertical>
        <Stack.Item>
          <Box bold color="label">
            {t('paisubmit-name', {}, 'Name')}
          </Box>
          <Input
            fluid
            maxLength={41}
            value={name}
            onChange={(value) => setInput({ ...input, name: value })}
          />
        </Stack.Item>
        <Stack.Item>
          <Box bold color="label">
            {t('paisubmit-field-description', {}, 'Description')}
          </Box>
          <Input
            fluid
            maxLength={100}
            value={description}
            onChange={(value) => setInput({ ...input, description: value })}
          />
        </Stack.Item>
        <Stack.Item>
          <Box bold color="label">
            {t('paisubmit-ooc-comments', {}, 'OOC Comments')}
          </Box>
          <Input
            fluid
            maxLength={100}
            value={comments}
            onChange={(value) => setInput({ ...input, comments: value })}
          />
        </Stack.Item>
      </Stack>
    </Section>
  );
};

/** Gives the user a submit button */
const ButtonsDisplay = (props) => {
  const { act } = useBackend<Data>();
  const { input } = props;
  const { comments, description, name } = input;
  const t = useT();

  return (
    <Section fill>
      <Stack>
        <Stack.Item>
          <Button
            onClick={() => act('save', { comments, description, name })}
            tooltip={t(
              'paisubmit-save-tooltip',
              {},
              'Saves your candidate data locally.',
            )}
          >
            {t('paisubmit-save', {}, 'SAVE')}
          </Button>
        </Stack.Item>
        <Stack.Item>
          <Button
            onClick={() => act('load')}
            tooltip={t(
              'paisubmit-load-tooltip',
              {},
              'Loads saved candidate data, if any.',
            )}
          >
            {t('paisubmit-load', {}, 'LOAD')}
          </Button>
        </Stack.Item>
        <Stack.Item>
          <Button
            onClick={() =>
              act('submit', {
                comments,
                description,
                name,
              })
            }
          >
            {t('paisubmit-submit', {}, 'SUBMIT')}
          </Button>
        </Stack.Item>
        <Stack.Item>
          <Button
            onClick={() => act('withdraw')}
            tooltip={t(
              'paisubmit-withdraw-tooltip',
              {},
              'Withdraws your pAI candidacy, if any.',
            )}
          >
            {t('paisubmit-withdraw', {}, 'WITHDRAW')}
          </Button>
        </Stack.Item>
      </Stack>
    </Section>
  );
};
