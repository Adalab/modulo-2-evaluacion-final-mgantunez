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


/*
const getHeartClicked = (heartClicked) => {

    if (heartClicked) {

        return '<i class="fa-solid fa-heart js_characterHeart heartClicked"></i>';

    }

    else {
        return '<i class="fa-regular fa-heart js_characterHeart character__heart character__heart:hover"></i>';

    }

};

*/


const renderOneCard = (cardObj) => {


    const imageUrl = getVisibleImageUrl(cardObj.imageUrl);
    debugger;

    const html =

        `<li class="js_characterCard character__card" id="${cardObj._id}">

        <div> 
            <img class="character__img" src="${imageUrl}"
            alt="Imagen de ${cardObj.name}">
        </div>
        <p class="character__name">${cardObj.name}</p>
        <i class="fa-regular fa-heart js_characterHeart character__heart character__heart:hover"></i>

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

    }

    else {

        // Quitar del array de favoritos

        favouritesCards.splice(favouritesIndex, 1);

        // Quitar del HTML

        renderFavourites();


    }
};


// SECCIÓN DE EVENTOS



// CÓDIGO QUE SE EJECUTA AL CARGAR LA PÁGINA 


fetch('https://api.disneyapi.dev/character?pageSize=50')
    .then(response => response.json())
    .then(data => {

        allCharactersCards = data.data;

        renderAllCards();

    });

