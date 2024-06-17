import css from './UserMenu.module.css';
import { useAuth } from '../../features/auth/authSlice';
import { useFetcher } from 'react-router-dom';

export const UserMenu = () => {
  const { user } = useAuth();
  const fetcher = useFetcher();

  if (!user) {
    return <p>You are not logged in.</p>;
  }

  const isLoggingOut = fetcher.formData != null;

  return (
    <div className={css.wrapper}>
      <p className={css.username}>Welcome, {user.name}</p>
      <fetcher.Form method="post" action="/logout">
        <button type="submit" disabled={isLoggingOut}>
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </fetcher.Form>
    </div>
  );
};
