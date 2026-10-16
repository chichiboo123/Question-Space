// Question Space 백엔드 (Google Apps Script)
// 이 파일 내용을 Apps Script 편집기의 Code.gs에 그대로 붙여 넣고 "새 버전"으로 배포한다.
// 설정 방법은 apps-script/README.md 참고.

// ===== 설정 =====
// 비밀값은 코드에 적지 않고 스크립트 속성(프로젝트 설정 → 스크립트 속성)에 저장한다.
//   SPREADSHEET_ID : 데이터 스프레드시트 ID
//   ADMIN_PASSWORD : 관리자 비밀번호
const PROPS = PropertiesService.getScriptProperties();
const SPREADSHEET_ID = PROPS.getProperty("SPREADSHEET_ID");
if (!SPREADSHEET_ID) throw new Error("스크립트 속성 SPREADSHEET_ID가 없습니다");

const SS = SpreadsheetApp.openById(SPREADSHEET_ID);
const Q_SHEET = SS.getSheetByName("Questions");
const C_SHEET = SS.getSheetByName("Comments");

if (!Q_SHEET) throw new Error("Questions 시트를 찾을 수 없습니다");
if (!C_SHEET) throw new Error("Comments 시트를 찾을 수 없습니다");

// J열: 작성자 확인용 토큰의 SHA-256 해시 (원본 토큰은 작성자 브라우저에만 있다)
const OWNER_COL = 10;

const MAX_AUTHOR = 20;
const MAX_QUESTION = 300;
const MAX_COMMENT = 500;
const MAX_TOPICS = 11;
const MAX_TOPIC = 20;

// 관리자 비밀번호 대입 방지: 10분 동안 20회 넘게 틀리면 잠시 막는다
const ADMIN_MAX_FAILS = 20;
const ADMIN_LOCK_SECONDS = 600;

// ===== 웹앱 엔드포인트 =====
function doGet(e) {
  e = e || { parameter: {} };
  const action = (e.parameter.action || "getall").toLowerCase();

  try {
    switch (action) {
      case "getall":
        return jsonResponse(getAllQuestions());
      case "get":
        return jsonResponse(getQuestionById(e.parameter.id));
      case "random":
        return jsonResponse(getRandomQuestion());
      case "bytopic":
        return jsonResponse(getQuestionsByTopic(e.parameter.topic));
      default:
        return jsonResponse({ error: "Unknown action" });
    }
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
  } catch (err) {
    return jsonResponse({ error: "Invalid JSON" });
  }
  const action = String(body.action || "").toLowerCase();

  if (action === "adminlogin") {
    try {
      return jsonResponse({ ok: isAdmin(body.adminPassword) });
    } catch (err) {
      return jsonResponse({ error: err.message });
    }
  }

  // 동시에 여러 글이 등록될 때 같은 행을 덮어쓰지 않도록 쓰기 작업은 잠금 안에서 처리한다
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return jsonResponse({ error: "Server busy. Try again." });
  }

  try {
    switch (action) {
      case "addquestion":
        return jsonResponse(addQuestion(body));
      case "addcomment":
        return jsonResponse(addComment(body));
      case "deletequestion":
        return jsonResponse(deleteQuestion(body));
      case "updatequestion":
        return jsonResponse(updateQuestion(body));
      case "deletecomment":
        return jsonResponse(deleteComment(body));
      case "updatecomment":
        return jsonResponse(updateComment(body));
      default:
        return jsonResponse({ error: "Unknown action" });
    }
  } catch (err) {
    return jsonResponse({ error: err.message });
  } finally {
    lock.releaseLock();
  }
}

// ===== 질문 조회 =====
function getAllQuestions() {
  const data = getSheetData(Q_SHEET);
  const comments = getSheetData(C_SHEET);
  return data.map(row => formatQuestion(row, comments)).reverse();
}

function getQuestionById(id) {
  const data = getSheetData(Q_SHEET);
  const comments = getSheetData(C_SHEET);
  const row = data.find(r => r[0] === id);
  if (!row) return { error: "Not found" };
  return formatQuestion(row, comments);
}

function getRandomQuestion() {
  const data = getSheetData(Q_SHEET);
  if (data.length === 0) return null;
  const comments = getSheetData(C_SHEET);
  const row = data[Math.floor(Math.random() * data.length)];
  return formatQuestion(row, comments);
}

