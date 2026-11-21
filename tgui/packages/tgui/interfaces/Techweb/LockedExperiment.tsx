import { Box, Button, Flex, Icon } from 'tgui-core/components';

import { useT } from '../../i18n';

export function LockedExperiment(props) {
  const t = useT();
  return (
    <Box m={1} className="ExperimentConfigure__ExperimentPanel">
      <Button
        fluid
        backgroundColor="#40628a"
        className="ExperimentConfigure__ExperimentName"
        disabled
      >
        <Flex align="center" justify="space-between">
          <Flex.Item color="rgba(0, 0, 0, 0.6)">
            <Icon name="lock" />
            {t('research-experiment-undiscovered', {}, 'Undiscovered Experiment')}
          </Flex.Item>
          <Flex.Item color="rgba(0, 0, 0, 0.5)">???</Flex.Item>
        </Flex>
      </Button>
      <Box className="ExperimentConfigure__ExperimentContent">
        {t(
          'research-experiment-undiscovered-desc',
          {},
          'This experiment has not been discovered yet, continue researching nodes in the tree to discover the contents of this experiment.',
        )}
      </Box>
    </Box>
  );
}
