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
          <p className="text-(--light-gray)">
            Discover, compare, and review the best software tools for developers and teams. Get honest reviews from real users.
          </p>
          <HorizontalLayout>
            <BlackBtn>
              Browse Software
            </BlackBtn>
            <WhiteBtn>
              Write a Review
            </WhiteBtn>
          </HorizontalLayout>
        </VerticalLayout>
        <div className="hero-visual" style={{ position: 'relative', width: '360px', height: '360px' }}>
          <div className="panda-wrapper" style={{ position: 'relative', width: '360px', height: '360px' }}>
            <div className="panda-circle" style={{ position: 'absolute', top: '50%', left: '50%', width: '100px', height: '100px', marginTop: '-50px', marginLeft: '-50px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
              <span className="panda">
                🐼
              </span>
            </div>
            <div className="floating-icon bamboo">🎋</div>
            <div className="floating-icon star">⭐</div>
            <div className="floating-icon heart">💚</div>
          </div>
        </div>
      </HorizontalLayout>
  )
}

export default Hero