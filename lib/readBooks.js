const fs = require('fs');
const path = require('path');
const baseDir = path.join(__dirname, '/../data/');
const filePath = baseDir + "\\" + 'books.json';

exports.readAllBooks = function () {
    try {
        let books;
        const data = fs.readFileSync(filePath, 'utf-8');
        books = JSON.parse(data);
        return books;
    } catch (error) {
        console.log(error);
    }
}