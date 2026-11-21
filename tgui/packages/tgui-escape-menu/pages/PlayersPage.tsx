import type { PlayerInfo, ServerState } from '../EscapeMenu';
import { makeT, type Translator } from '../i18n';

type Props = {
  serverState: ServerState;
  onNavigate: (page: 'home') => void;
  onAction: (action: string, payload?: Record<string, unknown>) => void;
};

export function PlayersPage({ serverState, onNavigate, onAction }: Props) {
  const t = makeT(serverState.language);
  return (
    <>
      <BackButton onClick={() => onNavigate('home')} t={t} />
      <div className="escape-menu__player-list">
        {serverState.admins.length > 0 ? (
          <PlayerSection title={t('escape-menu-players-admins', {}, 'Admins')}>
            {serverState.admins.map((admin) => (
              <PlayerEntry
                key={admin.ckey}
                player={admin}
                t={t}
                onToggleIgnore={() =>
                  onAction('toggle_ignore', { ckey: admin.ckey })
                }
              />
            ))}
          </PlayerSection>
        ) : (
          <div className="escape-menu__player-section-title">
            {t('escape-menu-players-no-admins', {}, 'No Admins Online!')}
          </div>
        )}
        <PlayerSection title={t('escape-menu-players-players', {}, 'Players')}>
          {serverState.players.map((player) => (
            <PlayerEntry
              key={player.ckey}
              player={player}
              t={t}
              onToggleIgnore={() =>
                onAction('toggle_ignore', { ckey: player.ckey })
              }
            />
          ))}
        </PlayerSection>
        {serverState.ignoredOffline.length > 0 && (
          <PlayerSection title={t('escape-menu-players-ignored', {}, 'Ignored (Offline)')}>
            {serverState.ignoredOffline.map((ckey) => (
              <div
                key={ckey}
                className="escape-menu__player-entry escape-menu__player-entry--ignored"
              >
                <span
                  className="escape-menu__player-name"
                  onClick={() => onAction('toggle_ignore', { ckey })}
                >
                  {ckey}
                </span>
              </div>
            ))}
          </PlayerSection>
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

function PlayerSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="escape-menu__player-section">
      <div className="escape-menu__player-section-title">{title}</div>
      <div className="escape-menu__player-grid">{children}</div>
    </div>
  );
}

function PlayerEntry({
  player,
  onToggleIgnore,
  t,
}: {
  player: PlayerInfo;
  onToggleIgnore: () => void;
  t: Translator;
}) {
  return (
    <div
      className={
        'escape-menu__player-entry' +
        (player.ignored ? ' escape-menu__player-entry--ignored' : '')
      }
    >
      <span
        className="escape-menu__player-name"
        onClick={player.isSelf ? undefined : onToggleIgnore}
      >
        {player.displayName}
        {player.ping !== undefined && (
          <span className="escape-menu__player-ping">
            {' '}
            {t(
              'escape-menu-players-ping',
              { ping: player.ping },
              `(${player.ping}ms)`,
            )}
          </span>
        )}
      </span>
      {player.rank && (
        <span
          className={
            'escape-menu__player-rank' +
            (player.feedbackLink ? ' escape-menu__player-rank--link' : '')
          }
          onClick={
            player.feedbackLink
              ? () => Byond.command(`.url ${player.feedbackLink}`)
              : undefined
          }
        >
          {player.rank}
        </span>
      )}
    </div>
  );
}
