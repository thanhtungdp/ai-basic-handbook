import type { ComparisonRow } from '@/components/handbook/interactive'

export const comparisonData: ComparisonRow[] = [
  {
    criterion: 'Cách dùng',
    chatAI: 'Hỏi đáp từng lần',
    hermes: 'Giao việc như cho nhân viên',
  },
  {
    criterion: 'Trí nhớ',
    chatAI: 'Dễ mất ngữ cảnh',
    hermes: 'Có memory, session, skill',
  },
  {
    criterion: 'Hành động',
    chatAI: 'Chủ yếu tạo nội dung',
    hermes: 'Dùng tool, file, web, cron, webhook',
  },
  {
    criterion: 'Việc lặp',
    chatAI: 'Bạn phải nhắc lại quy trình',
    hermes: 'Ghi thành skill để dùng lại',
  },
  {
    criterion: 'Tự động hóa',
    chatAI: 'Hạn chế',
    hermes: 'Chạy theo lịch hoặc sự kiện',
  },
  {
    criterion: 'Vai trò CEO',
    chatAI: 'Vẫn phải thao tác nhiều',
    hermes: 'Ra lệnh, duyệt, kiểm soát ngoại lệ',
  },
]
