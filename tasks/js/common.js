"use strict";

//initialize Parse library with your application ID and your app's JavaScript library key
Parse.initialize('nwo3Bj8lFpOm1xSd1hEeNybwWR3GoFTd0FCxSpQu', 'cCq01ipgUt76yQOGXZeQ9cUAzKbmiN1SCSnCRcFe');

/**
 * Shows an error in an element on the page with the class 'error-message'
 * @param err {Object} the error to be shown
 */
function showError(err) {
    $('.error-message').html(err.message).fadeIn();
}

/**
 * Clears any currently showing error
 */
function clearError() {
    $('.error-message').fadeOut().empty();
}
