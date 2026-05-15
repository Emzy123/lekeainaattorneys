import { auth } from "./auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = !req.nextUrl.pathname.startsWith('/login')
  const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth')

  if (isApiAuthRoute) return

  if (isOnDashboard) {
    if (isLoggedIn) {
      // Enforce Role-Based Access Control (RBAC)
      const userRole = (req.auth?.user as any)?.role;
      if (userRole !== 'ADMIN' && userRole !== 'EDITOR') {
        // Logged in but not authorized
        return Response.redirect(new URL('/login?error=AccessDenied', req.nextUrl));
      }
      return;
    }
    return Response.redirect(new URL('/login', req.nextUrl))
  } else if (isLoggedIn) {
    return Response.redirect(new URL('/', req.nextUrl))
  }
  return
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
