import {
  BlockQuote,
  Box,
  Button,
  Icon,
  Section,
  Stack,
} from 'tgui-core/components';

import { resolveAsset } from '../assets';
import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

export const ApprenticeContract = (props) => {
  const t = useT();
  return (
    <Window width={620} height={600} theme="wizard">
      <Window.Content>
        <Stack vertical fill>
          <Stack.Item>
            <Section textColor="lightgreen" fontSize="15px">
              {t(
                'apprentice-refund',
                {},
                'If you cannot reach any of your apprentices today, you can feed the contract back into your spellbook to refund it.',
              )}
            </Section>
          </Stack.Item>
          <Stack.Item grow>
            <ApprenticeSelection
              iconName="fire"
              fluffName={t(
                'apprentice-destruction-name',
                {},
                'Apprentice of Destruction',
              )}
              schoolTitle="destruction"
              assetName="destruction.png"
              blurb={t(
                'apprentice-destruction-blurb',
                {},
                'Your apprentice is skilled in offensive magic. They know Magic Missile and Fireball.',
              )}
            />
            <ApprenticeSelection
              iconName="route"
              fluffName={t(
                'apprentice-bluespace-name',
                {},
                'Student of Translocation',
              )}
              schoolTitle="bluespace"
              assetName="bluespace.png"
              blurb={t(
                'apprentice-bluespace-blurb',
                {},
                'Your apprentice is able to defy physics, melting through solid objects and travelling great distances in the blink of an eye. They know Teleport and Ethereal Jaunt.',
              )}
            />
            <ApprenticeSelection
              iconName="medkit"
              fluffName={t(
                'apprentice-healing-name',
                {},
                'Neophyte of Restoration',
              )}
              schoolTitle="healing"
              assetName="healing.png"
              blurb={t(
                'apprentice-healing-blurb',
                {},
                'Your apprentice is training to cast spells that will aid your survival. They know Forcewall and Charge and come with a Staff of Healing.',
              )}
            />
            <ApprenticeSelection
              iconName="user-secret"
              fluffName={t('apprentice-robeless-name', {}, 'Robeless Pupil')}
              schoolTitle="robeless"
              assetName="robeless.png"
              blurb={t(
                'apprentice-robeless-blurb',
                {},
                'Your apprentice is training to cast spells without their robes. They know Knock and Mindswap.',
              )}
            />
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
};

const ApprenticeSelection = (props) => {
  const { act } = useBackend();
  const { iconName, fluffName, schoolTitle, assetName, blurb } = props;
  const t = useT();
  return (
    <Section>
      <Stack align="middle" fill>
        <Stack.Item>
          <Stack vertical>
            <Stack.Item>
              <img
                src={resolveAsset(assetName)}
                style={{
                  borderStyle: 'solid',
                  borderColor: '#7e90a7',
                }}
              />
            </Stack.Item>
            <Stack.Item>
              <Button
                textAlign="center"
                fluid
                onClick={() =>
                  act('buy', {
                    school: schoolTitle,
                  })
                }
              >
                {t('apprentice-select', {}, 'Select')}
              </Button>
            </Stack.Item>
          </Stack>
        </Stack.Item>
        <Stack.Item grow>
          <Box fontSize="20px" height="30%">
            <Icon name={iconName} /> {fluffName}
          </Box>
          <BlockQuote height="70%" fontSize="16px">
            {blurb}
          </BlockQuote>
        </Stack.Item>
      </Stack>
    </Section>
  );
};
