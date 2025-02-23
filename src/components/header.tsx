import { useState } from "react";
import { FaSearch, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { LuLogIn } from "react-icons/lu";
import { Link } from "react-router-dom";

const user = { id: "asd", role: "" };

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const logoutHandler = () => {};

  return (
    <nav className="header">
      <Link onClick={() => setIsOpen(false)} to={"/"}>
        Home
      </Link>

      <Link onClick={() => setIsOpen(false)} to={"/search"}>
        <FaSearch />
      </Link>

      <Link onClick={() => setIsOpen(false)} to={"/cart"}>
        <FaShoppingCart />
      </Link>

      {user?.id ? (
        <>
          <button onClick={() => setIsOpen((prev) => !prev)}>
            <FaUser />
          </button>

          <dialog open={isOpen}>
            <div>
              {user.role === "admin" && (
                <Link onClick={() => setIsOpen(false)} to={"/admin/dashboard"}>
                  Admin
                </Link>
              )}

              <Link onClick={() => setIsOpen(false)} to={"/orders"}>
                Order
              </Link>

              <button onClick={logoutHandler}>
                <FaSignOutAlt />
              </button>
            </div>
          </dialog>
        </>
      ) : (
        <Link to={"/login"}>
          <LuLogIn />
        </Link>
      )}
    </nav>
  );
};

export default Header;
