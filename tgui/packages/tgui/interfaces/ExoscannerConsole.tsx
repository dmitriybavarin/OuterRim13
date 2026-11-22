import {
  BlockQuote,
  Box,
  Button,
  Icon,
  LabeledList,
  Modal,
  NoticeBox,
  Section,
  Stack,
} from 'tgui-core/components';
import { formatTime } from 'tgui-core/format';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type SiteData = {
  name: string;
  ref: string;
  description: string;
  distance: number;
  band_info: Record<string, string>;
  revealed: boolean;
};

type ScanData = {
  scan_power: number;
  point_scan_eta: number;
  deep_scan_eta: number;
  point_scan_complete: boolean;
  deep_scan_complete: boolean;
  site_data: SiteData;
};

const ScanFailedModal = (props) => {
  const { act } = useBackend();
  const t = useT();
  return (
    <Modal>
      <Stack fill vertical>
        <Stack.Item>
          <Box color="bad">
            {t('exoscanner-scan-failure', {}, 'SCAN FAILURE!')}
          </Box>
        </Stack.Item>
        <Stack.Item>
          <Button
            content={t('exoscanner-confirm', {}, 'Confirm')}
            onClick={() => act('confirm_fail')}
          />
        </Stack.Item>
      </Stack>
    </Modal>
  );
};

const ScanSelectionSection = (props) => {
  const { act, data } = useBackend<ScanData>();
  const {
    scan_power,
    point_scan_eta,
    deep_scan_eta,
    point_scan_complete,
    deep_scan_complete,
    site_data,
  } = data;
  const t = useT();
  const site = site_data;

  const point_cost = scan_power > 0 ? formatTime(point_scan_eta, 'short') : '∞';
  const deep_cost = scan_power > 0 ? formatTime(deep_scan_eta, 'short') : '∞';
  const scan_available = !point_scan_complete || !deep_scan_complete;
  return (
    <Stack vertical fill>
      <Stack.Item grow>
        <Section
          fill
          title={t('exoscanner-site-data', {}, 'Site Data')}
          buttons={
            <Button
              content={t('exoscanner-back', {}, 'Back')}
              onClick={() => act('select_site', { site_ref: null })}
            />
          }
        >
          <LabeledList>
            <LabeledList.Item label={t('exoscanner-name', {}, 'Name')}>
              {site.name}
            </LabeledList.Item>
            <LabeledList.Item
              label={t('exoscanner-description', {}, 'Description')}
            >
              {site.revealed
                ? site.description
                : t('exoscanner-no-data', {}, 'No Data')}
            </LabeledList.Item>
            <LabeledList.Item label={t('exoscanner-distance', {}, 'Distance')}>
              {site.distance}
            </LabeledList.Item>
            <LabeledList.Divider />
            <LabeledList.Item
              label={t('exoscanner-spectrography', {}, 'Spectrography Data')}
            />
            <LabeledList.Divider />
            {Object.keys(site.band_info).map((band) => (
              <LabeledList.Item key={band} label={band}>
                {site.band_info[band]}
              </LabeledList.Item>
            ))}
          </LabeledList>
        </Section>
      </Stack.Item>
      {scan_available && (
        <Stack.Item>
          <Section fill title={t('exoscanner-scans', {}, 'Scans')}>
            {!point_scan_complete && (
              <Section title={t('exoscanner-point-scan', {}, 'Point Scan')}>
                <BlockQuote>
                  {t(
                    'exoscanner-point-scan-desc',
                    {},
                    'Point scan performs rudimentary scan of the site, revealing its general characteristics.',
                  )}
                </BlockQuote>
                <Box>
                  <Button
                    content={t('exoscanner-scan', {}, 'Scan')}
                    disabled={scan_power <= 0}
                    onClick={() => act('start_point_scan')}
                  />
                  <Box inline pl={3}>
                    {t(
                      'exoscanner-estimated-time',
                      { time: point_cost },
                      `Estimated Time: ${point_cost}.`,
                    )}
                  </Box>
                </Box>
              </Section>
            )}
            {!deep_scan_complete && (
              <Section title={t('exoscanner-deep-scan', {}, 'Deep Scan')}>
                <BlockQuote>
                  {t(
                    'exoscanner-deep-scan-desc',
                    {},
                    'Deep scan performs full scan of the site, revealing all details.',
                  )}
                </BlockQuote>
                <Box>
                  <Button
                    content={t('exoscanner-scan', {}, 'Scan')}
                    disabled={scan_power <= 0}
                    onClick={() => act('start_deep_scan')}
                  />
                  <Box inline pl={3}>
                    {t(
                      'exoscanner-estimated-time',
                      { time: deep_cost },
                      `Estimated Time: ${deep_cost}.`,
                    )}
                  </Box>
                </Box>
              </Section>
            )}
          </Section>
        </Stack.Item>
      )}
    </Stack>
  );
};

type ScanInProgressData = {
  scan_time: number;
  scan_power: number;
  scan_description: string;
};

