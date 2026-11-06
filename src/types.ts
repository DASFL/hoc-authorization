export interface CurrentUser {
  name: string
  roles: string[]
}

export interface AuthorizationProps {
  currentUser?: CurrentUser | null
}
