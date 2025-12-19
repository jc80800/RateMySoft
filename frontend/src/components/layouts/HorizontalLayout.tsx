import { twMerge } from 'tailwind-merge'

interface HorizontalLayoutProps {
  children: React.ReactNode
  className?: string
}

const HorizontalLayout: React.FC<HorizontalLayoutProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={twMerge("flex flex-row items-center gap-4",className)}
    >
      {children}
    </div>
  )
}
export default HorizontalLayout
