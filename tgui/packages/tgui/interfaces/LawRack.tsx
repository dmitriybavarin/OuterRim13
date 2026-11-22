import { capitalize } from 'es-toolkit';
import { useState } from 'react';
import {
  Box,
  Button,
  DmIcon,
  Flex,
  Floating,
  Section,
  Stack,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';
import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

enum SlotSecurity {
  NONE = 0,
  SCREWED = 1,
  WELDED = 2,
}

type SlotData = {
  name: string;
  security: SlotSecurity;
  ioned: BooleanLike;
  empty: BooleanLike;
};

type Linkable = {
  name: string;
  ref: string;
};

type Data = {
  // All slots, including empty ones. Index 0 is the core slot if it exists.
  slots: SlotData[];
  // If the ui viewer is holding a module
  holding_module: BooleanLike;
  // If the ui viewer is holding a screwdriver
  holding_screwdriver: BooleanLike;
  // If the ui viewer is holding a welder
  holding_welder: BooleanLike;
  // If the ui viewer is holding a multitool
  holding_multitool: BooleanLike;
  // If this rack has a core slot
  has_core_slot: BooleanLike;
  // If the rack has no power
  depowered: BooleanLike;
  // If we are a broadcaster: This represents our parent rack
  parent_rack?: Linkable;
  // If we are a base: This is all silicons we can link to
  linkable_silicons?: Linkable[];
  // If we are a broadcaster: This is all racks we can link to
  linkable_racks?: Linkable[];
  // If we are a base: This is all silicons currently linked to us
  linked_mobs?: string[];
  // Number of modules in all linked racks
  linked_rack_module_count?: number;
  // If refresh is on cooldown
  refresh_cooldown: number;
};

function getSlotColor(
  slot: SlotData,
  index: number,
  has_core_slot: BooleanLike,
): string {
  const is_core_slot = index === 0 && has_core_slot;
  if (slot.empty) return is_core_slot ? '#5AA6FF' : '#83BFB1';
  if (slot.ioned) return '#DD7973';
  return is_core_slot ? '#4183CD' : '#14BB69';
}

const LawSlotScrew = (props: {
  noscrew: BooleanLike;
  disabled: BooleanLike;
  tooltip?: string;
  handleScrew: () => void;
}) => {
  return (
    <Button
      tooltip={props.tooltip}
      className={props.noscrew ? 'LawRack__Screw Empty' : 'LawRack__Screw'}
      disabled={props.disabled}
      onClick={props.handleScrew}
    />
  );
};

const LawSlot = (props: { slot: SlotData; index: number }) => {
  const { act, data } = useBackend<Data>();
  const t = useT();

  const { slot, index } = props;
  const {
    holding_module,
    holding_screwdriver,
    holding_welder,
    holding_multitool,
    has_core_slot,
  } = data;

  return (
    <Box
      height="33px"
      backgroundColor={getSlotColor(slot, index, has_core_slot)}
      p={1}
      mb={-0.5}
      className="LawRack__Slot"
    >
      <Flex align="center">
        <Flex.Item mr={1}>
          <LawSlotScrew
            tooltip={
              slot.security === SlotSecurity.SCREWED && !holding_screwdriver
                ? t(
                    'lawrack-need-screwdriver',
                    {},
                    'You need a screwdriver to unscrew this module.',
                  )
                : holding_screwdriver && slot.security === SlotSecurity.WELDED
                  ? t(
                      'lawrack-screws-welded',
                      {},
                      "You can't remove the screws before unwelding it.",
                    )
                  : undefined
            }
            noscrew={slot.empty || slot.security === SlotSecurity.NONE}
            disabled={
              !holding_screwdriver ||
              slot.empty ||
              slot.security === SlotSecurity.WELDED
            }
            handleScrew={() => act('screw_module', { slot: index + 1 })}
          />
        </Flex.Item>
        <Flex.Item width="85%">
          {(slot.security === SlotSecurity.WELDED || !!holding_welder) && (
            <Button
              textAlign="center"
              verticalAlignContent="middle"
              fluid
              tooltip={
                slot.security === SlotSecurity.WELDED && !holding_welder
                  ? t(
                      'lawrack-remove-welded',
                      {},
                      "You can't remove this module before unwelding it.",
                    )
                  : holding_welder &&
                      slot.security === SlotSecurity.NONE &&
                      !slot.empty
                    ? t(
                        'lawrack-screw-first',
                        {},
                        'Screw this module in place before welding.',
                      )
                    : undefined
              }
              className={
                slot.security === SlotSecurity.WELDED
                  ? 'LawRack__Welded'
                  : undefined
              }
              disabled={
                !holding_welder ||
                slot.empty ||
                slot.security === SlotSecurity.NONE
              }
              onClick={() => act('weld_module', { slot: index + 1 })}
            >
              {slot.security === SlotSecurity.WELDED
                ? t('lawrack-welded', {}, 'Welded')
                : slot.empty
                  ? slot.name || t('lawrack-empty', {}, 'Empty')
                  : t('lawrack-weld', {}, 'Weld Module')}
            </Button>
          )}
          {slot.security !== SlotSecurity.WELDED && !!holding_multitool && (
            <Button
              height="100%"
              textAlign="center"
              verticalAlignContent="middle"
              fluid
              disabled={!slot.ioned}
              onClick={() => act('multitool_module', { slot: index + 1 })}
            >
              {t('lawrack-repair-ion', {}, 'Repair Ion Damage')}
            </Button>
          )}
          {slot.security !== SlotSecurity.WELDED &&
            !holding_multitool &&
            !holding_welder && (
              <Button
                height="100%"
                textAlign="center"
                verticalAlignContent="middle"
                fluid
                tooltip={
                  slot.security === SlotSecurity.SCREWED
                    ? t(
                        'lawrack-remove-screwed',
                        {},
                        "You can't remove this module before unscrewing it.",
                      )
                    : undefined
                }
                disabled={
                  (!holding_module && slot.empty) ||
                  slot.security !== SlotSecurity.NONE
                }
                style={{ textTransform: 'capitalize' }}
                onClick={() =>
                  act(
                    holding_module && slot.empty
                      ? 'insert_module'
                      : 'remove_module',
                    { slot: index + 1 },
                  )
                }
              >
                {slot.name || t('lawrack-empty', {}, 'Empty')}
              </Button>
            )}
        </Flex.Item>
        <Flex.Item ml={1}>
          <LawSlotScrew
            tooltip={
              slot.security === SlotSecurity.SCREWED && !holding_screwdriver
                ? t(
                    'lawrack-need-screwdriver',
                    {},
                    'You need a screwdriver to unscrew this module.',
                  )
                : holding_screwdriver && slot.security === SlotSecurity.WELDED
                  ? t(
                      'lawrack-screws-welded',
                      {},
                      "You can't remove the screws before unwelding it.",
                    )
                  : undefined
            }
            noscrew={slot.empty || slot.security === SlotSecurity.NONE}
            disabled={
              !holding_screwdriver ||
              slot.empty ||
              slot.security === SlotSecurity.WELDED
            }
            handleScrew={() => act('screw_module', { slot: index + 1 })}
          />
        </Flex.Item>
      </Flex>
    </Box>
  );
};

const LinkableFloating = (props: {
  show_floating: boolean;
  linkable: Linkable[];
  link_act: (ref: string, name: string) => void;
  hide_floating: () => void;
  button: React.ReactNode;
}) => {
  const { show_floating, linkable, link_act, button, hide_floating } = props;

  if (!show_floating) {
    return button;
  }

  return (
    <Floating
      stopChildPropagation
      placement="top-start"
      content={
        <Stack
          fill
          backgroundColor="black"
          p={1}
          style={{
            borderRadius: '4px',
            boxShadow: '0px 4px 8px 3px rgba(0, 0, 0, 0.7)',
            flexDirection: 'column',
          }}
        >
          {linkable.map((item) => (
            <Stack.Item key={item.ref}>
              <Button
                icon="link"
                style={{ textTransform: 'capitalize' }}
                onClick={() => {
                  link_act(item.ref, item.name);
                  if (linkable.length === 1) hide_floating();
                }}
              >
                <b>{item.name}</b>
              </Button>
            </Stack.Item>
          ))}
        </Stack>
      }
    >
      {button}
    </Floating>
  );
};

const UnlinkableFloating = (props: {
  show_floating: boolean;
  unlinkable: string[];
  unlink_act: (index: number, name: string) => void;
  hide_floating: () => void;
  button: React.ReactNode;
  can_unlink: BooleanLike;
  unlink_tooltip?: string;
}) => {
  const {
    button,
    can_unlink,
    hide_floating,
    show_floating,
    unlink_act,
    unlink_tooltip,
    unlinkable,
  } = props;

  if (!show_floating) {
    return button;
  }

  return (
    <Floating
      stopChildPropagation
      placement="top-start"
      content={
        <Stack
          fill
          backgroundColor="black"
          p={1}
          style={{
            borderRadius: '4px',
            boxShadow: '0px 4px 8px 3px rgba(0, 0, 0, 0.7)',
            flexDirection: 'column',
          }}
        >
          {unlinkable.map((name, list_index) => (
            <Stack.Item key={name + list_index}>
              <Button
                icon="link-slash"
                style={{ textTransform: 'capitalize' }}
                disabled={!can_unlink}
                tooltip={unlink_tooltip}
                onClick={() => {
                  unlink_act(list_index, name);
                  if (unlinkable.length === 1) hide_floating();
                }}
              >
                <b>{name}</b>
              </Button>
            </Stack.Item>
          ))}
        </Stack>
      }
    >
      {button}
    </Floating>
  );
};

const AiFlavorDisplay = (props: { show_face: string }) => {
  return (
    <Box height="60px">
      <DmIcon
        icon="icons/obj/machines/status_display.dmi"
        icon_state="entertainment_frame"
        height="60px"
        width="60px"
        position="absolute"
        left="10px"
      />
      {!!props.show_face && (
        <DmIcon
          icon="icons/obj/machines/status_display.dmi"
          icon_state={props.show_face}
          height="60px"
          width="60px"
          position="absolute"
          left="10px"
        />
      )}
    </Box>
  );
};

const BroadcasterDisplay = () => {
  const { data, act } = useBackend<Data>();
  const { depowered, parent_rack, linkable_racks } = data;
  const t = useT();

  const [rackLink, setRackLink] = useState(true);
  return (
    <Stack>
      <Stack.Item width="50%">
        <Stack p={1} className="LawRack__Console" vertical>
          <Stack.Item>
            &gt; <b>{t('lawrack-linked-rack', {}, 'Linked Rack:')}</b>
          </Stack.Item>
          <Stack.Item>
            {parent_rack
              ? capitalize(parent_rack.name)
              : t('lawrack-na', {}, 'N/A')}
          </Stack.Item>
        </Stack>
      </Stack.Item>
      <Stack.Item width="50%" align="center">
        <Stack vertical fill>
          <Stack.Item>
            <Button
              fluid
              width="100%"
              disabled={depowered || !parent_rack}
              tooltip={
                depowered
                  ? t('lawrack-no-power', {}, 'No power!')
                  : parent_rack
                    ? undefined
                    : t('lawrack-no-linked-rack', {}, 'No linked rack!')
              }
              fontFamily="monospace"
              color={depowered || !parent_rack ? 'grey' : 'black'}
              onClick={() => act('unlink_rack')}
            >
              &gt; {t('lawrack-unlink-rack', {}, 'Unlink Rack')}
            </Button>
          </Stack.Item>
          <Stack.Item>
            <LinkableFloating
              show_floating={rackLink}
              linkable={linkable_racks || []}
              link_act={(ref, name) =>
                act('link_rack', {
                  rack_ref: ref,
                  rack_name: name,
                })
              }
              hide_floating={() => setRackLink(false)}
              button={
                <Button
                  width="100%"
                  disabled={
                    !linkable_racks?.length || depowered || !!parent_rack
                  }
                  tooltip={
                    depowered
                      ? t('lawrack-no-power', {}, 'No power!')
                      : linkable_racks?.length
                        ? parent_rack
                          ? t('lawrack-already-linked', {}, 'Already linked!')
                          : undefined
                        : t(
                            'lawrack-no-linkable-racks',
                            {},
                            'No linkable racks!',
                          )
                  }
                  fontFamily="monospace"
                  color={depowered || parent_rack ? 'grey' : 'black'}
                  onClick={() => setRackLink(!rackLink)}
                >
                  &gt; {t('lawrack-new-link', {}, 'New Link')}
                </Button>
              }
            />
          </Stack.Item>
        </Stack>
      </Stack.Item>
    </Stack>
  );
};

const BaseDisplay = () => {
  const { data, act } = useBackend<Data>();
  const { depowered, linkable_silicons, linked_mobs, parent_rack } = data;
  const t = useT();

  const [siliconLink, setSiliconLink] = useState(true);
  const [siliconUnlink, setSiliconUnlink] = useState(true);

  return (
    <Stack>
      <Stack.Item>
        <Stack p={1} className="LawRack__Console" vertical>
          <Stack.Item>
            &gt; <b>{t('lawrack-linked-silicons', {}, 'Linked Silicons:')}</b>
          </Stack.Item>
          <Stack.Item style={{ wordBreak: 'break-word' }}>
            {linked_mobs?.length
              ? linked_mobs.join(', ')
              : t('lawrack-na', {}, 'N/A')}
          </Stack.Item>
        </Stack>
      </Stack.Item>
      <Stack.Item grow>
        <Stack vertical>
          <UnlinkableFloating
            show_floating={siliconUnlink}
            unlinkable={linked_mobs || []}
            can_unlink={!depowered}
            unlink_tooltip={
              depowered ? t('lawrack-no-power', {}, 'No power!') : undefined
            }
            unlink_act={(index, name) =>
              act('unlink_silicon', {
                silicon_index: index,
                silicon_name: name,
              })
            }
            hide_floating={() => setSiliconUnlink(false)}
            button={
              <Button
                width="100%"
                disabled={!linked_mobs?.length || depowered}
                tooltip={
                  depowered
                    ? t('lawrack-no-power', {}, 'No power!')
                    : linked_mobs?.length
                      ? undefined
                      : t(
                          'lawrack-no-linked-silicons',
                          {},
                          'No linked silicons!',
                        )
                }
                color={depowered || !linked_mobs?.length ? 'grey' : 'black'}
                fontFamily="monospace"
                onClick={() => setSiliconUnlink(!siliconUnlink)}
              >
                &gt; {t('lawrack-manage', {}, 'Manage Connections')}
              </Button>
            }
          />
          <Stack.Item>
            <LinkableFloating
              show_floating={siliconLink}
              linkable={linkable_silicons || []}
              link_act={(ref, name) =>
                act('link_silicon', {
                  silicon_ref: ref,
                  silicon_name: name,
                })
              }
              hide_floating={() => setSiliconLink(false)}
              button={
                <Button
                  width="100%"
                  disabled={
                    !linkable_silicons?.length || depowered || !!parent_rack
                  }
                  tooltip={
                    depowered
                      ? t('lawrack-no-power', {}, 'No power!')
                      : linkable_silicons?.length
                        ? parent_rack
                          ? t(
                              'lawrack-linked-other',
                              {},
                              'Linked to another rack!',
                            )
                          : undefined
                        : t(
                            'lawrack-no-linkable-silicons',
                            {},
                            'No linkable silicons!',
                          )
                  }
                  color={
                    depowered || !linkable_silicons?.length ? 'gray' : 'black'
                  }
                  fontFamily="monospace"
                  onClick={() => setSiliconLink(!siliconLink)}
                >
                  &gt; {t('lawrack-new-connection', {}, 'New Connection')}
                </Button>
              }
            />
          </Stack.Item>
        </Stack>
      </Stack.Item>
    </Stack>
  );
};
export const LawRack = () => {
  const { data, act } = useBackend<Data>();
  const {
    depowered,
    linkable_racks,
    linked_mobs,
    parent_rack,
    slots,
    refresh_cooldown,
    has_core_slot,
    linked_rack_module_count,
  } = data;
  const t = useT();

  const screen_display = () => {
    if (depowered) {
      return 'off';
    }
    if (parent_rack || linked_mobs?.length) {
      return Math.round(Math.random() * 100) === 1 ? 'ai_hal' : 'ai_sal';
    }
    return 'ai_bsod';
  };

  return (
    <Window title={t('lawrack-title', {}, 'Module Rack')} width={400} height={slots.length * 40 + 200}>
      <Window.Content>
        <Section>
          <Stack vertical>
            {slots.map((slot, index) => (
              <Stack.Item key={index}>
                <LawSlot slot={slot} index={index} />
              </Stack.Item>
            ))}
            {linked_rack_module_count !== undefined && (
              <Stack.Item
                className="LawRack__Console"
                mt={1}
                p={0.5}
                textAlign="center"
              >
                <b>{linked_rack_module_count}</b>{' '}
                {t(
                  'lawrack-remote-modules',
                  { count: linked_rack_module_count },
                  'other module(s) are being loaded remotely.',
                )}
              </Stack.Item>
            )}
          </Stack>
        </Section>
        <Section
          title={t('lawrack-controls', {}, 'Controls')}
          buttons={
            <Button
              icon="refresh"
              disabled={depowered || refresh_cooldown > 0}
              tooltipPosition="left"
              tooltip={
                depowered
                  ? t('lawrack-no-power', {}, 'No power!')
                  : refresh_cooldown > 0
                    ? t(
                        'lawrack-cooldown',
                        { seconds: Math.round(refresh_cooldown / 10) },
                        'Cooldown: { $seconds }s',
                      )
                    : t(
                        'lawrack-refresh',
                        {},
                        'Refreshes module and link data.',
                      )
              }
              onClick={() => act('refresh')}
            />
          }
        >
          <Stack vertical>
            <Stack.Item>
              <Stack>
                {!!has_core_slot && (
                  <Stack.Item width="60px" mr={1} textAlign="center">
                    <AiFlavorDisplay show_face={screen_display()} />
                  </Stack.Item>
                )}
                {linkable_racks && (
                  <Stack.Item grow>
                    <BroadcasterDisplay />
                  </Stack.Item>
                )}
                {linked_mobs && (
                  <Stack.Item grow>
                    <BaseDisplay />
                  </Stack.Item>
                )}
              </Stack>
            </Stack.Item>
          </Stack>
        </Section>
      </Window.Content>
    </Window>
  );
};
