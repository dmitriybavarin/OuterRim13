import { type ReactNode, useState } from 'react';
import {
  BlockQuote,
  Box,
  Button,
  NoticeBox,
  Section,
  TextArea,
} from 'tgui-core/components';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { useT } from '../i18n';
import { Window } from '../layouts';

type Data = {
  connected: BooleanLike;
  is_admin: BooleanLike;
  questions: Question[];
  queue_pos: number;
  read_only: BooleanLike;
  status: string;
  welcome_message: string;
  centcom_connected: BooleanLike;
  has_permabans: BooleanLike;
};

type Question = {
  qidx: number;
  question: string;
  response: string | null;
};

enum STATUS {
  Approved = 'interview_approved',
  Denied = 'interview_denied',
}

// Matches a complete markdown-style link, capturing the whole [...](...)
const linkRegex = /(\[[^[]+\]\([^)]+\))/;
// Decomposes a markdown-style link into the link and display text
const linkDecomposeRegex = /\[([^[]+)\]\(([^)]+)\)/;

// Renders any markdown-style links within a provided body of text
const linkifyText = (text: string) => {
  const parts: ReactNode[] = text.split(linkRegex);
  for (let i = 1; i < parts.length; i += 2) {
    const match = linkDecomposeRegex.exec(parts[i] as string);
    if (!match) continue;

    parts[i] = (
      <a key={`link${i}`} href={match[2]}>
        {match[1]}
      </a>
    );
  }
  return parts;
};

export const Interview = (props) => {
  const { act, data } = useBackend<Data>();
  const {
    connected,
    is_admin,
    questions = [],
    queue_pos,
    read_only,
    status,
    welcome_message = '',
    centcom_connected,
    has_permabans,
  } = data;

  const allAnswered = questions.every((q) => q.response);
  const numAnswered = questions.filter((q) => q.response)?.length;
  const t = useT();

  return (
    <Window
      width={550}
      height={600}
      canClose={is_admin || status === 'interview_approved'}
    >
      <Window.Content scrollable>
        {(!read_only && (
          <Section title={t('interview-welcome', {}, 'Welcome!')}>
            <p>{linkifyText(welcome_message)}</p>
          </Section>
        )) || <RenderedStatus status={status} queue_pos={queue_pos} />}
        <Section
          title={t('interview-questionnaire', {}, 'Questionnaire')}
          buttons={
            <span>
              <Button
                onClick={() => act('submit')}
                disabled={read_only || !allAnswered || !questions.length}
                icon="envelope"
                tooltip={
                  !allAnswered &&
                  t(
                    'interview-answer-all',
                    { answered: numAnswered, total: questions.length },
                    'Please answer all questions. { $answered } / { $total }',
                  )
                }
              >
                {read_only
                  ? t('interview-submitted', {}, 'Submitted')
                  : t('interview-submit', {}, 'Submit')}
              </Button>
              {!!is_admin && status === 'interview_pending' && (
                <span>
                  <Button disabled={!connected} onClick={() => act('adminpm')}>
                    {t('interview-admin-pm', {}, 'Admin PM')}
                  </Button>
                  <Button color="good" onClick={() => act('approve')}>
                    {t('interview-approve', {}, 'Approve')}
                  </Button>
                  <Button color="bad" onClick={() => act('deny')}>
                    {t('interview-deny', {}, 'Deny')}
                  </Button>
                  {!!centcom_connected && (
                    <Button
                      color={has_permabans ? 'bad' : 'average'}
                      tooltip={
                        has_permabans
                          ? t(
                              'interview-permabans',
                              {},
                              'This user has permabans in their history!',
                            )
                          : ''
                      }
                      onClick={() => act('check_centcom')}
                    >
                      {t('interview-centcom', {}, 'Check Centcom')}
                    </Button>
                  )}
                </span>
              )}
            </span>
          }
        >
          {!read_only && (
            <>
              <Box as="p" color="label">
                {t(
                  'interview-instructions',
                  {},
                  'Please answer the following questions.',
                )}
                <ul>
                  <li>
                    {t(
                      'interview-instructions-save',
                      {},
                      'You can press enter key or the save button to save an answer.',
                    )}
                  </li>
                  <li>
                    {t(
                      'interview-instructions-edit',
                      {},
                      'You can edit your answers until you press the submit button.',
                    )}
                  </li>
                  <li>
                    {t(
                      'interview-instructions-submit',
                      {},
                      'Press SUBMIT when you are done.',
                    )}
                  </li>
                </ul>
              </Box>
              <NoticeBox info align="center">
                {t(
                  'interview-no-edit',
                  {},
                  'You will not be able to edit your answers after submitting.',
                )}
              </NoticeBox>
            </>
          )}
          {questions.map((question) => (
            <QuestionArea key={question.qidx} {...question} />
          ))}
        </Section>
      </Window.Content>
    </Window>
  );
};

const RenderedStatus = (props: { status: string; queue_pos: number }) => {
  const { status, queue_pos } = props;
  const t = useT();

  switch (status) {
    case STATUS.Approved:
      return (
        <NoticeBox success>
          {t('interview-approved', {}, 'This interview was approved.')}
        </NoticeBox>
      );
    case STATUS.Denied:
      return (
        <NoticeBox danger>
          {t('interview-denied', {}, 'This interview was denied.')}
        </NoticeBox>
      );
    default:
      return (
        <NoticeBox info>
          {t(
            'interview-queue',
            { position: queue_pos },
            'Your answers have been submitted. You are position { $position } in queue.',
          )}
        </NoticeBox>
      );
  }
};

const QuestionArea = (props: Question) => {
  const { qidx, question, response } = props;
  const { act, data } = useBackend<Data>();
  const { is_admin, read_only } = data;
  const t = useT();

  const [userInput, setUserInput] = useState(response);

  const saveResponse = () => {
    act('update_answer', {
      qidx,
      answer: userInput,
    });
  };

  const changedResponse = userInput !== response;

  const saveAvailable = !read_only && !!userInput && changedResponse;

  const isSaved = !!response && !changedResponse;

  return (
    <Section
      title={t('interview-question', { number: qidx }, 'Question { $number }')}
      buttons={
        <Button
          disabled={!saveAvailable}
          onClick={saveResponse}
          icon={isSaved ? 'check' : 'save'}
        >
          {isSaved
            ? t('interview-saved', {}, 'Saved')
            : t('interview-save', {}, 'Save')}
        </Button>
      }
    >
      <p>{linkifyText(question)}</p>
      {read_only || is_admin ? (
        <BlockQuote>{response || t('interview-no-response', {}, 'No response.')}</BlockQuote>
      ) : (
        <TextArea
          fluid
          height={10}
          maxLength={500}
          onChange={setUserInput}
          onEnter={saveResponse}
          placeholder={t(
            'interview-placeholder',
            {},
            'Write your response here, max of 500 characters. Press enter to submit.',
          )}
          value={response || undefined}
        />
      )}
    </Section>
  );
};
