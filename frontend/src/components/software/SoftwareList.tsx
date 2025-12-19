import { Software } from "@/types/schemas/software/software"
import SoftwareCard from "./SoftwareCard"

interface SoftwareListProps{
    softwares : Software[]
}

const SoftwareList = ({ softwares }: SoftwareListProps) => {
  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        gap-6
      "
    >
      {softwares.map((software: Software) => (
        <SoftwareCard
          key={software.id}
          software={software}
        />
      ))}
    </div>
  )
}
export default SoftwareList