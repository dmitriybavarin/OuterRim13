import { useBackend } from 'tgui/backend';
import { Button, LabeledList, NumberInput } from 'tgui-core/components';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  threshold: number;
  connections: number;
};

export const ChemAutomaticBuffer = () => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { threshold, connections } = data;
  return (
    <Window width={250} height={120}>
      <Window.Content>
        <LabeledList>
          <LabeledList.Item label={t('chemautomaticbuffer-threshold', {}, 'Threshold')}>
            <NumberInput
              minValue={1}
              maxValue={200}
              value={threshold}
              step={1}
              onChange={(value) =>
                act('set_threshold', {
                  threshold: value,
                })
              }
            />
          </LabeledList.Item>
          <LabeledList.Item label={t('chemautomaticbuffer-connections', {}, 'Connections')}>
            {connections || t('chemautomaticbuffer-connections-none', {}, 'N/A')}
          </LabeledList.Item>
          <LabeledList.Item label={t('chemautomaticbuffer-sync', {}, 'Sync')}>
            <Button onClick={() => act('sync')}>
              {t('chemautomaticbuffer-sync-values', {}, 'Sync Values')}
            </Button>
          </LabeledList.Item>
        </LabeledList>
      </Window.Content>
    </Window>
  );
};
