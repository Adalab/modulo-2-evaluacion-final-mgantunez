'use strict';

// SECCIÓN DE LOS QUERY SELECTOR

const characterUl = document.querySelector('.js_characterUl');
const favouriteCharacterUl = document.querySelector('.js_favouriteCharacterUl')


// SECCIÓN DE LOS DATOS DE LA APLICACIÓN

let allCharactersCards = [];

let favouritesCards = [];

// SECCIÓN DE FUNCIONES

const getVisibleImageUrl = (imageUrl) => {

    if (!imageUrl) {

        return 'https://placehold.co/400x400/ffffff/555555?text=Disney';
    }

    return imageUrl;

};


const renderOneCard = (cardObj) => {

    const imageUrl = getVisibleImageUrl(cardObj.imageUrl);

    const isFavourite = favouritesCards.findIndex((favCard) => favCard._id === cardObj._id) !== -1;

    const favClass = isFavourite ? 'favourite' : '';

    // Clases para el corazón

    const heartType = isFavourite ? 'fa-solid' : 'fa-regular';

    const heartClass = isFavourite ? 'heartClicked' : 'character__heart';

    const html =

        `<li class="js_characterCard character__card ${favClass}" id="${cardObj._id}">

        <div> 
            <img class="character__img" src="${imageUrl}"
            alt="Imagen de ${cardObj.name}">
        </div>
        <p class="character__name">${cardObj.name}</p>
        <i class="${heartType} fa-heart js_characterHeart ${heartClass}"></i>

    </li>`;

    return html;


};

const renderAllCards = () => {

    let html = '';

    for (const oneCard of allCharactersCards) {

        html += renderOneCard(oneCard);

    }

    characterUl.innerHTML = html;

    const allCardsLi = document.querySelectorAll('.js_characterCard');

    for (const li of allCardsLi) {

        li.addEventListener('click', handleFavourite);

    }

};

const renderFavourites = () => {

    let html = '';

    for (const oneCard of favouritesCards) {

        html += renderOneCard(oneCard);

    }

    favouriteCharacterUl.innerHTML = html;

};


const handleFavourite = (ev) => {

    debugger;

    ev.currentTarget.classList.toggle('favourite');

    const obtainID = parseInt(ev.currentTarget.id);


    // Búsqueda en el array de todos los personajes
    const clickedCharacterObj = allCharactersCards.find((eachCharacter) => eachCharacter._id === obtainID);

    // Búsqueda en el array de los personajes favoritos
    const favouritesIndex = favouritesCards.findIndex((eachCharacter) => eachCharacter._id === obtainID);

    if (favouritesIndex === -1) {

        // Se añade el <li> del personaje favorito al HTML

        favouritesCards.push(clickedCharacterObj);

        renderFavourites();
        renderAllCards();

    }

    else {

        // Quitar del array de favoritos

        favouritesCards.splice(favouritesIndex, 1);

        // Quitar del HTML

        renderFavourites();
        renderAllCards();

    }

    localStorage.setItem('charactersFavs', JSON.stringify(favouritesCards));

};


// SECCIÓN DE EVENTOS



// CÓDIGO QUE SE EJECUTA AL CARGAR LA PÁGINA 


fetch('https://api.disneyapi.dev/character?pageSize=50')
    .then(response => response.json())
    .then(data => {

        allCharactersCards = data.data;

        renderAllCards();

    });

if (localStorage.getItem('charactersFavs') !== null) {
    favouritesCards = JSON.parse(localStorage.getItem('charactersFavs'));
    renderFavourites();
}