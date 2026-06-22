import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/interview')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/interview"!</div>
}
