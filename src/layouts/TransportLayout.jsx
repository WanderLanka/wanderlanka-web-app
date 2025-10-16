import { Outlet } from "react-router-dom";
import TransportNavbar from "../components/transport/TransportNavBar.jsx";

const TransportLayout = () => {
  return (
    <div>
      <TransportNavbar />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default TransportLayout;
