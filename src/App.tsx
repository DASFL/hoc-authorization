import { useState } from 'react'
import AdminPanel from './components/AdminPanel'
import withAuthorization from './hoc/withAuthorization'
import type { CurrentUser } from './types'
import './App.css'

interface UserOption {
  id: string
  label: string
  user: CurrentUser | null
}

const users: UserOption[] = [
  { id: 'guest', label: 'Без пользователя', user: null },
  { id: 'reader', label: 'Анна — user', user: { name: 'Анна', roles: ['user'] } },
  { id: 'editor', label: 'Иван — editor', user: { name: 'Иван', roles: ['editor'] } },
  { id: 'admin', label: 'Мария — admin', user: { name: 'Мария', roles: ['admin'] } },
  { id: 'multiple', label: 'Олег — user, editor', user: { name: 'Олег', roles: ['user', 'editor'] } },
  { id: 'no-roles', label: 'Елена — без ролей', user: { name: 'Елена', roles: [] } }
]

const ProtectedAdminPanel = withAuthorization(AdminPanel, ['admin', 'editor'])

function App() {
  const [selectedUserId, setSelectedUserId] = useState('guest')
  const currentUser = users.find((option) => option.id === selectedUserId)?.user

  return (
    <main className="app">
      <h1>Контроль доступа</h1>
      <p className="intro">Раздел доступен пользователям с ролью admin или editor.</p>

      <div className="user-controls">
        <label htmlFor="current-user">Текущий пользователь</label>
        <select
          id="current-user"
          value={selectedUserId}
          onChange={(event) => setSelectedUserId(event.target.value)}
        >
          {users.map((option) => (
            <option key={option.id} value={option.id}>{option.label}</option>
          ))}
        </select>
        <p>Роли: {currentUser?.roles.join(', ') || 'нет'}</p>
      </div>

      <ProtectedAdminPanel
        currentUser={currentUser}
        title="Управление разделом"
        description="Здесь отображается содержимое защищённого компонента."
      />
    </main>
  )
}

export default App
