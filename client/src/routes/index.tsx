import { createFileRoute } from '@tanstack/react-router'
import { Form } from "../components/UI/Form"
import { Toaster } from '../components/UI/sonner'


export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {

  return (
    <>
      <Toaster />
      <Form />
    </>  
  )
}
