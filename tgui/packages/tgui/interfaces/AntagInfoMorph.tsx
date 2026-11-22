import { BlockQuote, Stack } from 'tgui-core/components';

import { useT } from '../i18n';
import { Window } from '../layouts';

const goodstyle = {
  color: 'lightgreen',
};

const badstyle = {
  color: 'red',
};

const noticestyle = {
  color: 'lightblue',
};

export const AntagInfoMorph = (props) => {
  const t = useT();
  return (
    <Window width={620} height={170} theme="abductor">
      <Window.Content>
        <Stack vertical fill>
          <Stack.Item fontSize="25px">{t('antaginfo-morph-title')}</Stack.Item>
          <Stack.Item>
            <BlockQuote>
              {t('antaginfo-morph-intro')}{' '}
              <span style={noticestyle}>{t('antaginfo-morph-assume')}</span>{' '}
              <span style={badstyle}>
                &ensp;{t('antaginfo-morph-assume-alert')}
              </span>{' '}
              {t('antaginfo-morph-morphed')}
              <span style={badstyle}>
                &ensp;{t('antaginfo-morph-wrongness')}
              </span>{' '}
              {t('antaginfo-morph-consume')}
              <span style={goodstyle}>&ensp;{t('antaginfo-morph-corpses')}</span>{' '}
              {t('antaginfo-morph-restore')}{' '}
              <span style={noticestyle}>{t('antaginfo-morph-restore-how')}</span>{' '}
            </BlockQuote>
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
};
