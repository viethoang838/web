"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (data.success) {
      alert("Đăng ký thành công! Hãy đăng nhập.");
      router.push('/login');
    } else {
      alert(data.message || "Lỗi đăng ký!");
    }
  };

  return (
    // Gom tất cả vào một thẻ div duy nhất và thêm marginTop
    <div className="container py-5" style={{ marginTop: '50px', minHeight: '80vh' }}>
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">ĐĂNG KÝ ACADEMY</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Họ và tên</label>
              <input 
                type="text" 
                placeholder="Nguyễn Văn A" 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="email@example.com" 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Địa chỉ</label>
              <input 
                type="text" 
                placeholder="Số nhà, tên đường..." 
                onChange={(e) => setFormData({...formData, address: e.target.value})} 
                required 
              />
            </div>
            <button type="submit" className="btn-auth-primary">TẠO TÀI KHOẢN</button>
          </form>
          <p className="auth-footer">Đã có tài khoản? <Link href="/login" style={{ color: '#ff9800', fontWeight: 'bold' }}>Đăng nhập</Link></p>
        </div>
      </div>
    </div>
  );
}