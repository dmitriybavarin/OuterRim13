import { Box, Button, Divider, Image, Section } from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';
import { processedText } from '../process';

type Data = {
  current_page: number;
  scribble_message: string | null;
  channel_has_messages: BooleanLike;
  channels: ChannelNames[];
  channel_data: ChannelData[];
  wanted_criminal: string | null;
  wanted_body: string | null;
  wanted_photo: string | null;
};

type ChannelNames = {
  name: string | null;
  page_number: number;
};

type ChannelData = {
  channel_name: string | null;
  author_name: string | null;
  is_censored: BooleanLike;
  channel_messages: ChannelMessages[];
};

type ChannelMessages = {
  message: string | null;
  photo: string | null;
  author: string | null;
};

export const Newspaper = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { channels = [], current_page, scribble_message } = data;

  return (
    <Window width={300} height={400}>
      <Window.Content backgroundColor="#858387" scrollable>
        <Section>
          <Button
            icon="arrow-left"
            width="49%"
            disabled={!current_page}
            onClick={() => act('prev_page')}
          >
            {t('newspaper-prev', {}, 'Previous Page')}
          </Button>
          <Button
            icon="arrow-right"
            width="50%"
            disabled={current_page === channels.length + 1}
            onClick={() => act('next_page')}
          >
            {t('newspaper-next', {}, 'Next Page')}
          </Button>
        </Section>
        {current_page === channels.length + 1 ? (
          <NewspaperEnding />
        ) : current_page ? (
          <NewspaperChannel />
        ) : (
          <NewspaperIntro />
        )}
        {!!scribble_message && (
          <Box
            style={{
              borderTop: '3px dotted rgba(255, 255, 255, 0.8)',
              borderBottom: '3px dotted rgba(255, 255, 255, 0.8)',
            }}
          >
            {scribble_message}
          </Box>
        )}
      </Window.Content>
    </Window>
  );
};

const NewspaperIntro = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { channels = [], wanted_criminal = [] } = data;

  return (
    <Section>
      <Box bold fontSize="30px">
        {t('newspaper-name', {}, 'The Griffon')}
      </Box>
      <Box bold fontSize="15px">
        {t('newspaper-slogan', {}, 'For use on Space Facilities only!')}
      </Box>
      <Box fontSize="12px">
        {t('newspaper-contents', {}, 'Table of Contents:')}
      </Box>
      {channels.map((channel) => (
        <Box key={channel.page_number}>
          {t(
            'newspaper-page-entry',
            { page: channel.page_number || 0, name: channel.name },
            `Page ${channel.page_number || 0}: ${channel.name}`,
          )}
        </Box>
      ))}
      {!!wanted_criminal && (
        <Box bold>
          {t(
            'newspaper-last-page',
            {},
            'Last Page: Important Security Announcement',
          )}
        </Box>
      )}
    </Section>
  );
};

const NewspaperChannel = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { channel_has_messages, channel_data = [] } = data;

  return (
    <Section>
      {channel_data.map((individual_channel) => (
        <Box key={individual_channel.channel_name}>
          <Box bold fontSize="15px">
            {individual_channel.channel_name}
          </Box>
          <Box fontSize="12px">
            {t(
              'newspaper-channel-author',
              { author: individual_channel.author_name },
              `Channel made by: ${individual_channel.author_name}`,
            )}
          </Box>
          {channel_has_messages
            ? individual_channel.channel_messages.map((message) => (
                <>
                  <Box key={message.message}>
                    <Box
                      dangerouslySetInnerHTML={processedText(message.message)}
                    />
                    {!!message.photo && <Image src={message.photo} />}
                    <Box>
                      {t(
                        'newspaper-written-by',
                        { author: message.author },
                        `Written by: ${message.author}`,
                      )}
                    </Box>
                  </Box>
                  <Divider />
                </>
              ))
            : t(
                'newspaper-no-stories',
                {},
                'No feed stories stem from this channel...',
              )}
        </Box>
      ))}
    </Section>
  );
};

const NewspaperEnding = (props) => {
  const { act, data } = useBackend<Data>();
  const t = useT();
  const { wanted_criminal, wanted_body, wanted_photo } = data;

  return (
    <Section>
      {wanted_criminal ? (
        <>
          <Box bold fontSize="15px">
            {t('newspaper-wanted', {}, 'Wanted Issue')}
          </Box>
          <Box fontSize="12px">
            {t(
              'newspaper-criminal',
              { name: wanted_criminal },
              `Criminal Name: ${wanted_criminal}`,
            )}
          </Box>
          <Box>
            {t(
              'newspaper-description',
              { description: wanted_body },
              `Description: ${wanted_body}`,
            )}
          </Box>
          {!!wanted_photo && <Image src={wanted_photo} />}
        </>
      ) : (
        t(
          'newspaper-nothing',
          {},
          'Apart from some uninteresting classified ads, theres nothing in this page...',
        )
      )}
    </Section>
  );
};
