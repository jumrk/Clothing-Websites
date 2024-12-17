function start() {
    back()
    checkedPaymet()
    applyVoucher()
    payment()
}
start()
function checkedPaymet() {
    var boxcheck = document.getElementById('radio-checked')
    boxcheck.addEventListener('click', () => {
        boxcheck.classList.add('active')
    })
}
function back() {
    var btn = document.getElementById('back')
    btn.addEventListener('click', () => {
        Swal.fire({
            title: "Thông báo",
            text: "Bạn có muốn thoát khỏi thanh toán",
            icon: "question",
            showCancelButton: true,
            cancelButtonText: "Hủy",
            confirmButtonText: "Đồng ý",
            cancelButtonColor: "#d33"
        }).then((result) => {
            if (result.isConfirmed) {
                window.history.back()
            }
        })
    })
}
function applyVoucher() {
    document.getElementById('btn-apply-voucher').addEventListener('click', async function () {
        const codeVoucher = document.getElementById('code-voucher').value;
        const voucherMessage = document.getElementById('voucher-message');
        try {
            // Gửi mã voucher đến server
            const response = await fetch('/payment/applyVoucher', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ codeVoucher: codeVoucher })
            });
            const data = await response.json();

            if (data.success) {
                document.getElementById('total-price').textContent = `${data.newTotal}`;

                alert("Áp dụng thành công")
            } else {
                alert("Mã không hợp lệ hoặc không đủ điều kiện")
            }
        } catch (error) {
            console.error('Error applying voucher:', error);
        }
    });
}
function payment() {
    document.getElementById('btn-payment').addEventListener('click', function () {
        const address = document.getElementById('address-select')?.value;
        const phone = document.getElementById('phone')?.value;
        const paymentMethod = document.querySelector('#procedure-payment:checked') ? "COD" : null;
        const totalPrice = document.getElementById('total-price').innerHTML;
        fetch('/payment/process-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address, phone, paymentMethod, totalPrice })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    // Redirect hoặc reload trang
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2000);
                } else {
                    alert(data.message);
                }
            })
            .catch(error => console.error('Lỗi khi thanh toán:', error));
    });

}