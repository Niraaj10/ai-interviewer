import { createFileRoute } from '@tanstack/react-router'
import InterviewRoom from '../components/InterviewRoom'

export const Route = createFileRoute('/interview')({
  component: RouteComponent,
})

function RouteComponent() {



  return <>
    <div>
      Hello "/interview"!
    </div>

    <InterviewRoom />
  </>
}
