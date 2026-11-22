import { Fragment, useState } from 'react';
import { useBackend } from 'tgui/backend';
import { useT } from 'tgui/i18n';
import { CharacterPreview } from 'tgui/interfaces/common/CharacterPreview';
import {
  Box,
  Button,
  Divider,
  Icon,
  Input,
  NoticeBox,
  Section,
  Stack,
  Tabs,
} from 'tgui-core/components';

import { useServerPrefs } from '../../useServerPrefs';
import type {
  LoadoutCategory,
  LoadoutItem,
  LoadoutManagerData,
  typePath,
} from './base';
import {
  ItemIcon,
  LoadoutTabDisplay,
  SearchDisplay,
  useItemName,
  useLabel,
} from './ItemDisplay';
import { LoadoutModifyDimmer } from './ModifyPanel';

export function LoadoutPage(props) {
  const serverData = useServerPrefs();
  const t = useT();
  const label = useLabel();
  const loadout_tabs = serverData?.loadout.loadout_tabs || [];

  const [searchLoadout, setSearchLoadout] = useState('');
  const [selectedTabName, setSelectedTab] = useState(
    loadout_tabs?.[0].name || '',
  );
  const [modifyItemDimmer, setModifyItemDimmer] = useState<LoadoutItem | null>(
    null,
  );

  if (!serverData) {
    return <NoticeBox>{t('loadout-loading', {}, 'Loading...')}</NoticeBox>;
  }

  return (
    <Stack vertical fill>
      <Stack.Item>
        {!!modifyItemDimmer && (
          <LoadoutModifyDimmer
            modifyItemDimmer={modifyItemDimmer}
            setModifyItemDimmer={setModifyItemDimmer}
          />
        )}
        <Section
          fitted
          title="&nbsp;"
          buttons={
            <Input
              width="200px"
              onChange={setSearchLoadout}
              placeholder={t(
                'loadout-search-placeholder',
                {},
                'Search for an item...',
              )}
              value={searchLoadout}
            />
          }
        >
          <Tabs fluid align="center">
            {loadout_tabs.map((curTab) => (
              <Tabs.Tab
                key={curTab.name}
                selected={
                  searchLoadout.length <= 1 && curTab.name === selectedTabName
                }
                onClick={() => {
                  setSelectedTab(curTab.name);
                  setSearchLoadout('');
                }}
              >
                <Box>
                  {curTab.category_icon && (
                    <Icon name={curTab.category_icon} mr={1} />
                  )}
                  {label(curTab.name)}
                </Box>
              </Tabs.Tab>
            ))}
          </Tabs>
        </Section>
      </Stack.Item>
      <Stack.Item grow>
        <LoadoutTabs
          loadout_tabs={loadout_tabs}
          currentTab={selectedTabName}
          currentSearch={searchLoadout}
          modifyItemDimmer={modifyItemDimmer}
          setModifyItemDimmer={setModifyItemDimmer}
        />
      </Stack.Item>
    </Stack>
  );
}

type LoadoutTabsProps = {
  loadout_tabs: LoadoutCategory[];
  currentTab: string;
  currentSearch: string;
  modifyItemDimmer: LoadoutItem | null;
  setModifyItemDimmer: (dimmer: LoadoutItem | null) => void;
};

function LoadoutTabs(props: LoadoutTabsProps) {
  const {
    loadout_tabs,
    currentTab,
    currentSearch,
    modifyItemDimmer,
    setModifyItemDimmer,
  } = props;
  const t = useT();
  const label = useLabel();
  const activeCategory = loadout_tabs.find((curTab) => {
    return curTab.name === currentTab;
  });
  const searching = currentSearch.length > 1;

  return (
    <Stack fill g={1}>
      <Stack.Item align="center" width="270px" height="100%">
        <Stack vertical fill>
          <Stack.Item height="60%" minHeight={0}>
            <LoadoutPreviewSection />
          </Stack.Item>
          <Stack.Item grow basis={0} minHeight={0}>
            <LoadoutSelectedSection
              all_tabs={loadout_tabs}
              modifyItemDimmer={modifyItemDimmer}
              setModifyItemDimmer={setModifyItemDimmer}
            />
          </Stack.Item>
        </Stack>
      </Stack.Item>
      <Stack.Item grow>
        {searching || activeCategory?.contents ? (
          <Section
            title={
              searching
                ? t('loadout-search-results', {}, 'Search results')
                : t('loadout-catalog', {}, 'Catalog')
            }
            fill
            scrollable
            buttons={
              activeCategory?.category_info ? (
                <Box italic mt={0.5}>
                  {label(activeCategory.category_info)}
                </Box>
              ) : null
            }
          >
            <Stack vertical g={1}>
              <Stack.Item>
                {searching ? (
                  <SearchDisplay
                    loadout_tabs={loadout_tabs}
                    currentSearch={currentSearch}
                  />
                ) : (
                  <LoadoutTabDisplay category={activeCategory} />
                )}
              </Stack.Item>
            </Stack>
          </Section>
        ) : (
          <Section fill>
            <Box>
              {t(
                'loadout-empty-tab',
                {},
                'No contents for selected tab.',
              )}
            </Box>
          </Section>
        )}
      </Stack.Item>
    </Stack>
  );
}

