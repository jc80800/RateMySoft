import Devider from "@/components/Devider";
import CategoryFilter from "@/components/homepage/CategoryFilter";
import Hero from "@/components/homepage/Hero";
import VerticalLayout from "@/components/layouts/VerticalLayout";

export default function Home() {
  return (
      <VerticalLayout className="items-center gap-20">
        <CategoryFilter />
        <Devider/>
        <Hero />
      </VerticalLayout>
  );
}
