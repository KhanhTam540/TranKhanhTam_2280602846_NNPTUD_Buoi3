let allProducts = [];      
let filteredData = [];     
let currentPage = 1;
let rowsPerPage = 10;

const tableBody = document.getElementById('product-list');
const searchInput = document.getElementById('search-input');
const rowsSelect = document.getElementById('rows-per-page');
const sortSelect = document.getElementById('sort-select');
const paginationContainer = document.getElementById('pagination-buttons');

// 1. Lấy dữ liệu từ API
async function fetchData() {
    try {
        const res = await fetch('https://api.escuelajs.co/api/v1/products');
        allProducts = await res.json();
        filteredData = [...allProducts]; 
        renderUI();
    } catch (err) {
        tableBody.innerHTML = '<tr><td colspan="5">Lỗi tải dữ liệu</td></tr>';
    }
}

// 2. Hàm xử lý sắp xếp
function sortData(data) {
    const type = sortSelect.value;
    if (type === 'none') return data;

    return [...data].sort((a, b) => {
        switch (type) {
            case 'price-asc': return a.price - b.price;
            case 'price-desc': return b.price - a.price;
            case 'title-asc': return a.title.localeCompare(b.title);
            case 'title-desc': return b.title.localeCompare(a.title);
            default: return 0;
        }
    });
}

// 3. Hàm render giao diện chính
function renderUI() {
    // Sắp xếp dữ liệu đã lọc
    const sortedData = sortData(filteredData);

    // Tính toán phân trang
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedItems = sortedData.slice(startIndex, endIndex);

    renderTable(paginatedItems);
    renderPagination(sortedData.length);
}

// 4. Hàm vẽ bảng
function renderTable(items) {
    if (items.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center">Không tìm thấy sản phẩm</td></tr>';
        return;
    }
    tableBody.innerHTML = items.map(p => `
        <tr>
            <td>${p.id}</td>
            <td><img src="${p.images[0]}" class="product-img" onerror="this.src='https://via.placeholder.com/80'"></td>
            <td><strong>${p.title}</strong></td>
            <td>$${p.price}</td>
            <td>${p.description.substring(0, 70)}...</td>
        </tr>
    `).join('');
}

// 5. Hàm tạo nút phân trang
function renderPagination(totalItems) {
    const pageCount = Math.ceil(totalItems / rowsPerPage);
    paginationContainer.innerHTML = '';
    if (pageCount <= 1) return;

    for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        if (i === currentPage) btn.classList.add('active');
        btn.addEventListener('click', () => {
            currentPage = i;
            renderUI();
        });
        paginationContainer.appendChild(btn);
    }
}

// --- GẮN SỰ KIỆN ---

// Tìm kiếm
searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    filteredData = allProducts.filter(p => p.title.toLowerCase().includes(keyword));
    currentPage = 1; 
    renderUI();
});

// Thay đổi kiểu sắp xếp
sortSelect.addEventListener('change', () => {
    currentPage = 1;
    renderUI();
});

// Thay đổi số lượng dòng
rowsSelect.addEventListener('change', (e) => {
    rowsPerPage = parseInt(e.target.value);
    currentPage = 1; 
    renderUI();
});

// Chạy hàm lấy dữ liệu lần đầu
fetchData();