import {
  Box,
  Button,
  Dropdown,
  LabeledList,
  Section,
  Stack,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';
import { InterfaceLockNoticeBox } from './common/InterfaceLockNoticeBox';

export type Data = {
  locked: BooleanLike;
  siliconUser: BooleanLike;
  controls: NavBeaconControl;
  static_controls: NavBeaconStaticControl;
};

export type NavBeaconControl = {
  location: string;
  patrol_enabled: BooleanLike;
  patrol_next: string;
  delivery_enabled: BooleanLike;
  delivery_direction: string;
  cover_locked: BooleanLike;
};

export type DisabledProps = {
  disabled: BooleanLike;
};

export type NavBeaconStaticControl = {
  direction_options: string[];
  has_codes: BooleanLike;
};

export const NavBeacon = (props) => {
  const { act, data } = useBackend();
  const t = useT();
  return (
    <Window title={t('navbeacon-title', {}, 'Nagivational Beacon')} width={400} height={350}>
      <Window.Content>
        <NavBeaconContent />
      </Window.Content>
    </Window>
  );
};

export const NavBeaconContent = (props) => {
  const { act, data } = useBackend<Data>();
  const { controls, static_controls } = data;
  const disabled = data.locked && !data.siliconUser;
  return (
    <Stack vertical fill>
      <InterfaceLockNoticeBox />
      <NavBeaconControlSection disabled={disabled} />
      <NavBeaconMaintenanceSection disabled={disabled} />
    </Stack>
  );
};

export const NavBeaconControlSection = (props: DisabledProps) => {
  const { act, data } = useBackend<Data>();
  const { controls, static_controls } = data;
  const t = useT();
  return (
    <Section title={t('navbeacon-controls', {}, 'Controls')}>
      <LabeledList>
        <LabeledList.Item label={t('navbeacon-location', {}, 'Location')}>
          <Button
            fluid
            content={controls.location ?? t('navbeacon-none-set', {}, 'None set')}
            icon="pencil-alt"
            disabled={props.disabled}
            onClick={() => act('set_location')}
          />
        </LabeledList.Item>
        <LabeledList.Item label={t('navbeacon-patrol', {}, 'Enable as Patrol Beacon')}>
          <Button.Checkbox
            fluid
            checked={controls.patrol_enabled}
            content={
              controls.patrol_enabled
                ? t('navbeacon-enabled', {}, 'Enabled')
                : t('navbeacon-disabled', {}, 'Disabled')
            }
            disabled={props.disabled}
            onClick={() => act('toggle_patrol')}
          />
        </LabeledList.Item>
        <LabeledList.Item label={t('navbeacon-next-patrol', {}, 'Next patrol')}>
          <Button
            fluid
            content={
              controls.patrol_next ??
              t('navbeacon-no-next-patrol', {}, 'No next patrol location')
            }
            icon="pencil-alt"
            disabled={props.disabled}
            onClick={() => act('set_patrol_next')}
          />
        </LabeledList.Item>
        <LabeledList.Item label={t('navbeacon-delivery', {}, 'Enable as Delivery Beacon')}>
          <Button.Checkbox
            fluid
            checked={controls.delivery_enabled}
            content={
              controls.delivery_enabled
                ? t('navbeacon-enabled', {}, 'Enabled')
                : t('navbeacon-disabled', {}, 'Disabled')
            }
            disabled={props.disabled}
            onClick={() => act('toggle_delivery')}
          />
        </LabeledList.Item>
        <LabeledList.Item label={t('navbeacon-direction', {}, 'Delivery Direction')}>
          <Dropdown
            disabled={!!props.disabled}
            options={static_controls.direction_options.map((direction) => ({
              value: direction,
              displayText: t(`navbeacon-direction-${direction}`, {}, direction),
            }))}
            selected={controls.delivery_direction}
            displayText={t(
              `navbeacon-direction-${controls.delivery_direction}`,
              {},
              controls.delivery_direction,
            )}
            onSelected={(value) =>
              act('set_delivery_direction', {
                direction: value,
              })
            }
          />
        </LabeledList.Item>
      </LabeledList>
    </Section>
  );
};

export const NavBeaconMaintenanceSection = (props: DisabledProps) => {
  const { act, data } = useBackend<Data>();
  const { controls, static_controls } = data;
  const t = useT();
  return (
    <Section title={t('navbeacon-maintenance', {}, 'Maintenance')}>
      <LabeledList>
        <LabeledList.Item label={t('navbeacon-reset-codes', {}, 'Reset codes')}>
          {!!static_controls.has_codes && (
            <Button
              fluid
              content={t('navbeacon-reset', {}, 'Reset')}
              icon="power-off"
              disabled={props.disabled}
              onClick={() => act('reset_codes')}
            />
          )}
          {!static_controls.has_codes && <Box>{t('navbeacon-no-codes', {}, 'No backup codes found')}</Box>}
        </LabeledList.Item>
        <LabeledList.Item label={t('navbeacon-hatch', {}, 'Maintenance hatch cover')}>
          <Button.Checkbox
            fluid
            checked={controls.cover_locked}
            content={
              controls.cover_locked
                ? t('navbeacon-locked', {}, 'Locked')
                : t('navbeacon-unlocked', {}, 'Unlocked')
            }
            disabled={props.disabled}
            onClick={() => act('toggle_cover')}
          />
        </LabeledList.Item>
      </LabeledList>
    </Section>
  );
};
