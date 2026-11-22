import { Box, Button, NoticeBox, Section, Table } from 'tgui-core/components';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  previous_attempts: Attempts[];
  attempts_left: number;
};

type Attempts = {
  attempt: string;
  bulls: number;
  cows: number;
};

export const AbandonedCrate = (props) => {
  const { data } = useBackend<Data>();
  const t = useT();
  const { previous_attempts, attempts_left } = data;

  return (
    <Window width={335} height={180 + previous_attempts.length * 19}>
      <Window.Content scrollable>
        <Section
          title={t('abandonedcrate-title', {}, 'Deca-Code Lock')}
          buttons={
            <Button
              tooltip={t(
                'abandonedcrate-hint',
                {},
                'Codes are made of a series of non-repeating digits. Each wrong guess will return the number of correct digits in correct locations, and the number of correct digits in incorrect locations.',
              )}
              icon="info"
              tooltipPosition="top"
            />
          }
        >
          <NoticeBox color="bad">
            {t(
              'abandonedcrate-warning',
              { attempts: attempts_left },
              `Anti-Tamper Bomb will activate ${attempts_left === 1 ? 'on next failed access attempt.' : `after ${attempts_left} failed access attempts.`}`,
            )}
          </NoticeBox>
          <Table>
            {!!previous_attempts.length && (
              <Table.Row fontSize="125%" bold>
                <Table.Cell
                  collapsing
                  color="white"
                  textAlign="center"
                  pr="5px"
                >
                  {t('abandonedcrate-attempt', {}, 'Attempt')}
                </Table.Cell>
                <Table.Cell collapsing textAlign="center">
                  <Button
                    tooltip={t('abandonedcrate-correct', {}, 'Correct digits at correct positions')}
                    icon="check"
                    color="green"
                  />
                </Table.Cell>
                <Table.Cell collapsing textAlign="center">
                  <Button
                    tooltip={t('abandonedcrate-misplaced', {}, 'Correct digits at incorrect positions')}
                    icon="asterisk"
                    color="yellow"
                  />
                </Table.Cell>
              </Table.Row>
            )}
            {previous_attempts.map((previous_attempts) => (
              <Table.Row
                key={previous_attempts.attempt}
                style={{ borderTop: '2px solid #222' }}
              >
                <Table.Cell collapsing textAlign="center" pr="5px">
                  <Box color="white" inline fontSize="125%">
                    {previous_attempts.attempt}
                  </Box>
                </Table.Cell>
                <Table.Cell collapsing textAlign="center">
                  <Box color="green" inline fontSize="125%">
                    {previous_attempts.bulls}
                  </Box>
                </Table.Cell>
                <Table.Cell collapsing textAlign="center">
                  <Box color="yellow" inline fontSize="125%">
                    {previous_attempts.cows}
                  </Box>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table>
        </Section>
      </Window.Content>
    </Window>
  );
};
