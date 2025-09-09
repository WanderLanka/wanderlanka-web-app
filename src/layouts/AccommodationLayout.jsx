import { Outlet } from "react-router-dom";
import AccommodationNavbar from "../components/accommodation/AccommodationNavBar.jsx";

const AccommodationLayout = () => {
  return (
    <div>
      <AccommodationNavbar />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AccommodationLayout;