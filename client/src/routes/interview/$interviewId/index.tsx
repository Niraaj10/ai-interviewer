import { createFileRoute } from '@tanstack/react-router'
import InterviewRoom from '../../../components/InterviewRoom'

export const Route = createFileRoute('/interview/$interviewId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { interviewId } = Route.useParams()

  console.log("inter : ", interviewId)


  return <>
    <div>
      Hello "/interview"!
    </div>

    <InterviewRoom interviewId={interviewId} />
  </>
}
