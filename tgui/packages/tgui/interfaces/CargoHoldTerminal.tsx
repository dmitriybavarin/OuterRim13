import {
  AnimatedNumber,
  Box,
  Button,
  LabeledList,
  Section,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  points: number;
  pad: string;
  sending: BooleanLike;
  status_report: string;
};

export const CargoHoldTerminal = (props) => {
  const { act, data } = useBackend<Data>();
  const { points, pad, sending, status_report } = data;
  const t = useT();

  return (
    <Window width={600} height={230}>
      <Window.Content scrollable>
        <Section>
          <LabeledList>
            <LabeledList.Item label={t('cargohold-value', {}, 'Current Cargo Value')}>
              <Box inline bold>
                <AnimatedNumber value={Math.round(points)} />{' '}
                {t('cargohold-credits', {}, 'credits')}
              </Box>
            </LabeledList.Item>
          </LabeledList>
        </Section>
        <Section
          title={t('cargohold-pad', {}, 'Cargo Pad')}
          buttons={
            <>
              <Button
                icon={'sync'}
                content={t('cargohold-recalc', {}, 'Recalculate Value')}
                disabled={!pad}
                onClick={() => act('recalc')}
              />
              <Button
                icon={sending ? 'times' : 'arrow-up'}
                content={
                  sending
                    ? t('cargohold-stop', {}, 'Stop Sending')
                    : t('cargohold-send', {}, 'Send Goods')
                }
                selected={sending}
                disabled={!pad}
                onClick={() => act(sending ? 'stop' : 'send')}
              />
            </>
          }
        >
          <LabeledList>
            <LabeledList.Item label={t('cargohold-status', {}, 'Status')} color={pad ? 'good' : 'bad'}>
              {pad
                ? t('cargohold-online', {}, 'Online')
                : t('cargohold-not-found', {}, 'Not Found')}
            </LabeledList.Item>
            <LabeledList.Item label={t('cargohold-report', {}, 'Cargo Report')}>
              {status_report}
            </LabeledList.Item>
          </LabeledList>
        </Section>
      </Window.Content>
    </Window>
  );
};
