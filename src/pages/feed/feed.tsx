import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  getAllOrders,
  getTotalOrdersNumber,
  getTotalTodayOrdersNumber,
  fetchFeed
} from '../../slices/feedSlice';
import { useDispatch, useSelector } from '../../services/store';
import { AppDispatch } from 'src/services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  const orders: TOrder[] = useSelector(getAllOrders);

  if (!orders.length) {
    return <Preloader />;
  }

  const handleGetFeeds = () => {
    dispatch(fetchFeed());
  };

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
