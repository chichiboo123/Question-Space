import { FileText, Target, Clock, Globe, UserX, Baby, Mail } from "lucide-react";
import LegalLayout from "@/components/LegalLayout";
import { useLang } from "@/lib/i18n";
import { SERVICE_NAME, OPERATOR, PRIVACY_EFFECTIVE_DATE } from "@/lib/legal";

// 개인정보 보호법 제30조, 같은 법 시행령 제31조 및 개인정보보호위원회
// 「개인정보 처리방침 작성지침」의 기재 항목 순서를 따른다.
const SUMMARY = [
  { icon: FileText, label: "처리 항목", value: "닉네임, 질문·답변 내용, 카테고리, 작성일시" },
  { icon: Target, label: "처리 목적", value: "질문·답변 게시 및 자동 번역 제공" },
  { icon: Clock, label: "보유 기간", value: "게시물 삭제 시 또는 서비스 종료 시까지" },
  { icon: UserX, label: "제3자 제공", value: "없음" },
  { icon: Globe, label: "처리위탁·국외이전", value: "Google LLC, GitHub, Inc. (미국)" },
  { icon: Baby, label: "아동 개인정보", value: "실명·연락처 등을 수집하지 않음" },
  { icon: Mail, label: "문의", value: "개인정보 보호책임자 문의 채널" },
];

