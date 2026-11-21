import { useNumber } from '../../i18n';
import { NtosWindow, Window } from '../../layouts';
import { TechwebStart } from './Start';

export function Techweb(props) {
  const width = useNumber('techweb-window-width', 640);
  const height = useNumber('techweb-window-height', 735);
  return (
    <Window width={width} height={height}>
      <Window.Content>
        <TechwebStart />
      </Window.Content>
    </Window>
  );
}

export function AppTechweb(props) {
  const width = useNumber('techweb-window-width', 640);
  const height = useNumber('techweb-window-height', 735);
  return (
    <NtosWindow width={width} height={height}>
      <NtosWindow.Content>
        <TechwebStart />
      </NtosWindow.Content>
    </NtosWindow>
  );
}
