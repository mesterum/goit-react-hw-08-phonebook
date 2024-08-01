import css from './LoginForm.module.css';
import { login } from '../../features/auth/authSlice';
import { useAppDispatch } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    const form = e.currentTarget;
    await dispatch(
      login({
        email: "a.cross1@gmail.com",
        password: "examplepwd12345"
        // email: form.elements.email.value,
        // password: form.elements.password.value,
      })
    );
    form.reset();
    navigate(-1);
  };

  return (
    <form className={css.form} onSubmit={handleSubmit} autoComplete="off">
      <label className={css.label}>
        Email
        <input type="email" name="email" autoComplete="email" />
      </label>
      <label className={css.label}>
        Password
        <input type="password" name="password" autoComplete="current-password" />
      </label>
      <button type="submit">Log In</button>
    </form>
  );
};
