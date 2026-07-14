'use client'

import React, { useEffect, useState } from 'react'
import { Checklist } from './Checklist'
import styles from '../handbook.module.css'

/* ---------- 1. PIECE CHIPS ---------- */
export function PieceChips06() {
  const pieces: [string, string][] = [
    ['Hermes chạy được', 'Bài 01'],
    ['Ra lệnh kiểu CEO', 'Bài 02'],
    ['Học quy trình → skill', 'Bài 03'],
    ['Dùng tool để hành động', 'Bài 04'],
    ['Việc lặp chạy bằng cron/webhook', 'Bài 05'],
  ]
  return (
    <div className={styles.pieceChips06}>
      {pieces.map(([t, tag]) => (
        <span key={t} className={styles.pieceChip06}>{t}<b>· {tag}</b></span>
      ))}
    </div>
  )
}

/* ---------- 2. BEFORE / AFTER ---------- */
export function SystemBeforeAfter06() {
  const [mode, setMode] = useState<'old' | 'new'>('old')
  const d = mode === 'old'
    ? {
      flow: ['Prompt rời', '·', 'Skill rời', '·', 'Automation rời'],
      loopback: '↻ không ai trả lời được',
      say: <>Mỗi automation, mỗi skill nằm tách rời thì CEO bắt đầu hỏi: <b>Agent nào đang làm việc gì? Việc nào đang chờ duyệt? Nếu lỗi thì báo ở đâu?</b> — và không có nơi nào trả lời.</>,
      cost: '✕ Rời rạc → rối, không biết ai làm gì, lỗi ở đâu, chờ duyệt việc nào',
      costCls: styles.costMinus06,
    }
    : {
      flow: ['Giao diện', '→', 'Agent vai trò', '→', 'Skill · Tool', '→', 'Dashboard / log'],
      loopback: '',
      say: <>Ghép các mảnh thành <b>một hệ thống Hermes</b>: agent theo vai trò, dashboard, rule bàn giao. CEO luôn biết ai đang làm gì, việc nào chờ duyệt, lỗi nằm ở đâu.</>,
      cost: '✓ Có hệ thống → mỗi việc có chỗ, mỗi agent có vai trò, mọi thứ có log',
      costCls: styles.costPlus06,
    }
  return (
    <div className={styles.sysBa06}>
      <div className={styles.sysBaSwitch06}>
        <button type="button" onClick={() => setMode('old')} className={mode === 'old' ? styles.on06 : ''}>⚠ Automation rời rạc</button>
        <button type="button" onClick={() => setMode('new')} className={mode === 'new' ? styles.onOrange06 : ''}>⚙ Một hệ thống Hermes</button>
      </div>
      <div className={styles.sysBaBody06}>
        <div className={styles.sysBaFlow06}>
          {d.flow.map((n, i) => {
            const isArrow = n === '→' || n === '·'
            const isLast = i === d.flow.length - 1 && mode === 'new'
            return isArrow ? <span key={i} className={styles.sysBaArrow06}>{n}</span> : <span key={i} className={isLast ? styles.sysBaNodeAcc06 : styles.sysBaNode06}>{n}</span>
          })}
          {mode === 'old' && <span className={styles.sysBaLoop06}>{d.loopback}</span>}
        </div>
        <p className={styles.sysBaSay06}>{d.say}</p>
        <div className={d.costCls}>{d.cost}</div>
      </div>
    </div>
  )
}

/* ---------- 3. STACK 6 LỚP ---------- */
export function SystemStack06() {
  const [sel, setSel] = useState(0)
  const layers = [
    { n: 'Giao diện', ic: '💬', role: 'CEO ra lệnh và duyệt việc', ex: 'Telegram · CLI · dashboard', d: 'Nơi CEO nói chuyện với hệ thống: ra lệnh, nhận báo cáo, bấm duyệt. Không cần nhiều kênh — một kênh chính là đủ để bắt đầu.' },
    { n: 'Agent vai trò', ic: '🧑\u200d💼', role: 'Chịu trách nhiệm một nhóm việc', ex: 'Sales Agent · Content Agent', d: 'Mỗi agent phụ trách đúng một nhóm việc lặp. Đây là lớp quyết định hệ thống có dễ kiểm soát hay không.' },
    { n: 'Skill', ic: '📋', role: 'Cách làm được chuẩn hóa', ex: 'Quy trình báo giá · viết blog', d: 'Quy trình đã được viết thành checklist tái sử dụng, để agent làm đúng cách mỗi lần — không phải nhắc lại từ đầu.' },
    { n: 'Tool', ic: '🔌', role: 'Khả năng hành động', ex: 'Gmail · Sheets · file · web', d: 'Cánh tay của agent: đọc/ghi dữ liệu, soạn email, tra cứu. Quyền hạn tool cần rõ: read, draft, update hay send.' },
    { n: 'Automation', ic: '⚙', role: 'Việc tự chạy theo lịch/sự kiện', ex: 'Báo cáo sáng · follow-up draft', d: 'Cron và webhook biến việc lặp thành việc tự chạy — CEO không phải nhớ, không phải bấm khởi động.' },
    { n: 'Dashboard / log', ic: '🖥', role: 'Nơi theo dõi trạng thái', ex: 'Việc đã làm · lỗi · chờ duyệt', d: 'Lớp kiểm soát: cho CEO biết cái gì đã xong, cái gì đang chờ, cái gì có vấn đề. Thiếu lớp này, hệ thống chạy nhưng mù.' },
  ]
  const l = layers[sel]
  return (
    <div className={styles.stack06}>
      <div className={styles.stackList06}>
        {layers.map((layer, i) => (
          <button key={layer.n} type="button" className={`${styles.stackLayer06} ${sel === i ? styles.stackLayerOn06 : ''}`} onClick={() => setSel(i)}>
            <span className={styles.stackLayerIdx06}>{i + 1}</span>
            <span className={styles.stackLayerIc06}>{layer.ic}</span>
            <span className={styles.stackLayerText06}>
              <span className={styles.stackLayerName06}>{layer.n}</span>
              <span className={styles.stackLayerRole06}>{layer.role}</span>
            </span>
            <span className={styles.stackLayerChev06}>›</span>
          </button>
        ))}
      </div>
      <div className={styles.stackDetail06}>
        <div className={styles.stackDetailIc06}>{l.ic}</div>
        <div className={styles.stackDetailLab06}>Lớp {sel + 1} / 6</div>
        <h4>{l.n}</h4>
        <p>{l.d}</p>
        <div className={styles.stackDetailEx06}><span className={styles.stackDetailExLab06}>Ví dụ</span>{l.ex}</div>
      </div>
    </div>
  )
}

