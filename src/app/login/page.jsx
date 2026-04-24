"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        document.cookie = `user=${JSON.stringify(data.user)}; path=/; max-age=86400`;

        alert("ĐĂNG NHẬP THÀNH CÔNG!");

        if (data.user.role === 1) {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
        
      } else {
        alert(data.message || "SAI TÀI KHOẢN HOẶC MẬT KHẨU!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("HỆ THỐNG ĐANG GẶP SỰ CỐ KẾT NỐI!");
    }
  };

  return (
    // THÊM THẺ DIV BAO NGOÀI NÀY ĐỂ NE' HEADER
    <div className="container py-5" style={{ marginTop: '50px', minHeight: '80vh' }}>
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">ĐĂNG NHẬP</h2>
          <p className="auth-subtitle">Chào mừng bạn quay trở lại Academy Shop</p>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email của bạn</label>
              <input 
                type="email" 
                className="input-field"
                placeholder="name@example.com" 
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Mật khẩu</label>
              <input 
                type="password" 
                className="input-field"
                placeholder="••••••••" 
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className="btn-auth-primary">ĐĂNG NHẬP NGAY</button>
          </form>

          <div className="auth-footer">
            <span>Chưa có tài khoản? </span>
            <Link href="/register" style={{ color: '#ff9800', fontWeight: 'bold' }}>Đăng ký tại đây</Link>
          </div>
        </div>
      </div>
    </div>
  );
}