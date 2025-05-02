import { useQuery } from '@tanstack/react-query';
import { Mail, Trash2, Search } from 'lucide-react';
import { useState } from 'react';

const AdminSubscribers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch subscribers
  const { data: subscribers, isLoading } = useQuery({
    queryKey: ['/api/subscribers'],
  });

  // Filter subscribers
  const filteredSubscribers = Array.isArray(subscribers) 
    ? subscribers.filter(subscriber => 
        subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b bg-white shadow-sm py-4 px-6">
        <h1 className="text-2xl font-bold">إدارة المشتركين في النشرة البريدية</h1>
      </header>
      
      <main className="flex-1 p-6">
        {/* Search and Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="بحث عن مشترك..."
              className="w-full border rounded-md py-2 px-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              تصدير CSV
            </button>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
              <p className="mt-4">جاري تحميل البيانات...</p>
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="p-8 text-center">
              <Mail className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">لا يوجد مشتركين في النشرة البريدية</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">البريد الإلكتروني</th>
                    <th className="px-6 py-3">تاريخ الاشتراك</th>
                    <th className="px-6 py-3">الحالة</th>
                    <th className="px-6 py-3">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscribers.map((subscriber, index) => (
                    <tr key={subscriber.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4">{subscriber.email}</td>
                      <td className="px-6 py-4">
                        {new Date(subscriber.createdAt).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                          نشط
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">إجمالي المشتركين</p>
                <p className="text-2xl font-bold">{Array.isArray(subscribers) ? subscribers.length : 0}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">معدل النمو</p>
                <p className="text-2xl font-bold">+5%</p>
              </div>
              <div className="bg-green-50 p-3 rounded-full">
                <div className="h-6 w-6 text-green-600 flex items-center justify-center">↗</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">معدل الفتح</p>
                <p className="text-2xl font-bold">65%</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-full">
                <Mail className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSubscribers;