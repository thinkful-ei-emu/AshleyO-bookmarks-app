'use strict';
/* global store, api, $ */


const bookmarkList = (function(){

// user can add bookmarks to user's bookmark list. Bookmarks contain:
//title,url link description, rating (1-5)




// user can see a list of my bookmarks when I first open the app



function generateStars(bookmark){
    let stars = '';
    for (let i=1; i <= bookmark.rating; i++){
        stars += `<i class="fas fa-star"></i>`        
    }
    return stars;
}




function generateBookmarkElement(bookmark){
    console.log('generateBookmarkElement ran');
    
     
    const bookmarkRating = generateStars(bookmark);
    
    
    




    return `
    <li class="bookmark-element" data-bookmark-status="${bookmark.url}" data-bookmark-id="${bookmark.id}">    
    <span class="bookmark-element-title">${bookmark.title}</span>  
    
    <div class="show-url hidden">
       <span> ${bookmark.url}</span>
    </div>
    
    <div class="star-rating">   
        <span>${bookmarkRating}</span>
    </div>
    
    <div class= "bookmark-buttons">
        <button class="js-bookmark-expand"> 
            <span class="button-label">Expand</span>
        </button>
        <button class="js-bookmark-delete"> 
            <span class="button-label">Remove</span>
        </button>
    </div>
    </li>`;
}

function generateBookmarksString(bookmarkList){
    console.log('generateBookmarkstring ran')
    const bookmarks = bookmarkList.map((bookmark) => generateBookmarkElement(bookmark));
    console.log(`result after mapping: ${bookmarks}`)
    return bookmarks.join('');
}

function render() {
    let bookmarks = [...store.bookmarks]    
    console.log('render ran');    

    const bookmarkListString = generateBookmarksString(bookmarks); 
    $('.js-bookmarks-list').html(bookmarkListString);
    
}

function serializeJson(form) {    
    const formData = new FormData(form);
    const object = {};
    formData.forEach((val, name) => object[name] = val);
    console.log(formData);
    return JSON.stringify(object);
    //need to send to post request
}

function handleNewBookmarkSubmit() {
    console.log('HANDLESUBMIT');    
    $('#js-bookmarks-form').submit(event => {          
        event.preventDefault();
        console.log('handleNewBookmarkSubmit ran');          
        let formElement = $('#js-bookmarks-form')[0];      
        let jsonElement = serializeJson(formElement);
        // console.log(jsonElement);
        const bookmark = {
            id: cuid(), 
            title: $(`#title`).val(),           
            rating: $(`#ratingScale`).val(),
            url: $(`#url`).val(),
            description: $(`#description`).val(),
         };                
        formElement.reset();
          
        if(event.currentTarget && store.adding){                                     
            store.toggleAddBookmark();            
            store.addBookmark(bookmark); 
                                 
            $('.create-bookmark').addClass('hidden');
            render();

        }
        else {     
            store.toggleAddBookmark();
            $('.create-bookmark').removeClass('hidden');     
        }
        
        
    });
}



//get id of current bookmark
function getCurrentBookmarkId(currentBookmark) {    
    return $(currentBookmark)
    .closest('.bookmark-element')
    .data('bookmark-id'); 
    
        

}
//event listener placed on remove button to remove bookmark when clicked
function handleDeleteBookmark() {
    $('.js-bookmarks-list').on('click','.js-bookmark-delete', event =>{        
        const id = getCurrentBookmarkId(event.currentTarget);
        store.findAndDelete(id);
        render();
    });
}

function getExpandStatus(currentBookmark) {
    return $(currentBookmark)
    .closest('.bookmark-element')
    .data('bookmark-status');
}


//user can click on addbookmark button to input bookmark info and add bookmark to list
function handleExpandButton (){ 
    $('.js-bookmarks-list').on('click','.js-bookmark-expand', event =>{        
        
        let expandBookmark = getExpandStatus(event.currentTarget);
        
        
        if(expandBookmark){
            $('.show-url').removeClass('hidden');
        }
        else{
            $('.show-url').addClass('hidden');
        }

        


        //  **NEED TO TOGGLE ADD AND REMOVE CLASS
        
    });
    
}






// All bookmarks in the list default to a "condensed" view showing only title and rating

// user can click on a bookmark to display the "detailed" view

// Detailed view expands to additionally display description and a "Visit Site" link



// user receive appropriate feedback when I cannot submit a bookmark

// Check all validations in the API documentation (e.g. title and url field required)

// user can select from a dropdown a "minimum rating" to filter the list by all bookmarks rated at or above the chosen selection

// (Extension) I can edit the rating and description of a bookmark in my list

function bindEventListeners() {
    // handleAddBookmarkButton();
    handleNewBookmarkSubmit();
    handleExpandButton();    
    handleDeleteBookmark();
}


return {
    render: render,
    bindEventListeners: bindEventListeners,
};

}());
