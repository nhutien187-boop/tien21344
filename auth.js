// Hệ thống xác thực
function getStoredUsers() {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Tạo admin mặc định nếu chưa có
    if (users.length === 0) {
        users.push({
            id: 'admin_default',
            name: 'Admin',
            email: 'admin@medreminder.com',
            password: 'Admin123'
        });
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    return users;
}

function registerUser(data) {
    const { name, email, password } = data;
    const users = getStoredUsers();
    
    // Kiểm tra email đã tồn tại
    if (users.find(u => u.email === email)) {
        return { success: false, message: 'Email đã được đăng ký!' };
    }
    
    const newUser = {
        id: 'user_' + Date.now(),
        name,
        email,
        password
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true, message: 'Đăng ký thành công!' };
}

function loginUser(email, password) {
    const users = getStoredUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return { success: false, message: 'Email hoặc mật khẩu sai!' };
    }
    
    setCurrentUser(user);
    return { success: true, message: 'Đăng nhập thành công!' };
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function logout() {
    localStorage.removeItem('currentUser');
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.email === 'admin@medreminder.com';
}

function requireAuth(redirectUrl) {
    if (!getCurrentUser()) {
        window.location.href = redirectUrl || 'login.html';
    }
}

function requireAdmin(redirectUrl) {
    if (!isAdmin()) {
        window.location.href = redirectUrl || 'login.html';
    }
}
