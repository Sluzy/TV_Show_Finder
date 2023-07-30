const movieContainer = document.querySelector("#movieContainer");
const form = document.querySelector("#searchForm");

// Event listener for form submission
form.addEventListener("submit", handleFormSubmit);

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault(event);
    const searchInput = document.querySelector("#searchTerm");
    const searchTerm = searchInput.value;
    try {
        const shows = await searchShows(searchTerm);
        if (shows.length === 0) {
            showError("No results found");
        } else {
            renderShows(shows);
        }
    } catch (error) {
        showError("An error occurred. Please try again later.");
    }
}

// Function to search for shows using the TVMaze API
async function searchShows(searchTerm) {
    const config = { params: { q: searchTerm } };
    const res = await axios.get("https://api.tvmaze.com/search/shows", config);
    return res.data;
}

// Function to display an error message
function showError(message) {
    swal({
        title: "Try again",
        text: message,
        icon: "error",
    });
}

// Function to render shows
function renderShows(shows) {
    const row = document.querySelector(".row");
    row.innerHTML = "";

    for (let show of shows) {
        const colSize = createColElement();
        const card = createCardElement();
        const img = createImageElement(show);
        const cardBody = createCardBodyElement();
        const name = createNameElement(show);
        const language = createLanguageElement(show);
        const rating = createRatingElement(show);

        cardBody.append(name, language, rating);
        card.append(img, cardBody);
        colSize.append(card);
        row.append(colSize);
    }
}

// Helper functions for creating DOM elements
function createColElement() {
    const colSize = document.createElement("div");
    colSize.classList.add("col-sm-4");
    return colSize;
}

function createCardElement() {
    const card = document.createElement("div");
    card.classList.add("card", "mb-5", "mx-auto", "d-block", "border");
    card.style.width = "18rem";
    return card;
}

function createImageElement(show) {
    if (!show.show.image) {
        // If the show has no image, return just the image element without an anchor
        const img = document.createElement("img");
        img.src = "placeholder.png";
        img.classList.add("card-img-top");
        img.style.height = "402px";
        return (img);
    }

    const link = document.createElement("a");
    const imgContainer = document.createElement("div");
    const img = document.createElement("img");

    img.src = show.show.image.medium;
    img.classList.add("card-img-top"); // Always add the class "card-img-top" to the image

    // Check if the show has an officialSite link and add it
    if (show.show.officialSite) {
        link.href = show.show.officialSite;
        link.target = "_blank";
        imgContainer.classList.add("image-container");
    } else {
        link.style.pointerEvents = "none";
        link.style.cursor = "default";
    }

    // Add image and imagecontainer
    link.append(imgContainer);
    imgContainer.append(img);
    return link;
}

function createCardBodyElement() {
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "bg-dark", "bg-gradient", "border");
    return cardBody;
}

function createNameElement(show) {
    const name = document.createElement("h5");
    name.classList.add("card-title", "text-white");
    name.innerText = show.show.name || "No name available";
    return name;
}

function createLanguageElement(show) {
    const language = document.createElement("p");
    language.classList.add("card-text", "text-white");
    language.innerText = show.show.language || "Unknown";
    return language;
}

function createRatingElement(show) {
    const rating = document.createElement("p");
    rating.classList.add("card-text", "text-white");
    if (show.show.rating && show.show.rating.average) {
        rating.innerText = show.show.rating.average;
    } else {
        rating.innerText = "No rating available";
    }
    return rating;
}