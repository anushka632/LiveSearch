// 1. Debounce Closure to handle search state and limit AJAX requests
function debounce(fn, delay) {
    let timerId;
    return function (...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

// 2. Fetch data via AJAX and update UI
function performSearch(query) {
    const $container =$('#resultsContainer');

    // Hide and clear if query is empty
    if (!query.trim()) {
        $container.empty().hide();
        return;
    }

    // Perform AJAX GET request
    $.ajax({
        url: 'products.json',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $container.empty();

            // Filter products matching query
            const filtered = data.products.filter(item =>
                item.title.toLowerCase().includes(query.toLowerCase())
            );

            if (filtered.length > 0) {
                filtered.forEach(product => {
                    $container.append(`
                        <div class="product-item">
                            <strong>${product.title}</strong> - ₹${product.price}
                        </div>
                    `);
                });
                $container.show();
            } else {
                $container.append('<div class="product-item">No products found</div>').show();
            }
        },
        error: function () {
            console.error("Error fetching product data.");
        }
    });
}

// 3. Initialize debounced handler (300ms delay)
const handleLiveSearch = debounce(function (e) {
    const query = $(e.target).val();
    performSearch(query);
}, 300);

// 4. Attach input listener using jQuery
$(document).ready(function () {$('#searchInput').on('input', handleLiveSearch);
});