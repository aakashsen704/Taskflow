import Sidebar from "./Sidebar/Sidebar.jsx";
import Navbar from "./Navbar/Navbar.jsx";

export default function Layout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar title={title} subtitle={subtitle} />
        <main className="flex-1 px-6 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
