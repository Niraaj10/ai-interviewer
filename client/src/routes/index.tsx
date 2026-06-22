import { createFileRoute } from '@tanstack/react-router'
import { Form } from "../components/UI/Form"


export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {

  return (
    <>
      <Form />
    </>  
  )
}
