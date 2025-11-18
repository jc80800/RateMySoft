import CategoryFilter from "@/components/homepage/CategoryFilter";
import VerticalLayout from "@/components/layouts/VerticalLayout";

export default function Home() {
  return (
      <VerticalLayout className="py-8">
        <CategoryFilter/>
      </VerticalLayout>
  );
}
