// This file handles dynamic creation, rendering, and interaction of pagination controls for paginated content.
// This file generates pagination buttons, manages their active/disabled states, and sets up navigation event listeners.
// It reads the current page from the URL, limits the maximum number of pages, and ensures a responsive UI with ellipsis for large page sets.


// Initializes the URL object and extracts the current page number from the query parameters.
const url = new URL(window.location.href);
const currentPage = Number(url.searchParams.get(`page`));


// Creates pagination buttons based on the total number of pages in the provided JSON.
// Handles different cases for small and large numbers of pages, and adds ellipsis where appropriate.
// Highlights the current page and sets up event listeners for pagination controls.
// @param {Object} json - The JSON object containing pagination info (expects json.total_pages).
export const createPagination = (json) => {
    const pageNumbers = document.querySelector(`#pageNumbers`);
    // Limit the maximum number of pages to 500
    const total_pages = json.total_pages > 500 ? 500 : json.total_pages;

    // If there are 7 or fewer pages, show all page buttons
    if (total_pages <= 7) {
        for (let i = 1; i <= total_pages; i++) {
            pageNumbers.innerHTML += `<li><button class="paginationButton" id="pageButton${i}">${i}</button></li>`;
        }
    } else {
        // If the current page is near the start, show the first 6 pages and an ellipsis
        if (currentPage <= 4) {
            for (let i = 1; i <= 6; i++) {
                pageNumbers.innerHTML += `<li><button class="paginationButton" id="pageButton${i}">${i}</button></li>`;
            }
            pageNumbers.innerHTML += `<li><button class="paginationButton" disabled>...</button></li>`;
        }
        // If the current page is near the end, show an ellipsis and the last 6 pages
        else if (currentPage >= total_pages - 2) {
            pageNumbers.innerHTML += `<li><button class="paginationButton" disabled>...</button></li>`;
            for (let i = total_pages - 5; i <= total_pages; i++) {
                pageNumbers.innerHTML += `<li><button class="paginationButton" id="pageButton${i}">${i}</button></li>`;
            }
        }
        // If the current page is somewhere in the middle, show ellipses and a range around the current page
        else {
            pageNumbers.innerHTML += `<li><button class="paginationButton" disabled>...</button></li>`;
            for (let i = -2; i <= 2; i++) {
                pageNumbers.innerHTML += `<li><button class="paginationButton" id="pageButton${currentPage + i}">${currentPage + i}</button></li>`;
            }
            pageNumbers.innerHTML += `<li><button class="paginationButton" disabled>...</button></li>`;
        }
    }

    // Highlight and disable the button for the current page
    const currentPageButton = document.querySelector(`#pageButton${currentPage <= 0 ? 1 : currentPage}`);
    currentPageButton.disabled = true;
    currentPageButton.classList.add(`activePage`);

    // Set up event listeners for all pagination controls
    mapPaginationButtons(total_pages);
}

// Adds event listeners to pagination buttons and navigation controls (first, previous, next, last).
// Handles enabling/disabling of controls based on the current page.
// @param {number} total_pages - The total number of pages.
const mapPaginationButtons = (total_pages) => {
    const paginationButtons = document.querySelectorAll('.paginationButton');
    const firstButton = document.querySelector(`#firstPage`);
    const previousButton = document.querySelector(`#previousPage`);
    const nextButton = document.querySelector(`#nextPage`);
    const lastButton = document.querySelector(`#lastPage`);

    // Add click event listeners to each numbered pagination button
    for (const button of paginationButtons) {
        button.addEventListener('click', () => {
            url.searchParams.set('page', button.innerHTML);
            window.location.href = url;
        })
    }

    // Disable previous and first buttons if on the first page
    if (currentPage <= 1) {
        previousButton.disabled = true;
        firstButton.disabled = true;
    }

    // Add click event listener to the previous button
    previousButton.addEventListener(`click`, () => {
        url.searchParams.set(`page`, (currentPage - 1 <= 0 ? 1 : currentPage - 1));
        window.location.href = url;
    })

    // Add click event listener to the next button
    nextButton.addEventListener('click', () => {
        url.searchParams.set(`page`, currentPage == 0 ? 2 : currentPage + 1);
        window.location.href = url;
    })

    // Add click event listener to the first button
    firstButton.addEventListener(`click`, () => {
        url.searchParams.set(`page`, 1);
        window.location.href = url;
    })

    // Add click event listener to the last button
    lastButton.addEventListener(`click`, () => {
        url.searchParams.set(`page`, Number(total_pages));
        window.location.href = url;
    })
}