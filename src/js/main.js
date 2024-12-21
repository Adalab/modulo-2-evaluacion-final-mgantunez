'use strict';

const characterUl = document.querySelector('.js_characterUl');


let allCharactersCards = [];


const getVisibleImageUrl = (imageUrl) => {

    if (!imageUrl) {

        return 'https://placehold.co/400x400/ffffff/555555?text=Disney';
    }

    return imageUrl;

}


const renderOneCard = (cardObj) => {

    debugger;

    const imageUrl = getVisibleImageUrl(cardObj.imageUrl);

    const html =

        `<li class="character__card">

        <div> 
            <img class="character__img" src="${imageUrl}"
            alt="Imagen de ${cardObj.name}">
        </div>
        <p class="character__name">${cardObj.name}</p>
        <i class="fa-regular fa-heart"></i>
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

