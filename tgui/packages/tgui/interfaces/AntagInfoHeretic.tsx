import '../styles/interfaces/AntagInfoHeretic.scss';

import { useState } from 'react';
import {
  BlockQuote,
  Box,
  Button,
  DmIcon,
  Section,
  Stack,
  Tabs,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useServerText, useT } from '../i18n';
import { Window } from '../layouts';
import { logger } from '../logging';
import {
  type Objective,
  ObjectivePrintout,
  ReplaceObjectivesButton,
} from './common/Objectives';

const hereticRed = {
  color: '#e03c3c',
};

const hereticBlue = {
  fontWeight: 'bold',
  color: '#2185d0',
};

const hereticPurple = {
  fontWeight: 'bold',
  color: '#bd54e0',
};

const hereticGreen = {
  fontWeight: 'bold',
  color: '#20b142',
};

const hereticYellow = {
  fontWeight: 'bold',
  color: 'yellow',
};

type IconParams = {
  icon: string;
  state: string;
  frame: number;
  dir: number;
  moving: BooleanLike;
};

type Knowledge = {
  path: string;
  icon_params: IconParams;
  name: string;
  desc: string;
  gainFlavor: string;
  cost: number;
  bgr: string;
  category?: ShopCategory;
  depth: number;
  done: BooleanLike;
  ascension: BooleanLike;
  disabled?: BooleanLike;
  notice?: string;
  info?: string;
};

enum ShopCategory {
  Tree = 'tree',
  Shop = 'shop',
  Draft = 'draft',
  Start = 'start',
}

type KnowledgeTier = {
  nodes: Knowledge[];
};

type HereticPassive = {
  name: string;
  recharge: string;
  description: string[];
};

type HereticPath = {
  route: string;
  complexity: string;
  complexity_color: string;
  description: string[];
  pros: string[];
  cons: string[];
  tips: string[];
  starting_knowledge: Knowledge;
  preview_abilities: Knowledge[];
  passive: HereticPassive;
};

type Info = {
  charges: number;
  total_sacrifices: number;
  ascended: BooleanLike;
  objectives: Objective[];
  can_change_objective: BooleanLike;
  paths: HereticPath[];
  knowledge_shop: Knowledge[];
  knowledge_tiers: KnowledgeTier[];
  passive_level: number;
  points_to_aura: number;
};

const IntroductionSection = (props) => {
  const { data } = useBackend<Info>();
  const t = useT();
  const { objectives, ascended, can_change_objective } = data;

  return (
    <Stack justify="space-evenly" height="100%" width="100%">
      <Stack.Item grow>
        <Section
          title={t('antaginfo-heretic-title')}
          fill
          fontSize="14px"
          scrollable
        >
          <Stack vertical>
            <FlavorSection />
            <Stack.Divider />
            <GuideSection />
            <Stack.Divider />
            <InformationSection />
            <Stack.Divider />
            {!ascended && (
              <Stack.Item>
                <ObjectivePrintout
                  fill
                  titleMessage={
                    can_change_objective
                      ? t('antaginfo-heretic-tasks-ascend')
                      : t('antaginfo-heretic-tasks-personal')
                  }
                  objectives={objectives}
                  objectiveFollowup={
                    <ReplaceObjectivesButton
                      can_change_objective={can_change_objective}
                      button_title={t('antaginfo-heretic-reject')}
                      button_colour={'red'}
                      button_tooltip={t('antaginfo-heretic-reject-tooltip')}
                    />
                  }
                />
              </Stack.Item>
            )}
          </Stack>
        </Section>
      </Stack.Item>
    </Stack>
  );
};

const FlavorSection = () => {
  const t = useT();
  return (
    <Stack.Item>
      <Stack vertical textAlign="center" fontSize="14px">
        <Stack.Item>
          <i>
            {t('antaginfo-heretic-flavor-1')}&nbsp;
            <span style={hereticBlue}>{t('antaginfo-heretic-flavor-shimmer')}</span>
            &nbsp;{t('antaginfo-heretic-flavor-2')}&nbsp;
            <span style={hereticRed}>{t('antaginfo-heretic-flavor-strange')}</span>
            &nbsp;{t('antaginfo-heretic-flavor-3')}
          </i>
        </Stack.Item>
        <Stack.Item>
          <b>
            {t('antaginfo-heretic-gates-pre')}{' '}
            <span style={hereticPurple}>{t('antaginfo-heretic-gates-name')}</span>
            &nbsp;{t('antaginfo-heretic-gates-post')}
          </b>
        </Stack.Item>
      </Stack>
    </Stack.Item>
  );
};

