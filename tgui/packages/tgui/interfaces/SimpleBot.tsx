import { useBackend } from 'tgui/backend';
import { useT } from 'tgui/i18n';
import { Window } from 'tgui/layouts';
import {
  Button,
  Icon,
  LabeledControls,
  NoticeBox,
  Section,
  Slider,
  Stack,
  Tooltip,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';
import { capitalizeAll } from 'tgui-core/string';

type Data = {
  can_hack: BooleanLike;
  custom_controls: Record<string, number>;
  emagged: BooleanLike;
  has_access: BooleanLike;
  locked: BooleanLike;
  settings: Settings;
};

type Settings = {
  airplane_mode: BooleanLike;
  allow_possession: BooleanLike;
  has_personality: BooleanLike;
  maintenance_lock: BooleanLike;
  pai_inserted: boolean;
  patrol_station: BooleanLike;
  possession_enabled: BooleanLike;
  power: BooleanLike;
};

export function SimpleBot(props) {
  const { data } = useBackend<Data>();
  const { can_hack, locked } = data;
  const access = !locked || !!can_hack;

  return (
    <Window width={450} height={300}>
      <Window.Content>
        <Stack fill vertical>
          <Stack.Item>
            <BotSettings />
          </Stack.Item>
          {!!access && (
            <Stack.Item grow>
              <BotControl />
            </Stack.Item>
          )}
        </Stack>
      </Window.Content>
    </Window>
  );
}

export function BotSettings(props) {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { can_hack, locked } = data;
  const access = !locked || !!can_hack;
  return (
    <Section
      title={t('simplebot-settings', {}, 'Settings')}
      buttons={<TabDisplay />}
    >
      {!access ? <NoticeBox>{t('simplebot-locked', {}, 'Locked!')}</NoticeBox> : <SettingsDisplay />}
    </Section>
  );
}

export function BotControl(props) {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { custom_controls } = data;
  return (
    <Section
      fill
      scrollable
      title={t('simplebot-controls', {}, 'Controls')}
    >
      <LabeledControls wrap>
        {Object.entries(custom_controls).map((control) => (
          <LabeledControls.Item
            pb={2}
            key={control[0]}
            label={t(
              `simplebot-control-${control[0].replace(/_/g, '-')}`,
              {},
              capitalizeAll(control[0].replace('_', ' ')),
            )}
          >
            <ControlHelper control={control} />
          </LabeledControls.Item>
        ))}
      </LabeledControls>
    </Section>
  );
}
/** Creates a lock button at the top of the controls */
function TabDisplay(props) {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const {
    can_hack,
    emagged,
    has_access,
    locked,
    settings: { allow_possession },
  } = data;

  return (
    <>
      {!!can_hack && (
        <Button
          color="danger"
          disabled={!can_hack}
          icon={emagged ? 'bug' : 'lock'}
          onClick={() => act('hack')}
          selected={!emagged}
          tooltip={
            !emagged
              ? t(
                  'simplebot-hack-tooltip',
                  {},
                  'Unlocks the safety protocols.',
                )
              : t(
                  'simplebot-reset-tooltip',
                  {},
                  'Resets the bot operating system.',
                )
          }
        >
          {emagged
            ? t('simplebot-malfunctional', {}, 'Malfunctional')
            : t('simplebot-safety-lock', {}, 'Safety Lock')}
        </Button>
      )}
      {!!allow_possession && <PaiButton />}
      <Button
        color="transparent"
        icon="fa-poll-h"
        onClick={() => act('rename')}
        tooltip={t(
          'simplebot-rename-tooltip',
          {},
          "Update the bot's name registration.",
        )}
      >
        {t('simplebot-rename', {}, 'Rename')}
      </Button>
      <Button
        color="transparent"
        disabled={!has_access && !can_hack}
        icon={locked ? 'lock' : 'lock-open'}
        onClick={() => act('lock')}
        selected={locked}
        tooltip={
          locked
            ? t('simplebot-unlock-tooltip', {}, 'Unlock the control panel.')
            : t('simplebot-lock-tooltip', {}, 'Lock the control panel.')
        }
      >
        {t('simplebot-controls-lock', {}, 'Controls Lock')}
      </Button>
    </>
  );
}

/** Creates a button indicating PAI status and offers the eject action */
function PaiButton(props) {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const {
    settings: { pai_inserted },
  } = data;

  if (!pai_inserted) {
    return (
      <Button
        color="transparent"
        icon="robot"
        tooltip={t(
          'simplebot-pai-insert-tooltip',
          {},
          'Insert an active PAI card to control this device.',
        )}
      >
        {t('simplebot-no-pai', {}, 'No PAI Inserted')}
      </Button>
    );
  }

  return (
    <Button
      disabled={!pai_inserted}
      icon="eject"
      onClick={() => act('eject_pai')}
      tooltip={t('simplebot-pai-eject-tooltip', {}, 'Ejects the current PAI.')}
    >
      {t('simplebot-eject-pai', {}, 'Eject PAI')}
    </Button>
  );
}

/** Displays the bot's standard settings: Power, patrol, etc. */
function SettingsDisplay(props) {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const {
    settings: {
      airplane_mode,
      patrol_station,
      power,
      maintenance_lock,
      allow_possession,
      possession_enabled,
    },
  } = data;

  return (
    <LabeledControls>
      <LabeledControls.Item label={t('simplebot-power', {}, 'Power')}>
        <Tooltip
          content={
            power
              ? t('simplebot-power-off-tooltip', {}, 'Powers off the bot.')
              : t('simplebot-power-on-tooltip', {}, 'Powers on the bot.')
          }
        >
          <Icon
            size={2}
            name="power-off"
            color={power ? 'good' : 'gray'}
            onClick={() => act('power')}
          />
        </Tooltip>
      </LabeledControls.Item>
      <LabeledControls.Item
        label={t('simplebot-airplane-mode', {}, 'Airplane Mode')}
      >
        <Tooltip
          content={
            !airplane_mode
              ? t(
                  'simplebot-airplane-disable-tooltip',
                  {},
                  'Disables remote access via console.',
                )
              : t(
                  'simplebot-airplane-enable-tooltip',
                  {},
                  'Enables remote access via console.',
                )
          }
        >
          <Icon
            size={2}
            name="plane"
            color={airplane_mode ? 'yellow' : 'gray'}
            onClick={() => act('airplane')}
          />
        </Tooltip>
      </LabeledControls.Item>
      <LabeledControls.Item
        label={t('simplebot-patrol-station', {}, 'Patrol Station')}
      >
        <Tooltip
          content={
            patrol_station
              ? t(
                  'simplebot-patrol-disable-tooltip',
                  {},
                  'Disables automatic station patrol.',
                )
              : t(
                  'simplebot-patrol-enable-tooltip',
                  {},
                  'Enables automatic station patrol.',
                )
          }
        >
          <Icon
            size={2}
            name="map-signs"
            color={patrol_station ? 'good' : 'gray'}
            onClick={() => act('patrol')}
          />
        </Tooltip>
      </LabeledControls.Item>
      <LabeledControls.Item
        label={t('simplebot-maintenance-lock', {}, 'Maintenance Lock')}
      >
        <Tooltip
          content={
            maintenance_lock
              ? t(
                  'simplebot-maintenance-open-tooltip',
                  {},
                  'Opens the maintenance hatch for repairs.',
                )
              : t(
                  'simplebot-maintenance-close-tooltip',
                  {},
                  'Closes the maintenance hatch.',
                )
          }
        >
          <Icon
            size={2}
            name="toolbox"
            color={maintenance_lock ? 'yellow' : 'gray'}
            onClick={() => act('maintenance')}
          />
        </Tooltip>
      </LabeledControls.Item>
      {!!allow_possession && (
        <LabeledControls.Item
          label={t('simplebot-personality', {}, 'Personality')}
        >
          <Tooltip
            content={
              possession_enabled
                ? t(
                    'simplebot-personality-reset-tooltip',
                    {},
                    'Resets personality to factory default.',
                  )
                : t(
                    'simplebot-personality-enable-tooltip',
                    {},
                    'Enables download of a unique personality.',
                  )
            }
          >
            <Icon
              size={2}
              name="robot"
              color={possession_enabled ? 'good' : 'gray'}
              onClick={() => act('toggle_personality')}
            />
          </Tooltip>
        </LabeledControls.Item>
      )}
    </LabeledControls>
  );
}

enum ControlType {
  MedbotThreshold = 'heal_threshold',
  FloorbotTiles = 'tile_stack',
  FloorbotLine = 'line_mode',
}

type ControlProps = {
  control: [string, number];
};

/** Helper function which identifies which button to create.
 * Might need some fine tuning if you are using more advanced controls.
 */
function ControlHelper(props: ControlProps) {
  const { act } = useBackend<Data>();
  const { control } = props;

  switch (control[0]) {
    case ControlType.MedbotThreshold:
      return <MedbotThreshold control={control} />;
    case ControlType.FloorbotTiles:
      return <FloorbotTiles control={control} />;
    case ControlType.FloorbotLine:
      return <FloorbotLine control={control} />;
    default:
      return (
        <Icon
          color={control[1] ? 'good' : 'gray'}
          name={control[1] ? 'toggle-on' : 'toggle-off'}
          size={2}
          onClick={() => act(control[0])}
        />
      );
  }
}

/** Slider button for medbot healing thresholds */
function MedbotThreshold(props: ControlProps) {
  const { act } = useBackend<Data>();
  const t = useT();
  const { control } = props;

  return (
    <Tooltip
      content={t(
        'simplebot-threshold-tooltip',
        {},
        'Adjusts the sensitivity for damage treatment.',
      )}
    >
      <Slider
        minValue={5}
        maxValue={75}
        ranges={{
          good: [-Infinity, 15],
          average: [15, 55],
          bad: [55, Infinity],
        }}
        step={5}
        unit="%"
        value={control[1]}
        onChange={(_, value) => act(control[0], { threshold: value })}
      />
    </Tooltip>
  );
}

/** Tile stacks for floorbots - shows number and eject button */
function FloorbotTiles(props: ControlProps) {
  const { act } = useBackend<Data>();
  const t = useT();
  const { control } = props;

  return (
    <Button
      disabled={!control[1]}
      icon={control[1] ? 'eject' : ''}
      onClick={() => act('eject_tiles')}
      tooltip={t(
        'simplebot-tiles-tooltip',
        {},
        'Number of floor tiles contained in the bot.',
      )}
    >
      {control[1] ? `${control[1]}` : t('simplebot-empty', {}, 'Empty')}
    </Button>
  );
}

/** Direction indicator for floorbot when line mode is chosen. */
function FloorbotLine(props: ControlProps) {
  const { act } = useBackend<Data>();
  const t = useT();
  const { control } = props;

  return (
    <Tooltip
      content={t(
        'simplebot-line-tooltip',
        {},
        'Enables straight line tiling mode.',
      )}
    >
      <Icon
        color={control[1] ? 'good' : 'gray'}
        name={control[1] ? 'compass' : 'toggle-off'}
        onClick={() => act('line_mode')}
        size={!control[1] ? 2 : 1.5}
      />
      {control[1] ? control[1].toString().charAt(0).toUpperCase() : ''}
    </Tooltip>
  );
}
