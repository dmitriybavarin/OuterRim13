import { Gender } from '../../gender';
import type { FeatureChoiced } from '../base';
import {
  type DropdownInputProps,
  FeatureDropdownInputCore,
  generateOptions,
  useChoiceTranslate,
} from '../dropdowns';

export const body_type: FeatureChoiced = {
  name: 'Body type',
  component: FeatureBodyTypeDropdownInput,
};

function FeatureBodyTypeDropdownInput(props: DropdownInputProps) {
  const currentGender = props.character_preferences.misc.gender;
  const translate = useChoiceTranslate(props.featureId);
  return (
    <FeatureDropdownInputCore
      {...props}
      populateOptions={(serverData) => {
        let options = generateOptions(serverData, translate);
        if (currentGender !== Gender.Male && currentGender !== Gender.Female) {
          options = options.filter(
            (option) =>
              option.value === Gender.Male || option.value === Gender.Female,
          );
        }
        return options;
      }}
    />
  );
}
