import { useEffect, useMemo, useRef, useState } from 'react';
import { Blink, Box, Button, Section, Stack } from 'tgui-core/components';
import { formatMoney } from 'tgui-core/format';
import { classes } from 'tgui-core/react';
import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  symbols: SlotSymbol[];
  reels: Reel[];
  balance: number;
  working: number;
  winning: number;
  money: number;
  cost: number;
  plays: number;
  jackpots: number;
  jackpot: number;
  paymode: number;
  jackpot_id: string;
  trap_id: string;
};

type SlotSymbol = {
  id: string;
  icon_id: string;
};

type Reel = {
  symbols: string[];
};

const pickRandomMany = <T,>(items: T[], n: number) => {
  const result: T[] = [];
  for (let i = 0; i < n; i += 1) {
    result.push(pickRandom(items));
  }
  return result;
};

const pickRandom = <T,>(items: T[]) => {
  return items[Math.floor(Math.random() * items.length)];
};

export const SlotMachine = () => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { symbols, cost, reels, balance } = data;
  const spinning = data.working === 1;

  const symbolsById = useMemo(() => {
    const map: Record<string, SlotSymbol> = {};
    for (const symbol of symbols) {
      map[symbol.id] = symbol;
    }
    return map;
  }, [symbols]);

  const jackpotSymbol = symbolsById[data.jackpot_id];
  const trapSymbol = data.trap_id ? symbolsById[data.trap_id] : null;

  return (
    <Window width={300} height={445}>
      <Window.Content>
        <Banner />
        <Section>
          <div className={'SlotMachine__Reels'}>
            {reels.map((reel, i) => (
              <div key={i} className={'SlotMachine__Reel'}>
                <IconStrip
                  symbols={symbols}
                  symbolsById={symbolsById}
                  symbolsNeeded={reel.symbols}
                  spinning={spinning}
                />
              </div>
            ))}
          </div>
        </Section>
        <Stack vertical fill>
          <Stack.Item>
            <Section fill align={'center'}>
              <Box inline textAlign={'center'} color="good" bold>
                {t('slotmachine-jackpot', {}, 'Jackpot:')}
              </Box>
              {jackpotSymbol && (
                <Box
                  className={classes([
                    'slotmachines32x32',
                    jackpotSymbol.icon_id,
                  ])}
                  style={{ verticalAlign: 'middle' }}
                />
              )}

              {trapSymbol && (
                <>
                  <Box inline color="bad" bold ml={5} mr={1}>
                    {t('slotmachine-trap', {}, 'Trap:')}
                  </Box>
                  <Box
                    className={classes([
                      'slotmachines32x32',
                      trapSymbol.icon_id,
                    ])}
                    style={{ verticalAlign: 'middle' }}
                  />
                </>
              )}
            </Section>
          </Stack.Item>
          <Stack.Item grow={1}>
            <Stack align={'stretch'}>
              <Stack.Item grow={1}>
                <Section
                  fill
                  title={t('slotmachine-balance', {}, 'Balance')}
                  buttons={
                    <Button
                      onClick={() => act('payout')}
                      disabled={balance <= 0}
                    >
                      {t('slotmachine-refund', {}, 'Refund')}
                    </Button>
                  }
                >
                  <Box textAlign={'center'} fontSize={2}>
                    {formatMoney(balance)} {t('slotmachine-cr', {}, 'cr')}
                  </Box>
                </Section>
              </Stack.Item>
              <Stack.Item grow={1}>
                <Section fill>
                  <Button
                    fluid
                    textAlign={'center'}
                    fontSize={3}
                    color={'green'}
                    onClick={() => act('spin')}
                    disabled={spinning || balance < cost}
                  >
                    {t('slotmachine-spin', {}, 'Spin!')}
                  </Button>
                </Section>
              </Stack.Item>
            </Stack>
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
};

const getBannerPages = () => [
  BannerTitle,
  BannerOnlyFewCreds,
  BannerPrizeMoney,
  BannerTitle,
  BannerJackpot,
  BannerStats,
];

const BANNER_TEXTS = [
  'SPIN! SPIN!',
  'WARMED UP!',
  'HOT SLOTS',
  'SPIN & WIN!',
  'BELIEVE IT!',
  'ZERO 2 HERO!',
  'JUST ONE MORE',
  'SPIN OF FATE',
  'BONUS TIME!',
  'BORN TO SPIN!',
  'NICE SPIN!',
  'NO SPIN NO WIN',
  'BET & FORGET',
  'HONK 4 LUCK',
  'DEBT 4 LIFE',
  'SPINGULARITY',
  'SPIN CITY',
  'BURN & EARN',
  'JACKPOT SOON!',
  'WIN THE DAY!',
  'FORTUNE CALLS',
  'INSTANT GOLD!',
  'DREAM BIGGER!',
  'WINNERS ONLY!',
  'SPIN IS LIFE',
  'BIG ONE SOON!',
  'LUCKY SPIN!',
  'CASH OUT? NO!',
];

const WINNING_TEXTS = [
  null,
  'FREE SPINS!',
  'PRIZE!',
  'BIG PRIZE!',
  'JACKPOT!!!',
];

