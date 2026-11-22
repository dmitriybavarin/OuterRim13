import { sortBy } from 'es-toolkit';
import { useState } from 'react';
import {
  Box,
  Button,
  Icon,
  Input,
  NoticeBox,
  ProgressBar,
  Section,
  Table,
  Tooltip,
  DmIcon,
} from 'tgui-core/components';
import { createSearch } from 'tgui-core/string';
import { formatTime } from 'tgui-core/format';

import { useT } from '../i18n';

export type TraitData = {
  path: string;
  name: string;
  icon: string;
  description: string;
};

type ReagentData = {
  name: string;
  rate: number;
};

export type SeedData = {
  key: string;
  amount?: number;
  name: string;
  lifespan: number;
  endurance: number;
  maturation: number;
  production: number;
  yield: number;
  potency: number;
  instability: number;
  icon: string;
  icon_state: string;
  volume_mod: number;
  volume_units: number;
  traits: string[];
  reagents: ReagentData[];
  mutatelist: string[];
  grind_results: string[];
  distill_reagent: string;
  juice_name: string;
};

type SeedTableProps = {
  // Dynamic
  seeds: SeedData[];
  // Static
  trait_db: TraitData[];
  cycle_seconds: number;
  renderActions?: (item: SeedData) => React.ReactNode;
};