const GuideSection = () => {
  const { data } = useBackend<Info>();
  const t = useT();
  const { points_to_aura } = data;
  return (
    <Stack.Item>
      <Stack vertical fontSize="12px">
        <Stack.Item>
          {t('antaginfo-heretic-guide-1-a')}&nbsp;
          <span style={hereticPurple}>{t('antaginfo-heretic-guide-1-influences')}</span>
          &nbsp;{t('antaginfo-heretic-guide-1-b')}&nbsp;
          <b>{t('antaginfo-heretic-guide-1-click')}</b>{' '}
          {t('antaginfo-heretic-guide-1-c')}&nbsp;
          <span style={hereticBlue}>{t('antaginfo-heretic-knowledge-points')}</span>
          . {t('antaginfo-heretic-guide-1-d')}
        </Stack.Item>
        <Stack.Item>
          {t('antaginfo-heretic-guide-2-a')}&nbsp;
          <span style={hereticRed}>{t('antaginfo-heretic-guide-2-action')}</span>
          &nbsp;{t('antaginfo-heretic-guide-2-b')}&nbsp;
          <span style={hereticRed}>{t('antaginfo-heretic-guide-2-targets')}</span>,{' '}
          {t('antaginfo-heretic-guide-2-c')}{' '}
          <b>{t('antaginfo-heretic-guide-2-heart')}</b>{' '}
          {t('antaginfo-heretic-guide-2-d')}
        </Stack.Item>
        <Stack.Item>
          {t('antaginfo-heretic-guide-3-a')}&nbsp;
          <span style={hereticGreen}>{t('antaginfo-heretic-rune')}</span>{' '}
          {t('antaginfo-heretic-guide-3-b')}&nbsp;
          <span style={hereticGreen}>{t('antaginfo-heretic-guide-3-grasp')}</span>
          &nbsp;{t('antaginfo-heretic-guide-3-c')} {t('antaginfo-heretic-guide-3-d')}
        </Stack.Item>
        <Stack.Item>
          {t('antaginfo-heretic-guide-4-a')}{' '}
          <span style={hereticRed}>{t('antaginfo-heretic-living-heart')}</span>{' '}
          {t('antaginfo-heretic-guide-4-b')} {t('antaginfo-heretic-guide-4-c')}&nbsp;
          <span style={hereticGreen}>{t('antaginfo-heretic-rune')}</span>{' '}
          {t('antaginfo-heretic-guide-4-d')}&nbsp;
          <span style={hereticRed}>{t('antaginfo-heretic-guide-4-sacrifice')}</span>{' '}
          {t('antaginfo-heretic-guide-4-e')}&nbsp;
          <span style={hereticBlue}>{t('antaginfo-heretic-knowledge-points')}</span>
          . {t('antaginfo-heretic-guide-4-f')} <b>{t('antaginfo-heretic-guide-4-only')}</b>{' '}
          {t('antaginfo-heretic-guide-4-g')}&nbsp;
          <span style={hereticRed}>{t('antaginfo-heretic-living-heart')}</span>.
        </Stack.Item>
        <Stack.Item>
          {t('antaginfo-heretic-guide-5-a')} <b>{points_to_aura}</b>&nbsp;
          <span style={hereticBlue}>{t('antaginfo-heretic-guide-5-points')}</span>
          &nbsp;{t('antaginfo-heretic-guide-5-b')}&nbsp;
          <span style={hereticPurple}>{t('antaginfo-heretic-guide-5-energy')}</span>{' '}
          {t('antaginfo-heretic-guide-5-c')} {t('antaginfo-heretic-guide-5-d')}
        </Stack.Item>
      </Stack>
    </Stack.Item>
  );
};

const InformationSection = () => {
  const { data } = useBackend<Info>();
  const t = useT();
  const { charges, total_sacrifices, ascended } = data;
  return (
    <Stack.Item>
      <Stack vertical fill>
        {!!ascended && (
          <Stack.Item>
            <Stack align="center">
              <Stack.Item>{t('antaginfo-heretic-ascended-pre')}</Stack.Item>
              <Stack.Item fontSize="24px">
                <Box inline color="yellow">
                  {t('antaginfo-heretic-ascended')}
                </Box>
                !
              </Stack.Item>
            </Stack>
          </Stack.Item>
        )}
        <Stack.Item>
          {t('antaginfo-heretic-have')} <b>{charges || 0}</b>&nbsp;
          <span style={hereticBlue}>
            {t('antaginfo-heretic-points', { count: charges || 0 })}
          </span>
          .
        </Stack.Item>
        <Stack.Item>
          {t('antaginfo-heretic-sacrifices-pre')}&nbsp;
          <b>{total_sacrifices || 0}</b>&nbsp;
          <span style={hereticRed}>
            {t('antaginfo-heretic-sacrifices', {
              count: total_sacrifices || 0,
            })}
          </span>
          .
        </Stack.Item>
      </Stack>
    </Stack.Item>
  );
};

const KnowledgeTree = () => {
  const { data } = useBackend<Info>();
  const t = useT();
  const { knowledge_tiers } = data;

  const nodesToShow = knowledge_tiers.filter((tier) => tier.nodes.length > 0);

  return (
    <Section title={t('antaginfo-heretic-tree')} fill scrollable>
      <Box textAlign="center" fontSize="32px">
        <span style={hereticYellow}>{t('antaginfo-heretic-dawn')}</span>
      </Box>
      <Stack vertical>
        {nodesToShow.length === 0
          ? t('antaginfo-common-objectives-none')
          : nodesToShow.map((tier, i) => (
              <Stack.Item key={i}>
                <Stack
                  justify="center"
                  align="center"
                  backgroundColor="transparent"
                  wrap="wrap"
                >
                  {tier.nodes.map((node) => (
                    <KnowledgeNode
                      key={node.path}
                      node={node}
                      // hack, free nodes are draft nodes
                      purchaseCategory={node.category}
                    />
                  ))}
                </Stack>
                <hr />
              </Stack.Item>
            ))}
      </Stack>
    </Section>
  );
};

// take &bull; in from byond and make sure it's rendered properly
function bulletpointHelper(text: string) {
  return text.replace(/&bull;/g, '•');
}

// description or info text may have <br>s,
// we need translate it into separate children for the tooltip to render it properly
function formatTooltipText(text: string) {
  return (
    <Stack vertical>
      {text.split('<br>').map((line, index) => {
        const isBulletPoint = line.includes('&bull;');
        if (isBulletPoint) {
          line = line.replace(/&bull;/g, '•');
        }
        return (
          <Stack.Item
            key={index}
            // hacky. pretty much solely exists to make Unsealed Arts readable.
            // stretches beyond the bounds of the tooltip to avoid getting cut off.
            // call it a format screw
            fontSize={isBulletPoint ? '10px' : undefined}
            width={isBulletPoint ? '110%' : undefined}
          >
            {line}
          </Stack.Item>
        );
      })}
    </Stack>
  );
}

type KnowledgeNodeProps = {
  node: Knowledge;
  purchaseCategory?: ShopCategory;
  can_buy?: BooleanLike;
};

