// SHA-256 Hash Function
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// Confirm modal display + Hash generation
async function showConfirmModal() {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;

  document.getElementById("confirmUsername").textContent = username;
  document.getElementById("confirmEmail").textContent = email;
  document.getElementById("confirmPhone").textContent = phone;

  const hashed = await hashPassword(password);
  document.getElementById("hashedPassword").value = hashed;

  console.log("Hashed password:", hashed);

  const modalElement = document.getElementById("confirmModal");

  if (typeof bootstrap === "undefined") {
    alert("Bootstrap JS가 로드되지 않아 모달을 열 수 없습니다.");
    return;
  }

  const modal = new bootstrap.Modal(modalElement);
  modal.show();
}

// 모달의 확인 버튼 클릭 → form submit
function submitRegister() {
  const modalElement = document.getElementById("confirmModal");

  if (typeof bootstrap !== "undefined") {
    const modal = bootstrap.Modal.getInstance(modalElement);

    if (modal) {
      modal.hide();
    }
  }

  document.getElementById("registerForm").submit();
}
