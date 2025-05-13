const url = new URL(window.location.href);
const currentPage = Number(url.searchParams.get(`page`));


export const createPagination = (json) => {
    const pageNumbers = document.querySelector(`#pageNumbers`);
    const total_pages = json.total_pages > 500? 500 : json.total_pages;

    if (total_pages <= 7) {
        for (let i = 1; i <= total_pages; i++) {
            pageNumbers.innerHTML += `<li><button class="paginationButton" id="pageButton${i}">${i}</button></li>`;
        }

    } else {
        if (currentPage <= 4) {
            for (let i = 1; i <= 6; i++) {
                pageNumbers.innerHTML += `<li><button class="paginationButton" id="pageButton${i}">${i}</button></li>`;
            }

            pageNumbers.innerHTML += `<li><button class="paginationButton" disabled>...</button></li>`;

        } else if (currentPage >= total_pages - 2) {
            pageNumbers.innerHTML += `<li><button class="paginationButton" disabled>...</button></li>`;

            for (let i = total_pages - 5; i <= total_pages; i++) {
                pageNumbers.innerHTML += `<li><button class="paginationButton" id="pageButton${i}">${i}</button></li>`;
            }

        } else {
            pageNumbers.innerHTML += `<li><button class="paginationButton" disabled>...</button></li>`;

            for (let i = -2; i <= 2; i++) {
                pageNumbers.innerHTML += `<li><button class="paginationButton" id="pageButton${currentPage + i}">${currentPage + i}</button></li>`;
            }

            pageNumbers.innerHTML += `<li><button class="paginationButton" disabled>...</button></li>`;
        }
    }

    const currentPageButton = document.querySelector(`#pageButton${currentPage <= 0 ? 1 : currentPage}`);
    currentPageButton.disabled = true;
    currentPageButton.classList.add(`activePage`);

    mapPaginationButtons(total_pages);
}

const mapPaginationButtons = (total_pages) => {
    const paginationButtons = document.querySelectorAll('.paginationButton');
    const firstButton = document.querySelector(`#firstPage`);
    const previousButton = document.querySelector(`#previousPage`);
    const nextButton = document.querySelector(`#nextPage`);
    const lastButton = document.querySelector(`#lastPage`);


    for (const button of paginationButtons) {
        button.addEventListener('click', () => {
            url.searchParams.set('page', button.innerHTML);
            window.location.href = url;
        })
    }


    if (currentPage <= 1) {
        previousButton.disabled = true;
        firstButton.disabled =true;
    }

    previousButton.addEventListener(`click`, () => {
        url.searchParams.set(`page`, (currentPage - 1 <= 0 ? 1 : currentPage - 1));
        window.location.href = url;
    })

    nextButton.addEventListener('click', () => {
        url.searchParams.set(`page`, currentPage == 0 ? 2 : currentPage + 1);
        window.location.href = url;
    })

    firstButton.addEventListener(`click`, () => {
        url.searchParams.set(`page`, 1);
        window.location.href = url;
    })

    lastButton.addEventListener(`click`, () => {
        url.searchParams.set(`page`, Number(total_pages));
        window.location.href = url;
    })
}