const Banner = () => {
  const { data } = useBackend<Data>();
  const t = useT();
  const [page, setPage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPage((page) => (page + 1) % getBannerPages().length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const winningFallback = WINNING_TEXTS[data.winning];
  if (winningFallback) {
    const winningText = t(
      `slotmachine-win-${data.winning}`,
      {},
      winningFallback,
    );
    return (
      <Section className={'SlotMachine__Banner SlotMachine__Banner--winning'}>
        <BannerTitle text={winningText} />
      </Section>
    );
  }

  const Component = getBannerPages()[page];

  return (
    <Section className={'SlotMachine__Banner'}>
      <Component />
    </Section>
  );
};

type BannerTitleProps = {
  text?: string;
};

const BannerTitle = (props: BannerTitleProps) => {
  const { data } = useBackend<Data>();
  const t = useT();
  const defaultIndex = useRef(Math.floor(Math.random() * BANNER_TEXTS.length));
  let text = props.text;
  if (!text) {
    if (data.balance <= 0) {
      text = t('slotmachine-insert-coin', {}, 'INSERT COIN');
    } else if (data.balance <= 5) {
      text = t('slotmachine-last-spin', {}, 'ONE LAST SPIN');
    } else {
      text = t(
        `slotmachine-banner-${defaultIndex.current + 1}`,
        {},
        BANNER_TEXTS[defaultIndex.current],
      );
    }
  }
  const letters = text.split('');
  return (
    <div className={'SlotMachine__BannerTitle'}>
      {letters.map((letter, i) => (
        <span key={i}>{letter}</span>
      ))}
    </div>
  );
};

const BannerOnlyFewCreds = () => {
  const { data } = useBackend<Data>();
  const t = useT();
  const variant = useRef(pickRandom([0, 1]));

  if (variant.current === 1) {
    return (
      <div>
        {t('slotmachine-for-only', {}, 'For only')}{' '}
        <Blink interval={200} time={200}>
          <b>{data.cost}</b>
        </Blink>{' '}
        {t(
          'slotmachine-credit-word',
          { count: data.cost },
          data.cost === 1 ? 'credit' : 'credits',
        )}
        !
        <br />
        <Box inline fontSize={'12px'}>
          {t('slotmachine-fix-problems', {}, 'You can fix all your problems!')}
        </Box>
      </div>
    );
  }

  return (
    <div>
      {t('slotmachine-only', {}, 'Only')}{' '}
      <Blink interval={200} time={200}>
        <b>{data.cost}</b>
      </Blink>{' '}
      {t(
        'slotmachine-credit-chance',
        { count: data.cost },
        `${data.cost === 1 ? 'credit' : 'credits'} for a chance`,
      )}
      <br />
      {t('slotmachine-to-win', {}, 'to win')} <b>{t('slotmachine-big', {}, 'big')}</b>
      !
    </div>
  );
};

const BannerPrizeMoney = () => {
  const { data } = useBackend<Data>();
  const t = useT();
  return (
    <div>
      {t('slotmachine-prize-money', {}, 'Available prize money:')}
      <br />
      <b>
        {t(
          'slotmachine-credits',
          { count: data.money },
          `${data.money} credit${data.money === 1 ? '' : 's'}`,
        )}
      </b>
    </div>
  );
};

const BannerJackpot = () => {
  const { data } = useBackend<Data>();
  const t = useT();
  return (
    <div>
      {t('slotmachine-current-jackpot', {}, 'Current jackpot:')}
      <br />
      <b>
        {t(
          'slotmachine-credits',
          { count: data.money + data.jackpot },
          `${data.money + data.jackpot} credit${data.money + data.jackpot === 1 ? '' : 's'}`,
        )}
        !
      </b>
    </div>
  );
};

const BannerStats = () => {
  const { data } = useBackend<Data>();
  const t = useT();
  return (
    <div>
      <Box inline fontSize={'13px'}>
        {t('slotmachine-so-far', {}, 'So far people have spun')}{' '}
        <b>
          {t(
            'slotmachine-times',
            { count: data.plays },
            `${data.plays} time${data.plays === 1 ? '' : 's'}`,
          )}
        </b>
      </Box>
      <br />
      {t('slotmachine-and-won', {}, 'and won')}{' '}
      <b>
        {t(
          'slotmachine-jackpots',
          { count: data.jackpots },
          `${data.jackpots} jackpot${data.jackpots === 1 ? '' : 's'}`,
        )}
        !
      </b>
    </div>
  );
};

const ICON_STRIP_LENGTH = 30;

type IconStripProps = {
  symbols: SlotSymbol[];
  symbolsById: Record<string, SlotSymbol>;
  symbolsNeeded: string[];
  spinning?: boolean;
};

const IconStrip = (props: IconStripProps) => {
  const { symbols, symbolsById, symbolsNeeded, spinning } = props;
  const symbolIds = useMemo(() => symbols.map((s) => s.id), [symbols]);

  const [drawnSymbols, setDrawnSymbols] = useState<string[]>([
    ...pickRandomMany(symbolIds, ICON_STRIP_LENGTH - 3),
    ...symbolsNeeded,
  ]);

  useEffect(() => {
    if (spinning) {
      setDrawnSymbols((drawn) => [
        ...drawn.slice(-3),
        ...pickRandomMany(symbolIds, ICON_STRIP_LENGTH - 6),
        ...symbolsNeeded,
      ]);
    } else {
      setDrawnSymbols([
        ...pickRandomMany(symbolIds, ICON_STRIP_LENGTH - 3),
        ...symbolsNeeded,
      ]);
    }
  }, [spinning]);

  return (
    <div
      className={classes([
        'SlotMachine__IconStrip',
        spinning && 'SlotMachine__IconStrip--spinning',
      ])}
    >
      {drawnSymbols.map((symbolId, i) => {
        const symbol = symbolsById[symbolId];
        return (
          <div key={i} className="SlotMachine__Symbol">
            {symbol && (
              <Box className={classes(['slotmachines32x32', symbol.icon_id])} />
            )}
          </div>
        );
      })}
    </div>
  );
};