export const SeedTable = (props: SeedTableProps) => {
  const t = useT();
  const [searchText, setSearchText] = useState('');
  const [sortField, setSortField] = useState('name');
  const search = createSearch(searchText, (item: SeedData) => item.name);
  const seeds_filtered =
    searchText.length > 0 ? props.seeds.filter(search) : props.seeds;
  const seeds_sorted = sortBy(seeds_filtered || [], [
    (item: SeedData) => item[sortField as keyof SeedData],
  ]);
  sortField !== 'name' && seeds_sorted.reverse();

  return (
    <Section>
      <Table>
        <Table.Row header>
          <Table.Cell colSpan={3} px={1} py={2}>
            <Input
              autoFocus
              placeholder={t('seedtable-search', {}, 'Search...')}
              value={searchText}
              onChange={setSearchText}
              fluid
            />
          </Table.Cell>
          <Table.Cell collapsing p={1}>
            <Tooltip
              content={
                t('seedtable-potency-tip', {}, 'Potency: Determines product mass, reagent volume and strength of effects.')
              }
            >
              <Box
                style={{ cursor: 'pointer', textAlign: "center" }}
                onClick={(e) => setSortField('potency')}
              >
                {t('seedtable-potency-abbr', {}, 'PTN')}
              </Box>
            </Tooltip>
          </Table.Cell>
          <Table.Cell collapsing p={1}>
            <Tooltip
              content={
                t('seedtable-yield-tip', {}, 'Yield: The number of products gathered in a single harvest.')
              }
            >
              <Box
                style={{ cursor: 'pointer', textAlign: "center" }}
                onClick={(e) => setSortField('yield')}
              >
                {t('seedtable-yield-abbr', {}, 'YLD')}
              </Box>
            </Tooltip>
          </Table.Cell>
          <Table.Cell collapsing p={1}>
            <Tooltip
              content={
                t('seedtable-instability-tip', {}, 'Instability: The likelihood of the plant to randomize stats or mutate. Affects quality of resulting food & drinks.')
              }
            >
              <Box
                style={{ cursor: 'pointer', textAlign: "center" }}
                onClick={(e) => setSortField('instability')}
              >
                {t('seedtable-instability-abbr', {}, 'INS')}
              </Box>
            </Tooltip>
          </Table.Cell>
          <Table.Cell collapsing p={1}>
            <Tooltip
              content={
                t('seedtable-endurance-tip', {}, 'Endurance: The health pool of the plant that delays death. Improves quality of resulting food & drinks.')
              }
            >
              <Box
                style={{ cursor: 'pointer', textAlign: "center" }}
                onClick={(e) => setSortField('endurance')}
              >
                {t('seedtable-endurance-abbr', {}, 'END')}
              </Box>
            </Tooltip>
          </Table.Cell>
          <Table.Cell collapsing p={1}>
            <Tooltip
              content={t('seedtable-lifespan-tip', {}, 'Lifespan: The age at which the plant starts decaying. Improves quality of resulting food & drinks.')}
            >
              <Box
                style={{ cursor: 'pointer', textAlign: "center" }}
                onClick={(e) => setSortField('lifespan')}
              >
                {t('seedtable-lifespan-abbr', {}, 'LFS')}
              </Box>
            </Tooltip>
          </Table.Cell>
          <Table.Cell collapsing p={1}>
            <Tooltip
              content={t('seedtable-maturation-tip', {}, 'Maturation: The age required for the first harvest.')}
            >
              <Box
                style={{ cursor: 'pointer', textAlign: "center" }}
                onClick={(e) => setSortField('maturation')}
              >
                {t('seedtable-maturation-abbr', {}, 'MTR')}
              </Box>
            </Tooltip>
          </Table.Cell>
          <Table.Cell collapsing p={1}>
            <Tooltip
              content={t('seedtable-production-tip', {}, 'Production: The period of product regrowth.')}
            >
              <Box
                style={{ cursor: 'pointer', textAlign: "center" }}
                onClick={(e) => setSortField('production')}
              >
                {t('seedtable-production-abbr', {}, 'PRD')}
              </Box>
            </Tooltip>
          </Table.Cell>
          <Table.Cell collapsing p={1} textAlign="right">
            {sortField !== 'name' && (
              <Tooltip content={t('seedtable-reset-sort', {}, 'Reset sorting')}>
                <Button
                  color="transparent"
                  icon="refresh"
                  onClick={(e) => setSortField('name')}
                />
              </Tooltip>
            )}
            <Box align="right" />
          </Table.Cell>
        </Table.Row>
        {seeds_sorted.length > 0 &&
          seeds_sorted.map((item) => (
            <Table.Row
              key={item.key}
              style={{ borderTop: '2px solid #222' }}
            >
              <Table.Cell collapsing>
                <DmIcon
                  mb={-2}
                  icon={item.icon}
                  icon_state={item.icon_state}
                  width="32px"
                  height="32px"
                />
              </Table.Cell>
              <Table.Cell py={0.5} px={1}>
                {`${item.amount ? `${item.amount}x ` : ''}${item.name}`}
              </Table.Cell>
              <Table.Cell py={0.5} px={1} collapsing textAlign={'right'}>
                {item.traits?.map((trait) => (
                  <TraitTooltip
                    key=""
                    path={trait}
                    trait_db={props.trait_db}
                  />
                ))}
                {!!item.mutatelist.length && (
                  <Tooltip
                    content={t(
                      'seedtable-mutates',
                      { list: item.mutatelist.join(', ') },
                      `Mutates into: ${item.mutatelist.join(', ')}`,
                    )}
                  >
                    <Icon name="dna" m={0.5} />
                  </Tooltip>
                )}
                {item.reagents.length > 0 && (
                  <Tooltip
                    content={
                      <ReagentTooltip
                        reagents={item.reagents}
                        grind_results={item.grind_results}
                        potency={item.potency}
                        volume_mod={item.volume_mod}
                        volume_units={item.volume_units}
                      />
                    }
                  >
                    <Icon name="blender" m={0.5} />
                  </Tooltip>
                )}
                {!!item.juice_name && (
                  <Tooltip content={t(
                      'seedtable-juice',
                      { name: item.juice_name },
                      `Juicing result: ${item.juice_name}`,
                    )}>
                    <Icon name="glass-water" m={0.5} />
                  </Tooltip>
                )}
                {!!item.distill_reagent && (
                  <Tooltip
                    content={t(
                      'seedtable-ferments',
                      { name: item.distill_reagent },
                      `Ferments into: ${item.distill_reagent}`,
                    )}
                  >
                    <Icon name="wine-bottle" m={0.5} />
                  </Tooltip>
                )}
              </Table.Cell>
              <Table.Cell px={1} collapsing>
                <Level value={item.potency} max={100} />
              </Table.Cell>
              <Table.Cell py={0.5} px={1} collapsing>
                <Level value={item.yield} max={10} />
              </Table.Cell>
              <Table.Cell py={0.5} px={1} collapsing>
                <Level value={item.instability} max={100} reverse />
              </Table.Cell>
              <Table.Cell py={0.5} px={1} collapsing>
                <Level value={item.endurance} max={100} />
              </Table.Cell>
              <Table.Cell py={0.5} px={1} collapsing>
                <Box textAlign="center">{formatTime(item.lifespan * props.cycle_seconds * 10, 'short')}</Box>
              </Table.Cell>
              <Table.Cell py={0.5} px={1} collapsing>
                <Box textAlign="center">{formatTime(item.maturation * props.cycle_seconds * 10, 'short')}</Box>
              </Table.Cell>
              <Table.Cell py={0.5} px={1} collapsing>
                <Box textAlign="center">{formatTime(item.production * props.cycle_seconds * 10, 'short')}</Box>
              </Table.Cell>
              <Table.Cell
                py={0.5}
                px={1}
                collapsing
                colSpan={2}
                textAlign="right"
              >
                {props.renderActions?.(item)}
              </Table.Cell>
            </Table.Row>
          ))}
      </Table>
      {seeds_sorted.length === 0 && (
        <NoticeBox m={1} p={1}>
          {t('seedtable-empty', {}, 'No seeds found.')}
        </NoticeBox>
      )}
    </Section>
  )
}