const ScanInProgressModal = (props) => {
  const { act, data } = useBackend<ScanInProgressData>();
  const { scan_time, scan_power, scan_description } = data;
  const t = useT();

  return (
    <Modal ml={1}>
      <NoticeBox>
        {t('exoscanner-in-progress', {}, 'Scan in Progress!')}
      </NoticeBox>
      <Box color="danger" />
      <LabeledList>
        <LabeledList.Item label={t('exoscanner-summary', {}, 'Scan summary')}>
          {scan_description}
        </LabeledList.Item>
        <LabeledList.Item label={t('exoscanner-time-left', {}, 'Time left')}>
          {formatTime(scan_time)}
        </LabeledList.Item>
        <LabeledList.Item
          label={t('exoscanner-array-power', {}, 'Scanning array power')}
        >
          {scan_power}
        </LabeledList.Item>
        <LabeledList.Item
          label={t('exoscanner-emergency-stop', {}, 'Emergency Stop')}
        >
          <Button.Confirm
            content={t('exoscanner-stop-scan', {}, 'STOP SCAN')}
            color="red"
            icon="times"
            onClick={() => act('stop_scan')}
          />
        </LabeledList.Item>
      </LabeledList>
    </Modal>
  );
};

type ExoscannerConsoleData = {
  scan_in_progress: boolean;
  scan_power: number;
  possible_sites: Array<SiteData>;
  wide_scan_eta: number;
  selected_site: string;
  failed: boolean;
  scan_conditions: Array<string>;
};

export const ExoscannerConsole = (props) => {
  const { act, data } = useBackend<ExoscannerConsoleData>();
  const {
    scan_in_progress,
    scan_power,
    possible_sites = [],
    wide_scan_eta,
    selected_site,
    failed,
    scan_conditions = [],
  } = data;
  const t = useT();

  const can_start_wide_scan = scan_power > 0;

  return (
    <Window width={550} height={600}>
      {!!scan_in_progress && <ScanInProgressModal />}
      {!!failed && <ScanFailedModal />}
      <Window.Content>
        <Stack vertical fill>
          <Stack.Item>
            <Section
              fill
              title={t('exoscanner-available-power', {}, 'Available array power')}
            >
              <Stack>
                <Stack.Item grow>
                  {(scan_power > 0 && (
                    <>
                      <Box pr={1} inline fontSize={2}>
                        {scan_power}
                      </Box>
                      <Icon name="satellite-dish" size={3} />
                    </>
                  )) ||
                    t(
                      'exoscanner-no-arrays',
                      {},
                      'No properly configured scanner arrays detected.',
                    )}
                </Stack.Item>
              </Stack>
              <Section
                title={t('exoscanner-conditions', {}, 'Special Scan Condtions')}
              >
                {scan_conditions?.map((condition) => (
                  <NoticeBox key={condition}>{condition}</NoticeBox>
                ))}
              </Section>
            </Section>
          </Stack.Item>
          {!!selected_site && (
            <Stack.Item grow>
              <ScanSelectionSection site_ref={selected_site} />
            </Stack.Item>
          )}
          {!selected_site && (
            <>
              <Stack.Item>
                <Section
                  buttons={
                    <Button
                      icon="search"
                      disabled={!can_start_wide_scan}
                      onClick={() => act('start_wide_scan')}
                    >
                      {t('exoscanner-scan', {}, 'Scan')}
                    </Button>
                  }
                  fill
                  title={t('exoscanner-wide-scan', {}, 'Configure Wide Scan')}
                >
                  <Stack>
                    <Stack.Item>
                      <BlockQuote>
                        {t(
                          'exoscanner-wide-scan-desc',
                          {},
                          'Broad spectrum scan looking for anything not matching known start charts.',
                        )}
                      </BlockQuote>
                    </Stack.Item>
                    <Stack.Item>
                      {t('exoscanner-cost-estimate', {}, 'Cost estimate:')}{' '}
                      {scan_power > 0
                        ? formatTime(wide_scan_eta, 'short')
                        : t('exoscanner-infinite-minutes', {}, '∞ minutes')}
                    </Stack.Item>
                  </Stack>
                </Section>
              </Stack.Item>
              <Stack.Item grow>
                <Section
                  fill
                  title={t(
                    'exoscanner-targeted-scans',
                    {},
                    'Configure Targeted Scans',
                  )}
                  scrollable
                  buttons={
                    <Button
                      content={t('exoscanner-view-experiments', {}, 'View Experiments')}
                      onClick={() => act('open_experiments')}
                      icon="tasks"
                    />
                  }
                >
                  <Stack vertical>
                    {possible_sites.map((site) => (
                      <Stack.Item key={site.ref}>
                        <Button
                          content={site.name}
                          onClick={() =>
                            act('select_site', { site_ref: site.ref })
                          }
                        />
                      </Stack.Item>
                    ))}
                  </Stack>
                </Section>
              </Stack.Item>
            </>
          )}
        </Stack>
      </Window.Content>
    </Window>
  );
};
