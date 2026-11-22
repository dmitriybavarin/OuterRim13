import { useBackend } from 'tgui/backend';
import {
  Button,
  LabeledList,
  NumberInput,
  Section,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  enabled: BooleanLike;
  max_volume: number;
  disposal_rate: number;
};

export function ChemDisposer() {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { enabled, max_volume, disposal_rate } = data;

  return (
    <Window width={320} height={105}>
      <Window.Content>
        <Section
          title={t('chemdisposer-control-panel', {}, 'Control Panel')}
          buttons={
            <Button
              icon="power-off"
              selected={enabled}
              onClick={() => act('toggle_power')}
            >
              {enabled
                ? t('chemistry-on', {}, 'On')
                : t('chemistry-off', {}, 'Off')}
            </Button>
          }
        >
          <LabeledList>
            <LabeledList.Item label={t('chemdisposer-volume', {}, 'Volume')}>
              <NumberInput
                value={disposal_rate}
                unit="u"
                width="50px"
                minValue={0.1}
                maxValue={max_volume}
                step={1}
                stepPixelSize={2}
                onChange={(value) =>
                  act('change_volume', {
                    volume: value,
                  })
                }
              />
            </LabeledList.Item>
          </LabeledList>
        </Section>
      </Window.Content>
    </Window>
  );
}
