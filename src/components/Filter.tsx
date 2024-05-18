import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectFilter, setFilterA } from "../features/phoneBook/filterSlice";

export default function Filter() {
  const filter = useAppSelector(selectFilter);
  const dispatch = useAppDispatch();
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilterA(e.target.value));
  }, [dispatch]);

  return (
    <label>
      Find contacts by name<br />
      <input value={filter} onChange={handleChange} id="search" />
    </label>
  )
}
