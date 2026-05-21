$(document).ready(function () {
    renderHomeSchedules();
});

async function renderHomeSchedules() {
    Utils.toggleLoading(true);
    try {
        const schedules = await API.getSchedules();
        const container = $('#listSchedules');
        container.empty();

        schedules.forEach(item => {
            const statusClass = item.isTaken ? 'is-taken' : '';
            const btnText = item.isTaken ? 'Đã uống' : 'Chưa uống';
            
            container.append(`
                <div class="col-md-4 mb-3">
                    <div class="card h-100 ${statusClass}">
                        <div class="card-body">
                            <h5 class="card-title">💊 ${item.medName}</h5>
                            <p class="card-text">Thời gian: <strong>${item.time}</strong></p>
                            <button class="btn btn-sm btn-primary" onclick="changeStatus('${item.id}', ${item.isTaken})">
                                ${btnText}
                            </button>
                        </div>
                    </div>
                </div>
            `);
        });
    } catch (err) {
        alert("Không thể tải lịch!");
    } finally {
        Utils.toggleLoading(false);
    }
}

async function changeStatus(id, currentStatus) {
    await API.updateSchedule(id, { isTaken: !currentStatus });
    renderHomeSchedules();
}