const KnowledgeNode = (props: KnowledgeNodeProps) => {
  const { node, can_buy = true, purchaseCategory } = props;
  const { data, act } = useBackend<Info>();
  const t = useT();
  const text = useServerText();
  const { charges } = data;

  const isBuyable = can_buy && !node.done && !node.disabled;

  const iconState = () => {
    if (!can_buy) {
      return node.bgr;
    }
    if (node.done) {
      return 'node_finished';
    }
    if (charges < node.cost || node.disabled) {
      return 'node_locked';
    }
    return node.bgr;
  };

  return (
    <Stack.Item key={node.name}>
      <Button
        color="transparent"
        tooltip={
          <Stack vertical>
            <Stack.Item align="center" fontSize="16px">
              <b>{text(node, 'name')}</b>
            </Stack.Item>
            <Stack.Item>
              <BlockQuote>
                <span style={hereticPurple}>
                  {t('antaginfo-heretic-result')}{' '}
                </span>{' '}
              </BlockQuote>
              {formatTooltipText(text(node, 'desc'))}
            </Stack.Item>
            {!!node.notice && (
              <Stack.Item color="red">
                {formatTooltipText(text(node, 'notice'))}
              </Stack.Item>
            )}
            {!!node.info && (
              <Stack.Item>
                <BlockQuote>
                  <span style={hereticGreen}>
                    {t('antaginfo-heretic-recipe')}{' '}
                  </span>{' '}
                </BlockQuote>
                {formatTooltipText(text(node, 'info'))}
              </Stack.Item>
            )}
          </Stack>
        }
        onClick={
          !isBuyable
            ? () => logger.warn(`Cannot buy ${node.name}`)
            : () =>
                act('research', { path: node.path, category: purchaseCategory })
        }
        width={node.ascension ? '192px' : '64px'}
        height={node.ascension ? '192px' : '64px'}
        m="8px"
        style={{
          borderRadius: '50%',
        }}
      >
        <DmIcon
          icon="icons/ui_icons/antags/heretic/knowledge.dmi"
          icon_state={iconState()}
          height={node.ascension ? '192px' : '64px'}
          width={node.ascension ? '192px' : '64px'}
          top="0px"
          left="0px"
          position="absolute"
        />
        <DmIcon
          icon={node.icon_params?.icon}
          icon_state={node.icon_params?.state}
          frame={node.icon_params?.frame}
          direction={node.icon_params?.dir}
          movement={node.icon_params?.moving}
          height={node.ascension ? '152px' : '64px'}
          width={node.ascension ? '152px' : '64px'}
          top={node.ascension ? '20px' : '0px'}
          left={node.ascension ? '20px' : '0px'}
          position="absolute"
        />
        <Box
          position="absolute"
          top="0px"
          left="0px"
          backgroundColor="black"
          textColor="white"
          bold
          style={{ margin: '2px', borderRadius: '100%' }}
        >
          {isBuyable && (node.cost > 0 ? node.cost : t('antaginfo-heretic-free'))}
        </Box>
      </Button>
      {!!node.ascension && (
        <Box textAlign="center" fontSize="32px">
          <span style={hereticPurple}>{t('antaginfo-heretic-dusk')}</span>
        </Box>
      )}
    </Stack.Item>
  );
};

const KnowledgeShop = () => {
  const { data } = useBackend<Info>();
  const t = useT();
  const { knowledge_shop } = data;

  if (!knowledge_shop || knowledge_shop.length === 0) {
    return null;
  }

  return (
    <Section title={t('antaginfo-heretic-shop')} fill scrollable>
      <Stack vertical fill>
        <Knowledges />
      </Stack>
    </Section>
  );

  function Knowledges() {
    // filter the list into being indexed by tier
    const tiers: Knowledge[][] = knowledge_shop.reduce((acc, knowledge) => {
      const tierIndex = knowledge.depth - 1; // depth starts at 1, so
      if (!acc[tierIndex]) {
        acc[tierIndex] = [];
      }
      acc[tierIndex].push(knowledge);
      return acc;
    }, [] as Knowledge[][]);

    return tiers?.map((tier, index) => (
      <Stack.Item key={`tier-${index}`}>
        {t('antaginfo-heretic-tier', { tier: index + 1 })}
        <Stack fill scrollable wrap="wrap">
          {tier.map((knowledge) => (
            <Stack.Item key={`knowledge-${knowledge.path}`}>
              <KnowledgeNode
                node={knowledge}
                purchaseCategory={knowledge.category}
              />
            </Stack.Item>
          ))}
        </Stack>
        <hr />
      </Stack.Item>
    ));
  }
};

const ResearchInfo = () => {
  const { data } = useBackend<Info>();
  const t = useT();
  const { charges, knowledge_shop } = data;

  return (
    <Stack vertical fill>
      <Stack.Item mb={1.5} fontSize="20px" textAlign="center">
        {t('antaginfo-heretic-research-have')} <b>{charges || 0}</b>&nbsp;
        <span style={hereticBlue}>
          {t('antaginfo-heretic-points', { count: charges || 0 })}
        </span>{' '}
        {t('antaginfo-heretic-research-spend')}
      </Stack.Item>
      <Stack fill>
        <Stack.Item grow>
          <KnowledgeTree />
        </Stack.Item>
        {!!knowledge_shop?.length && (
          <Stack.Item grow>
            <KnowledgeShop />
          </Stack.Item>
        )}
      </Stack>
    </Stack>
  );
};

