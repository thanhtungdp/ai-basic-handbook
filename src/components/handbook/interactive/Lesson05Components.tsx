'use client'

import React, { useEffect, useState } from 'react'
import { Checklist } from './Checklist'
import styles from '../handbook.module.css'

export function TaskChips05() {
  const chips = [
    ['Sáng xem pipeline sales', 'mỗi ngày'],
    ['Thứ Hai lên lịch content', 'mỗi tuần'],
    ['Cuối ngày tổng hợp việc tồn', 'mỗi ngày'],
    ['Sau demo 2 ngày follow-up lead', 'theo sự kiện'],
    ['Mỗi tuần kiểm tra báo cáo', 'mỗi tuần'],
    ['Có form mới phân loại khách', 'theo sự kiện'],
  ]
  return <div className={styles.taskchips05}>{chips.map(([t, tag]) => <span key={t}>{t}<b>· {tag}</b></span>)}</div>
}

export function AutomationBeforeAfter05() {
  const [mode, setMode] = useState<'old' | 'new'>('old')
  const d = mode === 'old'
    ? { nodes: ['CEO nhớ việc', 'CEO mở tool', 'CEO làm thủ công'], say: <>CEO không quá tải vì một việc lớn — mà vì <b>nhiều việc nhỏ cần nhớ làm đúng lúc</b>. Nếu việc phụ thuộc vào trí nhớ CEO, sớm muộn cũng bị quên.</>, cost: '✕ Phụ thuộc trí nhớ CEO → sớm muộn cũng quên, không tích lũy' }
    : { nodes: ['Đúng lịch / sự kiện', 'Hermes tự chạy', 'CEO nhận kết quả / duyệt'], say: <>Đưa việc lặp vào hệ thống để Hermes tự chạy. Mục tiêu là để CEO <b>không phải nhớ và không phải thao tác lại từ đầu</b>.</>, cost: '✓ Việc lặp nằm trong hệ thống — chạy đúng lịch, đúng sự kiện' }
  return <div className={styles.autoBa05}>
    <div className={styles.autoBaSwitch05}>
      <button type="button" onClick={() => setMode('old')} className={mode === 'old' ? styles.on05 : ''}>↻ CEO nhớ & làm thủ công</button>
      <button type="button" onClick={() => setMode('new')} className={mode === 'new' ? styles.onOrange05 : ''}>⚙ Hermes tự chạy theo lịch / sự kiện</button>
    </div>
    <div className={styles.autoBaBody05}>
      <div className={styles.autoFlow05}>{d.nodes.map((n, i) => <React.Fragment key={n}><span className={i === 2 && mode === 'new' ? styles.acc05 : ''}>{n}</span>{i < 2 && <em>→</em>}</React.Fragment>)}</div>
      <p>{d.say}</p><div className={mode === 'new' ? styles.costPlus05 : styles.costMinus05}>{d.cost}</div>
    </div>
  </div>
}

