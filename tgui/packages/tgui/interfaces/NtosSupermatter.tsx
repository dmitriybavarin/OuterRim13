import { useState } from 'react';
import { Button, ProgressBar, Section, Table } from 'tgui-core/components';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { NtosWindow } from '../layouts';
import { SupermatterContent, type SupermatterData } from './Supermatter';

type NtosSupermatterData = SupermatterData & { focus_uid?: number };

export const NtosSupermatter = (props) => {
  const { act, data } = useBackend<NtosSupermatterData>();
  const { sm_data, gas_metadata, focus_uid } = data;
  const t = useT();
  const [activeUID, setActiveUID] = useState(0);
  const activeSM = sm_data.find((sm) => sm.uid === activeUID);

  return (
    <NtosWindow height={400} width={700}>
      <NtosWindow.Content>
        {activeSM ? (
          <SupermatterContent
            {...activeSM}
            gas_metadata={gas_metadata}
            sectionButton={
              <Button icon="arrow-left" onClick={() => setActiveUID(0)}>
                {t('ntossupermatter-back', {}, 'Back')}
              </Button>
            }
          />
        ) : (
          <Section
            title={t('ntossupermatter-detected', {}, 'Detected Supermatters')}
            buttons={
              <Button
                icon="sync"
                content={t('ntossupermatter-refresh', {}, 'Refresh')}
                onClick={() => act('PRG_refresh')}
              />
            }
          >
            <Table>
              {sm_data.map((sm) => (
                <Table.Row key={sm.uid}>
                  <Table.Cell>{`${sm.uid}. ${sm.area_name}`}</Table.Cell>
                  <Table.Cell collapsing color="label">
                    {t('ntossupermatter-integrity', {}, 'Integrity:')}
                  </Table.Cell>
                  <Table.Cell collapsing width="120px">
                    <ProgressBar
                      value={sm.integrity / 100}
                      ranges={{
                        good: [0.9, Infinity],
                        average: [0.5, 0.9],
                        bad: [-Infinity, 0.5],
                      }}
                    />
                  </Table.Cell>
                  <Table.Cell collapsing>
                    <Button
                      icon="bell"
                      color={focus_uid === sm.uid && 'yellow'}
                      onClick={() => act('PRG_focus', { focus_uid: sm.uid })}
                    />
                  </Table.Cell>
                  <Table.Cell collapsing>
                    <Button
                      content={t('ntossupermatter-details', {}, 'Details')}
                      onClick={() => setActiveUID(sm.uid)}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table>
          </Section>
        )}
      </NtosWindow.Content>
    </NtosWindow>
  );
};
