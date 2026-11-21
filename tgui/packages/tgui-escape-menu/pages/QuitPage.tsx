import { makeT } from '../i18n';

type Props = {
  language?: string;
  onNavigate: (page: 'home') => void;
  onAction: (action: string) => void;
};

export function QuitPage({ language, onNavigate, onAction }: Props) {
  const t = makeT(language);
  return (
    <div className="escape-menu__quit">
      <div className="escape-menu__quit-prompt">
        {t('escape-menu-quit-prompt', {}, 'Are you sure you wish to quit?')}
      </div>
      <div className="escape-menu__quit-buttons">
        <button
          className="escape-menu__menu-button"
          onClick={() => onAction('quit')}
        >
          {t('escape-menu-quit-yes', {}, 'Yes')}
        </button>
        <button
          className="escape-menu__menu-button"
          onClick={() => onNavigate('home')}
        >
          {t('escape-menu-quit-no', {}, 'No')}
        </button>
      </div>
    </div>
  );
}
