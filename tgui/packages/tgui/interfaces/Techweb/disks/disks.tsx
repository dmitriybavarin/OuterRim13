import { Section, VirtualList } from 'tgui-core/components';

import { useT } from '../../../i18n';
import { useRemappedBackend } from '../helpers';
import { TechNode } from '../nodes/TechNode';
import type { TechwebNode } from '../types';

export function TechwebDesignDisk(props) {
  const { data } = useRemappedBackend();
  const t = useT();
  const { design_cache, d_disk } = data;
  if (!d_disk) return;

  const { blueprints } = d_disk;

  return (
    <>
      {blueprints.map((x, i) => (
        <Section key={i} title={t('research-disk-slot', { number: i + 1 }, `Slot ${i + 1}`)}>
          {(x === null && t('research-disk-empty', {}, 'Empty')) || (
            <>
              {t('research-disk-contains', {}, 'Contains the design for')}{' '}
              <b>{design_cache[x].name}</b>:<br />
              <span
                className={`${design_cache[x].class} Techweb__DesignIcon`}
              />
            </>
          )}
        </Section>
      ))}
    </>
  );
}

export function TechwebTechDisk(props) {
  const { data } = useRemappedBackend();
  const { t_disk } = data;
  if (!t_disk) return;

  const { stored_research } = t_disk;

  return (
    <Section scrollable fill>
      <VirtualList>
        {Object.keys(stored_research)
          .map((x) => ({ path: x }))
          .map((n) => (
            <TechNode key={n.path} nocontrols node={n as TechwebNode} />
          ))}
      </VirtualList>
    </Section>
  );
}
