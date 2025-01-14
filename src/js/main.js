'use strict';

// SECCIÓN DE LOS QUERY SELECTOR

const characterUl = document.querySelector('.js_characterUl');
const favouriteCharacterUl = document.querySelector('.js_favouriteCharacterUl')
const btnSearch = document.querySelector('.js_btnSearch');
const inputSearch = document.querySelector('.js_inputSearch');
const characterNotFound = document.querySelector('.js_characterNotFound');
const deleteAllFavouritesBtn = document.querySelector('.js_deleteAllFavouritesBtn');
const descriptionTextFavourites = document.querySelector('.js_descriptionTextFavourites');
const imageStitchFavourites = document.querySelector('.js_imageStitchFavourites');
const favouritesCounter = document.querySelector('.js_favouritesCounter');


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

    // Quitar la imagen en la sección de favoritos

    const imageHTML = isFavouriteSection ? '' : `<img class="character__img" src="${imageUrl}" alt="Imagen de ${cardObj.name}">`;

    // Cambiar el diseño de la card dependiendo de si estamos en la sección principal o de favoritos
    const cardClass = isFavouriteSection ? 'charactersFavouriteSection__card' : 'allCharactersSection__card';

    // Icono de basura solo si está en la sección de favoritos

    const trashIcon = isFavouriteSection ? '<i class="fa-solid fa-trash js_trash"></i>' : '';

    const html =

        `<li class="js_characterCard ${cardClass} ${favClass}" id="${cardObj._id}">
        <div> ${imageHTML} </div>
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
        html += renderOneCard(oneCard, false);
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

    if (favouritesCards.length === 0) {
        // Mostrar texto e imagen si no hay favoritos
        descriptionTextFavourites.style.display = 'block';
        imageStitchFavourites.style.display = 'block';
        favouritesCounter.style.display = 'none';

    } else {
        // Ocultar texto e imagen si hay favoritos
        descriptionTextFavourites.style.display = 'none';
        imageStitchFavourites.style.display = 'none';
        favouritesCounter.style.display = 'block';
    }

    // Contador de personajes favoritos
    favouritesCounter.innerHTML = `<i class="fa-solid fa-heart charactersFavouriteSection__counterheart" style="color: red;"></i> Total de favoritos: ${favouritesCards.length}`;

};

// Creo una variable para que se muestre el botón de borrar todos los favoritos cuando haya favoritos

const updateDeleteButtonVisibility = () => {

    if (favouritesCards.length > 0) {
        deleteAllFavouritesBtn.style.display = 'block';

    } else {
        deleteAllFavouritesBtn.style.display = 'none';
    }
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

    }

    else {

        // Quitar del array de favoritos

        favouritesCards.splice(favouritesIndex, 1);

        // Quitar del HTML

    }

    renderFavourites();
    renderAllCards();

    updateDeleteButtonVisibility();

    localStorage.setItem('charactersFavs', JSON.stringify(favouritesCards));

};


const handleClickButton = (ev) => {

    ev.preventDefault();

    characterNotFound.style.display = 'none';
    characterNotFound.innerHTML = '';

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

                characterNotFound.innerHTML =
                    `<p>Lo sentimos, ese personaje no se encuentra en nuestra base de datos. Prueba con otro personaje.</p>
                <img src="../images/Alicia_llorando_character_not_found.gif" alt="Personaje no encontrado. 
                Gif de Alicia en el país de las maravillas llorando">`;

                characterNotFound.style.display = 'block';
                characterNotFound.classList.add('searchSection__characterNotFound');
                characterUl.classList.add('hidden');

                return;

            }

            // Si se encuentran resultados

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

const handleDeleteAllFavourites = () => {

    console.log('Borrar todos los favoritos');

    // Primero se vacía el array de favoritos
    favouritesCards = [];

    renderFavourites();
    renderAllCards();

    // Eliminar los favoritos de localStorage
    localStorage.removeItem('charactersFavs');

    // Actualizar visibilidad del botón de borrar
    updateDeleteButtonVisibility();
};


// SECCIÓN DE EVENTOS

btnSearch.addEventListener('click', handleClickButton);
deleteAllFavouritesBtn.addEventListener('click', handleDeleteAllFavourites);


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
    updateDeleteButtonVisibility();
}