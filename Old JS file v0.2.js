// Version 0.2
const movieContainer = document.querySelector("#movieContainer");
const form = document.querySelector("#searchForm");

form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const searchInput = document.querySelector("#searchTerm")
    const searchTerm = searchInput.value;
    const config = { params: { q: searchTerm } }
    const res = await axios.get(`https://api.tvmaze.com/search/shows`, config);
    if (res.data.length === 0) {
        swal({
            title: "Try again",
            text: "No results found",
            icon: "error",
        });
    } else {
        makeElements(res);
    }
})

makeElements = (shows) => {

    // grab row and reset former search
    const row = document.querySelector(".row");
    row.innerHTML = "";

    for (let res of shows.data) {

        // div with col size
        const colSize = document.createElement("div");
        colSize.classList.add("col-sm-4");
        row.append(colSize);

        // div card
        const card = document.createElement("div");
        card.classList.add("card", "mb-5", "mx-auto", "d-block");
        card.style.width = "18rem";
        colSize.append(card);

        // img
        const img = document.createElement("img");
        if (res.show.image) {
            img.src = res.show.image.medium;
            img.classList.add("card-img-top");
            card.append(img);
        } else {
            img.src = "placeholder.png"
            img.classList.add("card-img-top");
            img.style.height = "402px";
            card.append(img);
        }

        // div - card-body wrapper
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        card.append(cardBody);

        // name
        if (res.show.name) {
            const name = document.createElement("h5");
            name.classList.add("card-title");
            name.innerText = res.show.name;
            cardBody.append(name);
        }

        // language
        if (res.show.language) {
            const language = document.createElement("p");
            language.classList.add("card-text")
            language.innerText = res.show.language;
            cardBody.append(language);
        }

        // rating
        const rating = document.createElement("p");
        rating.classList.add("card-text")
        if (res.show.rating.average) {
            rating.innerText = res.show.rating.average;
            cardBody.append(rating);
        } else {
            rating.innerText = "No rating available"
            cardBody.append(rating);
        }
    }
}