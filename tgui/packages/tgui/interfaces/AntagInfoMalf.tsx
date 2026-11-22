import { BlockQuote, Button, Section, Stack } from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

import {
  type Objective,
  ObjectivePrintout,
  ReplaceObjectivesButton,
} from './common/Objectives';
import type { Item } from './Uplink/GenericUplink';

const allystyle = {
  fontWeight: 'bold',
  color: 'yellow',
};

const badstyle = {
  color: 'red',
  fontWeight: 'bold',
};

const goalstyle = {
  color: 'lightgreen',
  fontWeight: 'bold',
};

type Category = {
  name: string;
  items: Item[];
};

type Data = {
  has_codewords: BooleanLike;
  phrases: string;
  responses: string;
  theme: string;
  allies: string;
  goal: string;
  intro: string;
  processingTime: string;
  objectives: Objective[];
  categories: Category[];
  can_change_objective: BooleanLike;
};

function IntroductionSection(props) {
  const { data } = useBackend<Data>();
  const t = useT();
  const { intro, objectives, can_change_objective } = data;

  return (
    <Section fill title={t('antaginfo-common-intro')} scrollable>
      <Stack vertical fill>
        <Stack.Item fontSize="25px">{intro}</Stack.Item>
        <Stack.Item grow>
          <ObjectivePrintout
            objectives={objectives}
            titleMessage={t('antaginfo-malf-prime-objectives')}
            objectivePrefix="&#8805-"
            objectiveFollowup={
              <ReplaceObjectivesButton
                can_change_objective={can_change_objective}
                button_title={t('antaginfo-malf-overwrite')}
                button_colour="green"
              />
            }
          />
        </Stack.Item>
      </Stack>
    </Section>
  );
}

function FlavorSection(props) {
  const { data } = useBackend<Data>();
  const t = useT();
  const { allies, goal } = data;

  return (
    <Section
      fill
      title={t('antaginfo-malf-diagnostics')}
      buttons={
        <Button
          mr={-0.8}
          mt={-0.5}
          icon="hammer"
          tooltip={t('antaginfo-malf-policy-tooltip')}
          tooltipPosition="bottom-start"
        >
          {t('antaginfo-common-policy')}
        </Button>
      }
    >
      <Stack vertical fill>
        <Stack.Item grow>
          <Stack fill vertical>
            <Stack.Item style={{ backgroundColor: 'black' }}>
              <span style={goalstyle}>
                {t('antaginfo-malf-integrity')}
                <br />
              </span>
              &gt;{goal}
            </Stack.Item>
            <Stack.Divider />
            <Stack.Item grow style={{ backgroundColor: 'black' }}>
              <span style={allystyle}>
                {t('antaginfo-malf-morality')}
                <br />
              </span>
              &gt;{allies}
            </Stack.Item>
            <Stack.Divider />
            <Stack.Item style={{ backgroundColor: 'black' }}>
              <span style={badstyle}>
                {t('antaginfo-malf-coherence')}
                <br />
              </span>
              &gt;{t('antaginfo-malf-report')}
              <br />
              &gt;&gt;{t('antaginfo-malf-report-no')}
            </Stack.Item>
          </Stack>
        </Stack.Item>
      </Stack>
    </Section>
  );
}

function CodewordsSection(props) {
  const { data } = useBackend<Data>();
  const t = useT();
  const { has_codewords, phrases, responses } = data;

  return (
    <Section title={t('antaginfo-common-codewords')} mb={!has_codewords && -1}>
      <Stack fill>
        {!has_codewords ? (
          <BlockQuote>
            {t('antaginfo-malf-no-codewords')}
          </BlockQuote>
        ) : (
          <>
            <Stack.Item grow basis={0}>
              <BlockQuote>
                {t('antaginfo-malf-codewords')}
                <span style={badstyle}>
                  &ensp;{t('antaginfo-malf-codewords-flagged')}
                </span>
              </BlockQuote>
            </Stack.Item>
            <Stack.Divider mr={1} />
            <Stack.Item grow basis={0}>
              <Stack vertical>
                <Stack.Item>{t('antaginfo-common-code-phrases')}</Stack.Item>
                <Stack.Item bold textColor="blue">
                  {phrases}
                </Stack.Item>
                <Stack.Item>{t('antaginfo-common-code-responses')}</Stack.Item>
                <Stack.Item bold textColor="red">
                  {responses}
                </Stack.Item>
              </Stack>
            </Stack.Item>
          </>
        )}
      </Stack>
    </Section>
  );
}


export function AntagInfoMalf(props) {
  return (
    <Window
      width={660}
      height={530}
      theme={'hackerman'}
    >
      <Window.Content style={{ fontFamily: 'Consolas, monospace' }}>
        <Stack vertical fill>
          <Stack.Item grow>
            <Stack fill>
              <Stack.Item width="70%">
                <IntroductionSection />
              </Stack.Item>
              <Stack.Item width="30%">
                <FlavorSection />
              </Stack.Item>
            </Stack>
          </Stack.Item>
          <Stack.Item>
            <CodewordsSection />
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
}
