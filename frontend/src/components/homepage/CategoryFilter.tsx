import { FC } from 'react';

interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

interface CategoryFilterProps {
  onCategorySelect: (id: string) => void;
  selectedCategory: string;
  categories?: Category[];
}

const CategoryFilter: FC<CategoryFilterProps> = ({
  onCategorySelect,
  selectedCategory,
  categories = [],
}) => {
  const defaultCategories: Category[] = [
    {
      id: 'all',
      name: 'All Software',
      icon: '🔍',
      description: 'Browse all software',
    },
  ];

  const allCategories = [...defaultCategories, ...categories];

  return (
    <div>
      <div>
        <h2>Browse by Category</h2>
        <p>Find software solutions that fit your needs</p>
      </div>

      <div>
        {allCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            title={category.description}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
