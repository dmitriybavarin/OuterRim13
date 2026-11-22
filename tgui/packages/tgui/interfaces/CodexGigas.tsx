import { Button, LabeledList, Section } from 'tgui-core/components';

import { useBackend } from '../backend';
import { slugify, useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  name: string;
  currentSection: number;
};

const PREFIXES = [
  'Dark',
  'Hellish',
  'Fallen',
  'Fiery',
  'Sinful',
  'Blood',
  'Fluffy',
] as const;

const TITLES = [
  'Lord',
  'Prelate',
  'Count',
  'Viscount',
  'Vizier',
  'Elder',
  'Adept',
] as const;

const NAMES = [
  'hal',
  've',
  'odr',
  'neit',
  'ci',
  'quon',
  'mya',
  'folth',
  'wren',
  'geyr',
  'hil',
  'niet',
  'twou',
  'phi',
  'coa',
] as const;

const SUFFIXES = [
  'the Red',
  'the Soulless',
  'the Master',
  'the Lord of all things',
  'Jr.',
] as const;

export const CodexGigas = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { name, currentSection } = data;

  return (
    <Window width={450} height={450}>
      <Window.Content>
        <Section>
          {name}
          <LabeledList>
            <Prefixes />
            <Titles />
            <Names />
            <Suffixes />
            <LabeledList.Item label={t('codexgigas-submit', {}, 'Submit')}>
              <Button
                content={t('codexgigas-search', {}, 'Search')}
                disabled={currentSection < 4}
                onClick={() => act('search')}
              />
            </LabeledList.Item>
          </LabeledList>
        </Section>
      </Window.Content>
    </Window>
  );
};

const Prefixes = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { currentSection } = data;

  return (
    <LabeledList.Item label={t('codexgigas-prefix', {}, 'Prefix')}>
      {PREFIXES.map((prefix) => (
        <Button
          key={prefix.toLowerCase()}
          content={t(`codexgigas-prefix-${slugify(prefix)}`, {}, prefix)}
          disabled={currentSection !== 1}
          onClick={() => act(`${prefix} `)}
        />
      ))}
    </LabeledList.Item>
  );
};

const Titles = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { currentSection } = data;

  return (
    <LabeledList.Item label={t('codexgigas-title', {}, 'Title')}>
      {TITLES.map((title) => (
        <Button
          key={title.toLowerCase()}
          content={t(`codexgigas-title-${slugify(title)}`, {}, title)}
          disabled={currentSection !== 2}
          onClick={() => act(title)}
        />
      ))}
    </LabeledList.Item>
  );
};

const Names = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { currentSection } = data;

  return (
    <LabeledList.Item label={t('codexgigas-name', {}, 'Name')}>
      {NAMES.map((name) => (
        <Button
          key={name.toLowerCase()}
          content={name}
          disabled={currentSection !== 3}
          onClick={() => act(name)}
        />
      ))}
    </LabeledList.Item>
  );
};

const Suffixes = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { currentSection } = data;

  return (
    <LabeledList.Item label={t('codexgigas-suffix', {}, 'Suffix')}>
      {SUFFIXES.map((suffix) => (
        <Button
          key={suffix.toLowerCase()}
          content={t(`codexgigas-suffix-${slugify(suffix)}`, {}, suffix)}
          disabled={currentSection !== 4}
          onClick={() => act(` ${suffix}`)}
        />
      ))}
    </LabeledList.Item>
  );
};