export default function Privacy() {
  const { t } = useLang();

  return (
    <LegalLayout title={t("privacyPolicy")} effectiveDate={PRIVACY_EFFECTIVE_DATE}>
      <p>
        {OPERATOR.name}(이하 &lsquo;운영자&rsquo;)은 「개인정보 보호법」 제30조에 따라 {SERVICE_NAME}(이하
        &lsquo;서비스&rsquo;) 이용자의 개인정보를 보호하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록
        다음과 같이 개인정보 처리방침을 수립·공개합니다.
      </p>
      <p>
        서비스는 <strong>회원가입 없이</strong> 닉네임만으로 이용할 수 있으며, 실명·연락처·이메일·학교명 등 특정
        개인을 알아볼 수 있는 정보를 요구하지 않습니다. 다만 이용자가 닉네임이나 게시물에 스스로 이러한 정보를
        적는 경우 개인정보에 해당할 수 있으므로, 운영자는 이 방침에 따라 보호합니다.
      </p>

      <h2>주요 개인정보 처리 표시</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        {SUMMARY.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-3">
            <Icon size={20} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="mb-0 text-xs text-muted-foreground">{label}</p>
              <p className="mb-0 font-medium">{value}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">※ 세부 사항은 아래 본문을 확인해 주세요.</p>

      <h2>제1조 (개인정보의 처리 목적 및 법적 근거)</h2>
      <p>
        운영자는 다음 목적을 위해서만 개인정보를 처리하며, 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에
        따라 필요한 조치를 이행합니다.
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>처리 목적</th>
              <th>법적 근거</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>질문·답변의 등록, 게시, 수정·삭제 등 서비스 제공</td>
              <td rowSpan={3}>
                정보주체와의 계약(이용약관)의 이행
                <br />
                (「개인정보 보호법」 제15조제1항제4호)
              </td>
            </tr>
            <tr>
              <td>게시물의 다국어(한국어·영어·일본어·인도네시아어) 자동 번역 제공</td>
            </tr>
            <tr>
              <td>부적절한 게시물 관리 및 이용약관 위반 행위 대응</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>제2조 (처리하는 개인정보의 항목 및 수집 방법)</h2>
      <h3>1. 이용자가 직접 입력하는 정보</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>구분</th>
              <th>항목</th>
              <th>수집 방법</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>질문 작성</td>
              <td>(필수) 닉네임, 질문 내용, 카테고리</td>
              <td rowSpan={2}>이용자가 서비스 화면에 직접 입력</td>
            </tr>
            <tr>
              <td>답변 작성</td>
              <td>(필수) 닉네임, 답변 내용</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3>2. 서비스 이용 과정에서 자동으로 생성되는 정보</h3>
      <ul>
        <li>게시물 식별번호(ID), 작성일시, 게시물의 자동 번역문</li>
        <li>작성자 확인값(토큰)의 해시값: 본인 게시물의 수정·삭제 권한을 확인하는 데에만 쓰이며 공개되지 않습니다.</li>
      </ul>
      <h3>3. 이용자 기기(브라우저)에만 저장되는 정보</h3>
      <p>
        아래 정보는 이용자의 브라우저 로컬 저장소(localStorage)에만 저장되며 운영자에게 전송되지 않습니다. 자세한
        내용은 제9조를 참고해 주세요.
      </p>
      <ul>
        <li>내가 작성한 질문·답변의 식별번호와 작성자 확인값(토큰), 언어 설정</li>
      </ul>
      <h3>4. 외부 서비스가 자동으로 생성·처리할 수 있는 정보</h3>
      <p>
        서비스 화면을 제공하는 호스팅·웹 글꼴 제공 업체(GitHub Pages, Google Fonts, jsDelivr)의 서버에는 접속 시 IP
        주소, 브라우저 종류, 접속 일시 등의 접속 기록이 해당 업체의 정책에 따라 남을 수 있습니다. 운영자는 이러한
        정보를 별도로 수집·저장하거나 이용하지 않습니다.
      </p>

      <h2>제3조 (개인정보의 처리 및 보유 기간)</h2>
      <ol>
        <li>
          닉네임, 질문·답변 내용 등 게시물 정보는 <strong>작성자가 게시물을 삭제하거나 운영자가 삭제할 때까지</strong>{" "}
          보유하며, 늦어도 서비스가 종료되는 때에 파기합니다.
        </li>
        <li>질문이 삭제되면 그 질문에 달린 답변도 함께 삭제됩니다.</li>
        <li>
          다만 관계 법령에 따라 보존할 필요가 있거나 수사기관의 적법한 요청이 있는 경우에는 해당 법령에서 정한 기간
          동안 보관할 수 있습니다.
        </li>
      </ol>

      <h2>제4조 (개인정보의 파기 절차 및 방법)</h2>
      <ol>
        <li>
          운영자는 보유 기간이 지나거나 처리 목적이 달성되는 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당
          개인정보를 파기합니다.
        </li>
        <li>
          파기 방법: 전자적 파일 형태의 정보는 데이터 저장소(Google 스프레드시트)에서 해당 행을 삭제하는 등 복구할 수
          없는 방법으로 영구 삭제합니다. 종이 문서로 처리하는 개인정보는 없습니다.
        </li>
      </ol>

      <h2>제5조 (개인정보의 제3자 제공)</h2>
      <p>
        운영자는 이용자의 개인정보를 제1조의 목적 범위에서만 처리하며, 이용자의 동의 또는 법률의 특별한 규정 등
        「개인정보 보호법」 제17조 및 제18조에 해당하는 경우를 제외하고는 제3자에게 제공하지 않습니다. 다만 서비스의
        특성상 이용자가 작성한 닉네임과 게시물은 서비스에 접속하는 누구나 볼 수 있도록 공개됩니다.
      </p>

      <h2>제6조 (개인정보 처리업무의 위탁 및 국외 이전)</h2>
      <p>
        운영자는 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리업무를 위탁하고 있으며, 수탁자의 서버가 국외에
        있어 「개인정보 보호법」 제28조의8제1항제3호에 따라 개인정보가 국외로 이전(보관)됩니다.
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>구분</th>
              <th>Google LLC</th>
              <th>GitHub, Inc.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>위탁 업무</th>
              <td>
                게시물 저장·관리(Google Apps Script, Google 스프레드시트), 게시물 자동 번역(Google 번역)
              </td>
              <td>서비스 웹페이지 호스팅(GitHub Pages)</td>
            </tr>
            <tr>
              <th>이전 항목</th>
              <td>닉네임, 질문·답변 내용, 카테고리, 작성일시</td>
              <td>접속 IP 주소 등 접속 기록</td>
            </tr>
            <tr>
              <th>이전 국가</th>
              <td>미국 (및 Google 데이터센터 소재 국가)</td>
              <td>미국</td>
            </tr>
            <tr>
              <th>이전 일시 및 방법</th>
              <td>질문·답변을 등록·수정할 때 암호화된 네트워크(HTTPS)로 전송</td>
              <td>서비스에 접속할 때 암호화된 네트워크(HTTPS)로 전송</td>
            </tr>
            <tr>
              <th>보유 및 이용 기간</th>
              <td>게시물 삭제 시 또는 위탁 계약 종료 시까지</td>
              <td>해당 업체의 개인정보 처리방침에 따름</td>
            </tr>
            <tr>
              <th>연락처</th>
              <td>
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                  policies.google.com/privacy
                </a>
              </td>
              <td>
                <a href="https://support.github.com/contact/privacy" target="_blank" rel="noopener noreferrer">
                  support.github.com/contact/privacy
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <strong>국외 이전을 거부하는 방법 및 효과:</strong> 국외 이전을 원하지 않는 이용자는 질문·답변을 작성하지
        않으면 됩니다. 이 경우 게시물 작성 기능은 이용할 수 없으나, 다른 이용자의 게시물을 둘러보는 것은
        가능합니다. 이미 작성한 게시물은 제8조의 방법으로 삭제를 요구할 수 있습니다.
      </p>
      <p>
        운영자는 위탁 계약 시 수탁자의 개인정보 보호 정책을 확인하며, 위탁 업무의 내용이나 수탁자가 변경될 경우에는
        지체 없이 이 개인정보 처리방침을 통해 공개합니다.
      </p>

      <h2>제7조 (14세 미만 아동의 개인정보 처리)</h2>
      <ol>
        <li>
          서비스는 실명·연락처 등 특정 개인을 알아볼 수 있는 정보를 요구하지 않으며, 14세 미만 아동의 개인정보를
          별도로 수집하지 않습니다.
        </li>
        <li>
          14세 미만 아동은 보호자 또는 선생님의 지도 아래 서비스를 이용하고, 닉네임과 게시물에 실명·학교·연락처·주소
          등 개인정보를 적지 않도록 해 주세요.
        </li>
        <li>
          운영자는 아동의 개인정보가 포함된 게시물을 발견하거나 신고받은 경우 지체 없이 삭제합니다. 법정대리인은
          아동의 개인정보에 대해 제8조에 따른 열람·정정·삭제·처리정지를 요구할 수 있습니다.
        </li>
      </ol>

      <h2>제8조 (정보주체와 법정대리인의 권리·의무 및 행사 방법)</h2>
      <ol>
        <li>
          이용자는 운영자에 대해 언제든지 개인정보 열람·정정·삭제·처리정지를 요구할 수 있습니다(「개인정보 보호법」
          제35조부터 제37조까지).
        </li>
        <li>
          권리 행사 방법
          <ul>
            <li>
              <strong>직접 처리:</strong> 게시물을 작성한 브라우저에서 &lsquo;내 글&rsquo; 표시가 있는 질문·답변을
              직접 수정하거나 삭제할 수 있습니다.
            </li>
            <li>
              <strong>운영자에게 요청:</strong> 브라우저 데이터를 삭제했거나 다른 기기에서 작성한 경우 등에는
              제12조의 개인정보 보호책임자에게 해당 게시물의 내용·작성일시 등 게시물을 특정할 수 있는 정보를 알려
              요청해 주세요.
            </li>
          </ul>
        </li>
        <li>운영자는 요청을 받은 날부터 10일 이내에 조치하고 그 결과를 알려 드립니다.</li>
        <li>
          권리 행사는 법정대리인이나 위임을 받은 자 등 대리인을 통하여 할 수 있습니다. 이 경우 「개인정보 처리 방법에
          관한 고시」 별지 제11호 서식에 따른 위임장을 제출해야 합니다.
        </li>
        <li>
          개인정보 열람 및 처리정지 요구는 「개인정보 보호법」 제35조제4항, 제37조제2항에 의하여 제한될 수 있으며,
          다른 법령에서 그 개인정보가 수집 대상으로 명시된 경우에는 삭제를 요구할 수 없습니다.
        </li>
        <li>
          이용자는 타인의 개인정보를 게시하거나 사생활을 침해해서는 안 되며, 이를 위반하여 발생한 책임은 해당
          이용자에게 있습니다.
        </li>
      </ol>

      <h2>제9조 (개인정보 자동 수집 장치의 설치·운영 및 거부)</h2>
      <ol>
        <li>서비스는 쿠키(cookie)를 사용하지 않습니다.</li>
        <li>
          서비스는 편의 기능 제공을 위해 브라우저의 로컬 저장소(localStorage)에 다음 정보를 저장합니다. 이 정보는
          이용자의 기기에만 저장되고 운영자에게 전송되지 않습니다.
        </li>
      </ol>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>저장 항목</th>
              <th>이용 목적</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>내가 작성한 질문·답변의 식별번호와 작성자 확인값(토큰)</td>
              <td>&lsquo;내 글&rsquo; 표시 및 본인 게시물 수정·삭제 기능 제공</td>
            </tr>
            <tr>
              <td>언어 설정</td>
              <td>선택한 화면 언어 유지</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <strong>거부 방법:</strong> 브라우저 설정에서 사이트 데이터를 삭제하거나 저장을 차단할 수 있습니다. 이 경우
        &lsquo;내 글&rsquo; 표시와 직접 수정·삭제 기능을 이용할 수 없으며, 게시물 삭제는 제8조에 따라 운영자에게
        요청할 수 있습니다.
      </p>

      <h2>제10조 (행태정보 수집·이용 및 자동화된 결정)</h2>
      <ol>
        <li>
          운영자는 맞춤형 광고 등을 위한 행태정보를 수집하지 않으며, 방문자 분석 도구나 광고 서비스를 사용하지
          않습니다.
        </li>
        <li>
          서비스의 게시물 자동 번역은 이용자에 대한 평가·결정이 아니며, 운영자는 「개인정보 보호법」
          제37조의2에 따른 완전히 자동화된 시스템으로 이용자의 권리·의무에 영향을 미치는 결정을 하지 않습니다.
        </li>
        <li>운영자는 가명정보를 처리하지 않습니다.</li>
      </ol>

      <h2>제11조 (개인정보의 안전성 확보 조치)</h2>
      <p>운영자는 「개인정보 보호법」 제29조에 따라 다음과 같은 안전성 확보 조치를 하고 있습니다.</p>
      <ul>
        <li>
          <strong>관리적 조치:</strong> 처리하는 개인정보의 최소화(회원가입·실명 등 미수집), 개인정보 처리방침 공개
        </li>
        <li>
          <strong>기술적 조치:</strong> 모든 데이터 전송 구간 암호화(HTTPS), 데이터 저장소 접근 권한을 운영자 계정으로
          제한, 게시물 수정·삭제 시 서버에서 작성자 확인값 또는 관리자 비밀번호를 검증, 작성자 확인값은 해시 처리하여
          저장
        </li>
        <li>
          <strong>물리적 조치:</strong> 물리적 보안이 갖추어진 클라우드 사업자(Google)의 데이터센터에 저장
        </li>
      </ul>

      <h2>제12조 (개인정보 보호책임자)</h2>
      <p>
        운영자는 개인정보 처리에 관한 업무를 총괄하고, 개인정보 처리와 관련한 이용자의 불만 처리 및 피해 구제를 위해
        아래와 같이 개인정보 보호책임자를 지정하고 있습니다. 개인정보 열람 청구도 아래 보호책임자에게 하실 수
        있습니다.
      </p>
      <div className="table-wrap">
        <table>
          <tbody>
            <tr>
              <th>개인정보 보호책임자</th>
              <td>{OPERATOR.privacyOfficer}</td>
            </tr>
            <tr>
              <th>연락처</th>
              <td>
                <a href={OPERATOR.contactUrl} target="_blank" rel="noopener noreferrer">
                  {OPERATOR.contactUrl.replace(/^https?:\/\//, "")}
                </a>{" "}
                (문의 채널)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>제13조 (권익침해 구제 방법)</h2>
      <p>
        이용자는 개인정보 침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원
        개인정보침해신고센터 등에 분쟁 해결이나 상담 등을 신청할 수 있습니다.
      </p>
      <ul>
        <li>
          개인정보분쟁조정위원회: (국번없이) 1833-6972 (
          <a href="https://www.kopico.go.kr" target="_blank" rel="noopener noreferrer">
            www.kopico.go.kr
          </a>
          )
        </li>
        <li>
          개인정보침해신고센터: (국번없이) 118 (
          <a href="https://privacy.kisa.or.kr" target="_blank" rel="noopener noreferrer">
            privacy.kisa.or.kr
          </a>
          )
        </li>
        <li>
          대검찰청: (국번없이) 1301 (
          <a href="https://www.spo.go.kr" target="_blank" rel="noopener noreferrer">
            www.spo.go.kr
          </a>
          )
        </li>
        <li>
          경찰청: (국번없이) 182 (
          <a href="https://ecrm.police.go.kr" target="_blank" rel="noopener noreferrer">
            ecrm.police.go.kr
          </a>
          )
        </li>
      </ul>

      <h2>제14조 (개인정보 처리방침의 변경)</h2>
      <ol>
        <li>이 개인정보 처리방침은 {PRIVACY_EFFECTIVE_DATE}부터 적용됩니다.</li>
        <li>
          내용이 추가·삭제 또는 수정되는 경우에는 시행일 7일 전부터(이용자 권리에 중요한 변경은 30일 전부터) 서비스
          화면을 통해 알려 드립니다.
        </li>
        <li>이전 개인정보 처리방침: 없음(최초 제정)</li>
      </ol>
    </LegalLayout>
  );
}
