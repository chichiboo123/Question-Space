// 내가 쓴 글의 ID와 작성자 토큰을 브라우저에 저장한다.
// 토큰은 글을 등록할 때 서버가 한 번만 내려주며, 수정·삭제할 때 서버가 이 토큰으로 작성자를 확인한다.
const QUESTIONS_KEY = "qs-my-question-tokens";
const COMMENTS_KEY = "qs-my-comment-tokens";

// 토큰 없이 ID만 저장하던 예전 형식. 서버가 더 이상 ID만으로는 수정·삭제를 허용하지 않으므로 지운다.
const LEGACY_KEYS = ["qs-my-questions", "qs-my-comments"];
try {
  LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
} catch {
  /* storage unavailable, ignore */
}

type TokenMap = Record<string, string>;

function readTokens(key: string): TokenMap {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(([, v]) => typeof v === "string" && v)
    ) as TokenMap;
  } catch {
    return {};
  }
}

function writeTokens(key: string, tokens: TokenMap) {
  try {
    localStorage.setItem(key, JSON.stringify(tokens));
  } catch {
    /* storage unavailable, ignore */
  }
}

function addToken(key: string, id: string, token: string) {
  if (!id || !token) return;
  writeTokens(key, { ...readTokens(key), [id]: token });
}

function removeToken(key: string, id: string) {
  const tokens = readTokens(key);
  delete tokens[id];
  writeTokens(key, tokens);
}

export const addMyQuestion = (id: string, token: string) => addToken(QUESTIONS_KEY, id, token);
export const removeMyQuestion = (id: string) => removeToken(QUESTIONS_KEY, id);
export const getMyQuestionToken = (id: string): string | undefined => readTokens(QUESTIONS_KEY)[id];
export const isMyQuestion = (id: string) => !!getMyQuestionToken(id);

export const addMyComment = (id: string, token: string) => addToken(COMMENTS_KEY, id, token);
export const removeMyComment = (id: string) => removeToken(COMMENTS_KEY, id);
export const getMyCommentToken = (id: string): string | undefined => readTokens(COMMENTS_KEY)[id];
export const isMyComment = (id: string) => !!getMyCommentToken(id);