const PathInfo = ({ currentPath }: { currentPath?: HereticPath }) => {
  const { data } = useBackend<Info>();
  const text = useServerText();
  const { paths } = data;

  const pathBoughtIndex = paths.findIndex(
    (path) => currentPath && path.route === currentPath.route,
  );

  const [currentTab, setCurrentTab] = useState(
    pathBoughtIndex !== -1 ? pathBoughtIndex : 0,
  );

  return (
    <Stack fill>
      {!currentPath && (
        <Stack.Item>
          <Tabs fluid vertical>
            {paths.map((path, index) => (
              <Tabs.Tab
                key={index}
                icon="info"
                selected={currentTab === index}
                onClick={() => setCurrentTab(index)}
              >
                {text(path, 'name') || path.route}
              </Tabs.Tab>
            ))}
          </Tabs>
        </Stack.Item>
      )}
      <Stack.Item grow>
        <PathContent path={paths[currentTab]} isPathSelected={!!currentPath} />
      </Stack.Item>
    </Stack>
  );
};

const PathProCons = ({
  proconlist,
  title,
}: {
  proconlist: string[];
  title: string;
}) => {
  return (
    <Stack vertical>
      <Stack.Item>
        <b>{title}:</b>
      </Stack.Item>
      <Stack.Item>
        {proconlist.map((item, index) => (
          <Stack.Item key={index} textAlign="left" mb={1}>
            &bull; {item}
          </Stack.Item>
        ))}
      </Stack.Item>
    </Stack>
  );
};

const PathContentUnselected = ({ path }: { path: HereticPath }) => {
  const t = useT();
  const text = useServerText();
  const lines = (name: string, list: string[]) =>
    list.map((line, index) => text(path, `${name}_${index + 1}`) || line);
  return (
    <Stack vertical>
      <Stack.Item verticalAlign="center" textAlign="center">
        <KnowledgeNode
          node={path.starting_knowledge}
          purchaseCategory={ShopCategory.Start}
        />
        <Stack.Item>
          <h3>
            {t('antaginfo-heretic-complexity')}{' '}
            <span style={{ color: path.complexity_color }}>
              {text(path, 'complexity') || path.complexity}
            </span>
          </h3>
        </Stack.Item>
      </Stack.Item>
      <Stack.Item>
        <Stack vertical>
          {lines('description', path.description).map((line, index) => (
            <Stack.Item key={index}>{line}</Stack.Item>
          ))}
        </Stack>
      </Stack.Item>
      <Stack.Divider />
      <Stack.Item>
        <Stack>
          <Stack.Item style={{ justifyItems: 'center' }} width="50%">
            <Stack vertical>
              <Stack.Item bold>
                {t('antaginfo-heretic-passive', { name: text(path.passive, 'name') || path.passive.name })}
              </Stack.Item>
              <Stack.Item italic>{text(path.passive, 'recharge') || path.passive.recharge}</Stack.Item>
              <Stack.Item className="Passive" width="100%">
                {text(path.passive, 'description_1') || path.passive.description[0]}
              </Stack.Item>
            </Stack>
          </Stack.Item>
          <Stack.Item width="50%">
            <Stack vertical>
              <Stack.Item bold>{t('antaginfo-heretic-abilities')}</Stack.Item>
              <Stack.Item>
                <Stack wrap="wrap" justify="center">
                  {path.preview_abilities.map((ability) => (
                    <Stack.Item key={`guaranteed_${ability.name}`} m={1}>
                      <KnowledgeNode node={ability} can_buy={false} />
                    </Stack.Item>
                  ))}
                </Stack>
              </Stack.Item>
            </Stack>
          </Stack.Item>
        </Stack>
      </Stack.Item>
      <Stack.Divider />
      <Stack.Item>
        <Stack>
          <Stack.Item width="50%">
            <PathProCons
              proconlist={lines('pros', path.pros)}
              title={t('antaginfo-heretic-pros')}
            />
          </Stack.Item>
          <Stack.Item width="50%">
            <PathProCons
              proconlist={lines('cons', path.cons)}
              title={t('antaginfo-heretic-cons')}
            />
          </Stack.Item>
        </Stack>
      </Stack.Item>
    </Stack>
  );
};

