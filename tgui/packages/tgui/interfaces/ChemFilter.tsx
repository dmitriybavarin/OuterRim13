import { Fragment } from 'react';
import { Button, Section, Stack } from 'tgui-core/components';

import { useBackend } from '../backend';
import type { CssColor } from '../constants';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  left: string[];
  right: string[];
};

type Props = {
  title: string;
  which: string;
  list: string[];
  buttonColor: CssColor;
};

export const ChemFilterPane = (props: Props) => {
  const { act } = useBackend();
  const t = useT();
  const { title, which, list, buttonColor } = props;

  return (
    <Section
      title={title}
      minHeight="240px"
      buttons={
        <Button
          icon="plus"
          color={buttonColor}
          onClick={() =>
            act('add', {
              which,
            })
          }
        >
          {t('chemfilter-add-reagent', {}, 'Add Reagent')}
        </Button>
      }
    >
      {list.map((filter) => (
        <Fragment key={filter}>
          <Button
            fluid
            icon="minus"
            onClick={() =>
              act('remove', {
                which,
                reagent: filter,
              })
            }
          >
            {filter}
          </Button>
        </Fragment>
      ))}
    </Section>
  );
};

export const ChemFilter = (props) => {
  const { data } = useBackend<Data>();
  const t = useT();
  const { left = [], right = [] } = data;

  return (
    <Window width={500} height={300}>
      <Window.Content scrollable>
        <Stack>
          <Stack.Item grow>
            <ChemFilterPane
              title={t('chemfilter-right', {}, 'Right')}
              which="right"
              list={right}
              buttonColor="red"
            />
          </Stack.Item>
          <Stack.Item grow>
            <ChemFilterPane
              title={t('chemfilter-left', {}, 'Left')}
              which="left"
              list={left}
              buttonColor="yellow"
            />
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
};
