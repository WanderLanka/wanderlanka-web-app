import { Outlet } from "react-router-dom";
import TravelerNavbar from "../components/traveler/TravelerNavBar.jsx";

const TravelerLayout = () => {
  return (
    <div>
      <TravelerNavbar />
      <main className="p-2">
        <Outlet />
      </main>
    </div>
  );
};

export default TravelerLayout;