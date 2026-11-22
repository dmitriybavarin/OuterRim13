import { Box, Divider, Section } from 'tgui-core/components';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  error_message: string | null;
  last_power_output: string | null;
  cold_data: CirculatorData[];
  hot_data: CirculatorData[];
};

type CirculatorData = {
  temperature_inlet: number | null;
  temperature_outlet: number | null;
  pressure_inlet: number | null;
  pressure_outlet: number | null;
};

export const ThermoElectricGenerator = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const {
    error_message,
    last_power_output,
    cold_data = [],
    hot_data = [],
  } = data;
  if (error_message) {
    return (
      <Window width={320} height={100}>
        <Window.Content>
          <Section>
            {t('thermo-error', { message: error_message }, 'ERROR: { $message }')}
          </Section>
        </Window.Content>
      </Window>
    );
  }
  return (
    <Window width={350} height={195}>
      <Window.Content>
        <Section>
          <Box>
            <Box>
              {t('thermo-last-output', { value: last_power_output ?? '' })}
            </Box>
            <Divider />
            <Box m={1} textColor="cyan" bold>
              {t('thermo-cold-loop', {}, 'Cold Loop')}
            </Box>
            {cold_data.map((data, index) => (
              <Box key={index}>
                <Box>
                  {t('thermo-temperature', {
                    inlet: data.temperature_inlet ?? '',
                    outlet: data.temperature_outlet ?? '',
                  })}
                </Box>
                <Box>
                  {t('thermo-pressure', {
                    inlet: data.pressure_inlet ?? '',
                    outlet: data.pressure_outlet ?? '',
                  })}
                </Box>
              </Box>
            ))}
          </Box>
          <Box>
            <Box m={1} textColor="red" bold>
              {t('thermo-hot-loop', {}, 'Hot loop')}
            </Box>
            {hot_data.map((data, index) => (
              <Box key={index}>
                <Box>
                  {t('thermo-temperature', {
                    inlet: data.temperature_inlet ?? '',
                    outlet: data.temperature_outlet ?? '',
                  })}
                </Box>
                <Box>
                  {t('thermo-pressure', {
                    inlet: data.pressure_inlet ?? '',
                    outlet: data.pressure_outlet ?? '',
                  })}
                </Box>
              </Box>
            ))}
          </Box>
        </Section>
      </Window.Content>
    </Window>
  );
};