/* ---------- 4. ROLES ---------- */
export function RoleCards06() {
  const [sel, setSel] = useState(0)
  const roleData = [
    { n: 'Sales Agent', ic: '📈', do: 'Lead, báo giá, follow-up, pipeline', dont: 'Tự giảm giá / gửi deal lớn khi chưa duyệt',
      spec: `Tên agent: Sales Agent
Mục tiêu: Giúp CEO xử lý lead, follow-up, báo giá nháp và pipeline sales.
Đầu vào: Sheet lead, ghi chú cuộc gọi, template báo giá, email khách.
Đầu ra: Email draft, báo giá draft, sales brief, danh sách việc cần CEO xử lý.
Tool được dùng: Telegram, file, Gmail draft, Google Sheets, web research.
Quyền hạn: Được đọc và draft. Không tự gửi email/báo giá nếu chưa được duyệt.
Escalation: Lead lớn quá hạn, thiếu giá, khách phản hồi khẩn.` },
    { n: 'Content Agent', ic: '✍', do: 'Ý tưởng, outline, draft, lịch đăng', dont: 'Tự đăng nội dung nhạy cảm',
      spec: `Tên agent: Content Agent
Mục tiêu: Giúp CEO gom ý tưởng, lên outline, viết draft theo voice và đề xuất lịch đăng.
Đầu vào: Folder ý tưởng, voice/brand guide, lịch đăng hiện tại, nội dung cũ.
Đầu ra: Ý tưởng, outline, draft bài, lịch đăng tuần, post ngắn tái sử dụng.
Tool được dùng: Telegram, file, docs, web research.
Quyền hạn: Chỉ đề xuất và draft. Không tự đăng, nhất là nội dung nhạy cảm.
Escalation: Tuần chưa có bài lên lịch, chủ đề nhạy cảm cần CEO quyết.` },
    { n: 'Research Agent', ic: '🔎', do: 'Tóm tắt thị trường, đối thủ, khách hàng', dont: 'Bịa dữ liệu / kết luận chưa xác minh',
      spec: `Tên agent: Research Agent
Mục tiêu: Chuẩn bị thông tin trước sales call, tóm tắt đối thủ và xu hướng ngành.
Đầu vào: Sheet khách hàng, website đối thủ, nguồn tin ngành.
Đầu ra: Customer brief, đối thủ tóm tắt, insight cho content, câu hỏi nên hỏi.
Tool được dùng: web research, file, Telegram.
Quyền hạn: Chỉ đọc và tổng hợp. Đánh dấu rõ dữ kiện chưa xác minh.
Escalation: Không tìm đủ thông tin đáng tin → báo CEO, không bịa.` },
    { n: 'Ops Agent', ic: '🗂', do: 'Báo cáo, checklist, nhắc việc, log', dont: 'Tự sửa dữ liệu quan trọng',
      spec: `Tên agent: Ops Agent
Mục tiêu: Tổng hợp việc tồn, kiểm tra checklist vận hành, báo lỗi và ghi log.
Đầu vào: Danh sách việc, log automation, trạng thái các agent.
Đầu ra: Daily Ops Wrap-up, danh sách việc chờ CEO, báo lỗi automation.
Tool được dùng: file, Telegram, Sheets (read).
Quyền hạn: Đọc và tổng hợp. Không tự sửa dữ liệu quan trọng.
Escalation: Automation lỗi, việc quan trọng quá hạn → đưa lên đầu báo cáo.` },
    { n: 'Finance/Admin', ic: '🧾', do: 'Tổng hợp chứng từ, nhắc thanh toán, báo cáo admin', dont: 'Tự chuyển tiền / quyết định tài chính',
      spec: `Tên agent: Finance/Admin Agent
Mục tiêu: Nhắc hóa đơn đến hạn, tổng hợp thanh toán và chuẩn bị báo cáo admin.
Đầu vào: Danh sách hóa đơn, chứng từ, lịch thanh toán.
Đầu ra: Danh sách khoản cần thu/trả, chứng từ còn thiếu, việc cần CEO duyệt.
Tool được dùng: file, Sheets (read), Telegram.
Quyền hạn: Chỉ tổng hợp và nhắc. Không tự chuyển tiền hay quyết định tài chính.
Escalation: Hóa đơn sắp quá hạn, thiếu chứng từ quan trọng → báo CEO.` },
  ]
  const r = roleData[sel]
  return (
    <div>
      <div className={styles.roles06}>
        {roleData.map((role, i) => (
          <button key={role.n} type="button" className={`${styles.roleCard06} ${sel === i ? styles.roleCardOn06 : ''}`} onClick={() => setSel(i)}>
            <div className={styles.roleHead06}><span className={styles.roleIc06}>{role.ic}</span><span className={styles.roleName06}>{role.n}</span></div>
            <div className={styles.roleDo06}><span className={styles.roleLabel06}>Nhiệm vụ chính</span>{role.do}</div>
            <div className={styles.roleDont06}><span className={styles.roleLabel06}>✕ Không nên làm</span>{role.dont}</div>
          </button>
        ))}
      </div>
      <div className={styles.roleSpec06}>
        <div className={styles.roleSpecHead06}><span className={styles.snipDot06} /> BẢN MÔ TẢ VAI TRÒ · {r.n.toUpperCase()}</div>
        <pre>{r.spec}</pre>
      </div>
    </div>
  )
}

