'use client'
import { useState } from "react"
import BlackBtn from "../buttons/BlackBtn"
import HorizontalLayout from "../layouts/HorizontalLayout"
import TextInput from "../TextInput"


const Subscribe = () => {
    const [email, setEmail] = useState("");
    const onSubmit = () => {

    }

    return (
<form>
  <HorizontalLayout>
    <TextInput
      inputType="text"
      placeholder="Enter your email address"
      onChange={(e) => setEmail(e.target.value)}
      className=" min-w-16 md:min-w-xs "
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