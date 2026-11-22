import {
  Button,
  Input,
  NoticeBox,
  ProgressBar,
  Section,
  Table,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type GeneratorStats = {
  name: string;
  id: number;
  max_strength: number;
  current_strength: number;
  active: BooleanLike;
  recovering: BooleanLike;
  current_regeneration: number;
};

type Data = {
  generators: GeneratorStats[];
};

export const ModularShieldConsole = () => {
  const { data } = useBackend<Data>();
  const t = useT();
  const { generators } = data;
  return (
    <Window title={t('modularshield-title', {}, 'Modular Shield Console')} width={450} height={275}>
      <Window.Content scrollable>
        {generators.length === 0 ? (
          <NoticeBox>
            {t('modularshield-no-generators', {}, 'No Generators Connected')}
          </NoticeBox>
        ) : (
          <Section minHeight="200px">
            <GeneratorTable />
          </Section>
        )}
      </Window.Content>
    </Window>
  );
};

const GeneratorTable = () => {
  const { data } = useBackend<Data>();
  const t = useT();
  const { generators } = data;
  return (
    <Table>
      <Table.Row>
        <Table.Cell bold>{t('modularshield-name', {}, 'Name')}</Table.Cell>
        <Table.Cell bold collapsing textAlign="center">
          {t('modularshield-status', {}, 'Status')}
        </Table.Cell>
        <Table.Cell bold textAlign="center">
          {t('modularshield-toggle', {}, 'Toggle')}
        </Table.Cell>
      </Table.Row>
      {generators.map((stat) => (
        <GeneratorTableEntry GeneratorData={stat} key={stat.id} />
      ))}
    </Table>
  );
};

type GeneratorTableEntryProps = {
  GeneratorData: GeneratorStats;
};

const GeneratorTableEntry = (props: GeneratorTableEntryProps) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { GeneratorData } = props;
  const {
    name,
    id,
    max_strength,
    current_strength,
    active,
    recovering,
    current_regeneration,
  } = GeneratorData;

  return (
    <Table.Row className="candystripe">
      <Table.Cell>
        <Input
          value={name}
          width="170px"
          onBlur={(value) =>
            act('rename', {
              id,
              name: value,
            })
          }
        />
      </Table.Cell>
      <Table.Cell
        collapsing
        textAlign="center"
        color={recovering ? 'red' : 'white'}
      >
        <ProgressBar
          width="170px"
          value={current_strength}
          maxValue={max_strength}
          ranges={{
            good: [max_strength * 0.75, max_strength],
            average: [max_strength * 0.25, max_strength * 0.75],
            bad: [0, max_strength * 0.25],
          }}
        >
          {current_strength}/{max_strength} + {current_regeneration}
        </ProgressBar>
      </Table.Cell>
      <Table.Cell>
        <Button
          bold
          disabled={recovering}
          selected={active}
          content={
            active
              ? t('modularshield-on', {}, 'On')
              : t('modularshield-off', {}, 'Off')
          }
          icon="power-off"
          onClick={() => act('toggle_shields', { id })}
        />
      </Table.Cell>
    </Table.Row>
  );
};
