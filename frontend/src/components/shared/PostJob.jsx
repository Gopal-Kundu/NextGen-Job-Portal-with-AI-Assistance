import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import CompanyListPage from "./CompanyListPage";

export default function Companies() {
  return (
    <>
        <div className="h-full relative flex items-center">
          <Sidebar highlightIndex={5} className="bg-gray-500" />
          <Navbar />
        </div>
          <CompanyListPage/>
    </>
  );
}
