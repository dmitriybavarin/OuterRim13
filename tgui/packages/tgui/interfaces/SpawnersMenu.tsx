import { useBackend } from 'tgui/backend';
import { useT } from 'tgui/i18n';
import { Window } from 'tgui/layouts';
import { Button, LabeledList, Section, Stack } from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';
import { capitalizeAll } from 'tgui-core/string';

type Data = {
  spawners: Spawner[];
};

type Spawner = {
  name: string;
  amount_left: number;
  infinite: BooleanLike;
} & Partial<{
  desc: string;
  you_are_text: string;
  flavor_text: string;
  important_text: string;
}>;

export const SpawnersMenu = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { spawners = [] } = data;

  return (
    <Window title={t('spawners-title', {}, 'Spawners Menu')} width={700} height={525}>
      <Window.Content scrollable>
        <Stack vertical>
          {spawners.map((spawner) => (
            <Stack.Item key={spawner.name}>
              <Section
                fill
                // Capitalizes the spawner name
                title={capitalizeAll(spawner.name)}
                buttons={
                  <Stack>
                    {spawner.infinite ? (
                      <Stack.Item fontSize="14px" color="green">
                        {t('spawners-infinite', {}, 'Infinite')}
                      </Stack.Item>
                    ) : (
                      <Stack.Item fontSize="14px" color="green">
                        {t(
                          'spawners-left',
                          { count: spawner.amount_left },
                          `${spawner.amount_left} left`,
                        )}
                      </Stack.Item>
                    )}
                    <Stack.Item>
                      <Button
                        content={t('spawners-jump', {}, 'Jump')}
                        onClick={() =>
                          act('jump', {
                            name: spawner.name,
                          })
                        }
                      />
                      <Button
                        content={t('spawners-spawn', {}, 'Spawn')}
                        onClick={() =>
                          act('spawn', {
                            name: spawner.name,
                          })
                        }
                      />
                    </Stack.Item>
                  </Stack>
                }
              >
                <LabeledList>
                  {spawner.desc ? (
                    <LabeledList.Item label={t('spawners-description', {}, 'Description')}>
                      {spawner.desc}
                    </LabeledList.Item>
                  ) : (
                    <div>
                      <LabeledList.Item label={t('spawners-origin', {}, 'Origin')}>
                        {spawner.you_are_text || t('spawners-unknown', {}, 'Unknown')}
                      </LabeledList.Item>
                      <LabeledList.Item label={t('spawners-directives', {}, 'Directives')}>
                        {spawner.flavor_text || t('spawners-none', {}, 'None')}
                      </LabeledList.Item>
                      <LabeledList.Item color="bad" label={t('spawners-conditions', {}, 'Conditions')}>
                        {spawner.important_text || t('spawners-none', {}, 'None')}
                      </LabeledList.Item>
                    </div>
                  )}
                </LabeledList>
              </Section>
            </Stack.Item>
          ))}
        </Stack>
      </Window.Content>
    </Window>
  );
};
