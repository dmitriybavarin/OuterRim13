import { Icon, Section, Stack } from 'tgui-core/components';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';
import { type Objective, ObjectivePrintout } from './common/Objectives';

type Info = {
  objectives: Objective[];
  nation: string;
  nationColor: string;
};

export const AntagInfoSeparatist = (props) => {
  const { data } = useBackend<Info>();
  const { nationColor } = data;
  return (
    <Window width={620} height={450}>
      <Window.Content backgroundColor={nationColor}>
        <Stack vertical fill>
          <Stack.Item grow>
            <IntroductionObjectives />
          </Stack.Item>
          <Stack.Item>
            <FrequentlyAskedQuestions />
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
};

const IntroductionObjectives = (props) => {
  const { data } = useBackend<Info>();
  const t = useT();
  const { nation, objectives } = data;
  return (
    <Section fill>
      <Stack vertical>
        <Stack.Item textColor="red" fontSize="20px">
          {t('antaginfo-separatist-title', { nation })}
        </Stack.Item>
        <Stack.Item grow>
          <ObjectivePrintout
            objectives={objectives}
            titleMessage={t('antaginfo-separatist-objectives', { nation })}
          />
        </Stack.Item>
      </Stack>
    </Section>
  );
};

const FrequentlyAskedQuestions = (props) => {
  const { data } = useBackend<Info>();
  const t = useT();
  const { nation } = data;
  return (
    <Section fill>
      <Stack vertical>
        <Stack.Item fontSize="18px" bold>
          <Icon name="info" color="label" /> {t('antaginfo-separatist-faq')}
        </Stack.Item>
        <Stack.Item fontSize="16px">
          {t('antaginfo-separatist-q1')}
        </Stack.Item>
        <Stack.Item>
          {t('antaginfo-separatist-a1')}
        </Stack.Item>
        <Stack.Item fontSize="16px">
          {t('antaginfo-separatist-q2')}
        </Stack.Item>
        <Stack.Item>
          {t('antaginfo-separatist-a2')}
        </Stack.Item>
        <Stack.Item fontSize="16px">
          {t('antaginfo-separatist-q3', { nation })}
        </Stack.Item>
        <Stack.Item>{t('antaginfo-separatist-a3')}</Stack.Item>
      </Stack>
    </Section>
  );
};