export function AutomationMatrix05() {
  const [sel, setSel] = useState<any>(null)
  const items = [
    { x: 16, y: 84, c: 'auto', t: 'Tóm tắt báo cáo sáng', why: 'Đầu ra rõ, rủi ro thấp, chỉ đọc dữ liệu. Hermes tự làm và gửi kết quả mỗi sáng.' },
    { x: 24, y: 70, c: 'auto', t: 'Tổng hợp việc tồn cuối ngày', why: 'Chỉ tổng hợp, không gửi ra ngoài, không sửa dữ liệu. An toàn để chạy theo cron.' },
    { x: 34, y: 60, c: 'auto', t: 'Phân loại lead từ form', why: 'Đầu vào rõ, đầu ra rõ. Chạy bằng webhook khi có form mới.' },
    { x: 62, y: 80, c: 'appr', t: 'Email follow-up sau demo', why: 'Quy trình rõ nhưng có gửi ra ngoài → Hermes tạo draft, CEO duyệt rồi mới gửi.' },
    { x: 70, y: 72, c: 'appr', t: 'Báo giá', why: 'Có mẫu nhưng phát sinh cam kết với khách. Chỉ tạo bản nháp để CEO duyệt.' },
    { x: 36, y: 30, c: 'remind', t: 'Gọi khách VIP', why: 'Cần phán đoán & quan hệ con người. Hermes nên nhắc đúng thời điểm.' },
    { x: 52, y: 34, c: 'remind', t: 'Duyệt hợp đồng', why: 'Quyết định thuộc về CEO. Hermes chỉ nên nhắc đúng lúc.' },
    { x: 84, y: 22, c: 'no', t: 'Quyết định giá', why: 'Phán đoán kinh doanh cao + rủi ro cao. Không tự động hóa.' },
    { x: 90, y: 14, c: 'no', t: 'Xử lý khủng hoảng', why: 'Bối cảnh phức tạp, rủi ro rất cao. Tuyệt đối không để automation tự chạy.' },
  ]
  const label: any = { auto: '✓ TỰ CHẠY', appr: '⏸ CHỜ DUYỆT', remind: '🔔 CHỈ NHẮC', no: '⛔ KHÔNG TỰ ĐỘNG HÓA' }
  return <div className={styles.matrix05Wrap}>
    <div className={styles.mxY05}>Độ rõ quy trình →</div>
    <div className={styles.matrix05}>
      <div className={`${styles.zone05} ${styles.zAuto05}`}><b>✓ Tự chạy</b><span>Rõ + rủi ro thấp</span></div>
      <div className={`${styles.zone05} ${styles.zAppr05}`}><b>⏸ Chờ duyệt</b><span>Rõ nhưng gửi ra ngoài</span></div>
      <div className={`${styles.zone05} ${styles.zRemind05}`}><b>🔔 Chỉ nhắc</b><span>Cần phán đoán</span></div>
      <div className={`${styles.zone05} ${styles.zNo05}`}><b>⛔ Không tự động hóa</b><span>Rủi ro cao</span></div>
      <i className={styles.crossV05}/><i className={styles.crossH05}/><small>Mức rủi ro →</small>
      {items.map((m) => <button key={m.t} type="button" className={`${styles.dot05} ${styles[`dot_${m.c}`]} ${sel?.t === m.t ? styles.dotOn05 : ''}`} style={{ left: `${m.x}%`, bottom: `${m.y}%` }} onClick={() => setSel(m)}><i/><span>{m.t}</span></button>)}
    </div>
    <div className={styles.mxDetail05}>{!sel ? 'Bấm một chấm để xem nên xếp việc đó vào nhóm nào.' : <><b className={styles[`tag_${sel.c}`]}>{label[sel.c]}</b><h4>{sel.t}</h4><p>{sel.why}</p></>}</div>
  </div>
}

export function CronWebhookQuiz05() {
  const qs = [
    ['Mỗi sáng 8h gửi báo cáo sales', 'cron'], ['Có form lead mới thì Hermes xử lý', 'hook'], ['Tổng hợp content vào mỗi thứ Hai', 'cron'], ['Có đơn hàng mới thì tạo ticket', 'hook'], ['Cuối ngày kiểm tra lead chưa follow-up', 'cron'],
  ]
  const [ans, setAns] = useState<Record<number, string>>({})
  const score = qs.filter(([, a], i) => ans[i] === a).length
  return <div className={styles.cwQuiz05}><div>CRON HAY WEBHOOK? <b>{score}/{qs.length}</b></div>{qs.map(([q, a], i) => <div key={q} className={styles.cwRow05}><p>{q}{ans[i] && <small>{ans[i] === a ? '✓ Đúng' : a === 'cron' ? '✕ Đây là Cron — chạy theo lịch' : '✕ Đây là Webhook — chạy khi có sự kiện'}</small>}</p><span><button disabled={!!ans[i]} onClick={() => setAns({ ...ans, [i]: 'cron' })}>⏰ Cron</button><button disabled={!!ans[i]} onClick={() => setAns({ ...ans, [i]: 'hook' })}>⚡ Webhook</button></span></div>)}</div>
}

export function CronWebhookCompare05() {
  return <><div className={styles.cw05}><div><h3>⏰ Cron</h3><small>CHẠY THEO LỊCH</small><p>Phù hợp với việc định kỳ — lặp lại theo thời gian cố định.</p>{['Báo cáo sáng','Báo cáo cuối ngày','Tổng hợp content tuần','Kiểm tra lead chưa follow-up','Nhắc việc định kỳ'].map(x=><span key={x}>{x}</span>)}</div><div><h3>⚡ Webhook</h3><small>CHẠY KHI CÓ SỰ KIỆN</small><p>Phù hợp với việc xảy ra theo sự kiện — không biết trước thời điểm.</p>{['Lead mới từ form','Đơn hàng mới','Ticket khách hàng mới','File mới trong folder','Dòng mới trong sheet'].map(x=><span key={x}>{x}</span>)}</div></div><div className={styles.mnemonic05}><b>Cron</b> = đúng giờ thì chạy.<br/><b>Webhook</b> = có sự kiện thì chạy.</div></>
}

