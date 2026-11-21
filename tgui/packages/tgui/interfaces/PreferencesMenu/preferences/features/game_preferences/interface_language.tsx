import type { FeatureChoiced } from '../base';
import { FeatureDropdownInput } from '../dropdowns';

export const interface_language: FeatureChoiced = {
  name: 'Interface language',
  category: 'UI',
  description: `
    The language of chat messages, item names and descriptions.
    The change applies immediately, no reconnect is needed.
  `,
  component: FeatureDropdownInput,
};
