import { useEffect, useState } from 'react';
import { Input, Section, Stack } from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';
import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';
import type { Objective } from './common/Objectives';

type Head = {
  name: string;
  role: string;
};

type Info = {
  antag_name: string;
  objectives: Objective[];
  leader: BooleanLike;
  code_phrases?: string[];
  code_responses?: string[];
  heads: Head[];
  lone_wolf: BooleanLike;
  conversion_objective?: string | null;
  conversion_objective_max_length: number;
};

type Translate = ReturnType<typeof useT>;

function formatCodes(t: Translate, text: string[]) {
  if (text.length === 0) return '';
  if (text.length === 1) return text[0];
  if (text.length === 2) {
    return t('antaginfo-revolution-codes-two', {
      first: text[0],
      second: text[1],
    });
  }
  return t('antaginfo-revolution-codes-many', {
    list: text.slice(0, -1).join(', '),
    last: text[text.length - 1],
  });
}

const JOKE_OBJECTIVE_COUNT = 5;
const OBJECTIVE_COUNT = 25;

function randomObjectivePlaceholderText(t: Translate) {
  if (Math.random() <= 0.01) {
    return t(
      `antaginfo-revolution-joke-${Math.floor(Math.random() * JOKE_OBJECTIVE_COUNT) + 1}`,
    );
  }
  return t(
    `antaginfo-revolution-example-${Math.floor(Math.random() * OBJECTIVE_COUNT) + 1}`,
  );
}

export const AntagInfoRevolution = () => {
  const { act, data } = useBackend<Info>();
  const t = useT();
  const {
    leader,
    code_phrases,
    code_responses,
    heads,
    lone_wolf,
    conversion_objective,
    conversion_objective_max_length,
  } = data;

  const [objectivePlaceholder, setObjectivePlaceholder] = useState(
    randomObjectivePlaceholderText(t),
  );

  useEffect(() => {
    if (!leader) return;
    const interval = setInterval(() => {
      setObjectivePlaceholder(randomObjectivePlaceholderText(t));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Window width={400} height={leader ? 500 : 400}>
      <Window.Content>
        <Section scrollable fill>
          <Stack vertical>
            <Stack.Item textColor="red" fontSize="24px" textAlign="center">
              {t('antaginfo-revolution-title')}
            </Stack.Item>
            <Stack.Item>
              {leader ? (
                <Stack vertical>
                  {lone_wolf ? (
                    <Stack.Item>
                      - {t('antaginfo-revolution-leader-alone')}
                    </Stack.Item>
                  ) : (
                    <Stack.Item>
                      - {t('antaginfo-revolution-leader-multiple')}
                    </Stack.Item>
                  )}
                  <Stack.Item>
                    - {t('antaginfo-revolution-leader-convert')}
                  </Stack.Item>
                  <Stack.Item>
                    - {t('antaginfo-revolution-leader-mindshields')}
                  </Stack.Item>
                  <Stack.Item>
                    - {t('antaginfo-revolution-leader-lost')}
                  </Stack.Item>
                </Stack>
              ) : (
                <Stack vertical>
                  <Stack.Item>
                    - {t('antaginfo-revolution-member-help')}
                  </Stack.Item>
                  <Stack.Item>
                    - {t('antaginfo-revolution-member-icons')}
                  </Stack.Item>
                  <Stack.Item>
                    - {t('antaginfo-revolution-member-lost')}
                  </Stack.Item>
                </Stack>
              )}
            </Stack.Item>
            {heads.length > 0 && (
              <>
                <Stack.Divider />
                <Stack.Item>
                  <Stack vertical>
                    <Stack.Item fontSize="16px" textAlign="center">
                      {t('antaginfo-revolution-heads')}
                    </Stack.Item>
                    {heads.map((head, i) => (
                      <Stack.Item key={`head-${i}`}>
                        -{' '}
                        {t('antaginfo-revolution-head', {
                          name: head.name,
                          role: head.role,
                        })}
                      </Stack.Item>
                    ))}
                  </Stack>
                </Stack.Item>
              </>
            )}
            {!!leader && (
              <>
                {!!code_phrases?.length && !!code_responses?.length && (
                  <>
                    <Stack.Divider />
                    <Stack.Item>
                      <Stack vertical>
                        <Stack.Item italic>
                          {t('antaginfo-revolution-code-intro')}
                        </Stack.Item>
                        <Stack.Item textColor="blue">
                          {t('antaginfo-revolution-code-phrases', {
                            codes: formatCodes(t, code_phrases),
                          })}
                        </Stack.Item>
                        <Stack.Item textColor="red">
                          {t('antaginfo-revolution-code-responses', {
                            codes: formatCodes(t, code_responses),
                          })}
                        </Stack.Item>
                      </Stack>
                    </Stack.Item>
                    <Stack.Divider />
                  </>
                )}
                <Stack.Divider />
                <Stack.Item>
                  <Stack vertical>
                    <Stack.Item italic>
                      {t('antaginfo-revolution-guideline')}
                    </Stack.Item>
                    <Stack.Item>
                      <Input
                        placeholder={t('antaginfo-revolution-example-prefix', {
                          text: objectivePlaceholder,
                        })}
                        fluid
                        maxLength={conversion_objective_max_length}
                        value={conversion_objective ?? ''}
                        onEnter={(value) =>
                          act('set_conversion_objective', {
                            conversion_objective: value,
                          })
                        }
                      />
                    </Stack.Item>
                  </Stack>
                </Stack.Item>
              </>
            )}
          </Stack>
        </Section>
      </Window.Content>
    </Window>
  );
};
