import {
  AnimatedNumber,
  Box,
  Button,
  ProgressBar,
  Section,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  enabled: BooleanLike;
  dos_capacity: number;
  dos_overload: number;
  dos_crashed: BooleanLike;
};

const OUTAGE_WARNING = `This system is suffering temporary outage due to
overflow of traffic buffers. Until buffered traffic is processed, all
further requests will be dropped. Frequent occurences of this
error may indicate insufficient hardware capacity of your
network. Please contact your network planning department for
instructions on how to resolve this issue.`;

export const NtnetRelay = (props) => {
  const { act, data } = useBackend<Data>();
  const { enabled, dos_capacity, dos_overload, dos_crashed } = data;
  const t = useT();

  return (
    <Window title={t('ntnetrelay-title', {}, 'NtNet Quantum Relay')} width={400} height={300}>
      <Window.Content>
        <Section
          title={t('ntnetrelay-buffer', {}, 'Network Buffer')}
          buttons={
            <Button
              icon="power-off"
              selected={enabled}
              content={
                enabled
                  ? t('ntnetrelay-enabled', {}, 'ENABLED')
                  : t('ntnetrelay-disabled', {}, 'DISABLED')
              }
              onClick={() => act('toggle')}
            />
          }
        >
          {!dos_crashed ? (
            <ProgressBar
              value={dos_overload}
              minValue={0}
              maxValue={dos_capacity}
            >
              <AnimatedNumber value={dos_overload} /> {t('ntnetrelay-gq', {}, 'GQ')}
              {' / '}
              {dos_capacity} {t('ntnetrelay-gq', {}, 'GQ')}
            </ProgressBar>
          ) : (
            <Box fontFamily="monospace">
              <Box fontSize="20px">
                {t('ntnetrelay-overflow', {}, 'NETWORK BUFFER OVERFLOW')}
              </Box>
              <Box fontSize="16px">
                {t('ntnetrelay-recovery', {}, 'OVERLOAD RECOVERY MODE')}
              </Box>
              <Box>{t('ntnetrelay-warning', {}, OUTAGE_WARNING)}</Box>
              <Box fontSize="20px" color="bad">
                {t('ntnetrelay-override', {}, 'ADMINISTRATOR OVERRIDE')}
              </Box>
              <Box fontSize="16px" color="bad">
                {t('ntnetrelay-caution', {}, 'CAUTION - DATA LOSS MAY OCCUR')}
              </Box>
              <Button
                icon="signal"
                content={t('ntnetrelay-purge', {}, 'PURGE BUFFER')}
                mt={1}
                color="bad"
                onClick={() => act('restart')}
              />
            </Box>
          )}
        </Section>
      </Window.Content>
    </Window>
  );
};
