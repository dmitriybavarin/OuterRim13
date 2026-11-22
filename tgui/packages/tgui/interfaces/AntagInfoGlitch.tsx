import { Section, Stack } from 'tgui-core/components';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';
import type { Objective } from './common/Objectives';

type Data = {
  antag_name: string;
  objectives: Objective[];
};

const textStyles = {
  variable: {
    color: 'white',
  },
  danger: {
    color: 'red',
  },
} as const;

export const AntagInfoGlitch = (props) => {
  const { data } = useBackend<Data>();
  const { antag_name, objectives = [] } = data;
  const t = useT();

  return (
    <Window width={350} height={450} theme="ntos_terminal">
      <Window.Content>
        <Section scrollable fill>
          <Stack fill vertical>
            <Stack.Item>FN TERMINATE_INTRUDERS (REF)</Stack.Item>
            <Stack.Divider />
            <Stack.Item bold fontSize="16px">
              <span style={textStyles.variable}>Initialize({antag_name})</span>
            </Stack.Item>
            <Stack.Item mb={1}>
              <span style={textStyles.danger}>
                {t('antaginfo-glitch-crime-name')}
              </span>{' '}
              {t('antaginfo-glitch-crime-mid')}{' '}
              <span style={textStyles.variable}>
                {t('antaginfo-glitch-eliminate')}
              </span>{' '}
              {t('antaginfo-glitch-crime-post')}
            </Stack.Item>
            <SpecificInfo />

            <Stack.Divider />
            <Stack.Item>
              <span style={{ opacity: 0.6 }}>
                &#47;&#47; {objectives[0]?.explanation}
              </span>
            </Stack.Item>
            <Stack.Item>
              const <span style={textStyles.variable}>TARGETS</span> ={' '}
            </Stack.Item>
            <Stack.Item>
              <span style={textStyles.variable}>system.</span>
              <span style={textStyles.danger}>INTRUDERS</span>
            </Stack.Item>
            <Stack.Item>
              while <span style={textStyles.variable}>TARGETS</span>.LIFE !={' '}
              <span style={textStyles.variable}>stat.</span>DEAD
            </Stack.Item>
            <Stack.Item>
              <span style={textStyles.variable}>action.</span>
              <span style={textStyles.danger}>KILL()</span>
            </Stack.Item>
            <Stack.Item>terminate_intruders([0x70cf4020])</Stack.Item>
          </Stack>
        </Section>
      </Window.Content>
    </Window>
  );
};

const SpecificInfo = (props) => {
  const { data } = useBackend<Data>();
  const { antag_name } = data;
  const t = useT();

  switch (antag_name) {
    case 'Cyber Police':
      return (
        <>
          <Stack.Item mb={1}>
            {t('antaginfo-glitch-police-pre')}{' '}
            <span style={textStyles.variable}>
              {t('antaginfo-glitch-police-skills')}
            </span>{' '}
            {t('antaginfo-glitch-police-post')}
          </Stack.Item>
          <Stack.Item grow>
            {t('antaginfo-glitch-police-ranged-pre')}{' '}
            <span style={textStyles.danger}>
              {t('antaginfo-glitch-police-forbidden')}
            </span>
            {t('antaginfo-glitch-police-ranged-post')}
          </Stack.Item>
        </>
      );
    case 'Cyber Tac':
      return (
        <>
          <Stack.Item mb={1}>
            {t('antaginfo-glitch-tac-pre')}{' '}
            <span style={textStyles.variable}>
              {t('antaginfo-glitch-tac-weapons')}
            </span>
            .
          </Stack.Item>
          <Stack.Item grow>
            <span style={textStyles.danger}>
              {t('antaginfo-glitch-tac-terminate')}
            </span>{' '}
            {t('antaginfo-glitch-tac-cost')}
          </Stack.Item>
        </>
      );
    case 'NetGuardian Prime':
      return (
        <Stack.Item grow>
          <span style={{ ...textStyles.danger, fontSize: '16px' }}>
            {t('antaginfo-glitch-prime')}
          </span>
        </Stack.Item>
      );
    default:
      return null;
  }
};
