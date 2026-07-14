import type { FlashCard } from '@/components/handbook/interactive'

export const flashcardsData: FlashCard[] = [
  {
    question: 'Chat AI và Hermes khác nhau ở đâu?',
    answer:
      'Chat AI dừng ở hỏi–đáp; Hermes có thể hành động trong hệ thống của bạn: dùng tool, file, web, cron, webhook.',
  },
  {
    question: 'Hermes "nhớ" bằng gì?',
    answer:
      'Bằng memory, session và skill — nên không bị mất ngữ cảnh và có thể tái sử dụng quy trình đã chuẩn hóa.',
  },
  {
    question: 'Vai trò CEO thay đổi thế nào?',
    answer:
      'Từ "người thao tác chính" → "người ra quyết định & duyệt ngoại lệ". Hermes lo phần lặp lại.',
  },
  {
    question: 'Skill là gì trong Hermes?',
    answer:
      'Là quy trình đã được ghi lại để dùng lại — thay vì phải nhắc lại cách làm mỗi lần.',
  },
  {
    question: 'Khi nào Hermes tự chạy?',
    answer:
      'Khi bạn gắn cron (theo lịch) hoặc webhook (theo sự kiện) — cấp độ tự động hóa thứ 4.',
  },
]
