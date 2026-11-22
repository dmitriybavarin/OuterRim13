import {
  AnimatedNumber,
  Box,
  Button,
  Divider,
  LabeledList,
  NoticeBox,
  ProgressBar,
  Section,
  Stack,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { resolveAsset } from '../assets';
import { useBackend } from '../backend';
import { useT } from '../i18n';
import { NtosWindow } from '../layouts';

type Data = {
  BossID: string;
  GameActive: BooleanLike;
  Hitpoints: number;
  PauseState: BooleanLike;
  PlayerHitpoints: number;
  PlayerMP: number;
  Status: string;
  TicketCount: number;
};

export function NtosArcade(props) {
  const t = useT();
  return (
    <NtosWindow width={450} height={350}>
      <NtosWindow.Content>
        <Section
          title={t('ntosarcade-title', {}, 'Outbomb Cuban Pete Ultra')}
          textAlign="center"
        >
          <Stack fill>
            <Stack.Item>
              <PlayerStats />
            </Stack.Item>
            <Stack.Item>
              <BossBar />
            </Stack.Item>
          </Stack>
          <BottomButtons />
        </Section>
      </NtosWindow.Content>
    </NtosWindow>
  );
}

function PlayerStats(props) {
  const { data } = useBackend<Data>();
  const { PauseState, PlayerHitpoints, PlayerMP, Status } = data;
  const t = useT();

  return (
    <>
      <LabeledList>
        <LabeledList.Item label={t('ntosarcade-player-health', {}, 'Player Health')}>
          <ProgressBar
            value={PlayerHitpoints}
            minValue={0}
            maxValue={30}
            ranges={{
              olive: [31, Infinity],
              good: [20, 31],
              average: [10, 20],
              bad: [-Infinity, 10],
            }}
          >
            {PlayerHitpoints}
            {t('ntosarcade-hp', {}, 'HP')}
          </ProgressBar>
        </LabeledList.Item>
        <LabeledList.Item label={t('ntosarcade-player-magic', {}, 'Player Magic')}>
          <ProgressBar
            value={PlayerMP}
            minValue={0}
            maxValue={10}
            ranges={{
              purple: [11, Infinity],
              violet: [3, 11],
              bad: [-Infinity, 3],
            }}
          >
            {PlayerMP}
            {t('ntosarcade-mp', {}, 'MP')}
          </ProgressBar>
        </LabeledList.Item>
      </LabeledList>
      <Divider />
      <NoticeBox danger={!PauseState}>{Status}</NoticeBox>
    </>
  );
}

function BossBar(props) {
  const { data } = useBackend<Data>();
  const t = useT();
  const { BossID, Hitpoints } = data;

  return (
    <>
      <ProgressBar
        value={Hitpoints}
        minValue={0}
        maxValue={45}
        ranges={{
          good: [30, Infinity],
          average: [5, 30],
          bad: [-Infinity, 5],
        }}
      >
        <AnimatedNumber value={Hitpoints} />
        {t('ntosarcade-hp', {}, 'HP')}
      </ProgressBar>
      <Box m={1} />
      <Section inline width="156px" textAlign="center">
        <img src={resolveAsset(BossID)} />
      </Section>
    </>
  );
}

function BottomButtons(props) {
  const { act, data } = useBackend<Data>();
  const { GameActive, PauseState, TicketCount } = data;
  const t = useT();

  return (
    <>
      <Button
        icon="fist-raised"
        tooltip={t('ntosarcade-attack-tooltip', {}, 'Go in for the kill!')}
        tooltipPosition="top"
        disabled={!GameActive || !!PauseState}
        onClick={() => act('Attack')}
      >
        {t('ntosarcade-attack', {}, 'Attack!')}
      </Button>
      <Button
        icon="band-aid"
        tooltip={t('ntosarcade-heal-tooltip', {}, 'Heal yourself!')}
        tooltipPosition="top"
        disabled={!GameActive || !!PauseState}
        onClick={() => act('Heal')}
      >
        {t('ntosarcade-heal', {}, 'Heal!')}
      </Button>
      <Button
        icon="magic"
        tooltip={t(
          'ntosarcade-recharge-tooltip',
          {},
          'Recharge your magic!',
        )}
        tooltipPosition="top"
        disabled={!GameActive || !!PauseState}
        onClick={() => act('Recharge_Power')}
      >
        {t('ntosarcade-recharge', {}, 'Recharge!')}
      </Button>

      <Box>
        <Button
          icon="sync-alt"
          tooltip={t(
            'ntosarcade-begin-tooltip',
            {},
            "One more game couldn't hurt.",
          )}
          tooltipPosition="top"
          disabled={!!GameActive}
          onClick={() => act('Start_Game')}
        >
          {t('ntosarcade-begin', {}, 'Begin Game')}
        </Button>
        <Button
          icon="ticket-alt"
          tooltip={t(
            'ntosarcade-tickets-tooltip',
            {},
            'Claim at your local Arcade Computer for Prizes!',
          )}
          tooltipPosition="top"
          disabled={!!GameActive}
          onClick={() => act('Dispense_Tickets')}
        >
          {t('ntosarcade-tickets', {}, 'Claim Tickets')}
        </Button>
      </Box>
      <Box color={TicketCount >= 1 ? 'good' : 'normal'}>
        {t(
          'ntosarcade-earned',
          { count: TicketCount },
          `Earned Tickets: ${TicketCount}`,
        )}
      </Box>
    </>
  );
}
