import { Box, NoticeBox } from 'tgui-core/components';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  uppertext: string;
  messages: { key: string }[];
  tguitheme: string;
};

export const Terminal = (props) => {
  const { data } = useBackend<Data>();
  const t = useT();
  const { messages = [], uppertext } = data;

  return (
    <Window theme={data.tguitheme} title={t('terminal-title', {}, 'Terminal')} width={480} height={520}>
      <Window.Content scrollable>
        <NoticeBox textAlign="left">{uppertext}</NoticeBox>
        {messages.map((message) => {
          return (
            <Box
              key={message.key}
              dangerouslySetInnerHTML={{ __html: message }}
            />
          );
        })}
      </Window.Content>
    </Window>
  );
};
