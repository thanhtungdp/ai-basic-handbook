import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface WeeklyReportEmailProps {
  userName: string
  weekNumber: number
  weekLabel: string
  lessonsCompleted: number
  lessonsInProgress: number
  totalLessons: number
  totalTimeSeconds: number
  videoWatchTimeSeconds: number
  courseProgressPercent: number
  lessons: Array<{
    title: string
    status: 'not_started' | 'in_progress' | 'done'
    totalTimeSeconds: number
    videoWatchTimeSeconds: number
  }>
  handbookUrl: string
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (minutes < 60) return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}

const statusLabels: Record<string, string> = {
  not_started: 'Chưa học',
  in_progress: 'Đang học',
  done: 'Đã xong',
}

const statusColors: Record<string, string> = {
  not_started: '#9ca3af',
  in_progress: '#f59e0b',
  done: '#10b981',
}

export function WeeklyReportEmail({
  userName,
  weekNumber,
  weekLabel,
  lessonsCompleted,
  lessonsInProgress,
  totalLessons,
  totalTimeSeconds,
  videoWatchTimeSeconds,
  courseProgressPercent,
  lessons,
  handbookUrl,
}: WeeklyReportEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{`Báo cáo học tập tuần ${String(weekNumber)} — Hermes Handbook`}</Preview>
      <Body style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', backgroundColor: '#f4f4f5', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
          {/* Header */}
          <Section style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 32, marginBottom: 16 }}>
            <Text style={{ fontSize: 14, color: '#71717a', margin: '0 0 4px 0' }}>
              Hermes Handbook — Báo cáo tuần {weekNumber}
            </Text>
            <Heading style={{ fontSize: 24, fontWeight: 700, color: '#18181b', margin: '0 0 8px 0' }}>
              Chào {userName} 👋
            </Heading>
            <Text style={{ fontSize: 15, color: '#52525b', margin: '0 0 0 0' }}>
              {weekLabel}
            </Text>
          </Section>

          {/* KPI Cards */}
          <Section style={{ marginBottom: 16 }}>
            <Row>
              <Container style={{ display: 'inline-block', width: '48%', verticalAlign: 'top', backgroundColor: '#ffffff', borderRadius: 12, padding: 20, marginRight: '2%' }}>
                <Text style={{ fontSize: 12, color: '#71717a', margin: '0 0 4px 0' }}>BÀI HOÀN THÀNH</Text>
                <Text style={{ fontSize: 28, fontWeight: 700, color: '#10b981', margin: 0 }}>
                  {lessonsCompleted}/{totalLessons}
                </Text>
              </Container>
              <Container style={{ display: 'inline-block', width: '48%', verticalAlign: 'top', backgroundColor: '#ffffff', borderRadius: 12, padding: 20 }}>
                <Text style={{ fontSize: 12, color: '#71717a', margin: '0 0 4px 0' }}>TIẾN ĐỘ KHÓA</Text>
                <Text style={{ fontSize: 28, fontWeight: 700, color: '#6366f1', margin: 0 }}>
                  {courseProgressPercent}%
                </Text>
              </Container>
            </Row>
            <Row style={{ marginTop: 8 }}>
              <Container style={{ display: 'inline-block', width: '48%', verticalAlign: 'top', backgroundColor: '#ffffff', borderRadius: 12, padding: 20, marginRight: '2%' }}>
                <Text style={{ fontSize: 12, color: '#71717a', margin: '0 0 4px 0' }}>THỜI GIAN HỌC</Text>
                <Text style={{ fontSize: 28, fontWeight: 700, color: '#18181b', margin: 0 }}>
                  {formatDuration(totalTimeSeconds)}
                </Text>
              </Container>
              <Container style={{ display: 'inline-block', width: '48%', verticalAlign: 'top', backgroundColor: '#ffffff', borderRadius: 12, padding: 20 }}>
                <Text style={{ fontSize: 12, color: '#71717a', margin: '0 0 4px 0' }}>THỜI GIAN VIDEO</Text>
                <Text style={{ fontSize: 28, fontWeight: 700, color: '#18181b', margin: 0 }}>
                  {formatDuration(videoWatchTimeSeconds)}
                </Text>
              </Container>
            </Row>
          </Section>

          {/* Lessons Table */}
          <Section style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <Heading style={{ fontSize: 16, fontWeight: 600, color: '#18181b', margin: '0 0 16px 0' }}>
              Chi tiết bài học
            </Heading>
            {lessons.map((lesson, i) => (
              <div key={i} style={{ borderBottom: i < lessons.length - 1 ? '1px solid #f4f4f5' : 'none', padding: '12px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, color: '#18181b', margin: 0, fontWeight: 500, flex: 1 }}>
                    {lesson.title}
                  </Text>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: 12,
                      fontWeight: 500,
                      padding: '4px 10px',
                      borderRadius: 999,
                      backgroundColor: `${statusColors[lesson.status]}20`,
                      color: statusColors[lesson.status],
                    }}
                  >
                    {statusLabels[lesson.status]}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                  <span style={{ fontSize: 12, color: '#a1a1aa' }}>
                    ⏱ {formatDuration(lesson.totalTimeSeconds)}
                  </span>
                  {lesson.videoWatchTimeSeconds > 0 && (
                    <span style={{ fontSize: 12, color: '#a1a1aa' }}>
                      🎥 {formatDuration(lesson.videoWatchTimeSeconds)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </Section>

          {/* CTA */}
          <Section style={{ textAlign: 'center', marginBottom: 16 }}>
            <Button
              href={handbookUrl}
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                backgroundColor: '#6366f1',
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 12,
                textDecoration: 'none',
              }}
            >
              Tiếp tục học →
            </Button>
          </Section>

          <Hr style={{ border: 'none', borderTop: '1px solid #e4e4e7', margin: '24px 0' }} />

          {/* Footer */}
          <Text style={{ fontSize: 13, color: '#a1a1aa', textAlign: 'center', margin: 0 }}>
            Hermes Handbook — Xây đội AI tự chủ cho Solo CEO
          </Text>
          <Text style={{ fontSize: 12, color: '#c4c4c8', textAlign: 'center', marginTop: 4 }}>
            Bạn nhận email này vì đang học Hermes Handbook.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default WeeklyReportEmail