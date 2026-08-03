import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/services/store';
import {
  userDataSelector,
  errorSelector,
  loginUser,
  authenticatedSelector
} from '../../slices/userSlice';
import { TLoginData, TRegisterData } from '@api';
import { Navigate } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(authenticatedSelector);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const userData: TLoginData = {
      email: email,
      password: password
    };

    dispatch(loginUser(userData));
  };

  if (isAuthenticated) {
    return <Navigate to={'/'} />;
  }

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
