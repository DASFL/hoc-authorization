import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import withAuthorization from './withAuthorization'
import type { AuthorizationProps } from '../types'

interface PanelProps extends AuthorizationProps {
  title: string
}

const deniedText = 'У вас нет прав для просмотра этого раздела.'

describe('withAuthorization', () => {
  it.each([
    { name: 'роль admin', user: { name: 'Анна', roles: ['admin'] }, allowed: true },
    { name: 'роль editor', user: { name: 'Иван', roles: ['editor'] }, allowed: true },
    { name: 'одна из нескольких ролей', user: { name: 'Олег', roles: ['user', 'editor'] }, allowed: true },
    { name: 'неподходящая роль', user: { name: 'Мария', roles: ['user'] }, allowed: false },
    { name: 'пустой список ролей', user: { name: 'Елена', roles: [] }, allowed: false },
    { name: 'пользователь null', user: null, allowed: false },
    { name: 'пользователь undefined', user: undefined, allowed: false }
  ])('$name', ({ user, allowed }) => {
    const Panel = vi.fn((props: PanelProps) => <p>{props.title}</p>)
    const ProtectedPanel = withAuthorization(Panel, ['admin', 'editor'])
    const html = renderToStaticMarkup(<ProtectedPanel currentUser={user} title="Защищённый раздел" />)

    if (allowed) {
      expect(html).toContain('Защищённый раздел')
      expect(html).not.toContain(deniedText)
      expect(Panel).toHaveBeenCalledOnce()
    } else {
      expect(html).toContain(deniedText)
      expect(Panel).not.toHaveBeenCalled()
    }
  })

  it('отказывает, если currentUser не передан', () => {
    const Panel = vi.fn((props: PanelProps) => <p>{props.title}</p>)
    const ProtectedPanel = withAuthorization(Panel, ['admin'])
    expect(renderToStaticMarkup(<ProtectedPanel title="Раздел" />)).toContain(deniedText)
    expect(Panel).not.toHaveBeenCalled()
  })

  it('передаёт исходные props, включая тот же объект currentUser', () => {
    const Panel = vi.fn((props: PanelProps) => <p>{props.title}</p>)
    const ProtectedPanel = withAuthorization(Panel, ['admin'])
    const props: PanelProps = { title: 'Панель', currentUser: { name: 'Анна', roles: ['admin'] } }
    renderToStaticMarkup(<ProtectedPanel {...props} />)
    expect(Panel.mock.calls[0][0]).toEqual(props)
    expect(Panel.mock.calls[0][0].currentUser).toBe(props.currentUser)
  })

  it('отказывает при пустом allowedRoles', () => {
    function Panel({ title }: PanelProps) { return <p>{title}</p> }
    const ProtectedPanel = withAuthorization(Panel, [])
    expect(renderToStaticMarkup(
      <ProtectedPanel title="Раздел" currentUser={{ name: 'Анна', roles: ['admin'] }} />
    )).toContain(deniedText)
  })
})
