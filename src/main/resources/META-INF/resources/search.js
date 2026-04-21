const CHAMPIONS = [
    { name: '아트록스', engName: 'Aatrox', role: '전사', lane: '탑', img: 'images/Aatrox.png', difficulty: '상' },
    { name: '사일러스', engName: 'Sylas', role: '마법사', lane: '정글/미드', img: 'https://ddragon.leagueoflegends.com/cdn/15.24.1/img/champion/Sylas.png', difficulty: '중' },
    { name: '애니비아', engName: 'Anivia', role: '마법사', lane: '미드', img: 'https://ddragon.leagueoflegends.com/cdn/15.24.1/img/champion/Anivia.png', difficulty: '상' },
    { name: '브라이어', engName: 'Briar', role: '전사', lane: '정글', img: 'https://ddragon.leagueoflegends.com/cdn/15.24.1/img/champion/Briar.png', difficulty: '중' },
    { name: '잭스', engName: 'Jax', role: '전사', lane: '탑', img: 'https://ddragon.leagueoflegends.com/cdn/15.24.1/img/champion/Jax.png', difficulty: '하' },
    { name: '징크스', engName: 'Jinx', role: '원거리딜러', lane: '원딜', img: 'https://ddragon.leagueoflegends.com/cdn/15.24.1/img/champion/Jinx.png', difficulty: '중' }
];

const NEWS = [
    { title: '새로운 챔피언 출시', desc: '2026 루나 레벨 이벤트! 신규 챔피언과 함께하는 특별한 시즌.', category: '게임 업데이트' },
    { title: '패치 노트 16.4', desc: '챔피언 밸런스 및 아이템 업데이트 내용을 확인하세요.', category: '패치 노트' }
];

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');

    // 검색 버튼 폼 전송 이벤트 (index.html, jnjnj.html 둘 다 작동)
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const query = searchInput.value.trim();
            if(query) {
                window.location.href = `jnjnj.html?
                q=${encodeURIComponent(query)}`;
            }
        });
    }

    // jnjnj.html 에서 URL 파라미터를 읽어와 검색 실행
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('q');
    
    if (queryParam) {
        if(searchInput) searchInput.value = queryParam;
        performSearch(queryParam);
    }
});

function performSearch(query) {
    const q = query.trim().toLowerCase();
    
    const searchResultsSection = document.getElementById('searchResults');
    if (!searchResultsSection) return; // 결과 영역이 없으면 중단 (index.html 에서는 실행안됨)

    document.getElementById('searchKeywordDisplay').textContent = `"${query}"`;

    const champResults = CHAMPIONS.filter(c =>
        c.name.includes(q) || c.engName.toLowerCase().includes(q) ||
        c.role.includes(q) || c.lane.includes(q)
    );
    const newsResults = NEWS.filter(n =>
        n.title.toLowerCase().includes(q) || n.desc.toLowerCase().includes(q) || n.category.toLowerCase().includes(q)
    );

    document.getElementById('champCount').textContent = `(${champResults.length})`;
    document.getElementById('newsCount').textContent = `(${newsResults.length})`;

    const champList = document.getElementById('championResultList');
    if (champResults.length === 0) {
        champList.innerHTML = `<div class="no-result p-4 border rounded"><h4>검색 결과 없음</h4><p>"${query}"에 해당하는 챔피언이 없습니다.</p></div>`;
    } else {
        champList.innerHTML = champResults.map(c => `
        <div class="search-result-card d-flex align-items-center p-0 mb-3 overflow-hidden bg-white rounded shadow-sm">
            <img src="${c.img}" alt="${c.name}" style="width: 80px; height: 80px; object-fit: cover;">
            <div class="p-3">
                <div style="font-weight:700; font-size:1rem; color:#111;">${c.name} <span style="color:#888; font-size:0.85rem;">(${c.engName})</span></div>
                <div style="color:#555; font-size:0.9rem; margin-top:4px;">역할: ${c.role} &nbsp;|&nbsp; 라인: ${c.lane} &nbsp;|&nbsp; 난이도: ${c.difficulty}</div>
            </div>
        </div>
        `).join('');
    }

    const newsList = document.getElementById('newsResultList');
    if (newsResults.length === 0) {
        newsList.innerHTML = `<div class="no-result p-4 border rounded"><h4>검색 결과 없음</h4><p>"${query}"에 해당하는 뉴스가 없습니다.</p></div>`;
    } else {
        newsList.innerHTML = newsResults.map(n => `
        <div class="search-result-card p-3 mb-3 bg-white rounded shadow-sm">
            <span style="font-size:0.75rem; background:#c8253a; color:#fff; padding:2px 8px; border-radius:3px;">${n.category}</span>
            <div style="font-weight:700; font-size:1rem; color:#111; margin-top:8px;">${n.title}</div>
            <div style="color:#555; font-size:0.9rem; margin-top:4px;">${n.desc}</div>
        </div>
        `).join('');
    }

    searchResultsSection.style.display = 'block';
    switchCategory('champion', document.querySelector('.search-category-item'));
}

function switchCategory(category, element) {
    document.querySelectorAll('.search-category-item').forEach(item => item.classList.remove('active'));
    if (element) element.classList.add('active');

    if (category === 'champion') {
        document.getElementById('resultChampion').style.display = 'block';
        document.getElementById('resultNews').style.display = 'none';
    } else if (category === 'news') {
        document.getElementById('resultChampion').style.display = 'none';
        document.getElementById('resultNews').style.display = 'block';
    }
}