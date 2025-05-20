const url = new URL(window.location.href);
export const sortBy = url.searchParams.get(`sort_by`) == null ? `popularity.desc` : url.searchParams.get(`sort_by`);

export const mapFilterSort = () => {
    const orderSelect = document.querySelector(`#sort_by`)
    orderSelect.addEventListener(`change`, (event) => {
        document.querySelector(`#filterSort`).submit();
    })

    for (const option of orderSelect.querySelectorAll(`option`)) {
        if (sortBy == option.value) {
            option.selected = true;
        }
    }
}