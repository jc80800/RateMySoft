import React, { FC } from 'react'
import BlackBtn from '../buttons/BlackBtn'
import WhiteBtn from '../buttons/WhiteBtn'
import HorizontalLayout from '../layouts/HorizontalLayout'
import VerticalLayout from '../layouts/VerticalLayout'

const Hero: FC = () => {
  return (
      <HorizontalLayout className='border-t-2 py-24'>
        <VerticalLayout>
          <h1 >
            Find the Perfect{' '} <br/>
            <span className="highlight">Software</span> Solution
          </h1>
          <p>
            Discover, compare, and review the best software tools for developers and teams. Get honest reviews from real users.
          </p>
          <HorizontalLayout className='w-full'>
            <BlackBtn>
              Browse Software
            </BlackBtn>
            <WhiteBtn>
              Write a Review
            </WhiteBtn>
          </HorizontalLayout>
        </VerticalLayout>
        <div className="relative mt-16 flex justify-center gap-6">
          <div className="w-16 h-16 bg-green-200 rounded-full animate-bounce"></div>
          <div className="w-20 h-20 bg-green-300 rounded-full animate-pulse"></div>
          <div className="w-12 h-12 bg-green-100 rounded-full animate-bounce"></div>
        </div>
      </HorizontalLayout>
  )
}

export default Hero