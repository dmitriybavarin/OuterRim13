import { sortBy } from 'es-toolkit';
import { useState } from 'react';
import { Flex, Input, Section, Tabs, VirtualList } from 'tgui-core/components';

import { useT } from '../../i18n';
import { useRemappedBackend } from './helpers';
import { TechNode } from './nodes/TechNode';

enum Tab {
  RESEARCHED,
  AVAILABLE,
  FUTURE,
}

export function TechwebOverview(props) {
  const { data } = useRemappedBackend();
  const t = useT();
  const { nodes, node_cache, design_cache } = data;
  const [tabIndex, setTabIndex] = useState(Tab.AVAILABLE);
  const [searchText, setSearchText] = useState('');

  // Only search when 3 or more characters have been input
  const searching = searchText && searchText.trim().length > 1;

  let displayedNodes = nodes;
  if (searching) {
    displayedNodes = displayedNodes.filter((x) => {
      const n = node_cache[x.path];
      return (
        n.name.toLowerCase().includes(searchText) ||
        n.name_en?.toLowerCase().includes(searchText) ||
        n.description.toLowerCase().includes(searchText) ||
        n.unlocked_designs.some(
          (e) =>
            design_cache[e].name.toLowerCase().includes(searchText) ||
            design_cache[e].name_en?.toLowerCase().includes(searchText),
        )
      );
    });
  } else {
    displayedNodes = sortBy(
      tabIndex < 2
        ? nodes.filter((x) => x.tier === tabIndex)
        : nodes.filter((x) => x.tier >= tabIndex),
      [(x) => node_cache[x.path].name],
    );
  }

  function switchTab(tab) {
    setTabIndex(tab);
    setSearchText('');
  }

  return (
    <Flex direction="column" height="100%">
      <Flex.Item>
        <Flex justify="space-between" className="Techweb__HeaderSectionTabs">
          <Flex.Item align="center" className="Techweb__HeaderTabTitle">
            {t('research-web-view', {}, 'Web View')}
          </Flex.Item>
          <Flex.Item grow>
            <Tabs>
              <Tabs.Tab
                selected={!searching && tabIndex === Tab.RESEARCHED}
                onClick={() => switchTab(0)}
              >
                {t('research-tab-researched', {}, 'Researched')}
              </Tabs.Tab>
              <Tabs.Tab
                selected={!searching && tabIndex === Tab.AVAILABLE}
                onClick={() => switchTab(1)}
              >
                {t('research-tab-available', {}, 'Available')}
              </Tabs.Tab>
              <Tabs.Tab
                selected={!searching && tabIndex === Tab.FUTURE}
                onClick={() => switchTab(2)}
              >
                {t('research-tab-future', {}, 'Future')}
              </Tabs.Tab>
              {!!searching && (
                <Tabs.Tab selected>
                  {t('research-search-results', {}, 'Search Results')}
                </Tabs.Tab>
              )}
            </Tabs>
          </Flex.Item>
          <Flex.Item align="center">
            <Input
              value={searchText}
              onChange={setSearchText}
              placeholder={t('research-search-placeholder', {}, 'Search...')}
              expensive
            />
          </Flex.Item>
        </Flex>
      </Flex.Item>
      <Flex.Item className="Techweb__OverviewNodes" height="100%">
        <Section fill scrollable>
          <VirtualList>
            {displayedNodes.map((n) => (
              <TechNode node={n} key={n.path} />
            ))}
          </VirtualList>
        </Section>
      </Flex.Item>
    </Flex>
  );
}
