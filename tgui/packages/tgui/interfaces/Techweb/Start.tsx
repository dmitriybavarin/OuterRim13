import { useState } from 'react';
import { Button, Modal } from 'tgui-core/components';

import { useBackend } from '../../backend';
import { useT } from '../../i18n';
import { TechwebContent } from './Content';
import { TechwebDataProvider } from './Data';
import { TechWebRoute } from './hooks';
import type { TechWebData } from './types';

export function TechwebStart(props) {
  const { act, data } = useBackend<TechWebData>();
  const t = useT();
  const { locked, stored_research } = data;
  const techwebState = useState({
    route: '',
  });

  if (locked) {
    return (
      <Modal width="15em" align="center" className="Techweb__LockedModal">
        <div>
          <b>{t('research-console-locked', {}, 'Console Locked')}</b>
        </div>
        <Button icon="unlock" onClick={() => act('toggleLock')}>
          {t('research-unlock', {}, 'Unlock')}
        </Button>
      </Modal>
    );
  }

  if (!stored_research) {
    return (
      <Modal width="25em" align="center" className="Techweb__LockedModal">
        <div>
          <b>
            {t(
              'research-no-techweb',
              {},
              'No research techweb found, please synchronize the console.',
            )}
          </b>
        </div>
      </Modal>
    );
  }

  return (
    <TechWebRoute.Provider value={techwebState}>
      <TechwebDataProvider>
        <TechwebContent />
      </TechwebDataProvider>
    </TechWebRoute.Provider>
  );
}
