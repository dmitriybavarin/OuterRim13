import {
  Box,
  Button,
  LabeledList,
  NoticeBox,
  ProgressBar,
  Section,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  AI_present: BooleanLike;
  error: BooleanLike;
  name: string;
  laws: string[];
  isDead: BooleanLike;
  restoring: BooleanLike;
  health: number;
  ejectable: BooleanLike;
};

export const AiRestorer = () => {
  return (
    <Window width={370} height={360}>
      <Window.Content scrollable>
        <AiRestorerContent />
      </Window.Content>
    </Window>
  );
};

export const AiRestorerContent = (props) => {
  const { act, data } = useBackend<Data>();
  const {
    AI_present,
    error,
    name,
    laws,
    isDead,
    restoring,
    health,
    ejectable,
  } = data;
  const t = useT();

  return (
    <>
      {error && <NoticeBox textAlign="center">{error}</NoticeBox>}
      {!!ejectable && (
        <Button
          fluid
          icon="eject"
          content={AI_present ? name : '----------'}
          disabled={!AI_present}
          onClick={() => act('PRG_eject')}
        />
      )}
      {!!AI_present && (
        <Section
          title={ejectable ? t('airestorer-status', {}, 'System Status') : name}
          buttons={
            <Box inline bold color={isDead ? 'bad' : 'good'}>
              {isDead
                ? t('airestorer-nonfunctional', {}, 'Nonfunctional')
                : t('airestorer-functional', {}, 'Functional')}
            </Box>
          }
        >
          <LabeledList>
            <LabeledList.Item label={t('airestorer-integrity', {}, 'Integrity')}>
              <ProgressBar
                value={health}
                minValue={0}
                maxValue={100}
                ranges={{
                  good: [70, Infinity],
                  average: [50, 70],
                  bad: [-Infinity, 50],
                }}
              />
            </LabeledList.Item>
          </LabeledList>
          {!!restoring && (
            <Box bold textAlign="center" fontSize="20px" color="good" mt={1}>
              {t('airestorer-progress', {}, 'RECONSTRUCTION IN PROGRESS')}
            </Box>
          )}
          <Button
            fluid
            icon="plus"
            content={t('airestorer-begin', {}, 'Begin Reconstruction')}
            disabled={restoring}
            mt={1}
            onClick={() => act('PRG_beginReconstruction')}
          />
          <Section title={t('airestorer-laws', {}, 'Laws')}>
            {laws.map((law) => (
              <Box key={law} className="candystripe">
                {law}
              </Box>
            ))}
          </Section>
        </Section>
      )}
    </>
  );
};
