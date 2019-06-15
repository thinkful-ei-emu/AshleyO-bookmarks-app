'use strict';
/* global store, api, $ */


const bookmarkList = (function(){


function generateStars(bookmark){
    console.log(bookmark.rating);
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
    <li class="bookmark-element" data-bookmark-id="${bookmark.id}">    
    <span class="bookmark-element-title">${bookmark.title}</span>    
    
    <div class="star-rating">   
        <span>${bookmarkRating}</span>
    </div>
    <div class="show-url hidden">
       <span> ${bookmark.url}</span><br>
       <span> ${bookmark.description}</span>       
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
    return bookmarks.join('');
}

function render() {
    let bookmarks = [...store.bookmarks]    
    console.log('render ran');      
     if(store.filterRating != null){        
         bookmarks = bookmarks.filter(bookmark => bookmark.rating >= store.filterRating);
         console.log(`NEW BOOKMARKS ARRAY: ${bookmarks}`); 

     };

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
            expand: false,
         };                
        formElement.reset();
          
        if(event.currentTarget && store.adding){                                     
            store.toggleAddBookmark();            
            store.addBookmark(bookmark);                                
            $('.create-bookmark').addClass('hidden');
            $('.minRating-container').removeClass('hidden');  
            
            render();
        }
        else {     
            store.toggleAddBookmark();
            $('.create-bookmark').removeClass('hidden');
            $('.minRating-container').addClass('hidden');
               
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

const toggleExpandStatus = function(bookmark) {
    
    if(bookmark.expand){
        bookmark.expand = false;
        console.log(`toggleStatus: IF: ${bookmark.expand}`);
    }
    else {
        bookmark.expand = true;
        console.log(`toggleStatus ELSE: ${bookmark.expand}`)
    }

    return bookmark.expand;
    
}
//user can click on addbookmark button to input bookmark info and add bookmark to list
function handleExpandButton (){ 
    $('.js-bookmarks-list').on('click','.js-bookmark-expand', event =>{        
                   
        const id = getCurrentBookmarkId(event.currentTarget);
        const bookmark = store.findById(id);  
        console.log(bookmark);
        const expandStatus = toggleExpandStatus(bookmark);        
           
        if(expandStatus) {
            $('.show-url').removeClass('hidden');            
            console.log("removeclass",expandStatus);                
        }
        else {
            $('.show-url').addClass('hidden');
            console.log("addlclass",expandStatus);                
        }
       
        
    });
    
}
//selected mim rating
function handleMinRatingFilter() {
    $('.container').on('change','#ratingMin', event =>{       
           event.preventDefault();
           let filterRatingVal = $(event.currentTarget).val();
           console.log(filterRatingVal);    
           store.setfilterRating(filterRatingVal);                  
           render();       
    });
}




function bindEventListeners() {    
    handleNewBookmarkSubmit();    
    handleExpandButton();    
    handleDeleteBookmark();
    handleMinRatingFilter();
}


return {
    render: render,
    bindEventListeners: bindEventListeners,
};

}());
