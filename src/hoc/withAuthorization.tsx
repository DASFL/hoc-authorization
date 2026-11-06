import { memo } from 'react'
import type { ComponentType } from 'react'
import AccessDenied from '../components/AccessDenied'
import type { AuthorizationProps } from '../types'

function withAuthorization<P extends AuthorizationProps>(
  WrappedComponent: ComponentType<P>,
  allowedRoles: string[]
) {
  const WithAuthorization = memo(function WithAuthorization(props: P) {
    const hasAccess = props.currentUser?.roles.some((role) => allowedRoles.includes(role))

    if (!hasAccess) return <AccessDenied />

    return <WrappedComponent {...props} />
  })

  WithAuthorization.displayName = `withAuthorization(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return WithAuthorization
}

export default withAuthorization