/* ---------- 5. HUB & SPOKE ---------- */
export function HubSpoke06() {
  const [sel, setSel] = useState(0)
  const agents = [
    { k: 'sales', n: 'Sales Agent', ic: '📈', tasks: ['Tóm tắt lead mới', 'Chuẩn bị email follow-up', 'Draft báo giá', 'Nhắc lead quá hạn', 'Báo cáo pipeline mỗi sáng'], auto: 'Mỗi sáng 8h, Sales Agent gửi Sales Morning Brief: lead cần xử lý, deal quá hạn, 3 việc sales ưu tiên.' },
    { k: 'content', n: 'Content Agent', ic: '✍', tasks: ['Gom ý tưởng content', 'Lên outline bài viết', 'Viết draft theo voice CEO', 'Đề xuất lịch đăng tuần', 'Tái sử dụng nội dung dài thành post ngắn'], auto: 'Thứ Hai 9h, Content Agent đề xuất 5 ý tưởng content tuần này, mỗi ý tưởng có hook, luận điểm, ví dụ thực tế và CTA.' },
    { k: 'research', n: 'Research Agent', ic: '🔎', tasks: ['Research khách trước sales call', 'Tóm tắt đối thủ', 'Theo dõi xu hướng ngành', 'Tìm insight cho bài viết'], auto: 'Khi có khách mới trong sheet, Research Agent chuẩn bị customer brief: họ làm gì, dấu hiệu nhu cầu, câu hỏi nên hỏi, thông tin chưa xác minh.' },
    { k: 'ops', n: 'Ops Agent', ic: '🗂', tasks: ['Tổng hợp việc tồn', 'Kiểm tra checklist vận hành', 'Báo lỗi automation', 'Ghi log việc agent đã làm'], auto: 'Cuối ngày 17h30, Ops Agent gửi Daily Ops Wrap-up: việc đã xong, việc chờ CEO, lỗi phát sinh, ưu tiên ngày mai.' },
    { k: 'finance', n: 'Finance/Admin', ic: '🧾', tasks: ['Nhắc hóa đơn đến hạn', 'Tổng hợp thanh toán', 'Chuẩn bị báo cáo admin', 'Theo dõi chứng từ còn thiếu'], auto: 'Thứ Sáu 16h, Finance/Admin Agent gửi danh sách khoản cần thu, khoản cần trả, chứng từ thiếu và việc cần CEO duyệt.' },
  ]
  const N = agents.length
  const a = agents[sel]
  return (
    <div className={styles.hub06}>
      <div className={styles.hubMap06}>
        <div className={styles.hubCenter06}><span className={styles.hubCenterRole06}>CEO</span><span className={styles.hubCenterSub06}>điều hành &amp; duyệt</span></div>
        {agents.map((agent, i) => {
          const ang = (-90 + i * (360 / N)) * Math.PI / 180
          const x = (50 + Math.cos(ang) * 38).toFixed(2)
          const y = (50 + Math.sin(ang) * 38).toFixed(2)
          const dx = Math.cos(ang) * 38, dy = Math.sin(ang) * 38
          const len = Math.hypot(dx, dy)
          const deg = Math.atan2(dy, dx) * 180 / Math.PI
          return (
            <React.Fragment key={agent.k}>
              <button type="button" className={`${styles.hubSpoke06} ${sel === i ? styles.hubSpokeOn06 : ''}`} style={{ ['--x' as any]: `${x}%`, ['--y' as any]: `${y}%` }} onClick={() => setSel(i)}>
                <span className={styles.hubSpokeIc06}>{agent.ic}</span>
                <span className={styles.hubSpokeName06}>{agent.n}</span>
              </button>
              <div className={styles.hubSpokeLine06} style={{ width: `${len}%`, transform: `rotate(${deg}deg)` }} />
            </React.Fragment>
          )
        })}
      </div>
      <div className={styles.hubDetail06}>
        <div className={styles.hubDetailHead06}><span className={styles.hubDetailIc06}>{a.ic}</span><h4>{a.n}</h4></div>
        <div className={styles.hubDetailLab06}>Việc lặp</div>
        <ul className={styles.hubDetailTasks06}>{a.tasks.map(t => <li key={t}>{t}</li>)}</ul>
        <div className={styles.hubDetailAuto06}><div className={styles.hubDetailAutoLab06}>⚙ Automation gợi ý</div>{a.auto}</div>
      </div>
    </div>
  )
}

