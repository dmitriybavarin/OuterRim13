import {
  AnimatedNumber,
  Button,
  LabeledList,
  ProgressBar,
  Section,
} from 'tgui-core/components';
import { round } from 'tgui-core/math';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';
import { type Beaker, BeakerSectionDisplay } from './common/BeakerDisplay';

const damageTypes = [
  {
    id: 'brute',
    label: 'Brute',
    type: 'bruteLoss',
  },
  {
    id: 'respiratory',
    label: 'Respiratory',
    type: 'oxyLoss',
  },
  {
    id: 'toxin',
    label: 'Toxin',
    type: 'toxLoss',
  },
  {
    id: 'burn',
    label: 'Burn',
    type: 'fireLoss',
  },
] as const;

const stat_to_color = {
  Dead: 'bad',
  Conscious: 'bad',
  Unconscious: 'good',
} as const;

type Occupant = {
  name: string;
  stat: string;
  bodyTemperature: number;
  health: number;
  maxHealth: number;
  bruteLoss: number;
  oxyLoss: number;
  toxLoss: number;
  fireLoss: number;
};

type Data = {
  isOperating: BooleanLike;
  isOpen: BooleanLike;
  autoEject: BooleanLike;
  occupant: Occupant;
  T0C: number;
  cellTemperature: number;
  beaker: Beaker;
};

export const Cryo = () => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { occupant, isOperating, isOpen } = data;

  return (
    <Window width={400} height={550}>
      <Window.Content scrollable>
        <Section title={t('cryo-section-occupant', {}, 'Occupant')}>
          <LabeledList>
            <LabeledList.Item label={t('cryo-occupant', {}, 'Occupant')}>
              {occupant?.name || t('cryo-no-occupant', {}, 'No Occupant')}
            </LabeledList.Item>
            {!!occupant && (
              <>
                <LabeledList.Item
                  label={t('cryo-state', {}, 'State')}
                  color={stat_to_color[occupant.stat]}
                >
                  {t(
                    `cryo-stat-${occupant.stat.toLowerCase()}`,
                    {},
                    occupant.stat,
                  )}
                </LabeledList.Item>
                <LabeledList.Item
                  label={t('cryo-temperature', {}, 'Temperature')}
                  color={occupant.bodyTemperature < data.T0C ? 'good' : 'bad'} // Green if the mob can actually be healed by cryoxadone.
                >
                  <AnimatedNumber value={round(occupant.bodyTemperature, 0)} />
                  {' K'}
                </LabeledList.Item>
                <LabeledList.Item label={t('cryo-health', {}, 'Health')}>
                  <ProgressBar
                    value={round(occupant.health / occupant.maxHealth, 2)}
                    color={occupant.health > 0 ? 'good' : 'average'}
                  >
                    <AnimatedNumber value={round(occupant.health, 0)} />
                  </ProgressBar>
                </LabeledList.Item>
                {damageTypes.map((damageType) => (
                  <LabeledList.Item
                    key={damageType.type}
                    label={t(`cryo-damage-${damageType.id}`, {}, damageType.label)}
                  >
                    <ProgressBar
                      value={round(data.occupant[damageType.type] / 100, 2)}
                    >
                      <AnimatedNumber
                        value={round(data.occupant[damageType.type], 0)}
                      />
                    </ProgressBar>
                  </LabeledList.Item>
                ))}
              </>
            )}
          </LabeledList>
        </Section>
        <Section title={t('cryo-section-cell', {}, 'Cell')}>
          <LabeledList>
            <LabeledList.Item label={t('cryo-power', {}, 'Power')}>
              <Button
                icon={isOperating ? 'power-off' : 'times'}
                disabled={isOpen}
                onClick={() => act('power')}
                color={isOperating && 'green'}
              >
                {isOperating
                  ? t('cryo-power-on', {}, 'On')
                  : t('cryo-power-off', {}, 'Off')}
              </Button>
            </LabeledList.Item>
            <LabeledList.Item label={t('cryo-temperature', {}, 'Temperature')}>
              <AnimatedNumber value={round(data.cellTemperature, 0)} /> K
            </LabeledList.Item>
            <LabeledList.Item label={t('cryo-door', {}, 'Door')}>
              <Button
                icon={isOpen ? 'unlock' : 'lock'}
                onClick={() => act('door')}
              >
                {isOpen
                  ? t('cryo-door-open', {}, 'Open')
                  : t('cryo-door-closed', {}, 'Closed')}
              </Button>
              <Button
                icon={data.autoEject ? 'sign-out-alt' : 'sign-in-alt'}
                onClick={() => act('autoeject')}
              >
                {data.autoEject
                  ? t('cryo-eject-auto', {}, 'Auto')
                  : t('cryo-eject-manual', {}, 'Manual')}
              </Button>
            </LabeledList.Item>
          </LabeledList>
        </Section>
        <BeakerSectionDisplay beaker={data.beaker} showpH={false} />
      </Window.Content>
    </Window>
  );
};
