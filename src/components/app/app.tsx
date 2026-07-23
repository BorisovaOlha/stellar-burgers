import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { ProtectedRoute } from '../protected-route/protected-route';

import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { Preloader } from '@ui';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import {
  fetchIngredients,
  getIngredientsSelector
} from '../../slices/ingredientsSlice';
import { RootState, AppDispatch } from '../../services/store';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const { ingredients, isIngredientsLoading, error } = useSelector(
    getIngredientsSelector
  );

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  /** TODO: взять переменные из стора */
  // const isIngredientsLoading = false;
  // const ingredients = [];
  // const error = null;

  // TODO: UseEffect - взять ингредиенты с сервера здесь для отрисовки ConstructorPage.
  // А именно написать асинх экшен, чтобы сделать запрос, создать слайс, чтобы хранить
  // полученные ингредиенты, в Апп через ЮзЭффект сделать запрос (задиспатчить экшен) и проверить
  // завершился ли запрос, есть ли ошибки. Если запрос выполняется, отображать AppHeader и прелоадер после него.
  // Если ошиька, то AppHeader и сообщение об ошибке. А если пришли ингредиенты,
  // то маршрут ConstructorPage. Далее - реализовать открытие модалки по клику.
  // Потом перейти к бургер конструктору. Для конструктора - другой слайс.
  // В других частях кода:

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={location.state?.background ?? location}>
        <Route
          path='/'
          element={
            isIngredientsLoading ? (
              <Preloader />
            ) : error ? (
              <div
                className={`${styles.error} text text_type_main-medium pt-4`}
              >
                {error}
              </div>
            ) : ingredients.length > 0 ? (
              <ConstructorPage />
            ) : (
              <div
                className={`${styles.title} text text_type_main-medium pt-4`}
              >
                Нет игредиентов
              </div>
            )
          }
        />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        {/*        
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} /> */}
      </Routes>

      {location.state?.background && (
        <Routes>
          {/* <Route
          path='/feed/:number'
          element={
            <Modal title='' onClose={}>
              <OrderInfo />
            </Modal>
          }
        /> */}

          <Route
            path='/ingredients/:id'
            element={
              <Modal title='' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          {/* <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <Modal title='' onClose={}>
                <OrderInfo />
              </Modal>
            </ProtectedRoute>
          }
        /> */}
        </Routes>
      )}
    </div>
  );
};

export default App;
