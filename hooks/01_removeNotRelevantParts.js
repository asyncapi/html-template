const fs = require('fs');
const path = require('path');

module.exports = {
    'generate:after': generator => {

        const params = generator.templateParams;
        const singleFile = params.singleFile === 'true';
        
        if (singleFile) {

            const jsDir = path.resolve(generator.targetDir, 'js');
            const cssDir = path.resolve(generator.targetDir, 'css');

            const callback = (error) => {
                if (error) {
                    throw error;
                }
            };

            fs.rmdir(jsDir, {recursive: true}, callback);
            fs.rmdir(cssDir, {recursive: true}, callback);
        }
    }
};