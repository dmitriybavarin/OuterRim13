import { useEffect, useState } from 'react';
import { Tooltip } from 'tgui-core/components';

import type { ResourceLink } from '../EscapeMenu';
import { makeT } from '../i18n';

type ServerState = {
  language?: string;
  stationName: string;
  canLeaveBody: boolean;
  canAdminHelp: boolean;
  hasTicketNotification: boolean;
  resources: ResourceLink[];
};

type Props = {
  serverState: ServerState;
  onNavigate: (page: 'admin' | 'players' | 'leave_body' | 'quit') => void;
  onAction: (action: string) => void;
  onClose: () => void;
  showResources: boolean;
  onToggleResources: () => void;
};

const COLLAPSE_DURATION = 400;

export function HomePage({
  serverState,
  onNavigate,
  onAction,
  onClose,
  showResources,
  onToggleResources,
}: Props) {
  const t = makeT(serverState.language);
  const [mounted, setMounted] = useState(false);
  const [collapsing, setCollapsing] = useState(false);

  useEffect(() => {
    if (showResources) {
      setMounted(true);
      setCollapsing(false);
    } else if (mounted) {
      setCollapsing(true);
      const timer = setTimeout(() => {
        setMounted(false);
        setCollapsing(false);
      }, COLLAPSE_DURATION);
      return () => clearTimeout(timer);
    }
  }, [showResources]);

  return (
    <>
      <div className="escape-menu__home-column">
        <div className="escape-menu__title">
          <div className="escape-menu__subtitle">{t('escape-menu-home-subtitle', {}, 'Another day on...')}</div>
          <div className="escape-menu__station-name">
            {serverState.stationName}
          </div>
        </div>
        <div className="escape-menu__buttons">
          <MenuButton onClick={onClose}>
            {t('escape-menu-home-resume', {}, 'Resume')}
          </MenuButton>
          <MenuButton
            onClick={() => {
              onAction('character');
              onClose();
            }}
          >
            {t('escape-menu-home-character', {}, 'Character')}
          </MenuButton>
          <MenuButton
            onClick={() => {
              onAction('settings');
              onClose();
            }}
          >
            {t('escape-menu-home-settings', {}, 'Settings')}
          </MenuButton>
          <MenuButton onClick={() => onNavigate('players')}>
            {t('escape-menu-home-players', {}, 'Players')}
          </MenuButton>
          <MenuButton
            onClick={() => onNavigate('admin')}
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
            {t('escape-menu-home-admin-help', {}, 'Admin Help')}
          </MenuButton>
          <MenuButton
            onClick={() => onNavigate('leave_body')}
            disabled={!serverState.canLeaveBody}
          >
            {t('escape-menu-home-leave-body', {}, 'Leave Body')}
          </MenuButton>
          <MenuButton onClick={() => onNavigate('quit')}>
            {t('escape-menu-home-quit', {}, 'Quit')}
          </MenuButton>
        </div>
      </div>
      <div className="escape-menu__resources">
        {mounted && (
          <div
            className={
              'escape-menu__resource-list' +
              (collapsing ? ' escape-menu__resource-list--collapsing' : '')
            }
          >
            {serverState.resources.map((resource) => (
              <Tooltip
                key={resource.id}
                position="top"
                content={t(
                  `escape-menu-resource-${resource.id}-tooltip`,
                  {},
                  resource.tooltip,
                )}
              >
                <button
                  className="escape-menu__resource-button"
                  onClick={() => onAction(`resource_${resource.id}`)}
                >
                  <IconButton iconClass={resource.id} />
                  <span className="escape-menu__resource-button-label">
                    {t(
                      `escape-menu-resource-${resource.id}-label`,
                      {},
                      resource.label,
                    )}
                  </span>
                </button>
              </Tooltip>
            ))}
          </div>
        )}
        <button
          className="escape-menu__resource-toggle"
          onClick={onToggleResources}
        >
          <IconButton iconClass="resources" />
          <span className="escape-menu__resource-label">
            {t('escape-menu-home-resources', {}, 'Resources')}
          </span>
        </button>
      </div>
    </>
  );
}

function IconButton({ iconClass }: { iconClass: string }) {
  return (
    <div className="escape-menu__icon-button">
      <span className="escape-menu-icons40x40 template" />
      <span
        className={`escape-menu-icons40x40 ${iconClass} escape-menu__icon-overlay`}
      />
    </div>
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
