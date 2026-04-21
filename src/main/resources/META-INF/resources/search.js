// ── 챔피언 데이터 ──────────────────────────────────────────────
const CHAMPIONS = [
    { name: '아트록스', engName: 'Aatrox', role: '전사', lane: '탑', img: 'images/Aatrox.png', difficulty: '상' },
    { name: '사일러스', engName: 'Sylas', role: '마법사', lane: '정글/미드', img: 'https://ddragon.leagueoflegends.com/cdn/15.24.1/img/champion/Sylas.png', difficulty: '중' },
    { name: '애니비아', engName: 'Anivia', role: '마법사', lane: '미드', img: 'https://ddragon.leagueoflegends.com/cdn/15.24.1/img/champion/Anivia.png', difficulty: '상' },
    { name: '브라이어', engName: 'Briar', role: '전사', lane: '정글', img: 'https://ddragon.leagueoflegends.com/cdn/15.24.1/img/champion/Briar.png', difficulty: '중' },
    { name: '잭스', engName: 'Jax', role: '전사', lane: '탑', img: 'https://ddragon.leagueoflegends.com/cdn/15.24.1/img/champion/Jax.png', difficulty: '하' },
    { name: '징크스', engName: 'Jinx', role: '원거리딜러', lane: '원딜', img: 'https://ddragon.leagueoflegends.com/cdn/15.24.1/img/champion/Jinx.png', difficulty: '중' },
];

// ── 뉴스 데이터 ──────────────────────────────────────────────
const NEWS = [
    { title: '새로운 챔피언 출시', desc: '2026 루나 레벨 이벤트! 신규 챔피언과 함께하는 특별한 시즌.', category: '게임 업데이트' },
    { title: '패치 노트 16.4', desc: '챔피언 밸런스 및 아이템 업데이트 내용을 확인하세요.', category: '패치 노트' },
];

// ── 검색 실행 ────────────────────────────────────────────────
function performSearch(query) {
    const q = query.trim().toLowerCase(); // 앞 뒤 공백제거, 소문자 변환
    if (!q) return;

    // 챔피온 데이터에서 이름, 영문명, 역할군, 라인 중 하나라도 검색어에 포함되면
    const champResults = CHAMPIONS.filter(c =>
        c.name.includes(q) || c.engName.toLowerCase().includes(q) ||
        c.role.includes(q) || c.lane.includes(q)
    );

    // 뉴스 데이터에서 제목, 설명, 카테고리 중 하나라도 검색어에 포함되면
    const newsResults = NEWS.filter(n =>
        n.title.toLowerCase().includes(q) || n.desc.toLowerCase().includes(q) || n.category.toLowerCase().includes(q)
    );

    // 새 창 열기
    const newWindow = window.open('', '_blank', 'width=1000,height=700,scrollbars=yes,resizable=yes');

    // 새 창 HTML 작성
    newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>검색 결과 - "${query}"</title>
            <link href="css/main.css" rel="stylesheet">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body {
                    background-color: #0a0e17;
                    color: #fff;
                    font-family: 'Pretendard', 'Malgun Gothic', sans-serif;
                }
                .accent-purple {
                    color: #a020f0;
                }
                .search-result-card {
                    background: #fff;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    margin-bottom: 12px;
                    transition: box-shadow 0.2s ease;
                }
                .search-result-card:hover {
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .search-result-card img {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 4px;
                    margin-right: 12px;
                }
                .no-result {
                    text-align: center;
                    padding: 40px 20px;
                    color: #666;
                }
                .search-category-item {
                    padding: 8px 16px;
                    cursor: pointer;
                    border-bottom: 2px solid transparent;
                    transition: all 0.2s ease;
                }
                .search-category-item.active {
                    border-bottom-color: #a020f0;
                    color: #a020f0;
                    font-weight: bold;
                }
                .search-keyword-header {
                    text-align: center;
                    padding: 20px 0;
                    background: #121825;
                    color: #fff;
                }
                .search-body {
                    padding: 20px;
                }
                .search-sidebar {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                }
                .search-content-area {
                    padding-left: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="search-keyword-header">
                    <h1>"${query}" 검색 결과</h1>
                </div>
                <div class="search-body">
                    <div class="row">
                        <div class="col-md-3">
                            <div class="search-sidebar">
                                <div style="font-size:0.8rem; color:#999; text-transform:uppercase; letter-spacing:0.1em;">카테고리</div>
                                <div class="search-category-item active" onclick="switchCategory('champion', this)">
                                    챔피언 <span class="count">(${champResults.length})</span>
                                </div>
                                <div class="search-category-item" onclick="switchCategory('news', this)">
                                    뉴스 <span class="count">(${newsResults.length})</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-9">
                            <div id="resultChampion">
                                <h5 style="color:#333;">챔피언</h5>
                                <div id="championResultList">
                                    ${champResults.length === 0 ? `<div class="no-result"><h4>검색 결과 없음</h4><p>"${query}"에 해당하는 챔피언이 없습니다.</p></div>` : champResults.map(c => `
                                        <div class="search-result-card d-flex align-items-center p-0 overflow-hidden">
                                            <img src="${c.img}" alt="${c.name}">
                                            <div class="p-3">
                                                <div style="font-weight:700; font-size:1rem; color:#111;">${c.name} <span style="color:#888; font-size:0.85rem;">(${c.engName})</span></div>
                                                <div style="color:#555; font-size:0.9rem; margin-top:4px;">역할: ${c.role} &nbsp;|&nbsp; 라인: ${c.lane} &nbsp;|&nbsp; 난이도: ${c.difficulty}</div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <div id="resultNews" style="display:none;">
                                <h5 style="color:#333;">뉴스</h5>
                                <div id="newsResultList">
                                    ${newsResults.length === 0 ? `<div class="no-result"><h4>검색 결과 없음</h4><p>"${query}"에 해당하는 뉴스가 없습니다.</p></div>` : newsResults.map(n => `
                                        <div class="search-result-card p-3">
                                            <span style="font-size:0.75rem; background:#c8253a; color:#fff; padding:2px 8px; border-radius:3px;">${n.category}</span>
                                            <div style="font-weight:700; font-size:1rem; color:#111; margin-top:8px;">${n.title}</div>
                                            <div style="color:#555; font-size:0.9rem; margin-top:4px;">${n.desc}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <script>
                function switchCategory(type, el) {
                    document.querySelectorAll('.search-category-item').forEach(i => i.classList.remove('active'));
                    el.classList.add('active');
                    document.getElementById('resultChampion').style.display = type === 'champion' ? 'block' : 'none';
                    document.getElementById('resultNews').style.display = type === 'news' ? 'block' : 'none';
                }
            </script>
        </body>
        </html>
    `);

    newWindow.document.close(); // 문서 작성 완료
}

// ── 카테고리 전환 ────────────────────────────────────────────
function switchCategory(type, el) {
    document.querySelectorAll('.search-category-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('resultChampion').style.display = type === 'champion' ? 'block' : 'none';
    document.getElementById('resultNews').style.display = type === 'news' ? 'block' : 'none';
}

// ── 폼 이벤트 ────────────────────────────────────────────────
document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('searchInput').value;
    performSearch(query);
});