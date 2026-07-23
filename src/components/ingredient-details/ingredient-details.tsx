import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from 'react-redux';
import { getIngredientsSelector } from '../../slices/ingredientsSlice';
import { useLocation, useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { ingredients } = useSelector(getIngredientsSelector);
  const { id } = useParams();

  const ingredientData = ingredients.find((ingredient) => ingredient._id == id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
