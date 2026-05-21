var API_BASE_URL = "https://6a06dc73c83ba8ad9b3e047a.mockapi.io";
var API_BASE_URL = "https://69fc4cf1fce564e25917c4aa.mockapi.io";

var ENDPOINTS = {
    patients: API_BASE_URL + "/patients",
    medications: API_BASE_URL + "/medications",
    schedules: API_BASE_URL + "/schedules",
};

/**
 * HÀM XỬ LÝ CHUNG
 */
function handleResponse(response, errorMessage) {
    if (!response.ok) {
        throw new Error(errorMessage || "Yêu cầu thất bại");
    }
    return response.json();
}

/**
 * DỊCH VỤ QUẢN LÝ THUỐC (MEDICATIONS)
 */
var MedService = {
    // Lấy danh sách thuốc
    getAll: function () {
        return fetch(ENDPOINTS.medications)
            .then(function (res) { return handleResponse(res, "Không thể lấy danh sách thuốc"); });
    },

    // Thêm thuốc mới (POST)
    create: function (data) {
        return fetch(ENDPOINTS.medications, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then(function (res) { return handleResponse(res, "Không thể thêm thuốc"); });
    },

    // Cập nhật thuốc (PUT)
    update: function (id, data) {
        return fetch(ENDPOINTS.medications + "/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then(function (res) { return handleResponse(res, "Không thể cập nhật thuốc"); });
    },

    // Xóa thuốc (DELETE)
    delete: function (id) {
        return fetch(ENDPOINTS.medications + "/" + id, {
            method: "DELETE",
        }).then(function (res) { return handleResponse(res, "Không thể xóa thuốc"); });
    }
};

/**
 * DỊCH VỤ QUẢN LÝ BỆNH NHÂN (PATIENTS) - ĐÃ THÊM HÀM THEO YÊU CẦU
 */
var PatientService = {
    // Lấy danh sách bệnh nhân
    getAll: function () {
        return fetch(ENDPOINTS.patients)
            .then(function (res) { return handleResponse(res, "Không thể lấy danh sách bệnh nhân"); });
    },

    // Thêm bệnh nhân mới (POST) - THÊM MỚI
    create: function (data) {
        return fetch(ENDPOINTS.patients, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then(function (res) { return handleResponse(res, "Không thể thêm bệnh nhân"); });
    },

    // Cập nhật bệnh nhân (PUT) - THÊM MỚI
    update: function (id, data) {
        return fetch(ENDPOINTS.patients + "/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then(function (res) { return handleResponse(res, "Không thể cập nhật bệnh nhân"); });
    },

    // Xóa bệnh nhân (DELETE) - THÊM MỚI
    delete: function (id) {
        return fetch(ENDPOINTS.patients + "/" + id, {
            method: "DELETE",
        }).then(function (res) { return handleResponse(res, "Không thể xóa bệnh nhân"); });
    }
};

/**
 * DỊCH VỤ LỊCH TRÌNH (SCHEDULES) - Dùng cho trang người dùng
 */
var ScheduleService = {
    getAll: function () {
        return fetch(ENDPOINTS.schedules)
            .then(function (res) { return handleResponse(res, "Không thể lấy lịch trình"); });
    },

    toggleStatus: function (id, isTaken) {
        return fetch(ENDPOINTS.schedules + "/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isTaken: isTaken }),
        }).then(function (res) { return handleResponse(res, "Không thể cập nhật trạng thái"); });
    }
};

// Lưu ý: Giữ lại các hàm cũ này nếu bạn đang gọi chúng ở trang index.html cũ
function getSchedules() { return ScheduleService.getAll(); }
function toggleScheduleStatus(id, isTaken) { return ScheduleService.toggleStatus(id, isTaken); }