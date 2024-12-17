function start() {
    plus_Minus()
    deleteCart()
    eventCopyVoucher()
}
start()
async function updateTotalCart() {
    const totalElement = document.getElementById('total');
    let totalAmount = 0;
    document.querySelectorAll('.information-product').forEach(product => {
        const totalPrice = parseFloat(product.querySelector('.total-price').textContent.replace('VND', '').trim());
        totalAmount += totalPrice;
    });

    totalElement.textContent = totalAmount.toFixed(3) + ' VND';
}
function plus_Minus() {
    // Tăng số lượng
    document.querySelectorAll('.Minus').forEach(button => {
        button.addEventListener('click', async () => {
            const cartId = button.dataset.cartId; // Lấy cart ID
            const response = await fetch(`/cart/decrease/${cartId}`, { method: 'PATCH' });

            if (response.ok) {
                const data = await response.json();
                button.closest('.information-product').querySelector('.quantity span').textContent = data.newQuantity;
                button.closest('.information-product').querySelector('.total-price').textContent = data.newTotal + '.000VND';

                updateTotalCart();  // Cập nhật lại tổng tiền
            }
        });
    });

    document.querySelectorAll('.Plus').forEach(button => {
        button.addEventListener('click', async () => {
            const cartId = button.dataset.cartId; // Lấy cart ID
            const response = await fetch(`/cart/increase/${cartId}`, { method: 'PATCH' });

            if (response.ok) {
                const data = await response.json();
                button.closest('.information-product').querySelector('.quantity span').textContent = data.newQuantity;
                button.closest('.information-product').querySelector('.total-price').textContent = data.newTotal + '.000VND';

                updateTotalCart();
            }
        });
    });


}
function deleteCart() {
    document.querySelectorAll('.delete_list').forEach(button => {
        button.addEventListener('click', async () => {
            const cartId = button.dataset.cartId; // Lấy cart ID
            const response = await fetch(`/cart/deleteCart/${cartId}`, { method: 'DELETE' });

            if (response.ok) {
                button.closest('.information-product').remove();
                updateTotalCart();
            }
        });
    });

}
function eventCopyVoucher() {
    document.addEventListener("DOMContentLoaded", function () {
        const copyButtons = document.querySelectorAll(".Copy");

        copyButtons.forEach(button => {
            button.addEventListener("click", function () {
                const codeVoucher = button.getAttribute("data-value");
                navigator.clipboard.writeText(codeVoucher).then(function () {
                    alert("Đã sao chép giá trị voucher: " + codeVoucher);
                }).catch(function (err) {
                    console.error("Lỗi sao chép:", err);
                    alert("Lỗi khi sao chép voucher.");
                });
            });
        });
    });

}