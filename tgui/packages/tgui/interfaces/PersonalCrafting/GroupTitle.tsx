import { Divider, Stack } from 'tgui-core/components';
import { useCraftText } from '../../i18n';

type Props = {
  title: string;
};

export function GroupTitle(props: Props) {
  const { title } = props;
  const text = useCraftText();

  return (
    <Stack my={1}>
      <Stack.Item grow>
        <Divider />
      </Stack.Item>
      <Stack.Item color="gray">{text(title)}</Stack.Item>
      <Stack.Item grow>
        <Divider />
      </Stack.Item>
    </Stack>
  );
}

export function SubGroupTitle(props: Props) {
  const { title } = props;
  const text = useCraftText();

  return (
    <Stack>
      <Stack.Item
        style={{
          borderBlockColor: 'label',
          borderStyle: 'dashed',
          borderTop: '0',
          borderRight: '0',
          borderLeft: '0',
          borderWidth: '2px',
        }}
        mb={0.75}
        grow
      />
      <Stack.Item grow pr={0.5} pl={0.5} italic align="center">
        {text(title)}
      </Stack.Item>
      <Stack.Item
        style={{
          borderBlockColor: 'label',
          borderStyle: 'dashed',
          borderTop: '0',
          borderRight: '0',
          borderLeft: '0',
          borderWidth: '2px',
        }}
        mb={0.75}
        grow
      />
    </Stack>
  );
}
