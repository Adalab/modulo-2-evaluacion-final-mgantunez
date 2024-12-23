'use strict';

// SECCIÓN DE LOS QUERY SELECTOR

const characterUl = document.querySelector('.js_characterUl');
const favouriteCharacterUl = document.querySelector('.js_favouriteCharacterUl')
const btnSearch = document.querySelector('.js_btnSearch');
const inputSearch = document.querySelector('.js_inputSearch');
const characterNotFound = document.querySelector('.js_characterNotFound');


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


const renderOneCard = (cardObj, isFavouriteSection = false) => {

    const imageUrl = getVisibleImageUrl(cardObj.imageUrl);

    const isFavourite = favouritesCards.findIndex((favCard) => favCard._id === cardObj._id) !== -1;

    const favClass = isFavourite ? 'favourite' : '';

    // Clases para el corazón

    const heartType = isFavourite ? 'fa-solid' : 'fa-regular';

    const heartClass = isFavourite ? 'heartClicked' : 'character__heart';

    // Icono de basura solo si está en la sección de favoritos

    const trashIcon = isFavouriteSection ? '<i class="fa-solid fa-trash js_trash"></i>' : '';

    const html =

        `<li class="js_characterCard character__card ${favClass}" id="${cardObj._id}">

        <div> 
            <img class="character__img" src="${imageUrl}"
            alt="Imagen de ${cardObj.name}">
        </div>
        <p class="character__name">${cardObj.name}</p>
        <i class="${heartType} fa-heart js_characterHeart ${heartClass}"></i>
        ${trashIcon}

    </li>`;

    return html;

};

const renderAllCards = () => {

    let html = '';

    // Aquí compruebo si lo que quiero que se renderice en la página es un array de diferentes personajes o solo un objeto con un personaje. 
    // Si solo es un objeto, convierto el objeto en array

    allCharactersCards = Array.isArray(allCharactersCards) ? allCharactersCards : [allCharactersCards];

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

        html += renderOneCard(oneCard, true);

    }

    favouriteCharacterUl.innerHTML = html;

};

const handleFavourite = (ev) => {

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


const handleClickButton = (ev) => {

    ev.preventDefault();

    let html = '';

    const searchCard = inputSearch.value.toLocaleLowerCase();

    if (searchCard === '') {

        fetch('https://api.disneyapi.dev/character?pageSize=50')

            .then(response => response.json())

            .then(data => {

                allCharactersCards = data.data;
                renderFavourites();
                renderAllCards();
            })

        return;

    }

    // URL con  parámetro de búsqueda
    const apiUrl = `https://api.disneyapi.dev/character?pageSize=50&name=${encodeURIComponent(searchCard)}`;

    // Llamada a la API
    fetch(apiUrl)

        .then(response => response.json())

        .then(data => {

            // Comprueba si hay resultados
            if (data.info.count === 0) {

                allCharactersCards = [];
                renderFavourites();
                renderAllCards();

                characterNotFound.textContent = 'Lo sentimos, ese personaje no se encuentra en nuestra base de datos. Prueba con otro personaje.';
                characterNotFound.style.display = 'block';
                characterUl.classList.add('hidden');

                return;

            }

            // Si se encuentran resultados



            debugger;

            characterNotFound.style.display = 'none';
            characterUl.classList.remove('hidden');

            allCharactersCards = data.data;
            renderFavourites();
            renderAllCards();


        })

        .catch(error => {
            // Si hay un error con la llamada a la API o no existe el personaje
            console.error('Error', error);

            characterNotFound.textContent = 'Lo sentimos, hubo un problema con la búsqueda';
            characterNotFound.style.display = 'block';
            characterUl.style.display = 'none';

        });


};

// SECCIÓN DE EVENTOS

btnSearch.addEventListener('click', handleClickButton);


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