"use client";
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) setUser(currentUser);
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();
    // Cập nhật lại trong LocalStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    alert('Cập nhật thông tin thành công!');
  };

  return (
    <div className="max-w-4xl mx-auto p-12">
      <h1 className="text-3xl font-bold mb-8">Thông tin cá nhân</h1>
      <div className="bg-white p-8 rounded-2xl shadow-sm border">
        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
            <input 
              type="text" value={user.name} 
              className="w-full px-4 py-3 border rounded-xl outline-none"
              onChange={(e) => setUser({...user, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" value={user.email} disabled
              className="w-full px-4 py-3 border rounded-xl bg-gray-50 cursor-not-allowed"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
            <input 
              type="password" value={user.password}
              className="w-full px-4 py-3 border rounded-xl outline-none"
              onChange={(e) => setUser({...user, password: e.target.value})}
            />
          </div>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition w-fit">
            Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  );
}