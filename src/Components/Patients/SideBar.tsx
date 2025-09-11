import React from 'react'
import { 
  IconHeartbeat,
  IconLayoutGrid,
  IconStethoscope,
  IconCalendarCheck,
  IconVaccine,
  IconMoodHeart, 
  IconUser
} from '@tabler/icons-react';
import { Avatar, Text } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const links = [
  {
    name: "Dashboard",
    url: "/Patient/dashboard",
    icon: <IconUser stroke={1.5} />
  },
  {
    name: "Profile",
    url: "/Patient/profile",
    icon: <IconUser stroke={1.5} />
  },
  {
    name: "Appointments",
    url: "/Patient/appointments",
    icon: <IconCalendarCheck stroke={1.5} />
  }
];

const SideBar = () => {
  // ✅ Redux se user data lao
  const user = useSelector((state: any) => state.user);

  return (
    <div className="flex">
      <div className="w-64"></div>
      <div className="w-64 h-screen overflow-y-auto fixed bg-dark flex flex-col gap-7 items-center">
        
        {/* Logo Section */}
        <div className="text-primary-400 flex gap-1 items-center fixed z-[500] py-3 bg-dark">
          <IconHeartbeat size={40} stroke={2.5}/>
          <span className="font-heading font-semibold text-3xl">pulse</span>
        </div>

        {/* User Section */}
        <div className="flex flex-col gap-7 mt-20">
          <div className="flex flex-col gap-1 items-center">
            <div className="p-1 bg-white rounded-full drop-shadow-xl">
              <Avatar 
                variant="filled" 
                src="/tabrez_logo.jpg" // 👈 optionally replace with user.profilePic
                size="xl" 
                alt="profile pic" 
              />
            </div>
            <span className="font-md text-light">
              {user?.name || "Guest"}
            </span>
            <Text c="dimmed" size="xs" className="text-light">
              {user?.role || "User"}
            </Text>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-2">
            {links.map((item) => (
              <NavLink
                to={item.url}
                key={item.name}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-4 p-3 w-full font-medium rounded-lg text-light ${
                    isActive ? "bg-primary-300 text-dark" : "hover:bg-primary-900"
                  }`
                }
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideBar;

