import { Button, LabeledList, NoticeBox, Section } from 'tgui-core/components';
import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  orphaned_keys: string[];
  archived_keys: string[];
};

export const AchievementsAdminPanel = (props) => {
  const { act, data } = useBackend<Data>();
  const { orphaned_keys, archived_keys } = data;
  const t = useT();
  return (
    <Window title={t('achievements-admin-title', {}, 'Achievements Admin Panel')} width={540} height={680}>
      <Window.Content scrollable>
        <Section
          title={t('achievements-admin-orphaned', {}, 'Orphaned achievements')}
        >
          <NoticeBox>
            {t('achievements-admin-orphaned-note')}
          </NoticeBox>
          <LabeledList>
            {orphaned_keys.map((key) => (
              <LabeledList.Item
                key={key}
                label=""
                buttons={
                  <>
                    <Button.Confirm
                      onClick={() => act('archive', { key: key })}
                    >
                      {t('achievements-admin-archive', {}, 'Archive')}
                    </Button.Confirm>
                    <Button.Confirm
                      onClick={() => act('cleanup_orphan', { key: key })}
                    >
                      {t('achievements-admin-cleanup', {}, 'Cleanup')}
                    </Button.Confirm>
                  </>
                }
              >
                {key}
              </LabeledList.Item>
            ))}
          </LabeledList>
        </Section>
        <Section
          title={t('achievements-admin-archived', {}, 'Archived achievements')}
        >
          <NoticeBox>{t('achievements-admin-archived-note')}</NoticeBox>
          <LabeledList>
            {archived_keys.map((key) => (
              <LabeledList.Item
                key={key}
                label=""
                buttons={
                  <Button.Confirm
                    onClick={() => act('cleanup_orphan', { key: key })}
                  >
                    {t('achievements-admin-cleanup', {}, 'Cleanup')}
                  </Button.Confirm>
                }
              >
                {key}
              </LabeledList.Item>
            ))}
          </LabeledList>
        </Section>
      </Window.Content>
    </Window>
  );
};
