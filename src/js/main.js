'use strict';

const characterUl = document.querySelector('.js_characterUl');


const renderOneCard = () => {

    characterUl.innerHTML =

        `<li class="character__card">

        <div class="character__img"> 
            <img src="${imageUrl}"
            alt="${name}">
        </div>

        <p class="character__name">Imagen de ${name}</p>

    </li>`;

}

renderOneCard();