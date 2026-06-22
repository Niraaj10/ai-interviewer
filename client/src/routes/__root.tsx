import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
    component: () => (
        <>
            {/* <nav>
                <Link to="/">
                    Home
                </Link>

                <Link to="/interview">
                    Interview
                </Link>
            </nav> */}

            <Outlet />
            <TanStackRouterDevtools />
        </>
    ),
})


