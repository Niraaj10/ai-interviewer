import { createFileRoute } from '@tanstack/react-router'
import { PrepPage } from '../../components/Prep'

export const Route = createFileRoute('/prep/')({
    component: PrepPage,
})

// function RouteComponent() {
//   return <div>Hello "/prep/"!</div>
// }
