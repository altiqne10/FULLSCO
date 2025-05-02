import { Link } from "wouter";

export default function Navbar() {
  const toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    
    if (sidebar && backdrop) {
      sidebar.classList.toggle("hidden");
      backdrop.classList.toggle("hidden");
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button 
              id="toggleSidebarMobile" 
              aria-expanded="true" 
              aria-controls="sidebar" 
              className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded"
              onClick={toggleSidebar}
            >
              <i className="fas fa-bars"></i>
            </button>
            <Link href="/" className="text-xl font-bold flex items-center lg:ml-2.5">
              <span className="text-primary-600">Blog</span><span className="font-light">Admin</span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="hidden lg:flex items-center">
              <span className="text-base font-normal text-gray-500 mr-5">Welcome, Admin</span>
            </div>
            <Link href="/posts/new" className="hidden sm:inline-flex ml-5 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center mr-3">
              <i className="fas fa-plus mr-2"></i> New Post
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
