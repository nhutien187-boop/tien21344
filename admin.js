$(document).ready(function () {
    loadAdminMeds();

    // Xử lý sự kiện lưu thuốc
    $('#btnSave').on('click', async function () {
        const name = $('#name').val();
        const dosage = $('#dosage').val();

        // Sử dụng Utils để Validate
        const errors = Utils.validateMedForm(name, dosage);

        if (Object.keys(errors).length > 0) {
            $('#errName').text(errors.name || "").removeClass('d-none');
            $('#errDosage').text(errors.dosage || "").removeClass('d-none');
            return;
        }

        // Nếu hợp lệ thì gọi API
        await API.createMed({ name, dosage });
        $('#modalMed').modal('hide');
        loadAdminMeds();
    });
});

async function loadAdminMeds() {
    const meds = await API.getMeds();
    const tbody = $('#medTableBody');
    tbody.empty();

    meds.forEach(m => {
        tbody.append(`
            <tr>
                <td>${m.id}</td>
                <td>${m.name}</td>
                <td>${m.dosage} viên/ngày</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="handleDelete('${m.id}')">Xóa</button>
                </td>
            </tr>
        `);
    });
}

async function handleDelete(id) {
    if (confirm("Xác nhận xóa thuốc?")) {
        await API.deleteMed(id);
        loadAdminMeds();
    }
}