function getQuestionsByTopic(topic) {
  const data = getSheetData(Q_SHEET);
  const comments = getSheetData(C_SHEET);
  return data
    .filter(row => {
      const topics = row[3] ? String(row[3]).split(",").map(t => t.trim()) : [];
      return topics.includes(topic);
    })
    .map(row => formatQuestion(row, comments))
    .reverse();
}

// ===== 질문·답변 작성 =====
function addQuestion(body) {
  const author = requireText(body.author, MAX_AUTHOR, "author");
  const text = requireText(body.text, MAX_QUESTION, "text");
  const topics = requireTopics(body.topics);

  const id = Utilities.getUuid();
  const ownerToken = newOwnerToken();
  const now = new Date().toISOString();

  const row = Q_SHEET.getLastRow() + 1;
  Q_SHEET.getRange(row, 1, 1, 5).setValues([[id, asText(author), asText(text), asText(topics.join(",")), now]]);
  setTranslationFormulas(Q_SHEET, row, "C");
  Q_SHEET.getRange(row, OWNER_COL).setValue(hashToken(ownerToken));
  SpreadsheetApp.flush();

  return {
    id, author, text, topics,
    createdAt: now, comments: [],
    text_ko: Q_SHEET.getRange(row, 6).getDisplayValue(),
    text_en: Q_SHEET.getRange(row, 7).getDisplayValue(),
    text_ja: Q_SHEET.getRange(row, 8).getDisplayValue(),
    text_id: Q_SHEET.getRange(row, 9).getDisplayValue(),
    ownerToken,
  };
}

function addComment(body) {
  const questionId = String(body.questionId || "");
  if (findRow(Q_SHEET, questionId) < 0) throw new Error("Question not found");
  const author = requireText(body.author, MAX_AUTHOR, "author");
  const text = requireText(body.text, MAX_COMMENT, "text");

  const id = Utilities.getUuid();
  const ownerToken = newOwnerToken();
  const now = new Date().toISOString();

  const row = C_SHEET.getLastRow() + 1;
  C_SHEET.getRange(row, 1, 1, 5).setValues([[id, questionId, asText(author), asText(text), now]]);
  setTranslationFormulas(C_SHEET, row, "D");
  C_SHEET.getRange(row, OWNER_COL).setValue(hashToken(ownerToken));
  SpreadsheetApp.flush();

  return {
    id, questionId, author, text, createdAt: now,
    text_ko: C_SHEET.getRange(row, 6).getDisplayValue(),
    text_en: C_SHEET.getRange(row, 7).getDisplayValue(),
    text_ja: C_SHEET.getRange(row, 8).getDisplayValue(),
    text_id: C_SHEET.getRange(row, 9).getDisplayValue(),
    ownerToken,
  };
}

// ===== 질문·답변 수정·삭제 (관리자 또는 작성자만) =====
function deleteQuestion(body) {
  const row = authorize(Q_SHEET, body);
  Q_SHEET.deleteRow(row);

  const cData = C_SHEET.getDataRange().getValues();
  for (let i = cData.length - 1; i >= 1; i--) {
    if (cData[i][1] === body.id) C_SHEET.deleteRow(i + 1);
  }
  return { success: true, deletedId: body.id };
}

function updateQuestion(body) {
  const row = authorize(Q_SHEET, body);
  if (body.text !== undefined) {
    const text = requireText(body.text, MAX_QUESTION, "text");
    Q_SHEET.getRange(row, 3).setValue(asText(text));
    setTranslationFormulas(Q_SHEET, row, "C");
  }
  if (body.topics !== undefined) {
    Q_SHEET.getRange(row, 4).setValue(asText(requireTopics(body.topics).join(",")));
  }
  SpreadsheetApp.flush();
  return { success: true, updatedId: body.id };
}

function deleteComment(body) {
  const row = authorize(C_SHEET, body);
  C_SHEET.deleteRow(row);
  return { success: true, deletedId: body.id };
}

function updateComment(body) {
  const row = authorize(C_SHEET, body);
  const text = requireText(body.text, MAX_COMMENT, "text");
  C_SHEET.getRange(row, 4).setValue(asText(text));
  setTranslationFormulas(C_SHEET, row, "D");
  SpreadsheetApp.flush();
  return { success: true, updatedId: body.id };
}

// ===== 권한 확인 =====
// 관리자 비밀번호 또는 작성자 토큰이 맞으면 대상 행 번호(1부터 시작)를 돌려준다.
function authorize(sheet, body) {
  const id = String(body.id || "");
  const row = findRow(sheet, id);
  if (row < 0) throw new Error("Not found");

  if (body.adminPassword && isAdmin(body.adminPassword)) return row;

  const storedHash = String(sheet.getRange(row, OWNER_COL).getValue() || "");
  const token = typeof body.ownerToken === "string" ? body.ownerToken : "";
  if (storedHash && token && storedHash === hashToken(token)) return row;

  throw new Error("Unauthorized");
}

