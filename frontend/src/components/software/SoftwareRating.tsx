import { ReactNode } from 'react'
import HorizontalLayout from '../layouts/HorizontalLayout'
import StarIcon from '../icons/StarIcon'

type SoftwareRatingProps = {
  rating: number        // e.g. 5.0
  totalReviews: number  // e.g. 1
}

const SoftwareRating = ({ rating, totalReviews}: SoftwareRatingProps) => {
  const fullStars = Math.floor(rating)
  if(!rating) rating = 0;//

  return (
    <HorizontalLayout>
      {/* Stars */}
      <HorizontalLayout className='gap-0.5'>
        {Array.from({ length: 5 }).map((_, i) => (
            <div className={ i < fullStars ? 'text-(--star-yellow)' : 'text-white'} key={i}>
                <StarIcon/>
            </div>

        ))}
      </HorizontalLayout>

      {/* Rating number */}
      <h3 className="font-semibold">
        {rating.toFixed(1)}
      </h3>

      {/* Review count */}
      <span className="text-(--dark-gray)">
        ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
      </span>
    </HorizontalLayout>
  )
}

export default SoftwareRating