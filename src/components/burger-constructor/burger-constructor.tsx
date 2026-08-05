import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  getConstructorData,
  createOrder,
  clearOrderModalData
} from '../../slices/constructorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/services/store';
import { Navigate, useNavigate } from 'react-router-dom';
import { authenticatedSelector } from '../../slices/userSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { constructorItems, orderRequest, orderModalData } =
    useSelector(getConstructorData);
  const isAuthenticated = useSelector(authenticatedSelector);
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const ingredientsIds = [
      constructorItems.bun!._id,
      ...constructorItems.ingredients.map((i) => i._id)
    ];
    dispatch(createOrder(ingredientsIds));
  };
  const closeOrderModal = () => {
    dispatch(clearOrderModalData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
