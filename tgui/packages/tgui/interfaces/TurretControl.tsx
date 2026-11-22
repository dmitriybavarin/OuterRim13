import { Button, LabeledList, Section } from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';
import { InterfaceLockNoticeBox } from './common/InterfaceLockNoticeBox';

type Data = {
  enabled: BooleanLike;
  lethal: BooleanLike;
  locked: BooleanLike;
  shootCyborgs: BooleanLike;
  siliconUser: BooleanLike;
};

export const TurretControl = (props) => {
  const { act, data } = useBackend<Data>();
  const { enabled, lethal, locked, siliconUser, shootCyborgs } = data;
  const isLocked = locked && !siliconUser;
  const t = useT();

  return (
    <Window width={305} height={siliconUser ? 168 : 164}>
      <Window.Content>
        <InterfaceLockNoticeBox />
        <Section>
          <LabeledList>
            <LabeledList.Item label={t('turretcontrol-status', {}, 'Turret Status')}>
              <Button
                icon={enabled ? 'power-off' : 'times'}
                content={
                  enabled
                    ? t('turretcontrol-enabled', {}, 'Enabled')
                    : t('turretcontrol-disabled', {}, 'Disabled')
                }
                selected={enabled}
                disabled={isLocked}
                onClick={() => act('power')}
              />
            </LabeledList.Item>
            <LabeledList.Item label={t('turretcontrol-mode', {}, 'Turret Mode')}>
              <Button
                icon={lethal ? 'exclamation-triangle' : 'minus-circle'}
                content={
                  lethal
                    ? t('turretcontrol-lethal', {}, 'Lethal')
                    : t('turretcontrol-stun', {}, 'Stun')
                }
                color={lethal ? 'bad' : 'average'}
                disabled={isLocked}
                onClick={() => act('mode')}
              />
            </LabeledList.Item>
            <LabeledList.Item label={t('turretcontrol-cyborgs', {}, 'Target Cyborgs')}>
              <Button
                icon={shootCyborgs ? 'check' : 'times'}
                content={
                  shootCyborgs
                    ? t('turretcontrol-yes', {}, 'Yes')
                    : t('turretcontrol-no', {}, 'No')
                }
                selected={shootCyborgs}
                disabled={isLocked}
                onClick={() => act('shoot_silicons')}
              />
            </LabeledList.Item>
          </LabeledList>
        </Section>
      </Window.Content>
    </Window>
  );
};