export function AutomationSpecAccordion05() {
  const data = [
    ['Trigger','Chạy khi nào, hoặc khi có sự kiện gì?','Mỗi ngày làm việc 08:00 · hoặc khi có form lead mới'],
    ['Input','Hermes lấy dữ liệu từ đâu?','Google Sheet pipeline · folder ghi chú demo'],
    ['Quy trình','Hermes xử lý theo những bước nào?','Đọc → lọc lead cần xử lý → tóm tắt → đề xuất 3 việc'],
    ['Output','Trả kết quả ở đâu, theo format nào?','Tin nhắn Telegram ngắn, 3 phần'],
    ['Quyền hạn','Được tự làm gì, việc nào cần CEO duyệt?','Chỉ đọc và báo cáo · hoặc chỉ draft, chưa gửi'],
    ['Cảnh báo','Khi nào cần báo gấp / escalate?','Deal lớn quá hạn > 2 ngày → đưa lên đầu'],
    ['Log','Ghi lại kết quả và lỗi ở đâu?','reports/sales/2026-06-26.md'],
  ]
  const [open, setOpen] = useState(0)
  return <div className={styles.acc05x}>{data.map(([t,q,ex],i)=><div key={t} className={open===i?styles.open05:''}><button type="button" onClick={()=>setOpen(open===i?-1:i)}><span>{i+1}</span>{t}<em>phần {i+1}/7</em></button>{open===i&&<div><p>{q}</p><code>Ví dụ · {ex}</code></div>}</div>)}</div>
}

export function AutomationBlueprints05() {
  const bps = [
    ['Sales Morning Brief','Rủi ro thấp','Mỗi ngày làm việc · 08:00','Google Sheet pipeline sales','Tin nhắn Telegram ngắn cho CEO','Chỉ đọc và báo cáo · không cập nhật sheet','Tạo một cron job tên “Sales Morning Brief”.\nMỗi ngày làm việc lúc 8h sáng, đọc pipeline sales, tóm tắt các lead cần xử lý hôm nay, lead quá hạn, và 3 hành động ưu tiên.\nGửi kết quả về Telegram cho anh.\nChỉ đọc dữ liệu, không cập nhật sheet.'],
    ['Demo Follow-up Draft','Rủi ro trung bình','Mỗi ngày · 16:00','Sheet pipeline + ghi chú demo','Danh sách + email draft gửi về Telegram','Chỉ draft · chưa gửi email','Tạo một cron job tên “Demo Follow-up Draft”.\nMỗi ngày 16h, tìm lead đã demo nhưng chưa follow-up sau 2 ngày, đọc ghi chú demo, tạo email draft.\nCHƯA gửi email — chỉ để anh duyệt.'],
    ['Weekly Content Pipeline','Rủi ro thấp','Thứ Hai hằng tuần · 09:00','Folder ý tưởng content + lịch đăng hiện tại','Bảng content plan','Chỉ đề xuất outline · chưa đăng','Tạo một cron job tên “Weekly Content Pipeline”.\nThứ Hai hằng tuần lúc 9h, tổng hợp ý tưởng chưa dùng, chọn 5 ý tưởng cho tuần, đề xuất hook + luận điểm + CTA.\nChỉ đề xuất outline, chưa đăng.'],
  ]
  const [cur,setCur]=useState(0); const b=bps[cur]
  return <><div className={styles.bpTabs05}>{bps.map((x,i)=><button key={x[0]} className={cur===i?styles.bpOn05:''} onClick={()=>setCur(i)}><small>Ví dụ {i+1}</small>{x[0]}</button>)}</div><div className={styles.bp05}><header><h4>{b[0]}</h4><span>{b[1]}</span></header>{[['Trigger',b[2]],['Input',b[3]],['Output',b[4]],['Quyền hạn',b[5]]].map(([k,v])=><p key={k}><b>{k}</b><span>{v}</span></p>)}</div><pre className={styles.promptBox05}>{b[6]}</pre></>
}

