import { ActionIcon } from "@mantine/core";
import { IconBellRinging, IconLayoutSidebarRightCollapse } from "@tabler/icons-react";
import ProfileMenu from "./ProfileMenu";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearJwt } from "../../Slices/JwtSlice";
import { logoutUser } from "../../Slices/UserSlice"; // ✅ import user slice logout

const Header = () => {
  const jwt = useSelector((state: any) => state.jwt);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // ✅ Reset Redux states
    dispatch(clearJwt());
    dispatch(logoutUser());

    // ✅ Remove token from localStorage (safety)
    localStorage.removeItem("token");

    console.log("User logged out");

    // ✅ Redirect to login
    navigate("/login");
  };

  return (
    <div className="w-full bg-light shadow-lg h-16 flex justify-between px-5 items-center">
      {/* Sidebar Toggle Button */}
      <ActionIcon variant="transparent" size="xl" aria-label="Toggle Sidebar">
        <IconLayoutSidebarRightCollapse
          style={{ width: "90%", height: "90%" }}
          stroke={1.5}
        />
      </ActionIcon>

      {/* Right Section */}
      <div className="flex gap-5 items-center">
        {jwt ? (
          <button
            onClick={handleLogout}
            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            LOGIN
          </Link>
        )}

        <ActionIcon variant="transparent" size="md" aria-label="Notifications">
          <IconBellRinging style={{ width: "90%", height: "90%" }} stroke={2} />
        </ActionIcon>

        {/* Profile Menu with User info */}
        <ProfileMenu />
      </div>
    </div>
  );
};

export default Header;


