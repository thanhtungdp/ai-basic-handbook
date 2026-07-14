import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface AdminWeeklyReportEmailProps {
  weekNumber: number
  weekLabel: string
  totalStudents: number
  activeStudents: number
  totalLessons: number
  totalCompletedLessons: number
  totalStudyTime: string
  totalVideoTime: string
  topStudents: Array<{
    fullName: string
    email: string
    progressPercent: number
    lessonsDone: number
    totalTime: string
    lastActive: string
  }>
  reportUrl: string
}

export function AdminWeeklyReportEmail({
  weekNumber,
  weekLabel,
  totalStudents,
  activeStudents,
  totalLessons,
  totalCompletedLessons,
  totalStudyTime,
  totalVideoTime,
  topStudents,
  reportUrl,
}: AdminWeeklyReportEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{`Admin report tuần ${weekNumber} — Hermes Handbook`}</Preview>
      <Body style={{ margin: 0, padding: 0, backgroundColor: '#e7e2d8' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '36px 16px' }}>
          <Section style={{ backgroundColor: '#fffefb', border: '2px solid #16140f' }}>
            <Section style={{ padding: '16px 40px', borderBottom: '2px solid #16140f', backgroundColor: '#f4f1ea' }}>
              <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border={0}>
                <tbody>
                  <tr>
                    <td style={{ fontFamily: 'Space Mono, Courier New, monospace', fontSize: '13px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#16140f' }}>
                      HERMES <span style={{ color: '#F26C2C' }}>AGENT</span>
                    </td>
                    <td align="right" style={{ fontFamily: 'Space Mono, Courier New, monospace', fontSize: '11px', letterSpacing: '.04em', color: '#6f685d' }}>
                      ADMIN REPORT
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Section style={{ backgroundColor: '#16140f', padding: '48px 40px 44px' }}>
              <Text style={{ fontFamily: 'Space Mono, Courier New, monospace', fontSize: '11px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#F26C2C', fontWeight: 700, margin: '0 0 14px 0' }}>
                — Tuần {weekNumber}
              </Text>
              <Heading style={{ fontFamily: 'Space Grotesk, Arial, sans-serif', fontSize: '38px', fontWeight: 700, letterSpacing: '-.03em', lineHeight: '1.06', color: '#ffffff', margin: '0 0 10px 0' }}>
                Báo cáo hệ thống
              </Heading>
              <Text style={{ fontFamily: 'Space Grotesk, Arial, sans-serif', fontSize: '18px', lineHeight: '1.6', color: '#d7cfc2', margin: 0 }}>
                {weekLabel} · tổng quan cohort học tập của handbook.
              </Text>
            </Section>

            <Section style={{ padding: '32px 40px 8px' }}>
              <Text style={{ fontFamily: 'Space Mono, Courier New, monospace', fontSize: '11px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#F26C2C', fontWeight: 700, margin: '0 0 18px 0' }}>
                — Check progress
              </Text>
              <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border={0} style={{ border: '2px solid #16140f' }}>
                <tbody>
                  {[
                    `Tổng học viên: ${totalStudents}`,
                    `Học viên có hoạt động: ${activeStudents}`,
                    `Tổng bài trong khóa: ${totalLessons}`,
                    `Tổng bài đã hoàn thành: ${totalCompletedLessons}`,
                    `Tổng thời gian học: ${totalStudyTime}`,
                    `Tổng thời gian video: ${totalVideoTime}`,
                  ].map((line, index, arr) => (
                    <tr key={line}>
                      <td style={{ padding: '14px 24px', borderBottom: index < arr.length - 1 ? '2px solid #16140f' : 'none' }}>
                        <Text style={{ fontFamily: 'Space Grotesk, Arial, sans-serif', fontSize: '15px', lineHeight: '1.6', color: '#16140f', margin: 0 }}>
                          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '18px', color: '#F26C2C', fontWeight: 700 }}>☐</span>
                          <span style={{ paddingLeft: 10 }}>{line}</span>
                        </Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>

            <Section style={{ padding: '28px 40px 8px' }}>
              <Text style={{ fontFamily: 'Space Mono, Courier New, monospace', fontSize: '11px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#F26C2C', fontWeight: 700, margin: '0 0 14px 0' }}>
                — Top học viên nổi bật
              </Text>
              <Section style={{ backgroundColor: '#f4f1ea', border: '2px solid #16140f', padding: '22px 24px' }}>
                {topStudents.length === 0 ? (
                  <Text style={{ fontFamily: 'Space Grotesk, Arial, sans-serif', fontSize: '15px', lineHeight: '1.7', color: '#16140f', margin: 0 }}>
                    Chưa có dữ liệu hoạt động trong tuần này.
                  </Text>
                ) : (
                  topStudents.map((student, index) => (
                    <div key={`${student.email}-${index}`} style={{ paddingBottom: index < topStudents.length - 1 ? 14 : 0, marginBottom: index < topStudents.length - 1 ? 14 : 0, borderBottom: index < topStudents.length - 1 ? '2px solid #16140f' : 'none' }}>
                      <Text style={{ fontFamily: 'Space Grotesk, Arial, sans-serif', fontSize: '16px', fontWeight: 700, lineHeight: '1.5', color: '#16140f', margin: '0 0 4px 0' }}>
                        {student.fullName}
                      </Text>
                      <Text style={{ fontFamily: 'Space Mono, Courier New, monospace', fontSize: '11px', letterSpacing: '.03em', color: '#6f685d', margin: '0 0 8px 0' }}>
                        {student.email}
                      </Text>
                      <Text style={{ fontFamily: 'Space Grotesk, Arial, sans-serif', fontSize: '14px', lineHeight: '1.7', color: '#16140f', margin: '0 0 4px 0' }}>
                        Tiến độ: <strong>{student.progressPercent}%</strong> · Bài xong: <strong>{student.lessonsDone}</strong> · Thời gian học: <strong>{student.totalTime}</strong>
                      </Text>
                      <Text style={{ fontFamily: 'Space Grotesk, Arial, sans-serif', fontSize: '13px', lineHeight: '1.6', color: '#6f685d', margin: 0 }}>
                        Hoạt động cuối: {student.lastActive}
                      </Text>
                    </div>
                  ))
                )}
              </Section>
            </Section>

            <Section style={{ padding: '24px 40px 8px' }}>
              <Text style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '18px', fontStyle: 'italic', lineHeight: '1.5', color: '#16140f', padding: '20px 24px', border: '2px solid #16140f', borderLeft: '4px solid #F26C2C', backgroundColor: '#fff7f2', margin: 0 }}>
                Mục tiêu của report này là giúp anh nhìn cohort theo góc độ vận hành: ai đang tiến bộ, ai đứng yên, và tuần này hệ thống học tạo ra bao nhiêu thời gian học thật.
              </Text>
            </Section>

            <Section style={{ padding: '28px 40px 40px' }}>
              <Text style={{ fontFamily: 'Space Grotesk, Arial, sans-serif', fontSize: '16px', fontWeight: 700, color: '#16140f', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                → Mở dashboard admin để xem chi tiết từng học viên.
              </Text>
              <table role="presentation" cellPadding="0" cellSpacing="0" border={0}>
                <tbody>
                  <tr>
                    <td align="center" style={{ backgroundColor: '#F26C2C', border: '2px solid #16140f', padding: '14px 32px' }}>
                      <a href={reportUrl} style={{ fontFamily: 'Space Grotesk, Arial, sans-serif', fontSize: '15px', fontWeight: 700, color: '#16140f', textDecoration: 'none', letterSpacing: '.02em', textTransform: 'uppercase', display: 'inline-block' }}>
                        Mở admin reports →
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Hr style={{ border: 'none', borderTop: '2px solid #16140f', margin: 0 }} />

            <Section style={{ backgroundColor: '#16140f', padding: '28px 40px' }}>
              <Text style={{ fontFamily: 'Space Mono, Courier New, monospace', fontSize: '12px', letterSpacing: '.04em', color: '#F26C2C', fontWeight: 700, margin: '0 0 6px 0' }}>
                HERMES HANDBOOK · ADMIN REPORT
              </Text>
              <Text style={{ fontFamily: 'Space Mono, Courier New, monospace', fontSize: '11px', letterSpacing: '.03em', lineHeight: '1.7', color: '#a89c8c', margin: 0 }}>
                Báo cáo này được gửi tự động từ server cron job.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default AdminWeeklyReportEmail
