import type { AuthorizationProps } from '../types'

interface AdminPanelProps extends AuthorizationProps {
  title: string
  description: string
}

function AdminPanel({ currentUser, title, description }: AdminPanelProps) {
  return (
    <section className="admin-panel">
      <p className="access-label">Доступ разрешён</p>
      <h2>{title}</h2>
      <p>{description}</p>
      <p className="user-greeting">Пользователь: {currentUser?.name}</p>
    </section>
  )
}

export default AdminPanel
