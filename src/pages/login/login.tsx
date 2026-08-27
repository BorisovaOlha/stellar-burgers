import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { AppDispatch } from 'src/services/store';
import {
  errorSelector,
  loginUser,
  authenticatedSelector,
  clearError
} from '../../slices/userSlice';
import { TLoginData, TRegisterData } from '@api';
import { Navigate } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(authenticatedSelector);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const userData: TLoginData = {
      email: email,
      password: password
    };

    dispatch(loginUser(userData));
  };

  const error = useSelector(errorSelector);

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
