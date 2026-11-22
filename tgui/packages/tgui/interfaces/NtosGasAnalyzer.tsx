import { Button } from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { NtosWindow } from '../layouts';
import { GasAnalyzerContent, type GasAnalyzerData } from './GasAnalyzer';

type NtosGasAnalyzerData = GasAnalyzerData & {
  atmozphereMode: 'click' | 'env';
  clickAtmozphereCompatible: BooleanLike;
};

export const NtosGasAnalyzer = (props) => {
  const { act, data } = useBackend<NtosGasAnalyzerData>();
  const { atmozphereMode, clickAtmozphereCompatible } = data;
  const t = useT();
  return (
    <NtosWindow width={500} height={450}>
      <NtosWindow.Content scrollable>
        {!!clickAtmozphereCompatible && (
          <Button
            icon={'sync'}
            onClick={() => act('scantoggle')}
            fluid
            textAlign="center"
            tooltip={
              atmozphereMode === 'click'
                ? t(
                    'ntosgasanalyzer-tooltip-click',
                    {},
                    'Right-click on objects while holding the tablet to scan them. Right-click on the tablet to scan the current location.',
                  )
                : t(
                    'ntosgasanalyzer-tooltip-env',
                    {},
                    'The app will update its gas mixture reading automatically.',
                  )
            }
            tooltipPosition="bottom"
          >
            {atmozphereMode === 'click'
              ? t(
                  'ntosgasanalyzer-mode-click',
                  {},
                  'Scanning tapped objects. Click to switch.',
                )
              : t(
                  'ntosgasanalyzer-mode-env',
                  {},
                  'Scanning current location. Click to switch.',
                )}
          </Button>
        )}
        <GasAnalyzerContent />
      </NtosWindow.Content>
    </NtosWindow>
  );
};
