import { Outlet } from "react-router-dom";
import TransportNavbar from "./TransportNavbar.jsx";

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
