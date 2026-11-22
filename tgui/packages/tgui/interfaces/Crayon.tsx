import { Button, LabeledList, Section } from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';
import { ColorItem } from './RapidPipeDispenser';

type Data = {
  has_cap: BooleanLike;
  can_change_colour: BooleanLike;
  drawables: Drawable[];
  is_capped: BooleanLike;
  selected_stencil: string;
  is_literate_user: BooleanLike;
  text_buffer: string;
};

type Drawable = {
  items: { item: string }[];
  name: string;
};

export const Crayon = (props) => {
  const { act, data } = useBackend<Data>();
  const {
    has_cap,
    can_change_colour,
    drawables = [],
    is_capped,
    selected_stencil,
    is_literate_user,
    text_buffer,
  } = data;
  const capOrChanges = has_cap || can_change_colour;
  const t = useT();

  return (
    <Window width={600} height={600}>
      <Window.Content scrollable>
        {!!capOrChanges && (
          <Section title={t('crayon-basic', {}, 'Basic')}>
            <LabeledList>
              <LabeledList.Item label={t('crayon-cap', {}, 'Cap')}>
                <Button
                  icon={is_capped ? 'power-off' : 'times'}
                  content={
                    is_capped
                      ? t('crayon-on', {}, 'On')
                      : t('crayon-off', {}, 'Off')
                  }
                  selected={is_capped}
                  onClick={() => act('toggle_cap')}
                />
              </LabeledList.Item>
              <ColorItem />
              <LabeledList.Item>
                <Button
                  content={t('crayon-custom-color', {}, 'Custom color')}
                  onClick={() => act('custom_color')}
                />
              </LabeledList.Item>
            </LabeledList>
          </Section>
        )}
        <Section title={t('crayon-stencil', {}, 'Stencil')}>
          <LabeledList>
            {drawables.map((drawable) => {
              const items = drawable.items || [];
              return (
                <LabeledList.Item key={drawable.name} label={drawable.name}>
                  {items.map((item) => (
                    <Button
                      key={item.item}
                      content={item.item}
                      selected={item.item === selected_stencil}
                      onClick={() =>
                        act('select_stencil', {
                          item: item.item,
                        })
                      }
                    />
                  ))}
                </LabeledList.Item>
              );
            })}
          </LabeledList>
        </Section>
        {!!is_literate_user && (
          <Section title={t('crayon-text', {}, 'Text')}>
            <LabeledList>
              <LabeledList.Item label={t('crayon-buffer', {}, 'Current Buffer')}>
                {text_buffer}
              </LabeledList.Item>
            </LabeledList>
            <Button
              content={t('crayon-new-text', {}, 'New Text')}
              onClick={() => act('enter_text')}
            />
          </Section>
        )}
      </Window.Content>
    </Window>
  );
};
