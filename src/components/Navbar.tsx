
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Users, ClipboardList, LogOut } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { title: "Inicio", icon: <Home size={20} />, path: "/dashboard" },
    { title: "Clientes", icon: <Users size={20} />, path: "/clients" },
    { title: "Visitas", icon: <ClipboardList size={20} />, path: "/visit" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-gray-light shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="relative flex flex-col items-center justify-center w-full h-full"
          >
            <motion.div
              className={`flex flex-col items-center justify-center ${
                isActive(item.path)
                  ? "text-brand-yellow"
                  : "text-brand-gray"
              }`}
              whileTap={{ scale: 0.9 }}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.title}</span>
              {isActive(item.path) && (
                <motion.div
                  className="absolute -top-0.5 w-1/2 h-0.5 bg-brand-yellow rounded-full"
                  layoutId="navIndicator"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </motion.div>
          </Link>
        ))}
        <Link
          to="/"
          className="flex flex-col items-center justify-center w-full h-full text-brand-gray"
        >
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <LogOut size={20} />
            <span className="text-xs mt-1">Salir</span>
          </motion.div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
