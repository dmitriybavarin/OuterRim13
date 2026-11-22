import { Stack } from 'tgui-core/components';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';
import { ChemFilterPane } from './ChemFilter';

type Data = {
  whitelist: string[];
};

export const BloodFilter = (props) => {
  const { data } = useBackend<Data>();
  const t = useT();
  const { whitelist = [] } = data;

  return (
    <Window width={500} height={300}>
      <Window.Content scrollable>
        <Stack>
          <Stack.Item grow>
            <ChemFilterPane
              title={t('chemfilter-whitelist', {}, 'Whitelist')}
              which="whitelist"
              list={whitelist}
              buttonColor="green"
            />
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
};
