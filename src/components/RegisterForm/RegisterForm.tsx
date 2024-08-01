import css from './RegisterForm.module.css';
import { register } from '../../features/auth/authSlice';
import { useAppDispatch } from '../../app/hooks';

export const RegisterForm = () => {
  const dispatch = useAppDispatch();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    const form = e.currentTarget;
    dispatch(
      register({
        name: "form.elements.name.value",
        email: "form.elements.email.value",
        password: "form.elements.password.value",
      })
    );
    form.reset();
  };

  return (
    <form className={css.form} onSubmit={handleSubmit} autoComplete="off">
      <label className={css.label}>
        Username
        <input type="text" name="name" autoComplete="username" />
      </label>
      <label className={css.label}>
        Email
        <input type="email" name="email" autoComplete="email" />
      </label>
      <label className={css.label}>
        Password
        <input type="password" name="password" autoComplete="new-password" />
      </label>
      <button type="submit">Register</button>
    </form>
  );
};
