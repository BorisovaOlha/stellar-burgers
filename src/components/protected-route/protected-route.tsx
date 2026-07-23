import { ReactNode } from 'react';

type ProtectedRouteProps = {
  children: ReactNode;
};

// TODO: поменять логику функции: если нет пользователя, перенаправляем его на страницу логина
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => children;
