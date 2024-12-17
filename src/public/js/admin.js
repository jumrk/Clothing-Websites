let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");


if (toggle) {
    toggle.onclick = function () {
        navigation.classList.toggle("active");
        main.classList.toggle("active");
    };
}

function start() {
    deleteUser();
    deleteProduct();
}
start();

function deleteUser() {
    document.addEventListener('DOMContentLoaded', () => {
        const deleteIcons = document.querySelectorAll('.delete-user');

        deleteIcons.forEach(icon => {
            icon.addEventListener('click', async (e) => {
                const userId = e.target.getAttribute('data-id');
                const confirmDelete = confirm('Bạn có chắc chắn muốn xóa người dùng này không?');
                if (!confirmDelete) return;

                try {
                    const response = await fetch(`/admin/users/${userId}`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                    });

                    const result = await response.json();

                    if (result.success) {
                        alert('Xóa người dùng thành công!');
                        e.target.closest('tr').remove();
                    } else {
                        alert('Không thể xóa người dùng.');
                    }
                } catch (error) {
                    console.error('Lỗi khi xóa người dùng:', error);
                    alert('Đã xảy ra lỗi khi xóa người dùng.');
                }
            });
        });
    });

}
function deleteProduct() {
    document.addEventListener('DOMContentLoaded', () => {
        const deleteIcons = document.querySelectorAll('.delete-product');

        deleteIcons.forEach(icon => {
            icon.addEventListener('click', async (e) => {
                const productId = e.target.getAttribute('data-id');
                const confirmDelete = confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?');
                if (!confirmDelete) return;

                try {
                    const response = await fetch(`/admin/products/${productId}`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                    });

                    const result = await response.json();

                    if (result.success) {
                        alert('Xóa sản phẩm thành công!');
                        e.target.closest('tr').remove();
                    } else {
                        alert('Không thể xóa sản phẩm.');
                    }
                } catch (error) {
                    console.error('Lỗi khi xóa sản phẩm:', error);
                    alert('Đã xảy ra lỗi khi xóa sản phẩm.');
                }
            });
        });
    });
}
