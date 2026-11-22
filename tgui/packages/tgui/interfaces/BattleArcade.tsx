import { Box, Button, Image, Section } from 'tgui-core/components';

import { resolveAsset } from '../assets';
import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  all_worlds: string[];
  attack_types: AttackTypeData[];
  max_hp: number;
  max_mp: number;
  ui_panel: string;
  feedback_message: string;
  player_current_world: string;
  unlocked_world_modifier: number;
  latest_unlocked_world_position: number;
  player_gold: number;
  player_current_hp: number;
  player_current_mp: number;
  enemy_icon_id: string;
  enemy_name: string;
  enemy_max_hp: number;
  enemy_hp: number;
  enemy_mp: number;
  cost_of_items: number;
  equipped_gear: EquippedGear[];
  shop_items: string[];
};

type AttackTypeData = {
  name: string;
  tooltip: string;
};

type EquippedGear = {
  name: string;
  slot: string;
};

export const BattleArcade = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const {
    ui_panel,
    player_current_hp,
    player_current_mp,
    max_hp,
    max_mp,
    player_gold,
    equipped_gear = [],
  } = data;
  return (
    <Window width={420} height={415}>
      <Window.Content>
        <Section align="center">
          {t('battlearcade-player-stats', {}, 'Player stats')} <br />{' '}
          {t('battlearcade-hp', {}, 'HP:')}{' '}
          <span style={{ color: '#c91212' }}>
            {player_current_hp}/{max_hp}
          </span>{' '}
          | {t('battlearcade-mp', {}, 'MP:')}{' '}
          <span style={{ color: '#0783b5' }}>
            {player_current_mp}/{max_mp}
          </span>{' '}
          | <span style={{ color: '#b8c10b' }}>{player_gold || 0}</span>
          {t('battlearcade-gold-unit', {}, 'G')} <br />
          {!equipped_gear.length && t('battlearcade-no-gear', {}, 'No gear equipped!')}
          {equipped_gear.map((gear, index) => (
            <>
              {gear.slot}: {gear.name} <br />
            </>
          ))}
        </Section>
        {ui_panel === 'Shop' ? (
          <ShopPanel />
        ) : ui_panel === 'World Map' ? (
          <WorldMapPanel />
        ) : ui_panel === 'Battle' ? (
          <BattlePanel />
        ) : ui_panel === 'Between Battle' ? (
          <BetweenBattlePanel />
        ) : (
          <GameOverPanel />
        )}
      </Window.Content>
    </Window>
  );
};

const ShopPanel = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { shop_items, cost_of_items, unlocked_world_modifier } = data;
  return (
    <Section align="center">
      <Box>{t('battlearcade-welcome', {}, 'Welcome to the Inn!')}</Box>
      <Image width={8} src={resolveAsset('shopkeeper.png')} />
      <Box m={2}>
        {t('battlearcade-inn-text', {}, 'Feel free to browse our wares, or take a nap. I\'ll be here to ensure you\'ll get a good night\'s rest without worry of ambushing or robbery.')}
      </Box>
      {shop_items.map((item, index) => (
        <Button
          key={index}
          icon="shield"
          width="100%"
          onClick={() => act('buy_item', { purchasing_item: item })}
        >
          {item}: {cost_of_items * unlocked_world_modifier}
          {t('battlearcade-gold-unit', {}, 'G')}
        </Button>
      ))}
      <Button icon="bed" width="100%" onClick={() => act('sleep')}>
        {t(
          'battlearcade-rest',
          { cost: cost_of_items / 2 },
          `Rest ${cost_of_items / 2}G`,
        )}
      </Button>
      <Button icon="arrow-left" width="100%" onClick={() => act('leave')}>
        {t('battlearcade-leave-inn', {}, 'Leave Inn')}
      </Button>
    </Section>
  );
};

const WorldMapPanel = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { all_worlds, latest_unlocked_world_position } = data;
  return (
    <Section align="center">
      <Box>
        <Button color="transparent" icon="map" />{' '}
        {t('battlearcade-world-map', {}, 'WORLD MAP')}{' '}
        <Button color="transparent" icon="map" />
      </Box>
      <Box m={1}>
        {t('battlearcade-world-text', {}, 'The further down you go, the harder the enemies will be, but the more loot you will get.')}
      </Box>
      <Button icon="house" width="100%" onClick={() => act('enter_inn')}>
        {t('battlearcade-enter-inn', {}, 'Enter Inn')}
      </Button>
      {all_worlds.map((world, index) => (
        <Button
          key={index}
          disabled={index >= latest_unlocked_world_position}
          icon="fist-raised"
          width="100%"
          onClick={() => act('start_fight', { selected_arena: world })}
        >
          {world}
        </Button>
      ))}
    </Section>
  );
};

const BattlePanel = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const {
    attack_types,
    enemy_icon_id,
    enemy_name,
    enemy_max_hp,
    enemy_hp,
    enemy_mp,
    feedback_message,
  } = data;
  return (
    <Section align="center">
      {feedback_message && <Box>{feedback_message}</Box>}
      <Box>
        {t(
          'battlearcade-enemy-hp',
          { name: enemy_name, hp: enemy_hp, max: enemy_max_hp },
          `${enemy_name}'s HP: ${enemy_hp}/${enemy_max_hp}`,
        )}
      </Box>
      <Box>
        {t(
          'battlearcade-enemy-mp',
          { name: enemy_name, mp: enemy_mp },
          `${enemy_name}'s MP: ${enemy_mp}`,
        )}
      </Box>
      <Image width={10} src={resolveAsset(enemy_icon_id)} />
      {attack_types.map((attack, index) => (
        <Button
          key={index}
          icon="fist-raised"
          width="100%"
          tooltip={attack.tooltip}
          onClick={() => act(attack.name)}
        >
          {attack.name}
        </Button>
      ))}
      <Button.Confirm
        icon="shoe-prints"
        width="100%"
        confirmContent={t('battlearcade-flee-confirm', {}, 'Really Flee?')}
        onClick={() => act('flee')}
      >
        {t('battlearcade-flee', {}, 'Flee (Lose half your Gold)')}
      </Button.Confirm>
    </Section>
  );
};

const BetweenBattlePanel = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  return (
    <Section align="center">
      <Image width={10} src={resolveAsset('fireplace.png')} />
      <Box m={1}>
        {t('battlearcade-night-text', {}, 'As night sets, you can choose to rest. This will restore your health and mana to full before the next battle, but you may also be ambushed, forcing you into the next fight without any additional healing.')}
      </Box>
      <Button icon="bed" width="100%" onClick={() => act('continue_with_rest')}>
        {t('battlearcade-sleep', {}, 'Attempt to sleep')}
      </Button>
      <Button
        icon="fire"
        width="100%"
        onClick={() => act('continue_without_rest')}
      >
        {t('battlearcade-leave-no-sleep', {}, 'Leave without sleeping')}
      </Button>
      <Button
        icon="shoe-prints"
        width="100%"
        onClick={() => act('abandon_quest')}
      >
        {t('battlearcade-abandon', {}, 'Abandon Quest')}
      </Button>
    </Section>
  );
};

const GameOverPanel = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  return (
    <Section align="center">
      <Box color="red" fontSize="32px" m={1}>
        {t('battlearcade-game-over', {}, 'Game Over')}
      </Box>
      <Box fontSize="15px">
        <Button
          lineHeight={2}
          fluid
          icon="arrow-left"
          onClick={() => act('restart')}
        >
          {t('battlearcade-main-menu', {}, 'Main Menu')}
        </Button>
      </Box>
    </Section>
  );
};
