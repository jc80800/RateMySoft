import CategoryFilter from "@/components/homepage/CategoryFilter";
import Hero from "@/components/homepage/Hero";
import VerticalLayout from "@/components/layouts/VerticalLayout";

export default function Home() {
  return (
      <VerticalLayout className="py-8 items-center gap-20">
        <CategoryFilter/>
        <Hero/>
      </VerticalLayout>
  );
}
