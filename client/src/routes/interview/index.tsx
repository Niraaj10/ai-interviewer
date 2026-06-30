import { createFileRoute } from '@tanstack/react-router'
import { Form } from '../../components/UI/Form'
import { Toaster } from '../../components/UI/sonner'

export const Route = createFileRoute('/interview/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <Toaster />
    <Form />
    </div>
}