/* ---------- 6. DASHBOARD ---------- */
export function Dashboard06() {
  const [sel, setSel] = useState(0)
  const dashQs = [
    { q: 'Agent nào đang chạy?', col: 'st', note: 'Cột Trạng thái cho biết agent nào Active, agent nào đang Paused.' },
    { q: 'Việc nào đang chờ mình duyệt?', col: 'wait', note: 'Cột "Chờ CEO" gom mọi việc đang đợi bạn bấm duyệt.' },
    { q: 'Việc nào lỗi hoặc thiếu dữ liệu?', col: 'warn', note: 'Cột "Cảnh báo" nêu lỗi, deadline quá hạn, dữ liệu chưa xác minh.' },
    { q: 'Việc gần nhất mỗi agent làm là gì?', col: 'last', note: 'Cột "Việc gần nhất" là log rút gọn của lần chạy cuối.' },
  ]
  const dashRows = [
    { a: 'Sales', ic: '📈', st: 'active', last: 'Sales Morning Brief', wait: '2 email draft', warn: 'Deal ABC quá hạn' },
    { a: 'Content', ic: '✍', st: 'active', last: 'Weekly Content Plan', wait: '5 outline', warn: 'Chưa có bài thứ Năm' },
    { a: 'Research', ic: '🔎', st: 'active', last: 'Customer brief ABC', wait: '—', warn: '2 dữ kiện chưa xác minh' },
    { a: 'Ops', ic: '🗂', st: 'active', last: 'Daily Wrap-up', wait: '3 việc cần quyết', warn: '1 cron lỗi' },
    { a: 'Finance/Admin', ic: '🧾', st: 'paused', last: 'Weekly admin check', wait: '—', warn: '—' },
  ]
  const stLabel: Record<string, string> = { active: 'Active', paused: 'Paused', error: 'Error', waiting: 'Waiting' }
  const hlCls = dashQs[sel].col ? styles[`dashHl_${dashQs[sel].col}06`] : styles.dashHl_st06
  return (
    <div>
      <div className={styles.dashq06}>
        {dashQs.map((d, i) => (
          <button key={d.q} type="button" className={`${styles.dashqBtn06} ${sel === i ? styles.dashqBtnOn06 : ''}`} onClick={() => setSel(i)}>
            <span className={styles.dashqNum06}>{i + 1}</span>{d.q}
          </button>
        ))}
      </div>
      <div className={styles.dash06}>
        <div className={styles.dashBar06}>🖥 hermes-business-os · dashboard <span className={styles.dashLive06}>cập nhật trực tiếp</span></div>
        <div className={`${styles.dashGrid06} ${hlCls}`}>
          <div className={styles.dashHeader06}>Agent</div>
          <div className={styles.dashHeader06}>Trạng thái</div>
          <div className={styles.dashHeader06}>Việc gần nhất</div>
          <div className={`${styles.dashHeader06} ${styles.dashColWait06}`}>Chờ CEO</div>
          <div className={`${styles.dashHeader06} ${styles.dashColWarn06}`}>Cảnh báo</div>
          {dashRows.map(r => {
            const hasWait = r.wait !== '—', hasWarn = r.warn !== '—'
            return (
              <React.Fragment key={r.a}>
                <div className={`${styles.dashCell06} ${styles.dashCellA06}`}><span className={styles.dashAgentIc06}>{r.ic}</span>{r.a}</div>
                <div className={styles.dashCell06}><span className={`${styles.badgeSt06} ${styles[`st_${r.st}06`]}`}>{stLabel[r.st]}</span></div>
                <div className={`${styles.dashCell06} ${styles.dashCellLast06}`}>{r.last}</div>
                <div className={`${styles.dashCell06} ${styles.dashColWait06} ${hasWait ? styles.dashHas06 : ''}`}>{hasWait ? <span className={styles.dashWait06}>{r.wait}</span> : <span className={styles.dashNone06}>Không</span>}</div>
                <div className={`${styles.dashCell06} ${styles.dashColWarn06} ${hasWarn ? styles.dashHas06 : ''}`}>{hasWarn ? <span className={styles.dashWarn06}>⚠ {r.warn}</span> : <span className={styles.dashNone06}>—</span>}</div>
              </React.Fragment>
            )
          })}
        </div>
      </div>
      <p className={styles.dashqNote06}>{dashQs[sel].note}</p>
    </div>
  )
}

/* ---------- 7. FILE TREE ---------- */
export function FileTree06() {
  const [sel, setSel] = useState<number | null>(null)
  const folders = [
    { name: 'agents', lvl: 1, d: 'Mô tả vai trò từng agent — mỗi agent một file: mục tiêu, đầu vào, đầu ra, quyền hạn, escalation.' },
    { name: 'sales', lvl: 2, d: 'Mô tả + tài liệu riêng của Sales Agent.' },
    { name: 'content', lvl: 2, d: 'Mô tả + tài liệu riêng của Content Agent.' },
    { name: 'research', lvl: 2, d: 'Mô tả + tài liệu riêng của Research Agent.' },
    { name: 'ops', lvl: 2, d: 'Mô tả + tài liệu riêng của Ops Agent.' },
    { name: 'finance-admin', lvl: 2, d: 'Mô tả + tài liệu riêng của Finance/Admin Agent.' },
    { name: 'skills', lvl: 1, d: 'Quy trình có thể tái sử dụng — checklist viết blog, quy trình báo giá, v.v.' },
    { name: 'templates', lvl: 1, d: 'Mẫu email, báo giá, báo cáo, content — để agent dùng lại, không viết lại từ đầu.' },
    { name: 'inputs', lvl: 1, d: 'Dữ liệu đầu vào: sheet lead, ghi chú demo, nguồn tin. Input có chỗ vào.' },
    { name: 'outputs', lvl: 1, d: 'Kết quả agent tạo ra: draft email, báo giá, brief. Output có chỗ ra.' },
    { name: 'reports', lvl: 1, d: 'Báo cáo định kỳ: Sales Morning Brief, Daily Wrap-up, Weekly Content Plan.' },
    { name: 'logs', lvl: 1, d: 'Log automation/agent: chạy lúc nào, đọc gì, tạo gì, có lỗi không.' },
    { name: 'approvals', lvl: 1, d: 'Việc đang chờ CEO duyệt — gom một chỗ để duyệt nhanh, không phải lục tìm.' },
  ]
  const f = sel !== null ? folders[sel] : null
  return (
    <div className={styles.treeWrap06}>
      <div className={styles.tree06}>
        <div className={styles.treeRoot06}>📁 /hermes-business-os</div>
        {folders.map((folder, i) => (
          <button key={folder.name} type="button" className={`${styles.treeNode06} ${styles[`treeLvl${folder.lvl}06`]}` + (sel === i ? ` ${styles.treeNodeSel06}` : '')} onClick={() => setSel(i)}>
            📁 {folder.name}<span className={styles.treeSlash06}>/</span>
          </button>
        ))}
      </div>
      <div className={styles.treeDetail06}>
        {!f ? <div className={styles.treeDetailEmpty06}>Bấm một thư mục bên trái để xem nó dùng để làm gì.</div> : <>
          <div className={styles.treeDetailName06}>📁 /{f.name}</div>
          <p>{f.d}</p>
        </>}
      </div>
    </div>
  )
}