export function CronPlayground05(){
 const [step,setStep]=useState(0)
 return <div className={styles.play05}><div className={styles.playBar05}>H Hermes · automation runner <span>CRON ĐANG BẬT</span></div><div className={styles.playBody05}>{step===0&&<p>Chào anh 👋 Đây là mô phỏng cron “Sales Morning Brief” chạy lúc 08:00.</p>}{step>=1&&<><p>⏰ 08:00 — cron <b>Sales Morning Brief</b> kích hoạt</p><ul><li>✓ Đọc Google Sheet pipeline</li><li>✓ Lọc lead quá hạn</li><li>✓ Tìm lead nóng</li><li>✓ Soạn báo cáo ngắn</li></ul></>}{step>=2&&<div className={styles.report05}><b>SALES MORNING BRIEF · 08:00</b><strong>⚠ Deal ABC quá hạn 2 ngày · 120tr</strong><ol><li>Gọi anh Minh — ABC</li><li>Gửi proposal DEF</li><li>Kiểm tra thanh toán GHI</li></ol><small>Hermes đã đọc pipeline, tạo 2 draft, không sửa dữ liệu.</small></div>}{step>=3&&<code>LOG: success · input: pipeline-sales · action: read-only · approval: none</code>}</div><div className={styles.playBtns05}>{step<3?<button onClick={()=>setStep(step+1)}>{step===0?'① Chạy cron 08:00':step===1?'② Xem báo cáo':'③ Xem log'}</button>:<button onClick={()=>setStep(0)}>↻ Chạy lại</button>}</div></div>
}

export function OutputPrinciples05(){const items=[['Việc cần xử lý lên đầu','CEO đọc 3 giây là nắm điều quan trọng nhất.'],['Không giấu giả định','Nếu Hermes phải đoán, nói rõ ra.'],['Rõ đã làm / chưa làm','Báo rõ Hermes đã làm gì và chưa làm gì.'],['Lựa chọn rõ ràng','Nếu cần duyệt, kết bằng “duyệt”, “sửa”, hoặc “bỏ qua”.']];return <><div className={styles.crit05}>{items.map(([h,q])=><div key={h}><b>{h}</b><span>{q}</span></div>)}</div><div className={styles.fmt05}><div><b>✕ BÁO CÁO DÀI</b><p>Chào anh, hôm nay em đã đọc toàn bộ pipeline gồm 42 lead... tiếp tục 300 chữ kể lể quy trình.</p></div><div><b>✓ BÁO CÁO NGẮN</b><p><strong>Cần chú ý ngay</strong>\nDeal ABC quá hạn 2 ngày · 120tr\n\n<strong>3 việc ưu tiên</strong>\n1. Gọi anh Minh — ABC\n2. Gửi proposal DEF\n3. Kiểm tra thanh toán GHI</p></div></div></>}

export function EscalationRules05(){const rows=[['🔥','Deal lớn quá hạn follow-up','Đưa lên đầu báo cáo'],['⚡','Lead nóng mới vào','Gửi thông báo riêng'],['🕳','Sheet thiếu dữ liệu quan trọng','Báo lỗi và yêu cầu bổ sung'],['💲','Email draft thiếu thông tin giá','Không draft, hỏi lại CEO'],['⚠','Cron chạy lỗi','Gửi thông báo lỗi ngắn']];return <div className={styles.esc05}>{rows.map(([ic,s,a])=><div key={s}><span>{ic}</span><b>{s}</b><em>{a}</em></div>)}</div>}

export function LogFeed05(){const [filter,setFilter]=useState('did');const lines=[['08:00','Sales Morning Brief — success · read-only',['did']],['08:00','Cần xử lý ngay: deal ABC quá hạn 2 ngày',['did','pending']],['08:01','Tạo 2 email follow-up draft → chờ duyệt',['did','pending']],['16:02','error: sheet thiếu cột “giá trị deal”',['did','error']]];return <div className={styles.logwrap05}><div className={styles.logfeed05}><b>📒 hermes-activity.log <span>live</span></b>{lines.map(([time,text,tags]:any)=><p key={time+text} className={!tags.includes(filter)?styles.dim05:''}><small>{time}</small>{text}</p>)}</div><div className={styles.logside05}>{[['did','Hermes đã làm gì rồi?'],['error','Có lỗi ở đâu không?'],['pending','Việc nào đang chờ mình duyệt?']].map(([k,q])=><button key={k} className={filter===k?styles.logOn05:''} onClick={()=>setFilter(k)}>{q}</button>)}</div></div>}

