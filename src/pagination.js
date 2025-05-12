export const createPagination = (json) => {
    const total_pages = json.total_pages;

    const paginationButtons = document.querySelectorAll('.paginationButton');

    for (const button of paginationButtons) {
        button.addEventListener('click', () => {
            let url = new URL(window.location.href);
            url.searchParams.set('page', button.innerHTML);
            window.location.href = url;
        })
    }
}