function isAdmin(password) {
  const saved = PROPS.getProperty("ADMIN_PASSWORD");
  if (!saved || typeof password !== "string" || !password) return false;

  const cache = CacheService.getScriptCache();
  const fails = Number(cache.get("adminFails") || 0);
  if (fails >= ADMIN_MAX_FAILS) throw new Error("Too many attempts. Try again later.");

  if (password === saved) return true;
  cache.put("adminFails", String(fails + 1), ADMIN_LOCK_SECONDS);
  return false;
}

function newOwnerToken() {
  return Utilities.getUuid() + Utilities.getUuid();
}

function hashToken(token) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, token, Utilities.Charset.UTF_8);
  // "sha256:" 접두어를 붙여 시트가 값을 숫자·수식으로 해석하지 않게 한다
  return "sha256:" + bytes.map(b => ((b + 256) % 256).toString(16).padStart(2, "0")).join("");
}

// ===== 입력 검증 =====
function requireText(value, maxLength, field) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) throw new Error(`${field} is required`);
  if (text.length > maxLength) throw new Error(`${field} is too long`);
  return text;
}

function requireTopics(value) {
  if (!Array.isArray(value)) throw new Error("topics is required");
  const topics = value
    .map(t => (typeof t === "string" ? t.trim() : ""))
    .filter(Boolean);
  if (topics.length === 0 || topics.length > MAX_TOPICS) throw new Error("invalid topics");
  if (topics.some(t => t.length > MAX_TOPIC || t.includes(","))) throw new Error("invalid topics");
  return topics;
}

// 이용자가 입력한 글이 =, +, -, @ 로 시작하면 시트가 수식으로 실행하므로 앞에 '를 붙여 글자로 저장한다
function asText(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

// ===== 유틸리티 =====
function setTranslationFormulas(sheet, row, textColLetter) {
  const ref = `${textColLetter}${row}`;
  ["ko", "en", "ja", "id"].forEach((lang, i) => {
    sheet.getRange(row, 6 + i).setFormula(`=IF(${ref}="","",GOOGLETRANSLATE(${ref},"auto","${lang}"))`);
  });
}

function findRow(sheet, id) {
  const lastRow = sheet.getLastRow();
  if (!id || lastRow < 2) return -1;
  const ids = sheet.getRange(1, 1, lastRow, 1).getValues();
  for (let i = 1; i < ids.length; i++) {
    if (ids[i][0] === id) return i + 1;
  }
  return -1;
}

function getSheetData(sheet) {
  const data = sheet.getDataRange().getValues();
  return data.slice(1).filter(row => row[0] && String(row[0]).trim() !== "");
}

// 응답에는 J열(작성자 토큰 해시)을 절대 포함하지 않는다
function formatQuestion(row, allComments) {
  const id = row[0];
  const comments = allComments
    .filter(c => c[1] === id)
    .map(c => ({
      id: c[0],
      questionId: c[1],
      author: c[2],
      text: c[3],
      createdAt: c[4],
      text_ko: c[5] || "",
      text_en: c[6] || "",
      text_ja: c[7] || "",
      text_id: c[8] || "",
    }));

  return {
    id: row[0], author: row[1], text: row[2],
    topics: row[3] ? String(row[3]).split(",").map(t => t.trim()) : [],
    createdAt: row[4],
    text_ko: row[5] || "", text_en: row[6] || "", text_ja: row[7] || "",
    text_id: row[8] || "",
    comments,
  };
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===== 기존 데이터 인도네시아어 일괄 번역 (한 번만 수동 실행) =====
function backfillIndonesian() {
  [
    { sheet: Q_SHEET, textCol: 3 },
    { sheet: C_SHEET, textCol: 4 },
  ].forEach(({ sheet, textCol }) => {
    const last = sheet.getLastRow();
    for (let i = 2; i <= last; i++) {
      const cell = sheet.getRange(i, 9);
      if (!cell.getValue()) {
        const ref = sheet.getRange(i, textCol).getA1Notation();
        cell.setFormula(`=IF(${ref}="","",GOOGLETRANSLATE(${ref},"auto","id"))`);
        Utilities.sleep(300);
      }
    }
  });
  SpreadsheetApp.flush();
}