function typepathToLoadoutItem(
  typepath: typePath,
  all_tabs: LoadoutCategory[],
) {
  // Maybe a bit inefficient, could be replaced with a hashmap?
  for (const tab of all_tabs) {
    for (const item of tab.contents) {
      if (item.path === typepath) {
        return item;
      }
    }
  }
  return null;
}

type LoadoutSelectedItemProps = {
  path: typePath;
  all_tabs: LoadoutCategory[];
  modifyItemDimmer: LoadoutItem | null;
  setModifyItemDimmer: (dimmer: LoadoutItem | null) => void;
};

function LoadoutSelectedItem(props: LoadoutSelectedItemProps) {
  const { all_tabs, path, modifyItemDimmer, setModifyItemDimmer } = props;
  const { act } = useBackend();
  const itemName = useItemName();

  const item = typepathToLoadoutItem(path, all_tabs);
  if (!item) {
    return null;
  }

  return (
    <Stack align={'center'} g={1}>
      <Stack.Item>
        <ItemIcon item={item} scale={1} />
      </Stack.Item>
      <Stack.Item grow basis={0} minWidth={0} style={{ overflowWrap: 'anywhere' }}>
        {itemName(item)}
      </Stack.Item>
      {item.buttons.length || item.reskins?.length ? (
        <Stack.Item>
          <Button
            color="none"
            width="32px"
            onClick={() => {
              setModifyItemDimmer(item);
            }}
          >
            <Icon size={1.8} name="cogs" color="grey" />
          </Button>
        </Stack.Item>
      ) : (
        <Stack.Item width="32px" /> // empty space
      )}
      <Stack.Item>
        <Button
          color="none"
          width="32px"
          onClick={() => act('select_item', { path: path, deselect: true })}
        >
          <Icon size={2.4} name="times" color="red" />
        </Button>
      </Stack.Item>
    </Stack>
  );
}

type LoadoutSelectedSectionProps = {
  all_tabs: LoadoutCategory[];
  modifyItemDimmer: LoadoutItem | null;
  setModifyItemDimmer: (dimmer: LoadoutItem | null) => void;
};

function LoadoutSelectedSection(props: LoadoutSelectedSectionProps) {
  const { act, data } = useBackend<LoadoutManagerData>();
  const t = useT();
  const { loadout_list } = data.character_preferences.misc;
  const { all_tabs, modifyItemDimmer, setModifyItemDimmer } = props;

  return (
    <Section
      title={t('loadout-selected-items', {}, 'Selected Items')}
      scrollable
      fill
    >
      <Box mb={1}>
        <Button.Confirm
          fluid
          icon="times"
          color="red"
          textAlign="center"
          disabled={!loadout_list || Object.keys(loadout_list).length === 0}
          tooltip={t(
            'loadout-clear-all-tooltip',
            {},
            'Clears ALL selected items from all categories.',
          )}
          onClick={() => act('clear_all_items')}
        >
          {t('loadout-clear-all', {}, 'Clear All')}
        </Button.Confirm>
      </Box>
      {loadout_list &&
        Object.entries(loadout_list).map(([path, item]) => (
          <Fragment key={path}>
            <LoadoutSelectedItem
              path={path}
              all_tabs={all_tabs}
              modifyItemDimmer={modifyItemDimmer}
              setModifyItemDimmer={setModifyItemDimmer}
            />
            <Divider />
          </Fragment>
        ))}
    </Section>
  );
}

function LoadoutPreviewSection() {
  const { act, data } = useBackend<LoadoutManagerData>();
  const t = useT();

  return (
    <Section fill title={t('loadout-preview', {}, 'Preview')}>
      <Stack vertical fill g={1}>
        <Stack.Item>
          <Button.Checkbox
            fluid
            checked={data.job_clothes}
            onClick={() => act('toggle_job_clothes')}
            style={{ whiteSpace: 'normal' }}
          >
            {t('loadout-job-clothes', {}, 'Job Clothes')}
          </Button.Checkbox>
        </Stack.Item>
        <Stack.Item grow basis={0} minHeight={0} style={{ overflow: 'hidden' }}>
          <Box
            height="100%"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <CharacterPreview height="100%" id={data.character_preview_view} />
          </Box>
        </Stack.Item>
        <Stack.Item align="center">
          <Stack g={1}>
            <Stack.Item>
              <Button
                icon="chevron-left"
                onClick={() =>
                  act('rotate_dummy', {
                    dir: 'left',
                  })
                }
              />
            </Stack.Item>
            <Stack.Item>
              <Button
                icon="chevron-right"
                onClick={() =>
                  act('rotate_dummy', {
                    dir: 'right',
                  })
                }
              />
            </Stack.Item>
          </Stack>
        </Stack.Item>
      </Stack>
    </Section>
  );
}