const PathContentSelected = ({
  path,
  passive_level,
}: {
  path: HereticPath;
  passive_level: number;
}) => {
  const t = useT();
  const text = useServerText();
  const lines = (name: string, list: string[]) =>
    list.map((line, index) => text(path, `${name}_${index + 1}`) || line);
  return (
    <Stack vertical>
      <Stack.Item>
        {lines('description', path.description).map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </Stack.Item>
      <Stack.Item>
        <Stack vertical>
          <Stack.Item bold>
            {t('antaginfo-heretic-passive-level', {
              name: text(path.passive, 'name') || path.passive.name,
              level: passive_level,
            })}
          </Stack.Item>
          <Stack.Item italic>{text(path.passive, 'recharge') || path.passive.recharge}</Stack.Item>
          {path.passive.description.map((rawLine, index) => {
            const line = text(path.passive, `description_${index + 1}`) || rawLine;
            return (
            <Stack.Item
              key={index}
              className={`Passive ${passive_level >= index + 1 ? 'Passive--Active' : ''}`}
              width="100%"
            >
              {t('antaginfo-heretic-level', { level: index + 1 })}
              <br />
              {line}
            </Stack.Item>
            );
          })}
        </Stack>
      </Stack.Item>
      <Stack.Item textAlign="left" mt={2} mb={1}>
        <Stack.Item bold mb={1}>
          {t('antaginfo-heretic-tips')}
        </Stack.Item>
        <Stack.Item>
          <Stack vertical>
            {lines('tips', path.tips).map((tip, index) => (
              <Stack.Item key={index} textAlign="left">
                &bull; {tip}
              </Stack.Item>
            ))}
          </Stack>
        </Stack.Item>
      </Stack.Item>
    </Stack>
  );
};

const PathContent = ({
  path,
  isPathSelected,
}: {
  path: HereticPath;
  isPathSelected: boolean;
}) => {
  const { data } = useBackend<Info>();
  const text = useServerText();
  const { passive_level } = data;

  return (
    <Section
      title={<h1 className="PathTitle">{text(path, 'name') || path.route}</h1>}
      textAlign="center"
      fill
      scrollable
    >
      <Stack vertical>
        {isPathSelected ? (
          <PathContentSelected path={path} passive_level={passive_level} />
        ) : (
          <PathContentUnselected path={path} />
        )}
      </Stack>
    </Section>
  );
};

export const AntagInfoHeretic = () => {
  const { data } = useBackend<Info>();
  const t = useT();
  const { ascended, knowledge_tiers, paths } = data;

  const [currentTab, setTab] = useState(1);
  // only tiers has done variables set
  const currentPath = paths.find((path) =>
    knowledge_tiers.some((tier) =>
      tier.nodes.some(
        (node) => node.done && node.path === path.starting_knowledge.path,
      ),
    ),
  );

  const tabs = [
    {
      label: t('antaginfo-heretic-tab-information'),
      icon: 'info',
      content: <IntroductionSection />,
    },
    {
      label: t('antaginfo-heretic-tab-paths'),
      icon: 'info',
      content: <PathInfo currentPath={currentPath} />,
    },
    {
      label: t('antaginfo-heretic-tab-research'),
      icon: 'book',
      content: <ResearchInfo />,
    },
  ];

  const currentTheme = () => {
    if (currentPath?.route) {
      return `Heretic theme-Heretic--${currentPath.route.replace(' ', '')}`;
    }
    return 'Heretic';
  };

  return (
    <Window
      width={750}
      height={635}
      theme={`${currentTheme()}${ascended ? ' heretic-theme-ascended' : ''}`}
    >
      <Window.Content>
        <Stack vertical fill>
          <Stack.Item>
            <Tabs fluid>
              {tabs.map((tab, index) => (
                <Tabs.Tab
                  key={index}
                  icon={tab.icon}
                  selected={currentTab === index}
                  onClick={() => setTab(index)}
                >
                  {tab.label}
                </Tabs.Tab>
              ))}
            </Tabs>
          </Stack.Item>
          <Stack.Item grow>{tabs[currentTab].content}</Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
};
