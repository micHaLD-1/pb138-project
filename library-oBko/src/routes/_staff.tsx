import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_staff')({
  beforeLoad: ({ context }) => {
    const { isLoggedIn, user } = context.auth
    if (!isLoggedIn || (user?.role !== 'ADMIN' && user?.role !== 'STAFF')) {
      throw redirect({ to: '/' })
    }
  },
  component: () => <Outlet />,
})
