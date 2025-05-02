import { Link, useLocation } from "wouter";

export default function Sidebar() {
  const [location] = useLocation();
  
  const closeSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    
    if (sidebar && backdrop) {
      sidebar.classList.add("hidden");
      backdrop.classList.add("hidden");
    }
  };
  
  // Check if current path matches the link
  const isActive = (path: string) => {
    return location === path || (path !== "/" && location.startsWith(path));
  };

  return (
    <>
      <aside id="sidebar" className="fixed hidden z-20 h-full top-0 left-0 pt-16 flex lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75" aria-label="Sidebar">
        <div className="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex-1 px-3 bg-white divide-y space-y-1">
              <ul className="space-y-2 pb-2">
                <li>
                  <Link 
                    href="/" 
                    className={`text-base ${isActive("/") ? "bg-gray-100" : ""} text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group`}
                    onClick={() => closeSidebar()}
                  >
                    <i className="fas fa-home text-gray-500 mr-3"></i>
                    <span className="ml-3">Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/posts" 
                    className={`text-base ${isActive("/posts") ? "bg-gray-100" : ""} text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group`}
                    onClick={() => closeSidebar()}
                  >
                    <i className="fas fa-pen-to-square text-gray-500 mr-3"></i>
                    <span className="ml-3">Posts</span>
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                    <i className="fas fa-comment text-gray-500 mr-3"></i>
                    <span className="ml-3">Comments</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                    <i className="fas fa-tag text-gray-500 mr-3"></i>
                    <span className="ml-3">Categories</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                    <i className="fas fa-user text-gray-500 mr-3"></i>
                    <span className="ml-3">Users</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                    <i className="fas fa-gear text-gray-500 mr-3"></i>
                    <span className="ml-3">Settings</span>
                  </a>
                </li>
              </ul>
              <div className="space-y-2 pt-2">
                <a href="#" className="text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 group transition duration-75 flex items-center p-2">
                  <i className="fas fa-right-from-bracket text-gray-500 mr-3"></i>
                  <span className="ml-3">Logout</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      <div 
        className="bg-gray-900 opacity-50 hidden fixed inset-0 z-10" 
        id="sidebarBackdrop"
        onClick={() => closeSidebar()}
      ></div>
    </>
  );
}
