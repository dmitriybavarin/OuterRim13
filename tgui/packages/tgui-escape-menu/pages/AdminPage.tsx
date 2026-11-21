import { Tooltip } from 'tgui-core/components';

import { makeT, type Translator } from '../i18n';

type Props = {
  serverState: {
    language?: string;
    canAdminHelp: boolean;
    canSeeNotes: boolean;
    hasTicketNotification: boolean;
  };
  onNavigate: (page: 'home') => void;
  onAction: (action: string) => void;
  onClose: () => void;
};

export function AdminPage({
  serverState,
  onNavigate,
  onAction,
  onClose,
}: Props) {
  const t = makeT(serverState.language);
  return (
    <>
      <BackButton onClick={() => onNavigate('home')} t={t} />
      <div className="escape-menu__buttons escape-menu__buttons--page">
        <MenuButton
          onClick={() => {
            onAction('create_ticket');
            onClose();
          }}
          disabled={!serverState.canAdminHelp}
        >
          {t('escape-menu-admin-create-ticket', {}, 'Create Admin Ticket')}
        </MenuButton>
        <MenuButton
          onClick={() => onAction('view_ticket')}
          blinking={serverState.hasTicketNotification}
          tooltip={
            serverState.hasTicketNotification
              ? t(
                    'escape-menu-ticket-notification',
                    {},
                    'An admin is trying to talk to you!',
                  )
              : undefined
          }
        >
          {t('escape-menu-admin-view-ticket', {}, 'View Latest Ticket')}
        </MenuButton>
        <MenuButton
          onClick={() => {
            onAction('admin_notice');
            onClose();
          }}
        >
          {t('escape-menu-admin-notices', {}, 'See Admin Notices')}
        </MenuButton>
        <MenuButton
          onClick={() => {
            onAction('pray');
            onClose();
          }}
        >
          {t('escape-menu-admin-pray', {}, 'Pray')}
        </MenuButton>
        {!!serverState.canSeeNotes && (
          <MenuButton
            onClick={() => {
              onAction('see_notes');
              onClose();
            }}
          >
            {t('escape-menu-admin-notes', {}, 'See Notes')}
          </MenuButton>
        )}
      </div>
    </>
  );
}

function BackButton({ onClick, t }: { onClick: () => void; t: Translator }) {
  return (
    <button className="escape-menu__back-button" onClick={onClick}>
      <div className="escape-menu__icon-button">
        <span className="escape-menu-icons40x40 template" />
        <span className="escape-menu-icons40x40 back escape-menu__icon-overlay" />
      </div>
      <span>{t('escape-menu-back', {}, 'Back')}</span>
    </button>
  );
}

type MenuButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  blinking?: boolean;
  tooltip?: string;
};

function MenuButton({
  children,
  onClick,
  disabled,
  blinking,
  tooltip,
}: MenuButtonProps) {
  const button = (
    <button
      className={
        'escape-menu__menu-button' +
        (disabled ? ' escape-menu__menu-button--disabled' : '') +
        (blinking ? ' escape-menu__menu-button--blinking' : '')
      }
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </button>
  );

  if (tooltip) {
    return <Tooltip content={tooltip}>{button}</Tooltip>;
  }

  return button;
}
