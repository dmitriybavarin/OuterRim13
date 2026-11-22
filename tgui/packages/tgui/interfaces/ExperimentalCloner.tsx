import {
  Button,
  Divider,
  ProgressBar,
  Section,
  Stack,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  linked_scanner: BooleanLike;
  linked_pod: BooleanLike;
  is_scanning: BooleanLike;
  is_cloning: BooleanLike;
  record_name?: string;
  record_species?: string;
  scanner_occupant?: string;
  scanner_species?: string;
  cloning_name?: string;
  cloning_species?: string;
  cloning_progress?: number;
};

export const ExperimentalCloner = (props: any) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const {
    linked_scanner,
    linked_pod,
    record_name,
    record_species,
    scanner_occupant,
    scanner_species,
    is_scanning,
    is_cloning,
    cloning_name,
    cloning_species,
    cloning_progress,
  } = data;

  return (
    <Window title={t('cloner-title', {}, 'Experimental Cloner')} width={500} height={300} theme="ntOS95">
      <Window.Content>
        <Section
          title={t('cloner-stored', {}, 'Stored Subject')}
          buttons={
            <Button
              icon="x"
              color="bad"
              tooltip={t('cloner-clear-tip', {}, 'Clear the currently stored cloning record.')}
              onClick={() => act('clear_record')}
              disabled={!record_name}
              tooltipPosition="bottom-start"
            >
              {t('cloner-clear', {}, 'Clear')}
            </Button>
          }
        >
          {record_name ? (
            <Stack.Item>
              {record_name} ({record_species ?? t('cloner-unknown', {}, 'Unknown')})
            </Stack.Item>
          ) : (
            t('cloner-no-dna-stored', {}, 'No stored DNA on record.')
          )}
        </Section>
        <Stack fill>
          <Stack.Item width="50%" mb={13}>
            <Section fill title={t('cloner-scanner', {}, 'Scanner')}>
              {linked_scanner ? (
                <Stack.Item textAlign="center">
                  <Stack vertical>
                    <Stack.Item bold>{t('cloner-occupant', {}, 'Current Occupant:')}</Stack.Item>
                    <Stack.Item>{scanner_occupant ?? t('cloner-none', {}, 'None')}</Stack.Item>
                    {scanner_occupant && (
                      <Stack vertical>
                        <Stack.Item bold>{t('cloner-occupant-species', {}, 'Occupant Species:')}</Stack.Item>
                        <Stack.Item>{scanner_species ?? t('cloner-unknown', {}, 'Unknown')}</Stack.Item>
                        <Divider />
                        <Button
                          color="good"
                          onClick={() => act('start_scan')}
                          content={is_scanning
                              ? t('cloner-scanning', {}, 'Scanning...')
                              : t('cloner-scan', {}, 'Scan Now')}
                          disabled={is_scanning}
                        />
                      </Stack>
                    )}
                  </Stack>
                </Stack.Item>
              ) : (
                <Stack.Item textAlign="center">
                  {t('cloner-no-scanner', {}, 'No scanner connected.')}
                </Stack.Item>
              )}
            </Section>
          </Stack.Item>
          <Stack.Item width="50%" mb={13}>
            <Section fill title={t('cloner-pod', {}, 'Cloning Pod')}>
              {linked_pod ? (
                <Stack.Item textAlign="center">
                  {is_cloning ? (
                    <Stack vertical>
                      <Stack.Item bold>{t('cloner-cloning', {}, 'Currently Cloning:')}</Stack.Item>
                      <Stack.Item>
                        {cloning_name} ({cloning_species ?? t('cloner-unknown', {}, 'Unknown')})
                      </Stack.Item>
                      <Stack.Item>
                        <ProgressBar
                          value={cloning_progress ?? 0}
                          minValue={0}
                          maxValue={100}
                          color="good"
                        />
                      </Stack.Item>
                      {cloning_progress === 100 && (
                        <Stack.Item>{t('cloner-kickstart', {}, 'Beginning neural kickstart...')}</Stack.Item>
                      )}
                    </Stack>
                  ) : (
                    <Stack vertical>
                      <Button
                        color="good"
                        onClick={() => act('start_clone')}
                        content={is_cloning
                            ? t('cloner-cloning-now', {}, 'Cloning...')
                            : t('cloner-begin', {}, 'Begin Cloning')}
                        disabled={is_cloning || !record_name}
                        tooltip={!record_name && t('cloner-no-dna', {}, 'No DNA on record.')}
                      />
                    </Stack>
                  )}
                </Stack.Item>
              ) : (
                <Stack.Item textAlign="center">{t('cloner-no-pod', {}, 'No pod connected.')}</Stack.Item>
              )}
            </Section>
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
};
