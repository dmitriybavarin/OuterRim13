import {
  Button,
  Input,
  LabeledList,
  Section,
  Stack,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';
import { AccessConfig, type Region } from './common/AccessConfig';

type Data = {
  accesses: string[];
  oneAccess: BooleanLike;
  passedCycleId: string;
  passedName: string;
  regions: Region[];
  shell: BooleanLike;
  unres_direction: number;
};

export function AirlockElectronics(props) {
  return (
    <Window width={420} height={485}>
      <Window.Content>
        <AirLockMainSection />
      </Window.Content>
    </Window>
  );
}

export function AirLockMainSection(props) {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const {
    accesses = [],
    oneAccess,
    passedName,
    passedCycleId,
    regions = [],
    unres_direction,
    shell,
  } = data;

  return (
    <Stack fill vertical>
      <Stack.Item>
        <Section fill>
          <LabeledList>
            <LabeledList.Item label={t('airlockelectronics-circuit-shell', {}, 'Integrated Circuit Shell')}>
              <Button.Checkbox
                checked={shell}
                onClick={() => {
                  act('set_shell', { on: !shell });
                }}
                tooltip={t(
                  'airlockelectronics-shell-hint',
                  {},
                  'Whether this airlock can have an integrated circuit placed inside of it or not.',
                )}
              >
                {t('airlockelectronics-shell', {}, 'Shell')}
              </Button.Checkbox>
            </LabeledList.Item>
            <LabeledList.Item label={t('airlockelectronics-access', {}, 'Access Required')}>
              <Button
                icon={oneAccess ? 'unlock' : 'lock'}
                onClick={() => act('one_access')}
              >
                {oneAccess
                  ? t('airlockelectronics-one', {}, 'One')
                  : t('airlockelectronics-all', {}, 'All')}
              </Button>
            </LabeledList.Item>
            <LabeledList.Item label={t('airlockelectronics-unrestricted', {}, 'Unrestricted Access')}>
              <Button
                icon={unres_direction & 1 ? 'check-square-o' : 'square-o'}
                selected={unres_direction & 1}
                onClick={() =>
                  act('direc_set', {
                    unres_direction: '1',
                  })
                }
              >
                {t('airlockelectronics-north', {}, 'North')}
              </Button>
              <Button
                icon={unres_direction & 2 ? 'check-square-o' : 'square-o'}
                selected={unres_direction & 2}
                onClick={() =>
                  act('direc_set', {
                    unres_direction: '2',
                  })
                }
              >
                {t('airlockelectronics-south', {}, 'South')}
              </Button>
              <Button
                icon={unres_direction & 4 ? 'check-square-o' : 'square-o'}
                selected={unres_direction & 4}
                onClick={() =>
                  act('direc_set', {
                    unres_direction: '4',
                  })
                }
              >
                {t('airlockelectronics-east', {}, 'East')}
              </Button>
              <Button
                icon={unres_direction & 8 ? 'check-square-o' : 'square-o'}
                selected={unres_direction & 8}
                onClick={() =>
                  act('direc_set', {
                    unres_direction: '8',
                  })
                }
              >
                {t('airlockelectronics-west', {}, 'West')}
              </Button>
            </LabeledList.Item>
            <LabeledList.Item label={t('airlockelectronics-name', {}, 'Airlock Name')}>
              <Input
                fluid
                maxLength={30}
                value={passedName}
                onBlur={(value) =>
                  act('passedName', {
                    passedName: value,
                  })
                }
              />
            </LabeledList.Item>
            <LabeledList.Item label={t('airlockelectronics-cycle-id', {}, 'Cycling Id')}>
              <Input
                fluid
                maxLength={30}
                value={passedCycleId}
                onBlur={(value) =>
                  act('passedCycleId', {
                    passedCycleId: value,
                  })
                }
              />
            </LabeledList.Item>
          </LabeledList>
        </Section>
      </Stack.Item>
      <Stack.Item grow>
        <AccessConfig
          accesses={regions}
          selectedList={accesses}
          accessMod={(ref) =>
            act('set', {
              access: ref,
            })
          }
          grantAll={() => act('grant_all')}
          denyAll={() => act('clear_all')}
          grantDep={(ref) =>
            act('grant_region', {
              region: ref,
            })
          }
          denyDep={(ref) =>
            act('deny_region', {
              region: ref,
            })
          }
        />
      </Stack.Item>
    </Stack>
  );
}
