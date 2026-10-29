import { FC, useEffect } from 'react';
import { apiGet } from '@/api/http';

const Category: FC = () => {
  useEffect(() => {
    apiGet('/gulimallproduct/category/list/tree').then((res) => {
      console.log(res);
    });
  });

  return <div></div>;
};

export default Category;
