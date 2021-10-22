const fs = require('fs');
const path = require('path');
const baseDir = path.join(__dirname, '/../data/');
const filePath = baseDir + "\\" + 'users.json';

exports.writeToAllUsers = function (data) {
    try {
        let length = data.length;

        let stringifiedData = JSON.stringify(data, null, length);

        fs.writeFileSync(filePath, stringifiedData, 'utf-8');

        return true;
    } catch (error) {
        console.log(error);
        return error;
    }
}