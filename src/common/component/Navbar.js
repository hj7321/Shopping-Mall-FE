import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faBox,
  faSearch,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/user/userSlice";
import clsx from "clsx";
import { CATEGORY } from "../../constants/product.constants";

const Navbar = () => {
  const [query] = useSearchParams();
  const currentCategory = query.get("category") || "ALL";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { cartItemCount } = useSelector((state) => state.cart);

  // 드로어 & 검색
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const inputRef = useRef(null);

  const handleCategoryClick = (category) => {
    const params = new URLSearchParams(query);
    if (category === "ALL") params.delete("category");
    else params.set("category", category);
    params.set("page", 1);
    navigate(`/?${params.toString().toLowerCase()}`);
    setMenuOpen(false);
  };

  const submitSearch = () => {
    const q = keyword.trim();
    navigate(q ? `?name=${q}` : "/");
    setSearchOpen(false);
  };

  const onKeyDownMobile = (e) => {
    if (e.key === "Enter") submitSearch();
    if (e.key === "Escape") setSearchOpen(false);
  };

  const onKeyDownDesktop = (e) => {
    if (e.key === "Enter") {
      const q = e.target.value.trim();
      navigate(q ? `?name=${q}` : "/");
    }
  };

  const handleLogout = () => dispatch(logout());

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 0);
  }, [searchOpen]);

  return (
    <div>
      {menuOpen && (
        <div
          className="fixed inset-0 z-[9998] bg-black/30 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div
        className={clsx(
          "fixed top-0 left-0 z-[9999] h-screen w-[240px] bg-white shadow-lg",
          "transform transition-transform duration-300 ease-in-out lg:hidden",
          menuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button className="p-4 text-2xl" onClick={() => setMenuOpen(false)}>
          &times;
        </button>

        <div className="px-4 flex flex-col gap-[12px] text-[14px]">
          {user ? (
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="pr-2 rounded hover:bg-gray-50 flex items-center gap-2 text-left"
            >
              <FontAwesomeIcon icon={faUser} />
              <span>로그아웃</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/login");
              }}
              className="pr-2 rounded hover:bg-gray-50 flex items-center gap-2 text-left"
            >
              <FontAwesomeIcon icon={faUser} />
              <span>로그인</span>
            </button>
          )}

          <button
            onClick={() => {
              setMenuOpen(false);
              navigate("/cart");
            }}
            className="pr-2 rounded hover:bg-gray-50 flex items-center gap-2 text-left"
          >
            <FontAwesomeIcon icon={faShoppingBag} />
            <span>{`쇼핑백 (${cartItemCount || 0})`}</span>
          </button>

          <button
            onClick={() => {
              setMenuOpen(false);
              navigate("/account/purchase");
            }}
            className="pr-2 rounded hover:bg-gray-50 flex items-center gap-2 text-left"
          >
            <FontAwesomeIcon icon={faBox} />
            <span>내 주문</span>
          </button>
        </div>

        <hr className="my-3 border-0 border-t-[0.5px] border-t-[#a6a6a6]" />

        <div className="px-4 flex flex-col gap-[16px]">
          <button
            onClick={() => handleCategoryClick("ALL")}
            className={clsx(
              "text-left",
              currentCategory === "ALL"
                ? "font-suit-900"
                : "hover:font-suit-800"
            )}
          >
            ALL
          </button>
          {CATEGORY.map((menu) => (
            <button
              key={menu}
              onClick={() => handleCategoryClick(menu)}
              className={clsx(
                "text-left",
                currentCategory.toLowerCase() === menu.toLowerCase()
                  ? "font-suit-900"
                  : "hover:font-suit-800"
              )}
            >
              {menu}
            </button>
          ))}
        </div>
      </div>

      {user && user.level === "admin" && (
        <Link
          to="/admin/product?page=1"
          className="flex justify-end text-[12px] md:text-[14px] mr-[10px]"
        >
          Admin page
        </Link>
      )}

      {/* === 상단 헤더 === */}
      <div className="flex justify-between items-center mr-[10px] mt-[10px]">
        {/* 햄버거: lg 미만에서 보임 (md 포함) */}
        <div className="burger-menu lg:hidden">
          <FontAwesomeIcon icon={faBars} onClick={() => setMenuOpen(true)} />
        </div>

        {/* 오른쪽 영역 */}
        <div className="flex items-center justify-end w-full gap-3 ">
          {/* 아이콘 그룹: lg 이상에서만 헤더에 표시 */}
          <div className="hidden lg:flex items-center gap-[16px] flex-shrink-0">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-[6px]"
              >
                <FontAwesomeIcon icon={faUser} />
                <span className="hidden xl:inline cursor-pointer">
                  로그아웃
                </span>
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-[6px]"
              >
                <FontAwesomeIcon icon={faUser} />
                <span className="hidden xl:inline cursor-pointer">로그인</span>
              </button>
            )}
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center gap-[6px]"
            >
              <FontAwesomeIcon icon={faShoppingBag} />
              <span className="hidden xl:inline cursor-pointer">{`쇼핑백(${
                cartItemCount || 0
              })`}</span>
            </button>
            <button
              onClick={() => navigate("/account/purchase")}
              className="flex items-center gap-[6px]"
            >
              <FontAwesomeIcon icon={faBox} />
              <span className="hidden xl:inline cursor-pointer">내 주문</span>
            </button>
          </div>

          {/* 축소 검색 + 토글: lg 미만에서 보임 (md 포함) */}
          <div className="flex items-center gap-2 lg:hidden">
            <div
              className={clsx(
                "overflow-hidden h-8 flex items-center",
                "transition-[width] duration-200 ease-in-out",
                searchOpen ? "w-[250px]" : "w-0"
              )}
            >
              <div className="flex items-center gap-2 border rounded px-2 w-full h-full bg-white">
                <input
                  ref={inputRef}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={onKeyDownMobile}
                  placeholder="제품 검색"
                  className="outline-none border-0 w-full text-sm bg-transparent"
                  tabIndex={searchOpen ? 0 : -1}
                />
              </div>
            </div>
            <button
              aria-expanded={searchOpen}
              className=" flex-shrink-0 lg:hidden"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>
      </div>

      {/* === 로고 === */}
      <div className="relative flex justify-center mb-[80px] mt-[10px] md:mt-[0px]">
        <Link
          to="/"
          className="z-[5000] absolute top-[0px] no-underline text-inherit hover:text-inherit font-suit-800 text-[40px] md:text-[50px] hover:scale-105 transition-all duration-500 transform"
        >
          Wearly
        </Link>
      </div>

      {/* === 하단 메뉴 + 데스크톱 검색 === */}
      <div className="nav-menu-area relative">
        <ul className="menu">
          <li>
            <button
              onClick={() => handleCategoryClick("ALL")}
              className={clsx(
                currentCategory === "ALL"
                  ? "font-suit-900"
                  : "hover:font-suit-800"
              )}
            >
              ALL
            </button>
          </li>
          {CATEGORY.map((menu) => (
            <li key={menu}>
              <button
                onClick={() => handleCategoryClick(menu)}
                className={clsx(
                  currentCategory.toLowerCase() === menu.toLowerCase()
                    ? "font-suit-900"
                    : "hover:font-suit-800"
                )}
              >
                {menu}
              </button>
            </li>
          ))}
        </ul>

        {/* 데스크톱 검색: lg 이상에서만 보임 */}
        <div className="hidden lg:flex items-center absolute right-[20px] mt-[16px]">
          <div className="flex items-center gap-2 border rounded px-2 h-8 bg-white">
            <FontAwesomeIcon icon={faSearch} className="opacity-70" />
            <input
              type="text"
              placeholder="제품 검색"
              onKeyDown={onKeyDownDesktop}
              className="outline-none border-0 w-[250px] text-sm bg-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
