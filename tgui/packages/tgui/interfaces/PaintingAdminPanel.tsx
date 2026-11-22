import { useState } from 'react';
import { Box, Button, LabeledList, Section, Table } from 'tgui-core/components';
import { decodeHtmlEntities } from 'tgui-core/string';

import { resolveAsset } from '../assets';
import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type PaintingAdminPanelData = {
  paintings: PaintingData[];
};

type PaintingData = {
  md5: string;
  title: string;
  creator_ckey: string;
  creator_name: string | null;
  creation_date: Date | null;
  creation_round_id: number | null;
  patron_ckey: string | null;
  patron_name: string | null;
  credit_value: number;
  width: number;
  height: number;
  ref: string;
  tags: string[] | null;
  medium: string | null;
};

export const PaintingAdminPanel = (props) => {
  const { act, data } = useBackend<PaintingAdminPanelData>();
  const [chosenPaintingRef, setChosenPaintingRef] = useState<
    string | undefined
  >();
  const { paintings } = data;
  const chosenPainting = paintings.find((p) => p.ref === chosenPaintingRef);
  const t = useT();

  return (
    <Window title={t('paintingadmin-title', {}, 'Painting Admin Panel')} width={800} height={600}>
      <Window.Content scrollable>
        {chosenPainting && (
          <Section
            title={t('paintingadmin-info', {}, 'Painting Information')}
            buttons={
              <Button onClick={() => setChosenPaintingRef(undefined)}>
                {t('paintingadmin-close', {}, 'Close')}
              </Button>
            }
          >
            <img
              src={resolveAsset(`paintings_${chosenPainting.md5}`)}
              height="96px"
              width="96px"
              style={{
                verticalAlign: 'middle',
              }}
            />
            <LabeledList>
              <LabeledList.Item label={t('paintingadmin-md5', {}, 'md5')} content={chosenPainting.md5} />
              <LabeledList.Item label={t('paintingadmin-label-title', {}, 'title')}>
                <Box inline style={{ wordBreak: 'break-all' }}>
                  {decodeHtmlEntities(chosenPainting.title)}
                </Box>
                <Button
                  onClick={() => act('rename', { ref: chosenPainting.ref })}
                  icon="edit"
                />
              </LabeledList.Item>
              <LabeledList.Item
                label={t('paintingadmin-creator-ckey', {}, 'creator ckey')}
                content={chosenPainting.creator_ckey}
              />
              <LabeledList.Item label={t('paintingadmin-creator-name', {}, 'creator name')}>
                <Box inline>{chosenPainting.creator_name}</Box>
                <Button
                  onClick={() =>
                    act('rename_author', { ref: chosenPainting.ref })
                  }
                  icon="edit"
                />
              </LabeledList.Item>
              <LabeledList.Item
                label={t('paintingadmin-date', {}, 'creation date')}
                content={chosenPainting.creation_date}
              />
              <LabeledList.Item
                label={t('paintingadmin-round', {}, 'creation round id')}
                content={chosenPainting.creation_round_id}
              />
              <LabeledList.Item
                label={t('paintingadmin-medium', {}, 'medium')}
                content={chosenPainting.medium}
              />
              <LabeledList.Item label={t('paintingadmin-tags', {}, 'tags')}>
                {chosenPainting.tags?.map((tag) => (
                  <Button
                    key={tag}
                    color="red"
                    icon="minus-circle"
                    iconPosition="right"
                    content={tag}
                    onClick={() =>
                      act('remove_tag', { tag, ref: chosenPainting.ref })
                    }
                  />
                ))}
                <Button
                  color="green"
                  icon="plus-circle"
                  onClick={() => act('add_tag', { ref: chosenPainting.ref })}
                />
              </LabeledList.Item>
              <LabeledList.Item
                label={t('paintingadmin-patron-ckey', {}, 'patron ckey')}
                content={chosenPainting.patron_ckey}
              />
              <LabeledList.Item
                label={t('paintingadmin-patron-name', {}, 'patron name')}
                content={chosenPainting.patron_name}
              />
              <LabeledList.Item
                label={t('paintingadmin-credit', {}, 'credit value')}
                content={chosenPainting.credit_value}
              />
              <LabeledList.Item label={t('paintingadmin-width', {}, 'width')} content={chosenPainting.width} />
              <LabeledList.Item
                label={t('paintingadmin-height', {}, 'height')}
                content={chosenPainting.height}
              />
            </LabeledList>
            <Section title={t('paintingadmin-actions', {}, 'Actions')}>
              <Button.Confirm
                onClick={() => {
                  setChosenPaintingRef(undefined);
                  act('delete', { ref: chosenPainting.ref });
                }}
                content={t('paintingadmin-delete', {}, 'Delete')}
              />
              <Button
                onClick={() => act('dumpit', { ref: chosenPainting.ref })}
              >
                {t('paintingadmin-reset', {}, 'Reset Patronage')}
              </Button>
            </Section>
          </Section>
        )}
        {!chosenPainting && (
          <Table>
            <Table.Row>
              <Table.Cell color="label">
                {t('paintingadmin-col-title', {}, 'Title')}
              </Table.Cell>
              <Table.Cell color="label">
                {t('paintingadmin-col-author', {}, 'Author')}
              </Table.Cell>
              <Table.Cell color="label">
                {t('paintingadmin-col-preview', {}, 'Preview')}
              </Table.Cell>
              <Table.Cell color="label">
                {t('paintingadmin-actions', {}, 'Actions')}
              </Table.Cell>
            </Table.Row>
            {paintings.map((painting) => (
              <Table.Row key={painting.ref} className="candystripe">
                <Table.Cell style={{ wordBreak: 'break-all' }}>
                  {decodeHtmlEntities(painting.title)}
                </Table.Cell>
                <Table.Cell>{painting.creator_ckey}</Table.Cell>
                <Table.Cell>
                  <img
                    src={resolveAsset(`paintings_${painting.md5}`)}
                    height="36px"
                    width="36px"
                    style={{
                      verticalAlign: 'middle',
                    }}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Button onClick={() => setChosenPaintingRef(painting.ref)}>
                    {t('paintingadmin-edit', {}, 'Edit')}
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table>
        )}
      </Window.Content>
    </Window>
  );
};
