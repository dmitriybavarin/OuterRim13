import { useState } from 'react';
import {
  Button,
  DmIcon,
  NoticeBox,
  Section,
  Stack,
} from 'tgui-core/components';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { NtosWindow } from '../layouts';

type Data = {
  dmi: {
    icon: string;
    icon_state: string;
  };
};

export const NtosCursor = () => {
  const { data } = useBackend<Data>();

  const { dmi } = data;
  const t = useT();

  const [numClicked, incrementClicked] = useState(0);

  const NoticeBoxText = () => {
    if (numClicked <= 2) {
      return t(
        'ntoscursor-sword-first',
        {},
        `There's only one option... It's the sword.`,
      );
    } else if (numClicked === 3) {
      return t(
        'ntoscursor-sword-third',
        {},
        `You clicked the sword. It's still the sword.`,
      );
    } else if (numClicked === 4) {
      return t(
        'ntoscursor-sword-fourth',
        {},
        `You clicked the sword again. It's still the sword.`,
      );
    } else if (numClicked === 5) {
      return t(
        'ntoscursor-sword-fifth',
        {},
        `Trying to click the sword again? It's still the sword.`,
      );
    }
    return t(
      'ntoscursor-sword-many',
      { count: numClicked },
      `You clicked the sword ${numClicked} times... It's still the sword.`,
    );
  };

  return (
    <NtosWindow width={350} height={300}>
      <NtosWindow.Content scrollable>
        <Section title={t('ntoscursor-title', {}, 'Select Cursor')}>
          <Stack vertical>
            <Stack.Item align={'center'}>
              <Button
                height="100px"
                width="100px"
                color={numClicked >= 1 ? 'green' : null}
                onClick={() => incrementClicked(numClicked + 1)}
              >
                <DmIcon
                  icon={dmi.icon}
                  icon_state={dmi.icon_state}
                  style={{
                    transform: `scale(3) translateX(4px) translateY(8px)`,
                  }}
                />
              </Button>
            </Stack.Item>
            <Stack.Item>
              <NoticeBox>{NoticeBoxText()}</NoticeBox>
            </Stack.Item>
          </Stack>
        </Section>
      </NtosWindow.Content>
    </NtosWindow>
  );
};
