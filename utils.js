const Utils = {
    // Định dạng tiền tệ hoặc số (nếu cần)
    formatNumber: (num) => new Intl.NumberFormat('vi-VN').format(num),

    // Kiểm tra tính hợp lệ của Form (Validation)
    validateMedForm: (name, dosage) => {
        let errors = {};
        if (!name || name.length < 2) errors.name = "Tên thuốc tối thiểu 2 ký tự";
        if (!dosage || dosage <= 0) errors.dosage = "Liều dùng phải lớn hơn 0";
        return errors;
    },

    // Hiển thị/Ẩn loading spinner
    toggleLoading: (show) => {
        if (show) $('#loading').removeClass('d-none');
        else $('#loading').addClass('d-none');
    }
};