/* ---------- 8. HANDOFF STATUSES ---------- */
export function HandoffStatus06() {
  const [sel, setSel] = useState(1)
  const statuses = [
    { k: 'done', label: 'Done', cls: 'sDone', mean: 'Đã xong, không cần CEO làm gì.',
      note: 'Card "Done" chỉ để CEO biết việc đã hoàn tất — không cần hành động, không làm gián đoạn.',
      card: { status: 'Done', title: 'Báo cáo sáng', did: ['Tổng hợp báo cáo pipeline sáng nay.', 'Lưu vào reports/sales/.'], ask: '', risk: 'Không có rủi ro — chỉ đọc dữ liệu.', reply: ['Đã xem'] } },
    { k: 'wait', label: 'Waiting for Approval', cls: 'sWait', mean: 'Chờ CEO duyệt trước khi gửi/thực hiện.',
      note: 'Card quan trọng nhất: nêu rõ việc đã làm, đúng một câu hỏi cần duyệt, và 3 lựa chọn trả lời để CEO bấm là xong.',
      card: { status: 'Waiting for Approval', title: 'Follow-up Draft', did: ['Đọc ghi chú demo ABC.', 'Soạn email follow-up.', 'Lưu draft vào outputs/follow-ups/abc.md.'], ask: 'Có gửi email này cho anh Minh không?', risk: 'Chưa có thông tin chính xác về thời gian triển khai.', reply: ['Duyệt gửi', 'Sửa CTA ngắn hơn', 'Chưa gửi'] } },
    { k: 'input', label: 'Need Input', cls: 'sInput', mean: 'Thiếu dữ liệu, cần CEO bổ sung.',
      note: 'Khi thiếu dữ liệu, agent không bịa. Nó dừng đúng chỗ và nói rõ thiếu gì để CEO bổ sung.',
      card: { status: 'Need Input', title: 'Pipeline cần dữ liệu', did: ['Đọc sheet pipeline.', 'Phát hiện thiếu giá trị deal của 2 lead.'], ask: 'Anh bổ sung giá trị deal cho lead DEF và GHI giúp em?', risk: 'Không có giá trị deal → không xếp được ưu tiên.', reply: ['Gửi số liệu', 'Bỏ qua 2 lead này'] } },
    { k: 'esc', label: 'Escalated', cls: 'sEsc', mean: 'Có việc quan trọng cần xử lý ngay.',
      note: 'Escalated phá vỡ luồng bình thường để báo riêng — dành cho việc thật sự gấp, không lạm dụng.',
      card: { status: 'Escalated', title: 'Cảnh báo pipeline', did: ['Theo dõi deal ABC qua pipeline.'], ask: 'Deal ABC (120tr) đã quá hạn follow-up 2 ngày — anh xử lý ngay nhé?', risk: 'Mỗi ngày chậm làm tăng khả năng mất deal.', reply: ['Gọi ngay', 'Giao em soạn email', 'Để chiều'] } },
    { k: 'fail', label: 'Failed', cls: 'sFail', mean: 'Chạy lỗi, cần kiểm tra.',
      note: 'Khi lỗi, agent báo ngắn: lỗi là gì, thiếu gì, cần CEO làm gì — không im lặng, không chạy tiếp với dữ liệu sai.',
      card: { status: 'Failed', title: 'Cron lỗi', did: ['Cron 16:00 chạy.', 'Không đọc được sheet pipeline (thiếu quyền).'], ask: 'Em cần anh cấp lại quyền truy cập sheet.', risk: 'Báo cáo chiều nay chưa tạo được.', reply: ['Đã cấp quyền', 'Kiểm tra sau'] } },
  ]
  const s = statuses[sel]
  const c = s.card
  return (
    <div>
      <div className={styles.statusPick06}>
        {statuses.map((st, i) => (
          <button key={st.k} type="button" className={`${styles.statChip06} ${styles[`statChip_${st.cls}06`]} ${sel === i ? styles.statChipOn06 : ''}`} onClick={() => setSel(i)}>
            <span className={styles.statDot06} />{st.label}
          </button>
        ))}
      </div>
      <div className={styles.handoffWrap06}>
        <div className={styles.phone06}>
          <div className={styles.phoneBar06}><span className={styles.phoneDot06}>H</span> Sales Agent <span className={styles.phoneTime06}>17:32</span></div>
          <div className={styles.phoneBody06}>
            <div className={`${styles.msgCard06} ${styles[`msgCard_${s.cls}06`]}`}>
              <div className={styles.msgCardTitle06}>Sales Agent — {c.title}</div>
              <div className={styles.msgCardStatus06}><span className={styles.msgCardStatusDot06} />Status: <b>{c.status}</b></div>
              <div className={styles.msgCardSec06}><div className={styles.msgCardLabel06}>Việc đã làm</div><ul>{c.did.map(d => <li key={d}>{d}</li>)}</ul></div>
              {c.ask && <div className={`${styles.msgCardSec06} ${styles.msgCardAsk06}`}><div className={styles.msgCardLabel06}>Cần anh xử lý</div>{c.ask}</div>}
              <div className={styles.msgCardSec06}><div className={styles.msgCardLabel06}>Rủi ro / giả định</div>{c.risk}</div>
              <div className={styles.msgCardReply06}>{c.reply.map((r, k) => <span key={r} className={k === 0 ? `${styles.replyBtn06} ${styles.replyBtnY06}` : styles.replyBtn06}>{r}</span>)}</div>
            </div>
          </div>
        </div>
        <div className={styles.handoffNote06}>
          <div className={styles.handoffNoteMean06}><span className={`${styles.badgeSt06} ${styles[`statChip_${s.cls}06`]}`}>{s.label}</span>{s.mean}</div>
          <p>{s.note}</p>
        </div>
      </div>
    </div>
  )
}

