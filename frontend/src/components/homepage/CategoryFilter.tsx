import { Category } from '@/types/schemas/category';
import GreenBtn from '../buttons/GreenBtn';
import HorizontalLayout from '../layouts/HorizontalLayout';
import VerticalLayout from '../layouts/VerticalLayout';


const CategoryFilter = ({
}) => {
  const defaultCategories: Category[] = [
    {
      id: 'all',
      name: 'All Software',
      icon: '🔍',
      description: 'Browse all software',
    },
  ];

  const allCategories : Category[] = [...defaultCategories]; //TODO : populate

  return (
    <VerticalLayout className='items-center'>
      <VerticalLayout className='items-center'>
        <h2>Browse by Category</h2>
        <p>Find software solutions that fit your needs</p>
      </VerticalLayout>

      <HorizontalLayout>
        {allCategories.map((category: Category, idx) => (
          <GreenBtn key={idx}>
            {/* TODO: onclick */}
            <HorizontalLayout >  
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </HorizontalLayout>
          </GreenBtn>
        ))}
      </HorizontalLayout>
    </VerticalLayout>
  );
};

export default CategoryFilter;
