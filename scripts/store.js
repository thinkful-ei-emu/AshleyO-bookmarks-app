'use strict';
//eslint-disable-next-line no unused-vars

const store = (function(){

    //function that updates error value
    const setError = function(error){
        this.error = error;
    }

    //function that addes bookmarks to list
    const addBookmark = function(bookmark){

        this.bookmarks.push(bookmark);
        console.log(store);
        console.log('bookmark added to bookmarks');

    }

    //function that finds bookmark id
    const findById = function(id) {       
        return this.bookmarks.find(bookmark => bookmark.id === id);
    }

    

    //function that deletes bookmarks

    const findAndDelete = function(id) {
         this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
         console.log(this.bookmarks);
    }
    
    //function that toggles add bookmark button
    const toggleAddBookmark = function() {

        this.adding = !this.adding;        

    }

    const setfilterRating = function (filterRatingVal) {
        this.filterRating = filterRatingVal;
    }

    const findAndUpdate = function(id) {
        this.bookmarks=this.findById(id);
        Object.assign(item, newData);
    }
  
    

   

    //function that updates data

    //function that expands bookmark

    //function that filters by min bookmark rating

    

    return {
        bookmarks: [],
        error: null,
        filterRating: null,
        adding: false,
        
        
        
        toggleAddBookmark,
        addBookmark,
        setError,        
        findById,
        findAndUpdate,         
        findAndDelete,
        setfilterRating,
    };



}());