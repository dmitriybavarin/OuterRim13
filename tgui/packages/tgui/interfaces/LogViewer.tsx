import { useState } from 'react';
import {
  Button,
  Collapsible,
  Input,
  NoticeBox,
  Section,
  Stack,
} from 'tgui-core/components';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type LogViewerData = {
  round_id: number;
  logging_start_timestamp: string;
  tree: LogViewerCategoryTree;
  last_data_update: number;
  categories: Record<string, LogViewerCategoryData>;
};

type LogViewerCategoryTree = {
  enabled: string[];
  disabled: string[];
};

type LogViewerCategoryData = {
  entry_count: number;
  entries: LogEntryData[];
};

type LogEntryData = {
  id: number;
  message: string;
  timestamp: string;
  semver?: Record<string, string>;
  data?: any[];
};

const CATEGORY_ALL = 'all';

export const LogViewer = (_: any) => {
  const { data, act } = useBackend<LogViewerData>();

  const [activeCategory, setActiveCategory] = useState('');

  let viewerData: LogViewerCategoryData = {
    entry_count: 0,
    entries: [],
  };

  if (activeCategory) {
    if (activeCategory !== CATEGORY_ALL) {
      viewerData = data.categories[activeCategory];
    } else {
      for (const category in data.categories) {
        const categoryData = data.categories[category];
        for (const entry of categoryData.entries) {
          viewerData.entries.push(entry);
        }
        viewerData.entry_count += categoryData.entry_count;
      }
      viewerData.entries.sort((a, b) => a.id - b.id);
    }
  }

  return (
    <Window width={720} height={720}>
      <Window.Content scrollable>
        <Section>
          <Button icon="sync" onClick={() => act('refresh')} />
        </Section>
        <CategoryBar
          options={data.tree.enabled}
          active={activeCategory}
          setActive={setActiveCategory}
        />
        <CategoryViewer activeCategory={activeCategory} data={viewerData} />
      </Window.Content>
    </Window>
  );
};

type CategoryBarProps = {
  options: string[];
  active: string;
  setActive: (active: string) => void;
};

const CategoryBar = (props: CategoryBarProps) => {
  const sorted = [...props.options].sort();
  const t = useT();
  const [categorySearch, setCategorySearch] = useState('');

  return (
    <Section
      title={t('logviewer-categories', {}, 'Categories')}
      scrollableHorizontal
      buttons={
        <Input
          placeholder={t('logviewer-search', {}, 'Search')}
          value={categorySearch}
          onChange={setCategorySearch}
        />
      }
    >
      <Stack>
        {/** these are not in stack items to have them directly next to eachother */}
        <Button
          selected={props.active === ''}
          onClick={() => props.setActive('')}
        >
          {t('logviewer-none', {}, 'None')}
        </Button>
        <Button
          tooltip={t('logviewer-slow', {}, 'This can be slow!')}
          selected={props.active === CATEGORY_ALL}
          onClick={() => props.setActive(CATEGORY_ALL)}
        >
          {t('logviewer-all', {}, 'All')}
        </Button>
        {sorted
          .filter((cat) =>
            cat.toLowerCase().includes(categorySearch.toLowerCase()),
          )
          .map((category) => (
            <Button
              key={category}
              selected={category === props.active}
              onClick={() => props.setActive(category)}
            >
              {category}
            </Button>
          ))}
      </Stack>
    </Section>
  );
};

type CategoryViewerProps = {
  activeCategory: string;
  data?: LogViewerCategoryData;
};

const validateRegExp = (str: string) => {
  try {
    new RegExp(str);
    return true;
  } catch (e) {
    return e;
  }
};

const CategoryViewer = (props: CategoryViewerProps) => {
  const t = useT();
  const [search, setSearch] = useState('');
  let [searchRegex, setSearchRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  if (!search && searchRegex) {
    setSearchRegex(false);
    searchRegex = false;
  }
  let regexValidation: boolean | SyntaxError = true;
  if (searchRegex) {
    regexValidation = validateRegExp(search);
  }

  return (
    <Section
      title={
        props.activeCategory
          ? t(
              'logviewer-viewer-category',
              {
                category: props.activeCategory,
                count: props.data?.entry_count ?? 0,
              },
              'Category Viewer - { $category }[{ $count }]',
            )
          : t(
              'logviewer-viewer-select',
              {},
              'Category Viewer - Select a category',
            )
      }
      buttons={
        <>
          <Input
            placeholder={t('logviewer-search', {}, 'Search')}
            value={search}
            onChange={setSearch}
          />
          <Button
            icon="code"
            tooltip={t('logviewer-regex', {}, 'RegEx Search')}
            selected={searchRegex}
            onClick={() => setSearchRegex(!searchRegex)}
          />
          <Button
            icon="font"
            selected={caseSensitive}
            tooltip={t('logviewer-case', {}, 'Case Sensitive')}
            onClick={() => setCaseSensitive(!caseSensitive)}
          />
          <Button
            icon="trash"
            tooltip={t('logviewer-clear', {}, 'Clear Search')}
            color="bad"
            onClick={() => {
              setSearch('');
              setSearchRegex(false);
            }}
          />
        </>
      }
    >
      <Stack vertical>
        {!searchRegex || regexValidation === true ? (
          props.data?.entries.map((entry) => {
            if (search) {
              if (searchRegex) {
                const regex = new RegExp(search, caseSensitive ? 'g' : 'gi');
                if (!regex.test(entry.message)) {
                  return null;
                }
              } else {
                if (caseSensitive) {
                  if (!entry.message.includes(search)) {
                    return null;
                  }
                } else {
                  if (
                    !entry.message.toLowerCase().includes(search.toLowerCase())
                  ) {
                    return null;
                  }
                }
              }
            }

            return (
              <Stack.Item key={entry.id}>
                <Collapsible title={`[${entry.id}] - ${entry.message}`}>
                  <Stack vertical fill>
                    <Stack.Item>
                      <p font-family="Courier">{entry.message}</p>
                    </Stack.Item>
                    <Stack.Item>
                      {entry.semver && (
                        <Stack.Item>
                          <JsonViewer data={entry.semver} title="Semver" />
                        </Stack.Item>
                      )}
                    </Stack.Item>
                    {entry.data && (
                      <Stack.Item>
                        <JsonViewer
                          data={entry.data}
                          title={t('logviewer-data', {}, 'Data')}
                        />
                      </Stack.Item>
                    )}
                  </Stack>
                </Collapsible>
              </Stack.Item>
            );
          })
        ) : (
          <NoticeBox danger>
            {t(
              'logviewer-invalid-regex',
              { error: (regexValidation as SyntaxError).message },
              'Invalid RegEx: { $error }',
            )}
          </NoticeBox>
        )}
      </Stack>
    </Section>
  );
};

const JsonViewer = (props: { data: any; title: string }) => {
  return (
    <Collapsible title={props.title}>
      <pre>{JSON.stringify(props.data, null, 2)}</pre>
    </Collapsible>
  );
};
