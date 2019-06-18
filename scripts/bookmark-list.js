'use strict';
/* global store, api, $ */


const bookmarkList = (function(){

    function generateError(message) {
        return `
        <section class="error-content">
        <button id="cancel-error">X</button>
        <p>${message}</p>
        </section>`;
    } 
        
    function renderError() {
        if(store.error) {
            const el = generateError(store.error);
            $('.error-container').html(el);
        }
            else {
                $('.error-container').empty();
            }
        }   


    function generateStars(bookmark){
        console.log(bookmark.rating);
        let stars = '';
        for (let i=1; i <= bookmark.rating; i++){
            stars += `<i class="fas fa-star"></i>`        
        }
        console.log(`STARS: ${stars}`);
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
        <div id="${bookmark.id}" class= "hidden">
        <span> ${bookmark.url}</span><br>
        <span> ${bookmark.description}</span>       
        </div>
        
        <div class= "bookmark-buttons">
            <button class="js-bookmark-expand"> 
                <span class="button-label text-${bookmark.id}">Expand</span>
                <span class="button-label text-${bookmark.id} hidden ">Shrink</span>
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
        renderError();
        let bookmarks = [...store.bookmarks]    
        console.log('render ran');      
        if(store.filterRating != null){        
            bookmarks = bookmarks.filter(bookmark => bookmark.rating >= store.filterRating);
            console.log(`NEW BOOKMARKS ARRAY: ${bookmarks}`); 

        };

        const bookmarkListString = generateBookmarksString(bookmarks); 
        $('.js-bookmarks-list').html(bookmarkListString);
        
    }

    //need to send to post request

    function serializeJson(form) {    
        const formData = new FormData(form);
        const object = {};
        formData.forEach((val, name) => object[name] = val);
        console.log(formData);
        return JSON.stringify(object);
        
    }

    function handleNewBookmarkSubmit() {      
        $('#js-bookmarks-form').submit(event => {          
            event.preventDefault();
            console.log('handleNewBookmarkSubmit ran');          
            let formElement = $('#js-bookmarks-form')[0];      
            let bookmarkForm = serializeJson(formElement);
            formElement.reset();      
            
            
            if(event.currentTarget && store.adding){                                                                    
                api.createBookmark(bookmarkForm)
            .then((newbookmark) => {                                                        
                              
                    store.addBookmark(newbookmark); 
                    render();
                
            })
            .catch((err) => {
                store.setError(err.message);
                renderError();
              });
                
                store.toggleAddBookmark();                                                      
                $('.create-bookmark').addClass('hidden');
                $('.minRating-container').removeClass('hidden');                     
              
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
            
            api.deleteBookmark(id)
            .then(() => {                                                        
                             
                    store.findAndDelete(id); 
                    render();
                
            })
            .catch((err) => {
                store.setError(err.message);
                renderError();
              });
        });
    }

   
    //user can click on addbookmark button to input bookmark info and add bookmark to list
    function handleExpandButton (){ 
        $('.js-bookmarks-list').on('click','.js-bookmark-expand', event =>{        
            
                       
            console.log(event.currentTarget);      
            const id = getCurrentBookmarkId(event.currentTarget);
            console.log(id);             
            $(`#${id}`).toggle();
            $(`.text-${id}`).toggle();
           


            // $("button").click(function(){
            // $(this).text($(this).text() === 'Expand' ? 'Shrink' : 'Expand');
            // const test = $(this);
            // console.log(test);
            // });

           
            

              
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

    function handleCloseError () {
        $('.error-container').on('click', `#cancel-error`, () => {
            store.setError(null);
            renderError();
        })
    }




    function bindEventListeners() {    
        handleNewBookmarkSubmit();    
        handleExpandButton();    
        handleDeleteBookmark();
        handleMinRatingFilter();
        handleCloseError();
    }


    return {
        render: render,
        bindEventListeners: bindEventListeners,
    };

}());
