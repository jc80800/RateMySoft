
interface HorizontalLayoutProps {
  children: React.ReactNode
  className?: string
}

const FlexibleLayout: React.FC<HorizontalLayoutProps> = ({children, className}) => {
  return (
    <div className={`flex flex-row flex-wrap gap-4 ${className ?? ""}`}>
        {children}
    </div>
  )
}

export default FlexibleLayout