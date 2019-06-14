'use strict';
/* global store, api, $ */


const bookmarkList = (function(){

// user can add bookmarks to user's bookmark list. Bookmarks contain:
//title,url link description, rating (1-5)




// user can see a list of my bookmarks when I first open the app

function generateBookmarkElement(bookmark){
    console.log('generateBookmarkElement ran');
    console.log(`bookmark in generateElement: ${bookmark}`);
    console.log(`bookmarkTitle in generateElement: ${bookmark.title}`);
    // const expandedClass = item.expanded ? 'bookmark-expanded' : '';
    return `
    <li class="bookmark-element">
    ${bookmark.title}
    <button>
    <span>Expand</span>
    </button>
    <button>
    <span>Remove</span>
    </button>
    </li>`;
}

function generateBookmarksString(bookmarkList){
    console.log('generateBookmarkstring ran')
    const bookmarks = bookmarkList.map((bookmark) => generateBookmarkElement(bookmark));
    console.log(`result after mapping: ${bookmarks}`)
    return bookmarks.join('join');
}

function render() {
    let bookmarks = [...store.bookmarks]
    console.log(`bookmarks in render: ${[...store.bookmarks]}`);
    console.log('render ran')
    const bookmarkListString = generateBookmarksString(bookmarks);   

    $('.js-bookmarks-list').html(bookmarkListString);
    
}

function serializeJson(form) {    
    const formData = new FormData(form);
    const o = {};
    formData.forEach((val, name) => o[name] = val);
    console.log(formData);
    return JSON.stringify(o);
}

function handleNewBookmarkSubmit() {
    
    $('#js-bookmarks-form').submit(function (event){        
      event.preventDefault();
      console.log('handleNewBookmarkSubmit ran');
      const form = event.currentTarget;      
      const bookmark = serializeJson(form);    
      
      store.addBookmark(bookmark);
      render();
    


    });
}




// All bookmarks in the list default to a "condensed" view showing only title and rating

// user can click on a bookmark to display the "detailed" view

// Detailed view expands to additionally display description and a "Visit Site" link

// user can remove bookmarks from my bookmark list

// user receive appropriate feedback when I cannot submit a bookmark

// Check all validations in the API documentation (e.g. title and url field required)

// user can select from a dropdown a "minimum rating" to filter the list by all bookmarks rated at or above the chosen selection

// (Extension) I can edit the rating and description of a bookmark in my list

function bindEventListeners() {
    handleNewBookmarkSubmit();
}


return {
    render: render,
    bindEventListeners: bindEventListeners,
};

}());
