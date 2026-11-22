import {
  Button,
  Dropdown,
  ImageButton,
  NumberInput,
  Section,
  Stack,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  can_boo: BooleanLike;
  hud_info: HudInfo[];
  has_fun: BooleanLike;
  lag_switch_on: BooleanLike;
  notification_data: NotificationData[];
  max_extra_view: number;
  current_extra_view: number;
  body_name: string;
  current_darkness: string;
  darkness_levels: string[];
};

type HudInfo = {
  name: string;
  enabled: BooleanLike;
  flag: string;
  tooltip: string;
};

type NotificationData = {
  key: string;
  enabled: BooleanLike;
  desc: string;
};

export const GhostMenu = (props) => {
  const { act, data } = useBackend<Data>();
  const { has_fun, can_boo } = data;
  const t = useT();
  return (
    <Window
      title={t('ghostmenu-title', {}, 'Ghost Menu')}
      width={500}
      height={630}
      buttons={
        !!has_fun && (
          <>
            <Button
              disabled={!can_boo}
              tooltip={t(
                'ghostmenu-boo-tooltip',
                {},
                'Haunts things near you, with a cooldown.',
              )}
              onClick={() => act('boo')}
            >
              {t('ghostmenu-boo', {}, 'Boo!')}
            </Button>
            <Button
              tooltip={t(
                'ghostmenu-possess-tooltip',
                {},
                'Allows you to possess any non-sentient mob.',
              )}
              onClick={() => act('possess')}
            >
              {t('ghostmenu-possess', {}, 'Possess')}
            </Button>
          </>
        )
      }
    >
      <Window.Content>
        <Stack fill>
          <Stack.Item width="40%">
            <Section
              title={t('ghostmenu-round-info', {}, 'Player & Round Info')}
            >
              <RoundSection />
            </Section>
            <Section title={t('ghostmenu-huds', {}, 'HUDs')}>
              <HudSection />
            </Section>
            <Section title={t('ghostmenu-settings', {}, 'Ghost Settings')}>
              <GhostSettingsSection />
            </Section>
          </Stack.Item>
          <Stack.Item width="60%">
            <NotificationPreferences />
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
};

const RoundSection = (props) => {
  const { act, data } = useBackend<Data>();
  const { body_name } = data;
  const t = useT();
  return (
    <>
      {!!body_name && (
        <ImageButton
          fluid
          dmIcon="icons/mob/simple/mob.dmi"
          dmIconState="ghost"
          tooltip={t(
            'ghostmenu-reenter-tooltip',
            {},
            'Click to re-enter your corpse.',
          )}
          onClick={() => act('return_to_body')}
          fontSize="11px"
          buttons={
            <Button.Confirm
              icon="ghost"
              tooltip={t(
                'ghostmenu-dnr-tooltip',
                {},
                'Become unable to be resusitated, permanently leaving your corpse behind.',
              )}
              onClick={() => act('DNR')}
            />
          }
        >
          {t(
            'ghostmenu-reenter',
            { name: body_name },
            `Re-enter ${body_name}`,
          )}
        </ImageButton>
      )}
      <ImageButton
        fluid
        dmIcon="icons/obj/machines/wallmounts.dmi"
        dmIconState="newscaster_off"
        onClick={() => act('crew_manifest')}
        fontSize="11px"
      >
        {t('ghostmenu-manifest', {}, 'View Crew Manifest')}
      </ImageButton>
      <ImageButton
        fluid
        dmIcon="icons/obj/aicards.dmi"
        dmIconState="pai"
        onClick={() => act('signup_pai')}
        fontSize="11px"
      >
        {t('ghostmenu-pai', {}, 'Sign up as pAI')}
      </ImageButton>
    </>
  );
};

const HudSection = (props) => {
  const { act, data } = useBackend<Data>();
  const { hud_info, lag_switch_on } = data;
  const t = useT();
  return (
    <Stack vertical>
      {hud_info.map((individual_hud) => (
        <Stack.Item key={individual_hud.name}>
          <Button
            fluid
            icon={individual_hud.enabled ? 'check' : 'times'}
            color={individual_hud.enabled ? 'good' : 'bad'}
            tooltip={individual_hud.tooltip}
            onClick={() =>
              act('toggle_visibility', { toggling: individual_hud.flag })
            }
          >
            {individual_hud.name}
          </Button>
        </Stack.Item>
      ))}
      {!lag_switch_on && (
        <Button
          tooltip={t(
            'ghostmenu-tray-tooltip',
            {},
            'Performs a t-ray scan where you are.',
          )}
          onClick={() => act('tray_scan')}
        >
          {t('ghostmenu-tray', {}, 'T-ray Scan')}
        </Button>
      )}
    </Stack>
  );
};

const GhostSettingsSection = (props) => {
  const { act, data } = useBackend<Data>();
  const {
    current_darkness,
    darkness_levels,
    max_extra_view,
    current_extra_view,
    lag_switch_on,
  } = data;
  const t = useT();
  return (
    <Stack vertical>
      <Stack.Item>
        <Dropdown
          options={darkness_levels}
          selected={current_darkness}
          onSelected={(value) =>
            act('darkness', {
              darkness_level: value,
            })
          }
        />
      </Stack.Item>
      <Stack.Item>
        <Button
          fluid
          tooltip={t(
            'ghostmenu-restore-tooltip',
            {},
            "Restores your ghost character's appearance and username to that in your character preferences.",
          )}
          onClick={() => act('restore_appearance')}
        >
          {t('ghostmenu-restore', {}, 'Restore Ghost Character')}
        </Button>
      </Stack.Item>
      {!lag_switch_on && (
        <Stack.Item mx={1}>
          {t('ghostmenu-extra-view', {}, 'Extra View Distance:')}
          <NumberInput
            width="30px"
            step={1}
            value={current_extra_view}
            minValue={0}
            maxValue={max_extra_view}
            onChange={(new_range) =>
              act('view_range', {
                new_view_range: new_range,
              })
            }
          />
        </Stack.Item>
      )}
    </Stack>
  );
};

const NotificationPreferences = (props) => {
  const { act, data } = useBackend<Data>();
  const { notification_data } = data;
  const t = useT();
  if (!notification_data) {
    return t('ghostmenu-no-notifications', {}, 'No notifications!');
  }

  const ignores = notification_data.sort((a, b) => {
    const descA = a.desc.toLowerCase();
    const descB = b.desc.toLowerCase();
    if (descA < descB) {
      return -1;
    }
    if (descA > descB) {
      return 1;
    }
    return 0;
  });

  return (
    <Section
      scrollable
      fill
      title={t(
        'ghostmenu-notifications',
        {},
        'Ghost Role Notifications',
      )}
      buttons={
        <>
          <Button
            icon="check"
            color="good"
            tooltip={t(
              'ghostmenu-enable-all',
              {},
              'Enable all notifications.',
            )}
            onClick={() => act('turn_all_on')}
          />
          <Button
            icon="times"
            color="bad"
            tooltip={t(
              'ghostmenu-disable-all',
              {},
              'Disable all notifications.',
            )}
            onClick={() => act('turn_all_off')}
          />
        </>
      }
    >
      {ignores.map((ignore) => (
        <Button
          fluid
          key={ignore.key}
          icon={ignore.enabled ? 'times' : 'check'}
          color={ignore.enabled ? 'bad' : 'good'}
          onClick={() => act('change_notification', { key: ignore.key })}
        >
          {ignore.desc}
        </Button>
      ))}
    </Section>
  );
};
