
function start() {
    sendCode();
    verifyCode();
    resetPassword();
}
start()


function sendCode() {
    document.getElementById('forgot-password-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;

        const response = await fetch('/forgot-password/sendCode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            document.getElementById('forgot-password-form').classList.add('d-none');
            document.getElementById('verify-code-form').classList.remove('d-none');
        } else {
            alert(result.message);
        }
    });
}

function verifyCode() {
    document.getElementById('verify-code-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const code = document.getElementById('code').value;

        const response = await fetch('/forgot-password/verifyCode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code }),
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            document.getElementById('verify-code-form').classList.add('d-none');
            document.getElementById('reset-password-form').classList.remove('d-none');
        } else {
            alert(result.message);
        }
    });
}

function resetPassword() {
    document.getElementById('reset-password-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await fetch('/forgot-password/ressetPassword', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            window.location.href = '/auth/login';
        } else {
            alert(result.message);
        }
    });
}