export const Level = (props) => {
  return (
    <ProgressBar
      value={props.value}
      maxValue={props.max}
      ranges={
        props.reverse
          ? {
              good: [0, props.max * 0.2],
              average: [props.max * 0.2, props.max * 0.6],
              bad: [props.max * 0.6, props.max],
            }
          : {
              bad: [0, props.max * 0.2],
              good: [props.max * 0.8, props.max],
            }
      }
    >
      <span
        style={{
          textShadow: '1px 1px 0 black',
        }}
      >
        {props.value}
      </span>
    </ProgressBar>
  );
};

export const ReagentTooltip = (props) => {
  const t = useT();
  let rate_total = 0;
  props.reagents.forEach((reagent) => {
    rate_total += reagent.rate;
  });
  const reagent_volumes: number[] = [];
  const reagent_percentages: number[] = [];
  props.reagents.forEach((reagent) => {
    reagent_percentages.push(reagent.rate / Math.max(1, rate_total));
    reagent_volumes.push(
      Math.max(
        Math.round(
          props.volume_units *
            (props.potency / 100) *
            (reagent.rate / Math.max(1, rate_total)) *
            props.volume_mod,
        ),
        1,
      ),
    );
  });
  return (
    <Table>
      <Table.Row header>
        <Table.Cell colSpan={3}>{t('seedtable-reagents-grind', {}, 'Reagents on grind:')}</Table.Cell>
      </Table.Row>
      {props.reagents?.map((reagent, i) => (
        <Table.Row key={i}>
          <Table.Cell>{reagent.name}</Table.Cell>
          <Table.Cell py={0.5} pl={2} textAlign={'right'}>
            {reagent_volumes[i]}u
          </Table.Cell>
          <Table.Cell py={0.5} pl={2} textAlign={'right'}>
            {rate_total > 1 && '~'}
            {Math.round(reagent_percentages[i] * 100)}%
          </Table.Cell>
        </Table.Row>
      ))}
      <Table.Row>
        <Table.Cell colSpan={3} style={{ borderTop: '1px dotted gray' }} />
      </Table.Row>
      <Table.Row header>
        <Table.Cell pt={1.5}>{t('seedtable-total', {}, 'Total')}</Table.Cell>
        <Table.Cell py={0.5} pl={2} textAlign={'right'}>
          {Math.round(reagent_volumes.reduce((a, b) => a + b))}u
        </Table.Cell>
        <Table.Cell py={0.5} pl={2} textAlign={'right'}>
          {Math.round(rate_total * 100)}%
        </Table.Cell>
      </Table.Row>
      <Table.Row header>
        <Table.Cell>{t('seedtable-capacity', {}, 'Capacity')}</Table.Cell>
        <Table.Cell py={0.5} pl={2} textAlign={'right'}>
          {props.volume_units}u
        </Table.Cell>
        <Table.Cell />
      </Table.Row>
      {!!props.grind_results.length && (
        <>
          <Table.Row>
            <Table.Cell colSpan={3} style={{ borderTop: '1px dotted gray' }} />
          </Table.Row>
          <Table.Row header>
            <Table.Cell colSpan={3} pt={1}>
              {t('seedtable-nutriments', {}, 'Nutriments turn into:')}
            </Table.Cell>
          </Table.Row>
          {props.grind_results?.map((reagent, i) => (
            <Table.Row key={i}>
              <Table.Cell colSpan={3}>{reagent}</Table.Cell>
            </Table.Row>
          ))}
        </>
      )}
    </Table>
  );
};

export const TraitTooltip = (props) => {
  const t = useT();
  const trait = props.trait_db.find((entry) => {
    return entry.path === props.path;
  });
  if (!trait) {
    return;
  }
  return (
    <Tooltip
      content={
        <Table>
          {!!props.grafting && (
            <Table.Row>
              <Table.Cell pb={1}>{t('seedtable-graft-trait', {}, 'Graft gains the following trait:')}</Table.Cell>
            </Table.Row>
          )}
          <Table.Row header>
            <Table.Cell>
              <Icon name={trait.icon} mr={1} />
              {trait.name}
            </Table.Cell>
          </Table.Row>
          {!!props.removable && (
            <Table.Row>
              <Table.Cell pb={1}>{t('seedtable-removable', {}, 'Removable trait.')}</Table.Cell>
            </Table.Row>
          )}
          {!!trait.description && (
            <Table.Row>
              <Table.Cell>{trait.description}</Table.Cell>
            </Table.Row>
          )}
        </Table>
      }
    >
      <Icon name={props.grafting ? 'scissors' : trait.icon} m={0.5} />
    </Tooltip>
  );
};
