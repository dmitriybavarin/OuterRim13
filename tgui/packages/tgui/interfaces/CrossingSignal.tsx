import { LabeledList, Section } from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  sensorStatus: BooleanLike;
  operatingStatus: number;
  inboundPlatform: number;
  outboundPlatform: number;
};

export const CrossingSignal = (props) => {
  const { data } = useBackend<Data>();
  const t = useT();

  const { sensorStatus, operatingStatus, inboundPlatform, outboundPlatform } =
    data;

  return (
    <Window title={t('crossingsignal-title', {}, 'Crossing Signal')} width={400} height={175} theme="dark">
      <Window.Content>
        <Section title={t('crossingsignal-section-status', {}, 'System Status')}>
          <LabeledList>
            <LabeledList.Item
              label={t('crossingsignal-operating-status', {}, 'Operating Status')}
              color={operatingStatus ? 'bad' : 'good'}
            >
              {operatingStatus
                ? t('crossingsignal-degraded', {}, 'Degraded')
                : t('crossingsignal-normal', {}, 'Normal')}
            </LabeledList.Item>
            <LabeledList.Item
              label={t('crossingsignal-sensor-status', {}, 'Sensor Status')}
              color={sensorStatus ? 'good' : 'bad'}
            >
              {sensorStatus
                ? t('crossingsignal-connected', {}, 'Connected')
                : t('crossingsignal-error', {}, 'Error')}
            </LabeledList.Item>
            <LabeledList.Item label={t('crossingsignal-inbound', {}, 'Inbound Platform')}>
              {inboundPlatform}
            </LabeledList.Item>
            <LabeledList.Item label={t('crossingsignal-outbound', {}, 'Outbound Platform')}>
              {outboundPlatform}
            </LabeledList.Item>
          </LabeledList>
        </Section>
      </Window.Content>
    </Window>
  );
};
