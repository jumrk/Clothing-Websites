function start() {
    viewInformationAddress()
    add_address()
    form_edit_user()
    edit_address()
}
start()
function viewInformationAddress() {
    var information = document.getElementById('information-user')
    var address = document.getElementById('address-user')
    var viewInformation = document.getElementById('view-information')
    var viewAddress = document.getElementById('view-address')
    information.addEventListener('click', () => {
        viewInformation.style.transform = 'translateX(0)'
        viewInformation.style.opacity = '1'
        viewAddress.style.transform = 'translateX(100%)'
        viewAddress.style.opacity = '0'
    })
    address.addEventListener('click', () => {
        viewAddress.style.transform = 'translateX(0)'
        viewAddress.style.opacity = '1'
        viewInformation.style.transform = 'translateX(100%)'
        viewInformation.style.opacity = '0'
    })
}
function show_form(id_btn_show, id_form, id_btn_close) {
    var btn_show_form = document.getElementById(id_btn_show)
    var form = document.getElementById(id_form)
    btn_show_form.addEventListener('click', () => {
        var close_form = document.getElementById(id_btn_close)
        form.style.transform = 'TranslateY(0)'
        close_form.addEventListener('click', () => {
            form.style.transform = 'TranslateY(-200%)'
        })
    })
}
function form_edit_user() {
    show_form('btn-show-form', 'form-edit-user', 'close-form')
}
function add_address() {
    show_form('add-address', 'form-address', 'close-form-address')
}
function edit_address() {
    document.addEventListener('DOMContentLoaded', () => {
        var class_list = document.querySelectorAll('.elm-btn-edit');
        var address = document.getElementById('addressEdit')
        let currentEditId = null;
        console.log(class_list);
        class_list.forEach(elm => {
            elm.addEventListener('click', () => {
                var close_form = document.getElementById('close-form-edit-address');
                var form = document.getElementById('form-edit-address');
                form.style.transform = 'TranslateY(0)';
                close_form.addEventListener('click', () => {
                    form.style.transform = 'TranslateY(-200%)';
                });
                currentEditId = elm.getAttribute('data-id');
                address.value = elm.getAttribute('data-address');
            });
        });
        document.getElementById('update-address-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const updatedData = {
                address: address.value
            };

            // Thực hiện cập nhật dữ liệu qua API (hoặc phương thức khác)
            fetch(`/user/updateAddress/${currentEditId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Cập nhật thành công!');
                        window.location.href = '/user';
                    } else {
                        alert('Cập nhật thất bại!');
                    }
                })
                .catch(error => {
                    console.error('Lỗi khi cập nhật:', error);
                    alert('Có lỗi xảy ra khi gửi yêu cầu.');
                });

        })
    }
    )
}
function delete_address() {
    var class_list = document.querySelectorAll('.elm-btn-delete')
    class_list.forEach(elm => {
        elm.addEventListener('click', () => {
            var id = elm.getAttribute('id')
            console.log(id)
            Swal.fire({
                title: "Cảnh báo",
                text: "Bạn có muốn xóa địa chỉ này?",
                icon: "question",
                showCancelButton: true,
                cancelButtonText: "Hủy",
                cancelButtonColor: "#d33",
            }).then((result) => {
                if (result.isConfirmed) {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        }
                    });
                    Toast.fire({
                        icon: "success",
                        title: "Xóa thành công"
                    });
                    setTimeout(() => {
                        changeApi('Address_user/' + id, "DELETE", null, getAddress)
                    }, 2000);
                }
            })
        })
    })
}