import {
  Box,
  Button,
  Flex,
  Icon,
  LabeledList,
  Modal,
  NoticeBox,
  Section,
  Stack,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { NtosWindow } from '../layouts';
import { FakeTerminal } from './common/FakeTerminal';

enum CONTRACT {
  Inactive = 1,
  Active = 2,
  Complete = 5,
}

type Data = {
  contracts_completed: number;
  contracts: ContractData[];
  dropoff_direction: string;
  earned_tc: number;
  error: string;
  extraction_enroute: BooleanLike;
  first_load: BooleanLike;
  info_screen: BooleanLike;
  logged_in: BooleanLike;
  ongoing_contract: BooleanLike;
  redeemable_tc: number;
};

type ContractData = {
  contract: string;
  dropoff: string;
  extraction_enroute: BooleanLike;
  id: number;
  message: string;
  payout_bonus: number;
  payout: number;
  status: number;
  target_rank: string;
  target: string;
};

const getInfoEntries = (t: ReturnType<typeof useT>) => [
  t('syndicontract-info-1', {}, 'SyndTract v2.0'),
  '',
  t('syndicontract-info-2', {}, "We've identified potentional high-value targets that are"),
  t('syndicontract-info-3', {}, 'currently assigned to your mission area. They are believed'),
  t('syndicontract-info-4', {}, 'to hold valuable information which could be of immediate'),
  t('syndicontract-info-5', {}, 'importance to our organisation.'),
  '',
  t('syndicontract-info-6', {}, 'Listed below are all of the contracts available to you. You'),
  t('syndicontract-info-7', {}, 'are to bring the specified target to the designated'),
  t('syndicontract-info-8', {}, 'drop-off, and contact us via this uplink. We will send'),
  t('syndicontract-info-9', {}, 'a specialised extraction unit to put the body into.'),
  '',
  t('syndicontract-info-10', {}, 'We want targets alive - but we will sometimes pay slight'),
  t('syndicontract-info-11', {}, "amounts if they're not, you just won't receive the shown"),
  t('syndicontract-info-12', {}, 'bonus. You can redeem your payment through this uplink in'),
  t('syndicontract-info-13', {}, 'the form of raw telecrystals, which can be put into your'),
  t('syndicontract-info-14', {}, 'regular Syndicate uplink to purchase whatever you may need.'),
  t('syndicontract-info-15', {}, 'We provide you with these crystals the moment you send the'),
  t('syndicontract-info-16', {}, 'target up to us, which can be collected at anytime through'),
  t('syndicontract-info-17', {}, 'this system.'),
  '',
  t('syndicontract-info-18', {}, 'Targets extracted will be ransomed back to the station once'),
  t('syndicontract-info-19', {}, 'their use to us is fulfilled, with us providing you a small'),
  t('syndicontract-info-20', {}, 'percentage cut. You may want to be mindful of them'),
  t('syndicontract-info-21', {}, 'identifying you when they come back. We provide you with'),
  t('syndicontract-info-22', {}, 'a standard contractor loadout, which will help cover your'),
  t('syndicontract-info-23', {}, 'identity.'),
];

export function SyndicateContractor(props) {
  return (
    <NtosWindow width={500} height={600}>
      <NtosWindow.Content scrollable>
        <SyndicateContractorContent />
      </NtosWindow.Content>
    </NtosWindow>
  );
}

function SyndicateContractorContent(props) {
  const { data, act } = useBackend<Data>();
  const t = useT();
  const { error, logged_in, first_load, info_screen } = data;

  const awaiting = t('syndicontract-term-awaiting', {}, 'Awaiting response...');
  const searching = t(
    'syndicontract-term-searching',
    {},
    'Searching for available contracts...',
  );
  const accNumber = Math.round(Math.random() * 20000);
  const terminalMessages = [
    t('syndicontract-term-biometric', {}, 'Recording biometric data...'),
    t('syndicontract-term-analyzing', {}, 'Analyzing embedded syndicate info...'),
    t('syndicontract-term-confirmed', {}, 'STATUS CONFIRMED'),
    t('syndicontract-term-contacting', {}, 'Contacting syndicate database...'),
    awaiting,
    awaiting,
    awaiting,
    awaiting,
    awaiting,
    awaiting,
    t('syndicontract-term-ack', {}, 'Response received, ack 4851234...'),
    t(
      'syndicontract-term-acc',
      { number: accNumber },
      `CONFIRM ACC ${accNumber}`,
    ),
    t('syndicontract-term-accounts', {}, 'Setting up private accounts...'),
    t('syndicontract-term-created', {}, 'CONTRACTOR ACCOUNT CREATED'),
    searching,
    searching,
    searching,
    searching,
    t('syndicontract-term-found', {}, 'CONTRACTS FOUND'),
    t('syndicontract-term-welcome', {}, 'WELCOME, AGENT'),
  ];

  const errorPane = !!error && (
    <Modal backgroundColor="red">
      <Flex align="center">
        <Flex.Item mr={2}>
          <Icon size={4} name="exclamation-triangle" />
        </Flex.Item>
        <Flex.Item mr={2} grow={1} textAlign="center">
          <Box width="260px" textAlign="left" minHeight="80px">
            {error}
          </Box>
          <Button onClick={() => act('PRG_clear_error')}>
            {t('syndicontract-dismiss', {}, 'Dismiss')}
          </Button>
        </Flex.Item>
      </Flex>
    </Modal>
  );

  if (!logged_in) {
    return (
      <Section minHeight="525px">
        <Box width="100%" textAlign="center">
          <Button color="transparent" onClick={() => act('PRG_login')}>
            {t('syndicontract-register', {}, 'REGISTER USER')}
          </Button>
        </Box>
        {!!error && <NoticeBox>{error}</NoticeBox>}
      </Section>
    );
  }

  if (logged_in && first_load) {
    return (
      <Box backgroundColor="rgba(0, 0, 0, 0.8)" minHeight="525px">
        <FakeTerminal
          allMessages={terminalMessages}
          finishedTimeout={3000}
          onFinished={() => act('PRG_set_first_load_finished')}
        />
      </Box>
    );
  }

  if (info_screen) {
    return (
      <>
        <Box backgroundColor="rgba(0, 0, 0, 0.8)" minHeight="500px">
          <FakeTerminal
            allMessages={getInfoEntries(t)}
            linesPerSecond={10}
          />
        </Box>
        <Button
          fluid
          color="transparent"
          textAlign="center"
          onClick={() => act('PRG_toggle_info')}
        >
          {t('syndicontract-continue', {}, 'CONTINUE')}
        </Button>
      </>
    );
  }

  return (
    <>
      {errorPane}
      <StatusPane state={props.state} />
      <ContractsTab />
    </>
  );
}

function StatusPane(props) {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { redeemable_tc, earned_tc, contracts_completed } = data;

  return (
    <Section
      buttons={
        <Button
          color="transparent"
          mb={0}
          ml={1}
          onClick={() => act('PRG_toggle_info')}
        >
          {t('syndicontract-view-info', {}, 'View Information Again')}
        </Button>
      }
      title={t('syndicontract-status', {}, 'Contractor Status')}
    >
      <Stack>
        <Stack.Item grow>
          <LabeledList>
            <LabeledList.Item
              label={t('syndicontract-tc-available', {}, 'TC Available')}
              buttons={
                <Button
                  disabled={redeemable_tc <= 0}
                  onClick={() => act('PRG_redeem_TC')}
                >
                  {t('syndicontract-claim', {}, 'Claim')}
                </Button>
              }
            >
              {String(redeemable_tc)}
            </LabeledList.Item>
            <LabeledList.Item label={t('syndicontract-tc-earned', {}, 'TC Earned')}>
              {String(earned_tc)}
            </LabeledList.Item>
          </LabeledList>
        </Stack.Item>
        <Stack.Item grow>
          <LabeledList>
            <LabeledList.Item label={t('syndicontract-completed', {}, 'Contracts Completed')}>
              {String(contracts_completed)}
            </LabeledList.Item>
            <LabeledList.Item
              label={t('syndicontract-current-status', {}, 'Current Status')}
            >
              {t('syndicontract-active', {}, 'ACTIVE')}
            </LabeledList.Item>
          </LabeledList>
        </Stack.Item>
      </Stack>
    </Section>
  );
}

function ContractsTab(props) {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const {
    contracts = [],
    ongoing_contract,
    extraction_enroute,
    dropoff_direction,
  } = data;

  return (
    <>
      <Section
        title={t('syndicontract-available', {}, 'Available Contracts')}
        buttons={
          <Button
            disabled={!ongoing_contract || !!extraction_enroute}
            onClick={() => act('PRG_call_extraction')}
          >
            {t('syndicontract-call-extraction', {}, 'Call Extraction')}
          </Button>
        }
      >
        {contracts.map((contract) => {
          if (ongoing_contract && contract.status !== CONTRACT.Active) {
            return null;
          }
          const active = contract.status > CONTRACT.Inactive;
          if (contract.status >= CONTRACT.Complete) {
            return null;
          }
          return (
            <Section
              key={contract.target}
              title={
                contract.target
                  ? `${contract.target} (${contract.target_rank})`
                  : t('syndicontract-invalid-target', {}, 'Invalid Target')
              }
              buttons={
                <>
                  <Box inline bold mr={1}>
                    {t(
                      'syndicontract-payout',
                      { payout: contract.payout, bonus: contract.payout_bonus },
                      `${contract.payout} (+${contract.payout_bonus}) TC`,
                    )}
                  </Box>
                  <Button
                    disabled={!!contract.extraction_enroute}
                    color={active && 'bad'}
                    onClick={() =>
                      act(`PRG_contract${active ? '_abort' : '-accept'}`, {
                        contract_id: contract.id,
                      })
                    }
                  >
                    {active
                      ? t('syndicontract-abort', {}, 'Abort')
                      : t('syndicontract-accept', {}, 'Accept')}
                  </Button>
                </>
              }
            >
              <Stack>
                <Stack.Item grow>{contract.message}</Stack.Item>
                <Stack.Item>
                  <Box bold mb={1}>
                    {t('syndicontract-dropoff', {}, 'Dropoff Location:')}
                  </Box>
                  <Box>{contract.dropoff}</Box>
                </Stack.Item>
              </Stack>
            </Section>
          );
        })}
      </Section>
      <Section
        title={t('syndicontract-locator', {}, 'Dropoff Locator')}
        textAlign="center"
        opacity={ongoing_contract ? 100 : 0}
      >
        <Box bold>{dropoff_direction}</Box>
      </Section>
    </>
  );
}
