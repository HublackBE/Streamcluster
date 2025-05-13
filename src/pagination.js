export const createPagination = (json) => {
    const total_pages = json.total_pages;

    mapPaginationButtons();
}

const mapPaginationButtons = () => {
    const paginationButtons = document.querySelectorAll('.paginationButton');
    const previousButton = document.querySelector(`#previousPage`);

    const url = new URL(window.location.href);
    const currentPage = Number(url.searchParams.get(`page`));

    for (const button of paginationButtons) {
        button.addEventListener('click', () => {
            url.searchParams.set('page', button.innerHTML);
            window.location.href = url;
        })
    }


    if (currentPage <= 1) {
        previousButton.disabled = true;
    }

    previousButton.addEventListener(`click`, () => {
        url.searchParams.set(`page`, (currentPage - 1 <= 0 ? 1 : currentPage - 1));
        window.location.href = url;
    })
    document.querySelector(`#nextPage`).addEventListener('click', () => {
        url.searchParams.set(`page`, currentPage == 0 ? 2 : currentPage + 1);
        window.location.href = url;
    })
}