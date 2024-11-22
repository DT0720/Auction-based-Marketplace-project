// src/interfaces/modules/routing/Navigation.tsx
import Link from "next/link";
import { ROUTES } from "./routes";

export const Navigation = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-100 shadow">
      <div className="text-lg font-bold">MyApp</div>
      <ul className="flex space-x-4">
        <li>
          <Link href={ROUTES.HOME}>Home</Link>
        </li>
        <li>
          <Link href={ROUTES.SIGNUP}>Sign Up</Link>
        </li>
        <li>
          <Link href={ROUTES.LOGIN}>Login</Link>
        </li>
        <li>
          <Link href={ROUTES.BUYER_DASHBOARD}>Dashboard</Link>
        </li>
      </ul>
    </nav>
  );
};