/* ---------- 9. READINESS CHECKLIST ---------- */
export function ReadinessChecklist06() {
  const readyData: [string, string, string[]][] = [
    ['Vai trò', '🧑\u200d💼', ['Agent có tên và phạm vi rõ.', 'Agent biết việc nào thuộc phạm vi, việc nào không.', 'Agent có output chuẩn.']],
    ['Dữ liệu', '🗄', ['Agent biết lấy input ở đâu.', 'Agent biết lưu output ở đâu.', 'Dữ liệu nhạy cảm được giới hạn quyền truy cập.']],
    ['Skill', '📋', ['Có checklist/skill cho việc lặp chính.', 'Skill không quá rộng.', 'Skill có tiêu chuẩn kiểm tra.']],
    ['Tool', '🔌', ['Tool cần dùng đã được kết nối.', 'Quyền hạn tool rõ: read, draft, update, send.', 'Hành động rủi ro cần approval.']],
    ['Automation', '⚙', ['Trigger rõ: lịch hoặc sự kiện.', 'Output báo về đúng kênh.', 'Có escalation rule.', 'Có log.']],
    ['CEO handoff', '🤝', ['Kết quả có status.', 'Việc chờ duyệt được gom lại.', 'CEO biết trả lời thế nào để duyệt/sửa/từ chối.']],
  ]
  const totalReady = readyData.reduce((s, g) => s + g[2].length, 0)
  const KEY = 'hermes06_ready_react'
  const [state, setState] = useState<Record<string, boolean>>({})
  useEffect(() => { try { const v = JSON.parse(localStorage.getItem(KEY) || '{}'); setState(v) } catch {} }, [])
  const save = (next: Record<string, boolean>) => { setState(next); try { localStorage.setItem(KEY, JSON.stringify(next)) } catch {} }
  const toggle = (gi: number, ii: number) => { const k = `${gi}_${ii}`; save({ ...state, [k]: !state[k] }) }
  let done = 0
  readyData.forEach((g, gi) => g[2].forEach((_, ii) => { if (state[`${gi}_${ii}`]) done++ }))
  const p = done / totalReady
  const offset = 314 * (1 - p)
  const verdictCls = done === totalReady ? styles.rgVerdictGo06 : p >= 0.6 ? styles.rgVerdictMaybe06 : styles.rgVerdictNo06
  const verdictText = done === totalReady ? '✓ SẴN SÀNG CHẠY 24/7' : p >= 0.6 ? '◐ GẦN SẴN SÀNG' : '○ CHƯA NÊN CHẠY 24/7'
  const msgText = done === totalReady ? 'Agent đủ điều kiện để chạy thật mỗi ngày.' : p >= 0.6 ? `Còn ${totalReady - done} điều kiện. Hoàn thiện nốt trước khi cho chạy tự động.` : `Mới đạt ${done}/${totalReady}. Agent có thể hỗ trợ thủ công, nhưng chưa nên chạy tự động.`
  return (
    <div className={styles.ready06}>
      <div className={styles.readyGauge06}>
        <div className={styles.rgRing06}>
          <svg width="120" height="120"><circle cx="60" cy="60" r="50" fill="none" stroke="#3a352c" strokeWidth="9" /><circle cx="60" cy="60" r="50" fill="none" stroke="var(--hb-terracotta)" strokeWidth="9" strokeDasharray="314" strokeDashoffset={offset} strokeLinecap="square" /></svg>
          <div className={styles.rgPct06}>{Math.round(p * 100)}%</div>
        </div>
        <div className={styles.rgMsg06} dangerouslySetInnerHTML={{ __html: msgText.replace(/(\d+\/\d+|\d+)/g, '<b>$1</b>') }} />
        <div className={`${styles.rgVerdict06} ${verdictCls}`}>{verdictText}</div>
      </div>
      <div className={styles.readyGroups06}>
        {readyData.map(([name, ic, items], gi) => {
          let gd = 0; items.forEach((_, ii) => { if (state[`${gi}_${ii}`]) gd++ })
          return (
            <div key={name} className={styles.rgroup06}>
              <div className={styles.rgroupHead06}><span className={styles.rgroupIc06}>{ic}</span>{name}<span className={`${styles.rgroupCount06} ${gd === items.length ? styles.rgroupCountFull06 : ''}`}>{gd}/{items.length}</span></div>
              <div className={styles.rgroupItems06}>
                {items.map((it, ii) => (
                  <div key={it} className={`${styles.rgroupItem06} ${state[`${gi}_${ii}`] ? styles.rgroupItemDone06 : ''}`} onClick={() => toggle(gi, ii)}>
                    <span className={styles.rgroupBox06}>✓</span>
                    <span className={styles.rgroupTxt06}>{it}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- 10. ROADMAP 4 WEEKS ---------- */
export function Roadmap06() {
  const [sel, setSel] = useState(0)
  const weeks = [
    { w: 'Tuần 1', goal: 'Bản đồ việc lặp + Hermes chạy được', out: '20–50 việc lặp, chọn 3 use case ưu tiên', d: 'Liệt kê mọi việc lặp trong tuần và đưa Hermes chạy được ở môi trường phù hợp. Chưa cần automation — chỉ cần thấy rõ đâu là việc đáng làm trước.' },
    { w: 'Tuần 2', goal: 'SOP thành skill', out: '1–2 skill đầu tiên', d: 'Lấy quy trình bạn đã làm nhiều lần, viết thành skill/checklist để Hermes làm đúng cách mỗi lần. Bắt đầu nhỏ — 1 đến 2 skill là đủ.' },
    { w: 'Tuần 3', goal: 'Tool + automation', out: 'Telegram/tool đầu tiên, 1 cron/webhook', d: 'Kết nối kênh hành động đầu tiên và biến một việc lặp rủi ro thấp thành cron hoặc webhook. Đây là lúc Hermes bắt đầu tự chạy.' },
    { w: 'Tuần 4', goal: 'Đội agent mini', out: '1–2 agent chạy thật mỗi ngày', d: 'Gom skill + tool + automation thành agent theo vai trò, có dashboard và rule bàn giao. Cho 1–2 agent chạy thật mỗi ngày — đó là Hermes Business OS đầu tiên của bạn.' },
  ]
  return (
    <div>
      <div className={styles.road06}>
        {weeks.map((wk, i) => (
          <button key={wk.w} type="button" className={`${styles.rstep06} ${sel === i ? styles.rstepOn06 : ''}`} onClick={() => setSel(i)}>
            <div className={styles.rsTop06}><span className={styles.rsWeek06}>{wk.w}</span><span className={styles.rsDot06} /></div>
            <div className={styles.rsGoal06}>{wk.goal}</div>
            {sel === i && <div className={styles.rsBody06}><p>{wk.d}</p><div className={styles.rsOut06}><span className={styles.rsOutLabel06}>Output</span>{wk.out}</div></div>}
          </button>
        ))}
      </div>
      <div className={styles.roadFormula06}>
        <div className={styles.roadFormulaLine06}><span>1</span> use case thật <span>→</span></div>
        <div className={styles.roadFormulaLine06}><span>1</span> skill <span>→</span> <span>1</span> tool <span>→</span> <span>1</span> automation</div>
        <div className={styles.roadFormulaLine06}><span>→</span> <span>1</span> agent vai trò <span>→</span> <span className={styles.roadFormulaAcc06}>đội agent mini</span></div>
      </div>
    </div>
  )
}

/* ---------- 11. BUSINESS OS CANVAS ---------- */
export function BusinessOSCanvas06() {
  const canvasCells: [string, string, boolean][] = [
    ['Business của bạn', 'bạn bán gì, cho ai', true],
    ['3 việc lặp ROI cao nhất', 'việc nào tốn thời gian nhất', false],
    ['Agent đầu tiên nên xây', 'sales? content? ops?', false],
    ['Skill đầu tiên cần có', 'quy trình nào chuẩn hóa trước', false],
    ['Tool cần kết nối', 'Telegram, Gmail, Sheets…', false],
    ['Automation đầu tiên', 'cron hay webhook', false],
    ['Việc cần CEO duyệt', 'ranh giới tự làm / hỏi', false],
    ['Dashboard/log dùng gì', 'Sheet, Markdown, docs', false],
    ['Rủi ro cần kiểm soát', 'điều gì tuyệt đối không tự động', false],
  ]
  const KEY = 'hermes06_canvas_react'
  const [vals, setVals] = useState<string[]>(new Array(canvasCells.length).fill(''))
  useEffect(() => { try { const s = JSON.parse(localStorage.getItem(KEY) || '[]'); if (Array.isArray(s) && s.length === canvasCells.length) setVals(s) } catch {} }, [])
  const save = (next: string[]) => { setVals(next); try { localStorage.setItem(KEY, JSON.stringify(next)) } catch {} }
  const setV = (i: number, v: string) => { const n = [...vals]; n[i] = v; save(n) }
  const reset = () => { const n = new Array(canvasCells.length).fill(''); save(n) }
  const filled = vals.filter(v => v && v.trim()).length
  return (
    <div>
      <div className={styles.canvas06}>
        {canvasCells.map(([title, hint, span], i) => (
          <div key={title} className={`${styles.canvasCell06} ${span ? styles.canvasCellSpan06 : ''}`}>
            <div className={styles.canvasCellNum06}><span className={styles.canvasCellIdx06}>{i + 1}</span>{title}</div>
            <textarea value={vals[i]} onChange={e => setV(i, e.target.value)} placeholder={`${hint}…`} />
          </div>
        ))}
      </div>
      <div className={styles.canvasFoot06}>
        <button type="button" className={styles.canvasResetBtn06} onClick={reset}>Xóa nội dung</button>
        <span className={styles.canvasSum06}>Đã điền <b>{filled}/{canvasCells.length}</b> ô</span>
      </div>
    </div>
  )
}

/* ---------- 12. FINAL COURSE CHECKLIST ---------- */
export function FinalCourseChecklist06() {
  const checkItems = [
    'Hermes chạy được ở môi trường phù hợp.',
    'Biết khi nào dùng máy cá nhân và khi nào dùng VPS 24/7.',
    'Chọn được provider/model phù hợp.',
    'Có bộ prompt kiểu CEO.',
    'Có ít nhất 1 skill/checklist cho việc thật.',
    'Có ít nhất 1 tool/kênh hành động thật.',
    'Có ít nhất 1 automation chạy theo lịch hoặc sự kiện.',
    'Có thiết kế agent theo vai trò.',
    'Có approval rule rõ.',
    'Có dashboard/log tối giản.',
    'Có 1–2 agent sẵn sàng làm việc thật mỗi ngày.',
  ]
  const KEY = 'hermes06_finalcheck_react'
  const [checked, setChecked] = useState<boolean[]>(new Array(checkItems.length).fill(false))
  useEffect(() => { try { const s = JSON.parse(localStorage.getItem(KEY) || '[]'); if (Array.isArray(s) && s.length === checkItems.length) setChecked(s) } catch {} }, [])
  const save = (next: boolean[]) => { setChecked(next); try { localStorage.setItem(KEY, JSON.stringify(next)) } catch {} }
  const toggle = (i: number) => { const n = [...checked]; n[i] = !n[i]; save(n) }
  const n = checked.filter(Boolean).length
  const p = n / checkItems.length
  const offset = 138 * (1 - p)
  const msg = n === checkItems.length ? '<b>🎓 Hoàn thành khóa Hermes Handbook ✓</b> Bạn đã có một Hermes Business OS cho business 1 người.' : `Đã đạt <b>${n}/${checkItems.length}</b> mục. Sắp xong rồi.`
  return (
    <div className={styles.finalCheck06}>
      {checkItems.map((t, i) => (
        <div key={t} className={`${styles.finalCheckItem06} ${checked[i] ? styles.finalCheckItemDone06 : ''}`} onClick={() => toggle(i)}>
          <div className={styles.finalCheckBox06}>✓</div>
          <div className={styles.finalCheckTxt06}>{t}</div>
        </div>
      ))}
      <div className={styles.finalCheckFoot06}>
        <div className={styles.finalCheckRing06}>
          <svg width="54" height="54"><circle cx="27" cy="27" r="22" fill="none" stroke="#3a352c" strokeWidth="5" /><circle cx="27" cy="27" r="22" fill="none" stroke="var(--hb-terracotta)" strokeWidth="5" strokeDasharray="138" strokeDashoffset={offset} strokeLinecap="square" /></svg>
          <div className={styles.finalCheckPct06}>{Math.round(p * 100)}%</div>
        </div>
        <div className={styles.finalCheckMsg06} dangerouslySetInnerHTML={{ __html: msg }} />
      </div>
    </div>
  )
}

/* ---------- 13. ERROR TABLE ---------- */
export function ErrorTable06() {
  const errs: [string, string, string][] = [
    ['Một agent làm quá nhiều', 'Output lan man, khó kiểm soát', 'Tách agent theo vai trò'],
    ['Không có dashboard', 'CEO không biết agent đang làm gì', 'Tạo bảng trạng thái tối giản'],
    ['Không có approval rule', 'Agent tự làm quá tay hoặc hỏi quá nhiều', 'Định nghĩa quyền hạn theo rủi ro'],
    ['Không có log', 'Không truy vết được lỗi', 'Ghi log ngắn mỗi lần chạy'],
    ['Skill quá dài / quá rộng', 'Agent load nhiều nhưng làm chưa đúng', 'Skill ngắn, theo use case cụ thể'],
    ['Tự động hóa quá sớm', 'Chạy sai, mất niềm tin', 'Thủ công → checklist → skill → automation'],
  ]
  const [open, setOpen] = useState<Set<number>>(new Set())
  const toggle = (i: number) => setOpen(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n })
  return (
    <div className={styles.errtbl06}>
      {errs.map(([l, sign, fix], i) => (
        <div key={l} className={`${styles.errRow06} ${open.has(i) ? styles.errRowOn06 : ''}`}>
          <div className={styles.errQ06} onClick={() => toggle(i)}>
            <span className={styles.errNum06}>{i + 1}</span>
            <span className={styles.errTitle06}>{l}</span>
            <span className={styles.errChev06}>›</span>
          </div>
          <div className={styles.errBody06} style={{ maxHeight: open.has(i) ? '280px' : '0' }}>
            <div className={styles.errIn06}>
              <div className={styles.errSign06}><div className={styles.errLab06}>Dấu hiệu</div><div className={styles.errVal06}>{sign}</div></div>
              <div className={styles.errFix06}><div className={styles.errLab06}>Cách sửa</div><div className={styles.errVal06}>{fix}</div></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------- 14. LESSON CHECKLIST WRAPPER ---------- */
export function Lesson06Checklist() {
  return (
    <Checklist
      storageKey="hermes06_check"
      items={[
        { text: 'Hiểu 6 lớp hệ thống Hermes: giao diện, agent, skill, tool, automation, dashboard.' },
        { text: 'Chọn được 3–5 vai trò agent cho business của mình.' },
        { text: 'Có "bản mô tả vai trò" cho ít nhất 1 agent.' },
        { text: 'Biết cấu trúc thư mục workspace chung.' },
        { text: 'Biết 5 trạng thái bàn giao và format handoff card.' },
        { text: 'Đã điền Business OS Canvas.' },
        { text: 'Có kế hoạch triển khai 4 tuần cho riêng mình.' },
      ]}
      completeMessage={<><strong>Hoàn thành khóa Hermes Handbook ✓</strong> Bạn đã có một Hermes Business OS cho business 1 người.</>}
      progressMessage={(n, t) => <>Đã đạt <strong>{n}/{t}</strong> mục. Gần hoàn thành rồi.</>}
    />
  )
}