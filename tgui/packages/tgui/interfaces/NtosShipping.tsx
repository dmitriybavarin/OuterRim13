import { Box, Button, LabeledList, Section } from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { NtosWindow } from '../layouts';

type Data = {
  current_user: string;
  card_owner: string;
  paperamt: number;
  barcode_split: number;
  has_id_slot: BooleanLike;
};

export const NtosShipping = (props) => {
  return (
    <NtosWindow width={450} height={350}>
      <NtosWindow.Content scrollable>
        <ShippingHub />
        <ShippingOptions />
      </NtosWindow.Content>
    </NtosWindow>
  );
};

/** Returns information about the current user, available paper, etc */
const ShippingHub = (props) => {
  const { act, data } = useBackend<Data>();
  const { current_user, card_owner, paperamt, barcode_split } = data;
  const t = useT();

  return (
    <Section
      title={t('ntosshipping-hub', {}, 'NTOS Shipping Hub.')}
      buttons={
        <Button
          icon="eject"
          content={t('ntosshipping-eject', {}, 'Eject Id')}
          onClick={() => act('ejectid')}
        />
      }
    >
      <LabeledList>
        <LabeledList.Item label={t('ntosshipping-current-user', {}, 'Current User')}>
          {current_user || t('ntosshipping-na', {}, 'N/A')}
        </LabeledList.Item>
        <LabeledList.Item label={t('ntosshipping-inserted-card', {}, 'Inserted Card')}>
          {card_owner || t('ntosshipping-na', {}, 'N/A')}
        </LabeledList.Item>
        <LabeledList.Item
          label={t('ntosshipping-paper', {}, 'Available Paper')}
        >
          {paperamt}
        </LabeledList.Item>
        <LabeledList.Item label={t('ntosshipping-profit', {}, 'Profit on Sale')}>
          {barcode_split}%
        </LabeledList.Item>
      </LabeledList>
    </Section>
  );
};

/** Returns shipping options */
const ShippingOptions = (props) => {
  const { act, data } = useBackend<Data>();
  const { has_id_slot, current_user } = data;
  const t = useT();

  return (
    <Section title={t('ntosshipping-options', {}, 'Shipping Options')}>
      <Box>
        <Button
          icon="id-card"
          tooltip={t(
            'ntosshipping-set-id-tooltip',
            {},
            'The currently ID card will become the current user.',
          )}
          tooltipPosition="right"
          disabled={!has_id_slot}
          onClick={() => act('selectid')}
          content={t('ntosshipping-set-id', {}, 'Set Current ID')}
        />
      </Box>
      <Box>
        <Button
          icon="print"
          tooltip={t(
            'ntosshipping-print-tooltip',
            {},
            'Print a barcode to use on a wrapped package.',
          )}
          tooltipPosition="right"
          disabled={!current_user}
          onClick={() => act('print')}
          content={t('ntosshipping-print', {}, 'Print Barcode')}
        />
      </Box>
      <Box>
        <Button
          icon="tags"
          tooltip={t(
            'ntosshipping-split-tooltip',
            {},
            "Set how much profit you'd like on your package.",
          )}
          tooltipPosition="right"
          onClick={() => act('setsplit')}
          content={t('ntosshipping-split', {}, 'Set Profit Margin')}
        />
      </Box>
      <Box>
        <Button
          icon="sync-alt"
          content={t('ntosshipping-reset', {}, 'Reset ID')}
          onClick={() => act('resetid')}
        />
      </Box>
    </Section>
  );
};
