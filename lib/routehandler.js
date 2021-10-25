const { readAllBooks } = require('./readBooks');
const { writeToAllBooks } = require('./writeBooks');
const { readAllUsers } = require('./readUsers');
const { writeToAllUsers } = require('./writeUsers');
const routeHandler = {};
const helper = require('./helper');

routeHandler.Books = (data, callback) => {
    const acceptableHeaders = ["post", "get", "put", "delete"];
    if (acceptableHeaders.indexOf(data.method) > -1) {
        routeHandler._books[data.method](data, callback);
    } else {
        callback(405);
    }
};

routeHandler.Users = (data, callback) => {
    const acceptableHeaders = ["post", "get", "put", "delete"];
    if (acceptableHeaders.indexOf(data.method) > -1) {
        routeHandler._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

// main book route object
routeHandler._books = {};

// main user route object
routeHandler._users = {};


// Post route -- for creating a user
routeHandler._users.post = (data, callback) => {
    let Users = readAllUsers();
    // validate that all required fields are filled out
    var userName = typeof(data.payload.username) === 'string' && data.payload.username.trim().length > 0 ? data.payload.username : false;
    var firstName = typeof(data.payload.firstname) === 'string' && data.payload.firstname.trim().length > 0 ? data.payload.firstname : false;
    var lastName = typeof(data.payload.lastname) === 'string' && data.payload.lastname.trim().length > 0 ? data.payload.lastname : false;
    if (userName && firstName && lastName) {
        if (userName !== "admin") {
            let foundUsername = Users.find( ({ username }) => username === userName);
            if (!foundUsername) {
                const id = helper.generateRandomString(30);
                let user = {
                    username: userName,
                    firstname: firstName,
                    lastname: lastName,
                    books: []
                };
                Users.push(user);
                const done = writeToAllUsers(Users);

                if (done === true) {
                    callback(200, { message: "Your account has been created. Here are your details:", user });
                } else {
                    callback(400, { message: "Some error occured. Please try again later" });
                }
            } else {
                callback(400, { message: "Your username already exists. Please try another" });
            }
        } else {
            callback(400, { message: "Your username cannot be 'admin'. Please try another" });
        }
    }
};


// Get route -- to get a single user's books and to get all users in the bookstore
routeHandler._users.get = (data, callback) => {
    let Users = readAllUsers();
    // validate that all required fields are filled out
    var userName = typeof(data.payload.username) === 'string' && data.payload.username.trim().length > 0 ? data.payload.username : false;
    if (userName) {
        if (userName != "admin") {
            let foundUser = Users.find( ({ username }) => username === userName);
            if (foundUser) {
                let books = foundUser.books;
                callback(200, { message: "Here are the books you've lent:", books });
            } else {
                callback(400, { message: "Some error occured. Please try again later" });
            }
        } else if (userName == "admin") {
            callback(200, { message: "Here are all the users registered to this bookstore:", Users });
        } else {
            callback(400, { message: "Some error occured. Please try again later" });
        }
    } else {
        callback(400, { message: "Please check your input and try again later" });
    }
};


// Put route -- to update a single user information
routeHandler._users.put = (data, callback) => {
    let Users = readAllUsers();
    // validate that all required fields are filled out
    var userName = typeof(data.payload.username) === 'string' && data.payload.username.trim().length > 0 ? data.payload.username : false;
    var firstName = typeof(data.payload.newFirstName) === 'string' && data.payload.newFirstName.trim().length > 0 ? data.payload.newFirstName : false;
    var lastName = typeof(data.payload.newLastName) === 'string' && data.payload.newLastName.trim().length > 0 ? data.payload.newLastName : false;
    if (userName) {
        if (userName !== "admin") {
            let foundUser = Users.find( ({ username }) => username === userName);
            if (foundUser) {
                if (firstName) {
                    foundUser.firstname = firstName;
                }
                if (lastName) {
                    foundUser.lastname = lastName;
                }
                Users = Users.filter(user => user.username != userName);
                Users.push(foundUser);
                const done = writeToAllUsers(Users);
                if (done === true) {
                    callback(200, { message: "User information has been updated:", foundUser });
                } else {
                    callback(400, { message: "Some error occured. Please try again later" });
                }
            } else {
                callback(400, { message: "Some error occured. Please try again later" });
            }
        } else {
            callback(400, { message: "Some error occured. Please try again later" });
        }
    } else {
        callback(400, { message: "Some error occured. Please check your info and try again later" });
    }
};


// Delete route -- to remove a single user from the bookstore
routeHandler._users.delete = (data, callback) => {
    let Users = readAllUsers();
    // validate that all required fields are filled out
    var userName = typeof(data.payload.username) === 'string' && data.payload.username.trim().length > 0 ? data.payload.username : false;
    if (userName) {
        if (userName !== "admin") {
            let foundUser = Users.find( ({ username }) => username === userName);
            if (foundUser) {
                Users = Users.filter(user => user.username != userName);
                const done = writeToAllUsers(Users);
                if (done === true) {
                    callback(200, { message: "User has been successfully deleted:", foundUser });
                } else {
                    callback(400, { message: "Some error occured. Please try again later" });
                }
            } else {
                callback(400, { message: "Some error occured. Please try again later" });
            }
        } else {
            callback(400, { message: "Some error occured. Please try again later" });
        }
    }
};


// Post route -- for creating a book
routeHandler._books.post = (data, callback) => {
    let Books = readAllBooks();
    // validate that all required fields are filled out
    var username = typeof(data.payload.username) === 'string' && data.payload.username.trim().length > 0 ? data.payload.username : false;
    var name = typeof(data.payload.name) === 'string' && data.payload.name.trim().length > 0 ? data.payload.name : false;
    var price = typeof(data.payload.price) === 'number' && data.payload.price > 0 ? data.payload.price : false;
    var author = typeof(data.payload.author) === 'string' && data.payload.author.trim().length > 0 ? data.payload.author : false;
    var publisher = typeof(data.payload.publisher) === 'string' && data.payload.publisher.trim().length > 0 ? data.payload.publisher : false;
    var copies = typeof(data.payload.copies) === 'number' && data.payload.copies > 0 ? data.payload.copies : false;
    if (name && price && author && publisher && copies) {
        if (username === 'admin') {
            const id = helper.generateRandomString(30);
            const book = {
                id: id,
                name: name,
                author: author,
                publisher: publisher,
                price: price,
                copies: copies
            };

            Books.push(book);
            const done = writeToAllBooks(Books);

            if (done === true) {
                callback(200, { message: "book added successfully", data: book });
            } else {
                callback(400, { message: "Some error occured. Please try again later" });
            }
        } else {
            callback(400, { message: "Unauthorized!" });
        }
    }
};


// Get route -- for getting all books and borrowing a book;
routeHandler._books.get = (data, callback) => {
    let Users = readAllUsers();
    let Books = readAllBooks();
    if (data.query.borrow == 'yes') {
        // validate that all required fields are filled out
        let bookName = typeof(data.payload.name) === 'string' && data.payload.name.trim().length > 0 ? data.payload.name : false;
        let bookAuthor = typeof(data.payload.author) === 'string' && data.payload.author.trim().length > 0 ? data.payload.author : false;
        let userName = typeof(data.payload.username) === 'string' && data.payload.username.trim().length > 0 ? data.payload.username : false;
        let user = Users.find(user => user.username == userName);
        if (user) {
            let book = Books.find(book => book.name == bookName && book.author == bookAuthor);
            if (book) {
                if (book.copies <= 0) {
                    callback(400, { message: 'All copies of this book have been lent out. Please try again later'});
                } else {
                    let userBook = book;
                    userBook.id = null;
                    userBook.copies = null;
                    user.books.push(userBook);
                    Users = Users.filter(user => user.username != userName);
                    Users.push(user);
                    book.copies--;
                    Books = Books.filter(book => book.name != bookName && book.author != bookAuthor);
                    Books.push(book);
                    let doneUsers = writeToAllUsers(Users);
                    let doneBooks = writeToAllBooks(Books);
                    if (doneUsers === true && doneBooks === true) {
                        callback(200, { message: 'book retrieved', data: userBook });
                    } else {
                        callback(400, { message: 'Some error occured. Please try again later'});
                    }
                }
            } else {
                callback(404, { message: "Book not found. Please check list of all books and try again" });
            }
        } else {
            callback(404, { message: "User not found. Please create an account to use this bookstore" });
        }

    } else if (data.payload.username == 'admin') {
        callback(200, { message: 'All books retrieved', data: Books });
    } else if (data.payload.username == null) {
        let userBooks = Books.map(book => {
            book.id = null;
            book.copies = null;
            return book;
        });
        callback(200, { message: 'All books retrieved', data: userBooks });
    }
};


// Put route -- for updating a book and returning a book
routeHandler._books.put = (data, callback) => {
    let Users = readAllUsers();
    let Books = readAllBooks();
    if (data.query.return == 'yes') {
        // validate that all required fields are filled out
        let bookName = typeof(data.payload.name) === 'string' && data.payload.name.trim().length > 0 ? data.payload.name : false;
        let bookAuthor = typeof(data.payload.author) === 'string' && data.payload.author.trim().length > 0 ? data.payload.author : false;
        let userName = typeof(data.payload.username) === 'string' && data.payload.username.trim().length > 0 ? data.payload.username : false;
        let user = Users.find(user => user.username == userName);
        if (user) {
            let book = Books.find(book => book.name == bookName && book.author == bookAuthor);
            if (book) {
                user.books = user.books.filter(book => book.name != bookName && book.author != bookAuthor);
                Users = Users.filter(user => user.username != userName);
                Users.push(user);
                book.copies++;
                Books = Books.filter(book => book.name != bookName && book.author != bookAuthor);
                Books.push(book);
                let doneUsers = writeToAllUsers(Users);
                let doneBooks = writeToAllBooks(Books);
                if (doneUsers === true && doneBooks === true) {
                    book.id = null;
                    book.copies = null;
                    callback(200, { message: 'book successfully returned', data: book });
                } else {
                    callback(400, { message: 'Some error occured. Please try again later'});
                }
            } else {
                callback(404, { message: "Book is not in our database. Please check and try again." });
            }
        } else {
            callback(404, { message: "User not found. Please create an account to use this bookstore" });
        }

    } else {
        // validate that all required fields are filled out
        var bookId = typeof(data.payload.bookId) === 'string' && data.payload.bookId.trim().length > 0 ? data.payload.bookId : false;
        var username = typeof(data.payload.username) === 'string' && data.payload.username.trim().length > 0 ? data.payload.username : false;
        var name = typeof(data.payload.name) === 'string' && data.payload.name.trim().length > 0 ? data.payload.name : false;
        var price = typeof(data.payload.price) === 'number' && data.payload.price > 0 ? data.payload.price : false;
        var author = typeof(data.payload.author) === 'string' && data.payload.author.trim().length > 0 ? data.payload.author : false;
        var publisher = typeof(data.payload.publisher) === 'string' && data.payload.publisher.trim().length > 0 ? data.payload.publisher : false;
        var copies = typeof(data.payload.copies) === 'number' && data.payload.copies > 0 ? data.payload.copies : false;
            if (username === 'admin') {
                let book = Books.find(book => book.id == bookId);
                if (book) {
                    Books = Books.filter(book => book.id != bookId);
                    if (name) {
                        book.name = name;
                    }
                    if (price) {
                        book.price = price;
                    }
                    if (author) {
                        book.author = author;
                    }
                    if (publisher) {
                        book.publisher = publisher;
                    }
                    if (copies) {
                        book.copies = copies;
                    }
                    Books.push(book);
                    const updatedUsers = Users.map(user => {
                        let updatedUser = user.books.map(newbook => {
                            if (newbook.id == bookId) {
                                newbook.name = book.name;
                                newbook.price = book.price;
                                newbook.author = book.author;
                                newbook.publisher = book.publisher;
                                newbook.copies = book.copies;
                            }
                            return newbook;
                        });
                        return updatedUser;
                    });
                    const doneBooks = writeToAllBooks(Books);
                    const doneUsers = writeToAllUsers(updatedUsers);

                    if (doneBooks === true && doneUsers === true) {
                        callback(200, { message: 'book successfully updated', data: book });
                    }
                } else {
                    callback(404, { message: 'Book ID is invalid. Please check and try again' });
                }
        } else {
            callback(404, { message: 'Not found' });
        }
    }
};


// Delete route -- for deleting a book
routeHandler._books.delete = (data, callback) => {
    let Books = readAllBooks();
    // validate that all required fields are filled out
    var bookId = typeof(data.payload.bookId) === 'string' && data.payload.bookId.trim().length > 0 ? data.payload.bookId : false;
    var username = typeof(data.payload.username) === 'string' && data.payload.username.trim().length > 0 ? data.payload.username : false;
    if (username == 'admin'){
        let book = Books.find( ({ id }) => id == bookId);
        if (book) {
            Books = Books.filter(book => book.id != bookId);
            let done = writeToAllBooks(Books);
            if (done === true) {
                callback(200, { message: 'book successfully deleted', data: book });
            } else {
                callback(400, {err : err, message : 'could not delete book. Try again later'});
            }
        } else {
            callback(404, { message: 'Book ID is invalid. Please check and try again' });
        }
    } else{
        callback(404, { message : 'Page not found' });
    }
};

routeHandler.ping = (data, callback) => {
    callback(200, { response: "server is live" });
};
routeHandler.notfound = (data, callback) => {
    callback(404, { response: 'not found' });
};

module.exports = routeHandler;