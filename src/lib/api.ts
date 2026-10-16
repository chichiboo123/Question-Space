const API_URL = "https://script.google.com/macros/s/AKfycbziVpqGBJoQz7nQN0ZwgALeUZvPB04EsmDVd0l-y9DKT99x6ns3lcGCGyctV-dKXdJBfg/exec";

export interface Comment {
  id: string;
  questionId: string;
  author: string;
  text: string;
  createdAt: string;
  text_ko?: string;
  text_en?: string;
  text_ja?: string;
  text_id?: string;
}

export interface Question {
  id: string;
  author: string;
  text: string;
  topics: string[];
  createdAt: string;
  comments: Comment[];
  text_ko?: string;
  text_en?: string;
  text_ja?: string;
  text_id?: string;
}

function safeString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function normalizeTopics(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => safeString(v).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value.split(",").map((v) => v.trim()).filter(Boolean);
  }
  return [];
}

function sanitizeComment(raw: any): Comment | null {
  const id = safeString(raw?.id).trim();
  if (!id) return null;

  return {
    id,
    questionId: safeString(raw?.questionId).trim(),
    author: safeString(raw?.author),
    text: safeString(raw?.text),
    createdAt: safeString(raw?.createdAt),
    text_ko: safeString(raw?.text_ko),
    text_en: safeString(raw?.text_en),
    text_ja: safeString(raw?.text_ja),
    text_id: safeString(raw?.text_id),
  };
}

function sanitizeQuestion(raw: any): Question | null {
  const id = safeString(raw?.id).trim();
  const text = safeString(raw?.text);
  if (!id || !text.trim()) return null;

  const rawComments = Array.isArray(raw?.comments) ? raw.comments : [];

  return {
    id,
    author: safeString(raw?.author),
    text,
    topics: normalizeTopics(raw?.topics),
    createdAt: safeString(raw?.createdAt),
    comments: rawComments.map(sanitizeComment).filter(Boolean) as Comment[],
    text_ko: safeString(raw?.text_ko),
    text_en: safeString(raw?.text_en),
    text_ja: safeString(raw?.text_ja),
    text_id: safeString(raw?.text_id),
  };
}

async function fetchJson(url: string, init?: RequestInit): Promise<any> {
  const res = await fetch(url, init);
  const text = await res.text();

  if (!res.ok) {
    throw new Error(`API ${res.status}: ${text.slice(0, 160)}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Invalid API response: ${text.slice(0, 160)}`);
  }
}

async function fetchGet(action: string, params: Record<string, string> = {}): Promise<any> {
  const url = new URL(API_URL);
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  return fetchJson(url.toString(), {
    method: "GET",
    cache: "no-store",
  });
}

async function fetchPost(body: Record<string, any>): Promise<any> {
  const data = await fetchJson(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
  });
  // Apps Script는 HTTP 상태 코드를 바꿀 수 없어 실패도 200 + { error }로 돌려준다
  if (data && typeof data === "object" && typeof data.error === "string") {
    throw new Error(data.error);
  }
  return data;
}

// 수정·삭제 권한: 작성자 토큰 또는 관리자 비밀번호 중 하나를 서버에 보낸다
export interface AuthCredentials {
  ownerToken?: string;
  adminPassword?: string;
}

export async function apiGetAllQuestions(): Promise<Question[]> {
  const data = await fetchGet("getall");
  if (!Array.isArray(data)) return [];
  return data.map(sanitizeQuestion).filter(Boolean) as Question[];
}

export async function apiGetQuestionById(id: string): Promise<Question | null> {
  if (!id) return null;
  const data = await fetchGet("get", { id });
  if (data?.error) return null;
  return sanitizeQuestion(data);
}

export async function apiGetRandomQuestion(): Promise<Question | null> {
  const data = await fetchGet("random");
  if (!data) return null;
  return sanitizeQuestion(data);
}

export async function apiGetQuestionsByTopic(topic: string): Promise<Question[]> {
  const data = await fetchGet("bytopic", { topic });
  if (!Array.isArray(data)) return [];
  return data.map(sanitizeQuestion).filter(Boolean) as Question[];
}

export async function apiAddQuestion(
  author: string,
  text: string,
  topics: string[]
): Promise<{ question: Question; ownerToken: string }> {
  const data = await fetchPost({ action: "addquestion", author, text, topics });
  const sanitized = sanitizeQuestion(data);
  if (!sanitized) throw new Error("Invalid addquestion response");
  return { question: sanitized, ownerToken: safeString(data?.ownerToken) };
}

export async function apiAddComment(
  questionId: string,
  author: string,
  text: string
): Promise<{ comment: Comment; ownerToken: string }> {
  const data = await fetchPost({ action: "addcomment", questionId, author, text });
  const sanitized = sanitizeComment(data);
  if (!sanitized) throw new Error("Invalid addcomment response");
  return { comment: sanitized, ownerToken: safeString(data?.ownerToken) };
}

export async function apiAdminLogin(adminPassword: string): Promise<boolean> {
  const data = await fetchPost({ action: "adminlogin", adminPassword });
  return data?.ok === true;
}

export async function apiDeleteQuestion(id: string, auth: AuthCredentials): Promise<any> {
  return fetchPost({ action: "deletequestion", id, ...auth });
}

export async function apiUpdateQuestion(id: string, text: string, topics: string[], auth: AuthCredentials): Promise<any> {
  return fetchPost({ action: "updatequestion", id, text, topics, ...auth });
}

export async function apiDeleteComment(questionId: string, id: string, auth: AuthCredentials): Promise<any> {
  return fetchPost({ action: "deletecomment", questionId, id, ...auth });
}

export async function apiUpdateComment(questionId: string, id: string, text: string, auth: AuthCredentials): Promise<any> {
  return fetchPost({ action: "updatecomment", questionId, id, text, ...auth });
}
