# bookstore-api

A bookstore RESTful API built in Node.js

**Use guide:*

**General:**

* To register as a new user to the book store, send a POST request to localhost:8080/users, with a JSON object:

    ```

        {
            "username": "non-spaced string, unique",
            "firstname": "non-spaced string, non-unique",
            "lastname": "non-spaced string, non-unique",
        }

    ```

**Admin:**

* To add a new book to the library, send a POST request to localhost:8080/books, with a JSON object:

{
    "username": "admin",
    "name": "Name of book (string)",
    "author": "Author of book (string)",
    "publisher": "Publisher of book (string)",
    "price": Price of book (number),
    "copies": Number of copies in stock (number)
}

* To view full information and IDs on books available in the bookstore, send a GET request to localhost:8080/books, with a JSON object:

{
    "username": "admin"
}

* To update a particular book available, send a PUT request to localhost:8080/books, with a JSON object:

{
    "username": "admin",
    "bookId": "ID of book in database, gotten from admin GET request to all books (string)",
    "name": "New Name of book if changed, else do not include property in JSON object (string)",
    "author": "New author of book if changed, else do not include property in JSON object (string)",
    "publisher": "New author of book if changed, else do not include property in JSON object (string)",
    "price": New price of book, if changed, else do not include property in JSON object, (number),
    "copies": New number of copies in store, if changed, else do not include property in JSON object (number),
}

* To delete a particular book from the library, send a DELETE request to localhost:8080/books, with a JSON object:

{
    "username": "admin",
    "bookId": "ID of book in database, gotten from admin GET request to all books (string)"
}

* To update a particular user, send a PUT request to localhost:8080/users, with a JSON object:

{
    "username": "registered user's username (string)",
    "newFirstName": "New first name of user if changed, else do not include property in JSON object (string)",
    "newLastName": "New last name of user if changed, else do not include property in JSON object (string)"
}

* To delete a particular user, send a DELETE request to localhost:8080/users, with a JSON object:

{
    "username": "registered user's username (string)"
}

**Registered Users:**

* To view all books available in the bookstore, send a GET request to localhost:8080/books, with a JSON object:

{
    "username": null
}

* To view all the books borrowed, send a GET request to localhost:8080/users, with a JSON object:

{
    "username": "registered user's username (string)"
}

* To lend a book, send a GET request to localhost:8080/books?borrow=yes, with a JSON object:

{
    "username": "registered user's username (string)",
    "name": "Name of book (string)",
    "author": "Author of book (string)"
}

* To return a book, send a PUT request to localhost:8080/books?return=yes, with a JSON object:

{
    "username": "registered user's username (string)",
    "name": "Name of book (string)",
    "author": "Author of book (string)"
}
