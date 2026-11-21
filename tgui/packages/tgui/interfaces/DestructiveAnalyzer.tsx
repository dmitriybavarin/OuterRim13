import { Box, Button, Image, NoticeBox, Section } from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { techwebNodeKey, useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  server_connected: BooleanLike;
  loaded_item: string;
  item_icon: string;
  indestructible: BooleanLike;
  already_deconstructed: BooleanLike;
  recoverable_points: string;
  node_data: NodeData[];
};

type NodeData = {
  node_name: string;
  node_path: string;
  node_hidden: BooleanLike;
};

export const DestructiveAnalyzer = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const {
    server_connected,
    indestructible,
    loaded_item,
    item_icon,
    already_deconstructed,
    recoverable_points,
    node_data = [],
  } = data;
  if (!server_connected) {
    return (
      <Window
        width={400}
        height={260}
        title={t('research-analyzer-title', {}, 'Destructive Analyzer')}
      >
        <Window.Content>
          <NoticeBox textAlign="center" danger>
            {t(
              'research-not-connected',
              {},
              'Not connected to a server. Please sync one using a multitool.',
            )}
          </NoticeBox>
        </Window.Content>
      </Window>
    );
  }
  if (!loaded_item) {
    return (
      <Window
        width={400}
        height={260}
        title={t('research-analyzer-title', {}, 'Destructive Analyzer')}
      >
        <Window.Content>
          <NoticeBox textAlign="center" danger>
            {t('research-analyzer-no-item', {}, 'No item loaded!')} <br />
            {t(
              'research-analyzer-no-item-hint',
              {},
              "Put any item inside to see what it's capable of!",
            )}
          </NoticeBox>
        </Window.Content>
      </Window>
    );
  }
  return (
    <Window
        width={400}
        height={260}
        title={t('research-analyzer-title', {}, 'Destructive Analyzer')}
      >
      <Window.Content scrollable>
        <Section
          title={loaded_item}
          buttons={
            <Button
              icon="eject"
              tooltip={t(
                'research-analyzer-eject-tooltip',
                {},
                'Ejects the item currently inside the machine.',
              )}
              onClick={() => act('eject_item')}
            />
          }
        >
          <Image
            src={`data:image/jpeg;base64,${item_icon}`}
            height="64px"
            width="64px"
            verticalAlign="middle"
          />
        </Section>
        <Section
          title={t(
            'research-analyzer-methods',
            {},
            'Deconstruction Methods',
          )}
        >
          {!indestructible && (
            <NoticeBox textAlign="center" danger>
              {t(
                'research-analyzer-cannot',
                {},
                "This item can't be deconstructed!",
              )}
            </NoticeBox>
          )}
          {!!indestructible && (
            <>
              {!!recoverable_points && (
                <>
                  <Box fontSize="14px">
                    {t(
                      'research-analyzer-points',
                      {},
                      'Research points from deconstruction',
                    )}
                  </Box>
                  <Box>{recoverable_points}</Box>
                </>
              )}
              <Button.Confirm
                icon="hammer"
                tooltip={
                  already_deconstructed
                    ? t(
                        'research-analyzer-already',
                        {},
                        'This item item has already been deconstructed, and will not give any additional information.',
                      )
                    : t(
                        'research-analyzer-destroy-tooltip',
                        {},
                        'Destroys the object currently residing in the machine.',
                      )
                }
                onClick={() =>
                  act('deconstruct')
                }
              >
                {t('research-analyzer-deconstruct', {}, 'Deconstruct')}
              </Button.Confirm>
            </>
          )}
          {node_data.map((node) => (
            <Button.Confirm
              icon="cash-register"
              mt={1}
              disabled={!node.node_hidden}
              key={node.node_path}
              tooltip={
                node.node_hidden
                  ? t(
                      'research-analyzer-node-tooltip',
                      {},
                      'Deconstruct this to research the selected node.',
                    )
                  : t(
                      'research-analyzer-node-done',
                      {},
                      'This node has already been researched.',
                    )
              }
              onClick={() =>
                act('deconstruct', { deconstruct_path: node.node_path })
              }
            >
              {t(
                techwebNodeKey(node.node_path),
                {},
                node.node_name,
              )}
            </Button.Confirm>
          ))}
        </Section>
      </Window.Content>
    </Window>
  );
};
