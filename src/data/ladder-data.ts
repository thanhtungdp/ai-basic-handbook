import type { LadderLevel } from '@/components/handbook/interactive'

export const ladderData: LadderLevel[] = [
  {
    lv: 'L1',
    name: 'Prompt',
    sub: 'Ra lệnh từng lần',
    ceo: 'Ra lệnh từng lần',
    hermes: 'Trả kết quả theo yêu cầu',
    example: '"Viết giúp anh một bài LinkedIn."',
  },
  {
    lv: 'L2',
    name: 'Checklist',
    sub: 'Đưa quy trình mẫu',
    ceo: 'Đưa quy trình mẫu',
    hermes: 'Làm theo từng bước',
    example: '"Viết theo checklist <em>hook → insight → ví dụ → CTA</em>."',
  },
  {
    lv: 'L3',
    name: 'Skill',
    sub: 'Chuẩn hóa cách làm',
    ceo: 'Sửa và chuẩn hóa cách làm',
    hermes: 'Ghi nhớ quy trình để dùng lại',
    example: '"Lưu cách viết này thành <em>skill content CEO POV</em>."',
  },
  {
    lv: 'L4',
    name: 'Cron / Webhook',
    sub: 'Lịch hoặc trigger',
    ceo: 'Thiết lập lịch hoặc trigger',
    hermes: 'Tự chạy việc định kỳ/sự kiện',
    example: '"Mỗi sáng thứ Hai tạo <em>5 ý tưởng bài viết</em>."',
  },
  {
    lv: 'L5',
    name: 'Agent chuyên trách',
    sub: 'Quản lý theo vai trò',
    ceo: 'Quản lý theo vai trò',
    hermes: 'Tự xử lý một nhóm việc lặp',
    example: '"<em>Content Agent</em> theo dõi pipeline, đề xuất bài, draft, nhắc duyệt."',
  },
]
