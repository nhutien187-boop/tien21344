const AUTH_USERS_KEY = "medreminder_users";
const AUTH_CURRENT_KEY = "medreminder_current_user";

const DEFAULT_AUTH_USERS = [
    {
        fullName: "Quản trị viên",
        email: "admin@medreminder.com",
        password: "Admin@123"
    }
];

function getAuthUsers() {
    const raw = localStorage.getItem(AUTH_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveAuthUsers(users) {
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function ensureDefaultUsers() {
    const users = getAuthUsers();
    const adminExists = users.some(u => u.email === DEFAULT_AUTH_USERS[0].email);
    if (!adminExists) {
        users.push(DEFAULT_AUTH_USERS[0]);
        saveAuthUsers(users);
    }
}

function findUserByEmail(email) {
    return getAuthUsers().find(user => user.email.toLowerCase() === email.toLowerCase());
}

function registerAuthUser({ fullName, email, password }) {
    const errors = {};
    if (!fullName || fullName.trim().length < 2) {
        errors.fullName = "Tên phải ít nhất 2 ký tự.";
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Email không hợp lệ.";
    }
    if (!password || password.length < 6) {
        errors.password = "Mật khẩu tối thiểu 6 ký tự.";
    }
    if (findUserByEmail(email)) {
        errors.email = "Email này đã tồn tại.";
    }
    if (Object.keys(errors).length > 0) {
        return { success: false, errors };
    }

    const users = getAuthUsers();
    users.push({ fullName: fullName.trim(), email: email.toLowerCase(), password });
    saveAuthUsers(users);
    return { success: true };
}

function loginAuthUser(email, password) {
    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
        return { success: false, message: "Email hoặc mật khẩu không đúng." };
    }

    setCurrentUser(user);
    return { success: true, user };
}

function setCurrentUser(user) {
    const safeUser = {
        fullName: user.fullName,
        email: user.email
    };
    localStorage.setItem(AUTH_CURRENT_KEY, JSON.stringify(safeUser));
}

function getCurrentUser() {
    const raw = localStorage.getItem(AUTH_CURRENT_KEY);
    return raw ? JSON.parse(raw) : null;
}

function clearCurrentUser() {
    localStorage.removeItem(AUTH_CURRENT_KEY);
}

function requireAuth(redirectPage = 'login.html') {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = redirectPage;
        return null;
    }
    return user;
}

function requireAdmin() {
    const user = requireAuth();
    if (user && user.email.toLowerCase() !== DEFAULT_AUTH_USERS[0].email) {
        window.location.href = 'index.html';
        return null;
    }
    return user;
}

function logout() {
    clearCurrentUser();
    window.location.href = 'login.html';
}

function redirectIfAuthenticated() {
    const user = getCurrentUser();
    if (!user) return;

    const target = user.email.toLowerCase() === DEFAULT_AUTH_USERS[0].email ? 'admin.html' : 'index.html';
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'login.html' || currentPage === 'register.html') {
        window.location.href = target;
    }
}

function showFormError(selector, message) {
    const target = $(selector);
    if (target.length) {
        target.text(message).removeClass('d-none');
    }
}

function clearFormErrors() {
    $('.form-text.text-danger').text('').addClass('d-none');
    $('.alert').remove();
}

$(document).ready(function () {
    ensureDefaultUsers();

    if ($('#loginForm').length || $('#registerForm').length) {
        redirectIfAuthenticated();
    }

    if ($('#loginForm').length) {
        $('#loginForm').submit(function (event) {
            event.preventDefault();
            clearFormErrors();

            const email = $('#loginEmail').val().trim();
            const password = $('#loginPassword').val().trim();

            if (!email) {
                showFormError('#loginEmailError', 'Vui lòng nhập email.');
                return;
            }
            if (!password) {
                showFormError('#loginPasswordError', 'Vui lòng nhập mật khẩu.');
                return;
            }

            const result = loginAuthUser(email, password);
            if (!result.success) {
                $('#loginForm').prepend(`<div class="alert alert-danger">${result.message}</div>`);
                return;
            }

            const redirect = result.user.email.toLowerCase() === 'admin@medreminder.com' ? 'admin.html' : 'index.html';
            window.location.href = redirect;
        });
    }

    if ($('#registerForm').length) {
        $('#registerForm').submit(function (event) {
            event.preventDefault();
            clearFormErrors();

            const fullName = $('#registerName').val().trim();
            const email = $('#registerEmail').val().trim();
            const password = $('#registerPassword').val().trim();
            const confirmPassword = $('#registerConfirmPassword').val().trim();

            if (password !== confirmPassword) {
                showFormError('#registerConfirmPasswordError', 'Mật khẩu xác nhận không khớp.');
                return;
            }

            const result = registerAuthUser({ fullName, email, password });
            if (!result.success) {
                Object.keys(result.errors).forEach(key => {
                    showFormError('#register' + key.charAt(0).toUpperCase() + key.slice(1) + 'Error', result.errors[key]);
                });
                return;
            }

            $('#registerForm').prepend('<div class="alert alert-success">Đăng ký thành công. Chuyển sang trang đăng nhập...</div>');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1200);
        });
    }
});
