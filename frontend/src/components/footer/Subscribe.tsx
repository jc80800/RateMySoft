'use client'
import { useState } from "react"
import BlackBtn from "../buttons/BlackBtn"
import HorizontalLayout from "../HorizontalLayout"
import TextInput from "../TextInput"


const Subscribe = () => {
    const [email, setEmail] = useState("");
    const onSubmit = () => {

    }

    return (
<form className="flex-1 w-full">
  <HorizontalLayout className="w-full gap-4">
    <TextInput
      inputType="text"
      placeholder="Enter your email address"
      onChange={(e) => setEmail(e.target.value)}
      className="flex-1 w-full"
    />
    <BlackBtn type="submit">
      <HorizontalLayout>
        <p>Subscribe</p>
        <span className="btn-emoji">📬</span>
      </HorizontalLayout>
    </BlackBtn>
  </HorizontalLayout>
</form>
    )
}

export default Subscribe