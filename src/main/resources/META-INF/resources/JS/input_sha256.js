// SHA-256 Hash Function (Web Crypto API)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
// Confirm modal display + Hash generation
async function showConfirmModal() {
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const password = document.getElementById('password').value;
  // Display input info in modal
  document.getElementById('confirmUsername').textContent = username;
  document.getElementById('confirmEmail').textContent = email;
  document.getElementById('confirmPhone').textContent = phone;
  // SHA-256 hash generation and store in hidden field
  const hashed = await hashPassword(password);
  document.getElementById('hashedPassword').value = hashed;
  // Log hash value to console
  console.log('Hashed password:', hashed);
  // Bootstrap confirm modal display
  const modal = new bootstrap.Modal(
    document.getElementById('confirmModal'));
  modal.show();
}
// 가입하기 버튼 클릭 → form submit
function submitRegister() {
// 확인 모달 닫기
bootstrap.Modal.getInstance(
document.getElementById('confirmModal')).hide();
// form submit → POST /register_check 전송
document.getElementById('registerForm').submit();
}