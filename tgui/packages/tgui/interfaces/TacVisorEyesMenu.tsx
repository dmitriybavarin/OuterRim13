import { Button, Dropdown, LabeledList, Section } from 'tgui-core/components';
import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  friendlyFaction: string;
  hostileFaction: string;
  visorDisplay: string;
  threatFlags: number;

  validFriendlyFactions: string[];
  validHostileFactions: string[];
  visorOptions: string[];
  threatOptions: Record<string, number>;
};

export const TacVisorEyesMenu = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const {
    friendlyFaction,
    hostileFaction,
    visorDisplay,
    threatFlags,
    validFriendlyFactions,
    validHostileFactions,
    visorOptions,
    threatOptions,
  } = data;
  return (
    <Window title={t('tacvisor-title', {}, 'Tactical IFF Visor')} width={320} height={264}>
      <Window.Content>
        <Section title={t('tacvisor-settings', {}, 'Settings')}>
          <LabeledList>
            <LabeledList.Item label={t('tacvisor-friendly', {}, 'Friendly Faction')}>
              <Dropdown
                options={validFriendlyFactions}
                selected={friendlyFaction}
                onSelected={(value) => act('set_friendly', { faction: value })}
              />
            </LabeledList.Item>
            <LabeledList.Item label={t('tacvisor-hostile', {}, 'Hostile Faction')}>
              <Dropdown
                options={validHostileFactions}
                selected={hostileFaction}
                onSelected={(value) => act('set_hostile', { faction: value })}
              />
            </LabeledList.Item>
            <LabeledList.Item label={t('tacvisor-image', {}, 'Visor Image')}>
              <Dropdown
                options={visorOptions}
                selected={visorDisplay}
                onSelected={(value) => act('set_display', { display: value })}
              />
            </LabeledList.Item>
          </LabeledList>
        </Section>
        <Section title={t('tacvisor-threat', {}, 'Threat Parameters')}>
          {Object.keys(threatOptions).map((option) => (
            <Button.Checkbox
              key={option}
              checked={threatFlags & threatOptions[option]}
              onClick={() =>
                act('set_threat_flags', {
                  threat_flags: threatFlags ^ threatOptions[option],
                })
              }
            >
              {option}
            </Button.Checkbox>
          ))}
        </Section>
      </Window.Content>
    </Window>
  );
};
