import {
  AnimatedNumber,
  Button,
  LabeledList,
  NoticeBox,
  Section,
} from 'tgui-core/components';
import { formatMoney } from 'tgui-core/format';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  current_balance: number;
  siphoning: BooleanLike;
  station_name: string;
};

export const BankMachine = (props) => {
  const { act, data } = useBackend<Data>();
  const { current_balance, siphoning, station_name } = data;
  const t = useT();

  return (
    <Window width={350} height={155}>
      <Window.Content>
        <NoticeBox danger>
          {t('bankmachine-warning', {}, 'Authorized personnel only')}
        </NoticeBox>
        <Section title={t(
          'bankmachine-vault',
          { station: station_name },
          '{ $station } Vault',
        )}>
          <LabeledList>
            <LabeledList.Item
              label={t('bankmachine-balance', {}, 'Current Balance')}
              buttons={
                <Button
                  icon={siphoning ? 'times' : 'sync'}
                  content={
                    siphoning
                      ? t('bankmachine-stop', {}, 'Stop Siphoning')
                      : t('bankmachine-siphon', {}, 'Siphon Credits')
                  }
                  selected={siphoning}
                  onClick={() => act(siphoning ? 'halt' : 'siphon')}
                />
              }
            >
              <AnimatedNumber
                value={current_balance}
                format={(value) => formatMoney(value)}
              />
              {` ${t('bankmachine-cr', {}, 'cr')}`}
            </LabeledList.Item>
          </LabeledList>
        </Section>
      </Window.Content>
    </Window>
  );
};
