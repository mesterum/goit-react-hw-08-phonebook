import css from './UserMenu.module.css';
import { useAuth } from '../../features/auth/authSlice';
import { Form } from 'react-router-dom';

export const UserMenu = () => {
  const { user, isRefreshing: isLoggingOut } = useAuth();

  if (!user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div className={css.wrapper}>
      <p className={css.username}>Welcome, {user.name}</p>
      <Form method="post" action="/logout">
        <button type="submit" disabled={isLoggingOut}>
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </Form>
    </div>
  );
};
