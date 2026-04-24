let users = []; // Mảng tạm thời lưu trữ user

export async function POST(request) {
  const body = await request.json();
  const { email, password, name } = body;

  // Kiểm tra dữ liệu đầu vào (Validation)
  if (!email || !password) {
    return new Response(JSON.stringify({ message: "Thiếu email hoặc mật khẩu" }), { status: 400 });
  }

  // Kiểm tra trùng lặp
  const userExists = users.find(u => u.email === email);
  if (userExists) {
    return new Response(JSON.stringify({ message: "Email đã tồn tại" }), { status: 400 });
  }

  const newUser = { id: Date.now(), email, password, name };
  users.push(newUser);

  return new Response(JSON.stringify({ message: "Đăng ký thành công!", user: { email, name } }), { status: 201 });
}