 
let selectedCategory = 1000;
let sortByView = false;

const sortBtn = document.getElementById('sort-btn');

sortBtn.addEventListener('click', () => {
    sortByView = true;
    loadCard(selectedCategory, sortByView)
})

// load category data 
const loadCategories = async () => {
    const res = await fetch('https://openapi.programming-hero.com/api/videos/categories')
    const data = await res.json()
    const categories = data.data;
    displayCategoriesBtn(categories);
}

// display category button 
const displayCategoriesBtn = (categories) => {

    // get category button container 
    const btnContainer = document.getElementById('btn-container');

    categories.forEach(category => {

        // create new button 
        const categoriesBtn = document.createElement('button');
        categoriesBtn.innerText = category.category;
        categoriesBtn.classList = `category-btn btn btn-ghost hover:bg-slate-700 bg-slate-700 text-white text-lg`;
        categoriesBtn.addEventListener('click', () => {
            loadCard(category.category_id)
            const allBtn = document.querySelectorAll('.category-btn');
            for(let btn of allBtn){
                btn.classList.remove('bg-red-600');
            }
            categoriesBtn.classList.add('bg-red-600')
        })

        // appending categories Btn
        btnContainer.appendChild(categoriesBtn);

    })
}

// load single card data 
const loadCard = async (cardId, sortByView) => {
    selectedCategory = cardId;
    const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${cardId}`)
    const data = await res.json()
    const cards = data.data;
    
    if(sortByView){
        cards.sort((a, b) => {
            const totalViewStrFirst = a.others?.views;
            const totalViewsStrSecond = b.others?.views;
            const totalViewFirstNumber = parseFloat(totalViewStrFirst.replace("K", '')) || 0;
            const totalViewSecondNumber = parseFloat(totalViewsStrSecond.replace('K', '')) || 0;
            return totalViewSecondNumber - totalViewFirstNumber;
        })
    }

    displayCards(cards);
    
}




function msToTime(duration) {
    
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
  
    // hours = (hours < 10) ? "0" + hours : hours;
    // minutes = (minutes < 10) ? "0" + minutes : minutes;
  
    return hours + "hrs " + minutes + "min ago";
  }




// display video card 
const displayCards = cards => {
   
    // get card container 
    const cardContainer = document.getElementById('card-container');
    const errorElement = document.getElementById('error-element');

    // clean card container before adding new card 
    cardContainer.innerHTML = '';


    if( cards.length === 0 ){
        errorElement.classList.remove('hidden');
    }
    else {
        errorElement.classList.add('hidden');
    }




    cards.forEach(card => {

        let ms = '';
        if(card.others.posted_date){
            ms = msToTime(card.others.posted_date)
        }


        let verifiedBadge = '';
        if(card.authors[0].verified) {
            verifiedBadge = `<img class="w-6 h-6" src="./images/verify.png" alt=""></img>` 
        }

        const videoCard = document.createElement('div');
        videoCard.innerHTML = `
        <div class="card w-full bg-base-100 shadow-xl">
                <figure class="overflow-hidden h-72">
                    <img class="w-full h-full object-cover" src="${card.thumbnail}" />
                    <h6 class="absolute bottom-[40%] right-12 text-white">${ms}</h6>
                </figure>
                <div class="card-body">
                    <div class="flex space-x-4 justify-start items-start">
                        <div>
                            <img class="w-12 h-12 rounded-full object-cover" src="${card.authors[0].profile_picture}" alt="Shoes" />
                        </div>
                        <div>
                            <h2 class="card-title">${card.title}</h2>
                            <div class="flex mt-3">
                                <p class="">${card.authors[0].profile_name}</p>
                                ${verifiedBadge}
                            </div>
                            <p class="mt-3">${card.others.views} Views</p>
                        </div>
                    </div>
                </div>
            </div>

        `
        cardContainer.appendChild(videoCard);
    })

}



loadCategories()
loadCard(selectedCategory, sortByView)