import { NoticeBox } from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';
import { LaunchpadControl } from './LaunchpadConsole';

type Data = {
  has_pad: BooleanLike;
  pad_closed: BooleanLike;
};

export const LaunchpadRemote = (props) => {
  const { data } = useBackend<Data>();
  const t = useT();
  const { has_pad, pad_closed } = data;

  return (
    <Window
      title={t('launchpadremote-title', {}, 'Briefcase Launchpad Remote')}
      width={340}
      height={275}
      theme="syndicate"
    >
      <Window.Content>
        {(!has_pad && <NoticeBox>{t('launchpadremote-none', {}, 'No Launchpad Connected')}</NoticeBox>) ||
          (pad_closed && <NoticeBox>{t('launchpadremote-closed', {}, 'Launchpad Closed')}</NoticeBox>) || (
            <LaunchpadControl topLevel />
          )}
      </Window.Content>
    </Window>
  );
};
