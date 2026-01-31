let allProducts = [];
let filteredData = [];
let currentPage = 1;
let rowsPerPage = 10;

const tableBody = document.getElementById('product-list');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const rowsSelect = document.getElementById('rows-per-page');
const paginationContainer = document.getElementById('pagination');

// 1. Fetch dữ liệu
async function loadData() {
    try {
        const response = await fetch('https://api.escuelajs.co/api/v1/products');
        allProducts = await response.json();
        filteredData = [...allProducts];
        renderUI();
    } catch (error) {
        tableBody.innerHTML = '<tr><td colspan="5">Lỗi tải dữ liệu API</td></tr>';
    }
}

// 2. Hàm vẽ giao diện chính
function renderUI() {
    let dataToDisplay = [...filteredData];

    // --- CHỨC NĂNG SẮP XẾP ---
    const sortType = sortSelect.value;
    if (sortType === 'price-asc') dataToDisplay.sort((a, b) => a.price - b.price);
    else if (sortType === 'price-desc') dataToDisplay.sort((a, b) => b.price - a.price);
    else if (sortType === 'name-asc') dataToDisplay.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortType === 'name-desc') dataToDisplay.sort((a, b) => b.title.localeCompare(a.title));

    // --- CHỨC NĂNG CHIA TRANG ---
    const start = (currentPage - 1) * rowsPerPage;
    const paginatedItems = dataToDisplay.slice(start, start + rowsPerPage);

    renderTable(paginatedItems);
    renderPaginationButtons(dataToDisplay.length);
}

// 3. Vẽ bảng
function renderTable(items) {
    tableBody.innerHTML = items.map(p => {
        let img = p.images[0].replace(/[\[\]"\\]/g, "");
        return `
            <tr>
                <td>${p.id}</td>
                <td><img src="${img}" class="product-img" referrerpolicy="no-referrer" onerror="this.src='https://via.placeholder.com/80'"></td>
                <td><strong>${p.title}</strong></td>
                <td>$${p.price}</td>
                <td>${p.description.substring(0, 60)}...</td>
            </tr>
        `;
    }).join('');
}

// 4. Vẽ nút phân trang
function renderPaginationButtons(total) {
    const totalPages = Math.ceil(total / rowsPerPage);
    paginationContainer.innerHTML = '';
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        if (i === currentPage) btn.classList.add('active');
        btn.onclick = () => { currentPage = i; renderUI(); };
        paginationContainer.appendChild(btn);
    }
}

// --- XỬ LÝ SỰ KIỆN ---

// Tìm kiếm onChange
searchInput.oninput = () => {
    filteredData = allProducts.filter(p => p.title.toLowerCase().includes(searchInput.value.toLowerCase()));
    currentPage = 1;
    renderUI();
};

// Sắp xếp
sortSelect.onchange = () => {
    currentPage = 1;
    renderUI();
};

// Đổi số dòng hiển thị
rowsSelect.onchange = () => {
    rowsPerPage = parseInt(rowsSelect.value);
    currentPage = 1;
    renderUI();
};

loadData();