export function AutomationWorksheet05(){const opts=['Báo cáo sales mỗi sáng','Tóm tắt việc cần làm cuối ngày','Kiểm tra lead chưa follow-up','Đề xuất content plan hằng tuần'];const fields=['Tên automation','Trigger','Input','Quy trình','Output','Quyền hạn','Escalation','Log'];const KEY='hermes05_ws_react';const [task,setTask]=useState('');const [vals,setVals]=useState<string[]>(fields.map(()=>''));useEffect(()=>{try{const s=JSON.parse(localStorage.getItem(KEY)||'{}');if(s.task)setTask(s.task);if(Array.isArray(s.vals)&&s.vals.length===8)setVals(s.vals)}catch{}},[]);const save=(next:any)=>{try{localStorage.setItem(KEY,JSON.stringify({task,vals,...next}))}catch{}};const setV=(i:number,v:string)=>{const n=[...vals];n[i]=v;setVals(n);save({vals:n})};return <><div className={styles.taskPick04}><span>Automation của tôi:</span><div>{opts.map(o=><button key={o} className={task===o?styles.tpOn04:''} onClick={()=>{const n=task===o?'':o;setTask(n);save({task:n})}}>{o}</button>)}</div><input placeholder="…hoặc gõ việc khác của bạn"/></div><div className={styles.ws04}><table><thead><tr><th>Thành phần</th><th>Câu trả lời của bạn</th></tr></thead><tbody>{fields.map((f,i)=><tr key={f}><td>{f}</td><td><input value={vals[i]} onChange={e=>setV(i,e.target.value)} placeholder={`${f.toLowerCase()}…`}/></td></tr>)}</tbody></table><div><button onClick={()=>{const n=fields.map(()=>'');setVals(n);save({vals:n})}}>Xóa nội dung</button><span>Đã điền <b>{vals.filter(Boolean).length}/8</b> phần</span></div></div></>}

export function Lesson05Checklist(){return <Checklist storageKey="hermes05_check" items={[{text:'Hiểu khác biệt giữa cron và webhook.'},{text:'Chọn được 1 việc lặp phù hợp để tự động hóa.'},{text:'Phân loại được việc: tự chạy, chờ duyệt, chỉ nhắc hay không tự động hóa.'},{text:'Viết được trigger, input, output, quyền hạn, escalation và log.'},{text:'Có format báo cáo ngắn để CEO đọc nhanh.'},{text:'Có rule “không tự bịa khi thiếu dữ liệu”.'},{text:'Có automation đầu tiên sẵn sàng tạo trong Hermes.'}]} completeMessage={<><strong>Hoàn thành bài 05 ✓</strong> Bạn đã biến một việc lặp thành automation an toàn.</>} progressMessage={(n,t)=><>Đã đạt <strong>{n}/{t}</strong> mục. Tiếp tục nhé.</>}/>}

export function ErrorTable05(){const errs=[['Tự động hóa việc quá rủi ro','CEO không dám cho chạy thật','Bắt đầu bằng read-only hoặc draft-only'],['Trigger mơ hồ','Automation chạy sai thời điểm','Ghi rõ lịch hoặc sự kiện'],['Output quá dài','CEO không đọc báo cáo','Đưa “cần chú ý ngay” lên đầu'],['Không có escalation','Việc quan trọng bị lẫn trong báo cáo','Đặt rule báo gấp'],['Không có log','Không biết agent đã làm gì','Lưu log ngắn mỗi lần chạy'],['Cho gửi ra ngoài quá sớm','Rủi ro sai email / dữ liệu','Dùng approval flow trước']];const[open,setOpen]=useState<Set<number>>(new Set());return <div className={styles.errtbl03}>{errs.map(([l,s,f],i)=><div key={l} className={`${styles.errRow03} ${open.has(i)?styles.errRowOn03:''}`}><div className={styles.errQ03} onClick={()=>setOpen(p=>{const n=new Set(p);n.has(i)?n.delete(i):n.add(i);return n})}><span className={styles.errNum03}>{i+1}</span><span className={styles.errTitle03}>{l}</span><span className={styles.errChev03}>›</span></div><div className={styles.errBody03} style={{maxHeight:open.has(i)?'280px':'0'}}><div className={styles.errIn03}><div className={styles.errSign03}><div className={styles.errLab03}>Dấu hiệu</div><div className={styles.errVal03}>{s}</div></div><div className={styles.errFix03}><div className={styles.errLab03}>Cách sửa</div><div className={styles.errVal03}>{f}</div></div></div></div></div>)}</div>}
