import HorizontalLayout from '../layouts/HorizontalLayout'
import { DropdownIcon } from '../icons/DropdownIcon'
import { ReactNode } from 'react'

interface DropdownBtnProps {
  text: string
}


const DropdownBtn = ({text} : DropdownBtnProps) => {
  return (
    <HorizontalLayout className='rounded-lg border p-2 px-6 border-(--light-gray)'>
        <label>{text}</label>
        <DropdownIcon/>
    </HorizontalLayout>
  )
}

export default DropdownBtn