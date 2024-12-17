function start() {
    formatPrice();
    select_color();
    select_size();
    minus();
    plus();
    show_descript_product();
};

start();

function formatPrice() {
    const priceElement = document.getElementById('view_price');
    const priceValue = parseInt(priceElement.innerText);
    const formatted = priceValue.toLocaleString('vi-VN', { minimumFractionDigits: 0 });
    priceElement.innerHTML = formatted + '.000';
};
function select_color() {
    var size = document.getElementsByName("colorCart");
    var result = document.getElementById("result-color");
    size.forEach((value) => {
        value.addEventListener("change", () => {
            if (value.checked == true) {
                result.className = value.value;
                result.innerHTML = `<span style="height: 20px; border: 1px solid black; margin-right: 5px;width: 20px;display: inline-block; border-radius: 5px; background-color: ${value.value};"></span>`;
                console.log(value);
            };
        });
    });
};
function select_size() {
    var size = document.getElementsByName("sizeCart")
    var result = document.getElementById("result-size")

    size.forEach((value) => {
        value.addEventListener("change", () => {
            value.style.backgroundColor = 'black'
            value.style.color = 'white'
            if (value.checked == true) {
                result.innerHTML = value.value
                console.log(value)
            }
        })
    })
}
function minus() {
    var number = document.getElementById("value-number")
    var btn = document.getElementById('minus')
    btn.addEventListener('click', () => {
        if (number.value <= 1) {
            number.value = 1
            console.log(number.value)
        } else {
            number.value--
        }
    })
}
function plus() {
    var value_number = document.getElementById("value-number")
    var btn = document.getElementById('plus')
    btn.addEventListener('click', () => {
        value_number.value++
        console.log(value_number.value)
    })
}
function show_descript_product() {
    var click = document.getElementById("click-descript")
    var show = document.getElementById("show-descript")

    click.addEventListener('click', () => {
        if (show.style.opacity == "1") {
            show.style.opacity = "0"
            show.style.maxHeight = "0"
        } else {
            show.style.opacity = "1"
            show.style.maxHeight = "100%"
        }
    })
}