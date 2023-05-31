const path = require('path');

function getAccessTokenProxied(email, password){
  return new Promise((resolve, reject) => {
    const exec = require('child_process').exec;
    const fileFolder = __filename.split('/').slice(0, -1).join('/')
    const proccess = exec('sh '+fileFolder+'/signWithProxy.sh', (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            reject(err);
            return;
        }
        resolve(JSON.parse(stdout));
        console.log(JSON.parse(stdout));
    })
  
    proccess.stdin.write(email + '\n');
    proccess.stdin.write(password + '\n');
  })
}

module.exports = getAccessTokenProxied;