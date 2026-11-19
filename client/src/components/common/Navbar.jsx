
import { Link } from "react-router-dom";
import { Droplet } from "lucide-react";

function Navbar() {
  return (

    <nav className="flex items-center justify-between px-14 py-3 bg-gray-50 shadow-sm">

      <Link to="/" className="flex items-center gap-3">
        <Droplet className="text-red-600" size={36} />
        <h1 className="text-3xl font-bold text-slate-800">
          Globin<span className="text-red-600">Plus</span>
        </h1>
      </Link>

      <div className="flex items-center gap-12 text-lg text-slate-600 font-medium">
        <Link to="/profile" className="hover:text-red-600 transition">
          Profile
        </Link>

        <Link to="/about" className="hover:text-red-600 transition">
          About Us
        </Link>

        <Link to="/contact" className="hover:text-red-600 transition">
          Contact Us
        </Link>
      </div>

      <Link
        to="/login"
        className="bg-red-600 text-white px-6 py-1 text-lg rounded-xl hover:bg-red-700 transition"
      >
        Login
      </Link>

    </nav>

  );
}

export default Navbar;
