'use strict';

const characterUl = document.querySelector('.js_characterUl');

let allCharactersCards = [];

const renderOneCard = (cardObj) => {

    const html =

        `<li class="character__card">

        <div class="character__img"> 
            <img src="${cardObj.imageUrl}"
            alt="Imagen de ${cardObj.name}">
        </div>

        <p class="character__name">${cardObj.name}</p>

    </li>`;

    return html;

}


const renderAllCards = () => {

    let html = '';

    for (const oneCard of allCharactersCards) {

        html += renderOneCard(oneCard);

    }

    characterUl.innerHTML = html;

}

fetch('https://api.disneyapi.dev/character?pageSize=50')
    .then(response => response.json())
    .then(data => {

        allCharactersCards = data.data;

        renderAllCards();

    });

