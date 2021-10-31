const fs = require('fs');
const path = require('path');
const baseDir = path.join(__dirname, '/../data/');
const filePath = baseDir + "\\" + 'users.json';

exports.readAllUsers = function () {
    try {
        let users;
        const data = fs.readFileSync(filePath, 'utf-8');
        users = JSON.parse(data);
        return users;
    } catch (error) {
        console.log(error);
    }
}
