import { useState } from 'react';
import {
  Box,
  Button,
  Dimmer,
  Icon,
  Section,
  Stack,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { slugify, useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  broken: BooleanLike;
  destinations: Dest[];
  moving: BooleanLike;
  tram_location: string;
};

type Dest = {
  dest_icons: Record<string, string>;
  id: number;
  name: string;
};

const DEPARTMENT2COLOR = {
  // Station
  Arrivals: 'black',
  Service: 'olive',
  Command: 'blue',
  Security: 'red',
  Medical: 'teal',
  Engineering: 'yellow',
  Cargo: 'brown',
  Science: 'purple',
  Departures: 'white',
  // Hilbert Research Facility
  Reception: 'white',
  Botany: 'olive',
  Chemistry: 'teal',
  Processing: 'brown',
  Xenobiology: 'purple',
  Ordnance: 'yellow',
  Office: 'red',
  Dormitories: 'black',
} as const;

const COLOR2BLURB = {
  blue: "This is the tram's current location.",
  green: 'This is the selected destination.',
  transparent: 'Click to set destination.',
} as const;

const marginNormal = 1;
const marginDipped = 3;

const dipUnderCircle = (dest, dep) => {
  const index = Object.keys(dest.dest_icons).indexOf(dep);
  const dipped = index === 1;
  return dipped ? marginDipped : marginNormal;
};

export const TramControl = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { broken, moving, destinations = [], tram_location } = data;

  const [transitIndex, setTransitIndex] = useState(1);

  return (
    <Window title={t('tramcontrol-title', {}, 'Tram Controls')} width={600} height={300}>
      <Window.Content>
        {(!!broken && <BrokenTramDimmer />) || (
          <Section fill>
            {!!moving && <MovingTramDimmer />}
            <Stack
              align="center"
              fill
              fontSize="16px"
              justify="space-around"
              vertical
            >
              <Stack.Item>{t('tramcontrol-transit', {}, 'Nanotrasen Transit System')}</Stack.Item>
              <Stack.Item>
                <Stack fill>
                  {destinations.map((dest) => (
                    <Stack.Item key={dest.name}>
                      <Destination
                        dest={dest}
                        transitIndex={transitIndex}
                        setTransitIndex={setTransitIndex}
                      />
                    </Stack.Item>
                  ))}
                </Stack>
              </Stack.Item>
              <Stack.Item>
                <Button
                  disabled={tram_location === destinations[transitIndex].name}
                  onClick={() =>
                    act('send', {
                      destination: destinations[transitIndex].id,
                    })
                  }
                >
                  {t('tramcontrol-send', {}, 'Send Tram')}
                </Button>
              </Stack.Item>
            </Stack>
          </Section>
        )}
      </Window.Content>
    </Window>
  );
};

const BrokenTramDimmer = () => {
  const t = useT();

  return (
    <Dimmer>
      <Stack vertical>
        <Stack.Item>
          <Icon ml={7} color="red" name="triangle-exclamation" size={10} />
        </Stack.Item>
        <Stack.Item fontSize="14px" color="red">
          {t('tramcontrol-check', {}, 'Check Tram Controller!')}
        </Stack.Item>
      </Stack>
    </Dimmer>
  );
};

const MovingTramDimmer = (props) => {
  const { data } = useBackend<Data>();
  const t = useT();
  const { tram_location } = data;

  return (
    <Dimmer>
      <Stack vertical>
        <Stack.Item>
          <Icon ml={10} name="sync-alt" color="green" size={11} />
        </Stack.Item>
        <Stack.Item mt={5} fontSize="14px" color="green">
          {t(
            'tramcontrol-travelling',
            { location: tram_location },
            `The tram is travelling to ${tram_location}!`,
          )}
        </Stack.Item>
      </Stack>
    </Dimmer>
  );
};

const Destination = (props) => {
  const { dest, setTransitIndex, transitIndex } = props;
  const { data } = useBackend<Data>();
  const t = useT();
  const { destinations = [], tram_location } = data;

  const getDestColor = (dest) => {
    if (!tram_location) return 'bad';
    const here = dest.name === tram_location;
    const selected = transitIndex === destinations.indexOf(dest);
    return here ? 'blue' : selected ? 'green' : 'transparent';
  };

  return (
    <Stack vertical>
      <Stack.Item ml={5}>
        <Button
          mb={0}
          compact
          circular
          height={4.9}
          width={4.9}
          color={getDestColor(dest)}
          tooltipPosition="top"
          tooltip={
            COLOR2BLURB[getDestColor(dest)]
              ? t(
                  `tramcontrol-blurb-${getDestColor(dest)}`,
                  {},
                  COLOR2BLURB[getDestColor(dest)],
                )
              : undefined
          }
          onClick={() => setTransitIndex(destinations.indexOf(dest))}
        >
          <Icon ml={-0.75} fontSize="59px" name="circle-o" />
        </Button>
        {destinations.length - 1 !== destinations.indexOf(dest) ? (
          <Section title=" " mt={-7.5} ml={10} mr={-6} />
        ) : (
          <Box mt={-0.75} />
        )}
      </Stack.Item>
      {dest.dest_icons && (
        <Stack.Item>
          <Stack>
            {Object.keys(dest.dest_icons).map((dep) => (
              <Stack.Item key={dep} mt={dipUnderCircle(dest, dep)}>
                <Button
                  color={DEPARTMENT2COLOR[dep]}
                  icon={dest.dest_icons[dep]}
                  tooltipPosition="bottom"
                  tooltip={t(`tramcontrol-dept-${slugify(dep)}`, {}, dep)}
                  style={{
                    borderRadius: '5em',
                    border: '2px solid white',
                  }}
                />
              </Stack.Item>
            ))}
          </Stack>
        </Stack.Item>
      )}
    </Stack>
  );
};
