import { createRootRoute, Outlet } from '@tanstack/react-router'

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
            {/* <TanStackRouterDevtools /> */}
        </>
    ),
})


