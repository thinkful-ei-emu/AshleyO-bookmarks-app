'use strict';
// eslint-disable-next-line no-unused-vars

const api = (function(){
    
    const BASE_URL = 'https://thinkful-list-api.herokuapp.com/ashley';


    const listApiFetch = function(...args) {
        let error;
        return fetch(...args)
        .then(res => {
            if (!res.ok) {
                error = {code: res.status};
                if(!res.headers.get('content-type').includes('json')) {
                    error.message = res.statusText;
                    return Promise.reject(error);
                }
                
            }
            return Promise.reject(error);
        })
        .then(data => {
            if (error) {
                error.message = data.message;
                return Promise.reject(error);
            }
            return data;
        });
        
    };

    const getBookmarks = function () {
        return listApiFetch(BASE_URL + '/bookmarks')
    };

    const createBookmark = function(newBookmark) {
        // const jsonNewBookmark = JSON.stringify(newBookmark);
        return listApiFetch(BASE_URL + '/bookmarks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: newBookmark
        });                    
    };
    
    const updateBookmark = function(id, updateData) {
        const newData = JSON.stringify(updateData);
        return listApiFetch(BASE_URL + '/bookmarks/' + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: newData
        });                    
    };


    const deleteBookmark = function(id) {        
        return listApiFetch(BASE_URL + '/bookmarks/' + id, {
            method: 'DELETE',
            
        });                    
    };
    
    


    







    return {
        getBookmarks,
        createBookmark,
        updateBookmark,
        deleteBookmark,

    };






}());