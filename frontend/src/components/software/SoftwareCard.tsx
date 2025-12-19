import { Software } from '@/types/schemas/software/software'
import VerticalLayout from '../layouts/VerticalLayout'
import HorizontalLayout from '../layouts/HorizontalLayout'
import Image from 'next/image'
import SoftwareRating from './SoftwareRating'
import Card from '../Card'
import WhiteBtn from '../buttons/WhiteBtn'
import GreenBtn from '../buttons/GreenBtn'
import BlackBtn from '../buttons/BlackBtn'

interface SoftwareCardProps {
  software: Software
}

const SoftwareCard = ({ software }: SoftwareCardProps) => {
  return (
    <Card>
      <VerticalLayout>
        <header>
          <HorizontalLayout>
            <Image className="rounded-2xl" src="/app-icon.png" alt="RateMySoft" width={50} height={50} />
            <VerticalLayout>
              <h3 className='pl-3'>{software.name}</h3>
              <GreenBtn>{software.category}</GreenBtn>
            </VerticalLayout>
          </HorizontalLayout>
        </header>
        <p className='min-h-14'>{software.description}</p>
        <SoftwareRating rating={software.avg_rating} totalReviews={software.total_reviews} />
        <HorizontalLayout className='w-full'>
          <WhiteBtn href={`software/${software.id}`}>View Details</WhiteBtn>
          <BlackBtn href={`software/write-review/${software.id}`}>Write Review</BlackBtn>
        </HorizontalLayout>
      </VerticalLayout>
    </Card>

  )
}

export default SoftwareCard