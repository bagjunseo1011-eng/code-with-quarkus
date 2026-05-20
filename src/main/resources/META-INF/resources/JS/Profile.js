window.onload = function () {
    fetch('/profile/info') // 프로필 정보 API 호출
        .then(res => res.json()) // json 파싱
        .then(data => {
            const u = document.getElementById('infoUsername'); if (u) u.textContent = data.username;
            const e = document.getElementById('infoEmail');    if (e) e.textContent = data.email;
            const p = document.getElementById('infoPhone');    if (p) p.textContent = data.phone;
            if (data.profileImage) {
                const img = document.getElementById('profileImg'); if (img) img.src = '/uploads/profile/' + data.profileImage;
            }
        });
};