import { Box, Icon, Section, Stack } from 'tgui-core/components';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';
import { type Objective, ObjectivePrintout } from './common/Objectives';

type Data = {
  objectives: Objective[];
};

export const AntagInfoBrainwashed = (porps) => {
  const { data } = useBackend<Data>();
  const t = useT();

  return (
    <Window width={400} height={400} theme="abductor">
      <Window.Content backgroundColor="#722e7d">
        <Icon
          size={16}
          name="flushed"
          color="#3f1945"
          position="absolute"
          top="42%"
          left="26%"
        />
        <Section fill>
          <Stack fill vertical g={0} textAlign="center">
            <Stack.Item fontFamily="Wingdings">
              {t('antaginfo-brainwashed-wingdings-top')}
            </Stack.Item>
            <Stack.Item fontSize="20px">{t('antaginfo-brainwashed-mind-reels')}</Stack.Item>
            <Stack.Item fontSize="20px">
              {t('antaginfo-brainwashed-single-purpose')}
            </Stack.Item>
            <Stack.Item mt={3.5} grow>
              <ObjectivePrintout
                fill
                objectives={data.objectives}
                objectiveFollowup={
                  <Box bold textColor="red">
                    {t('antaginfo-brainwashed-directive-followup')}
                  </Box>
                }
              />
            </Stack.Item>
            <Stack.Item mb={0.5} fontSize="20px" textColor="#61e4b9">
              {t('antaginfo-brainwashed-follow-directives')}
            </Stack.Item>
            <Stack.Item fontFamily="Wingdings">
              {t('antaginfo-brainwashed-wingdings-bottom')}
            </Stack.Item>
          </Stack>
        </Section>
      </Window.Content>
    </Window>
  );
};
