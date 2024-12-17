function start() {
    deleteOrder()
};
start();

function deleteOrder() {
    document.getElementById('btn-delete').addEventListener('click', async function () {
        const orderId = this.getAttribute('data-order-id');

        const confirmCancel = confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?");
        if (!confirmCancel) {
            return;
        }
        try {
            const response = await fetch(`/orderDetail/cancel/${orderId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            if (result.success) {
                alert("Đơn hàng đã được hủy thành công.");
                window.location.href = '/user';
            } else {
                alert(result.message); // Thông báo lỗi từ server
            }
        } catch (error) {
            console.error("Lỗi khi hủy đơn hàng:", error);
            alert("Đã xảy ra lỗi khi xử lý yêu cầu.");
        }
    });

}