const fs = require('fs');

(async () => {
    function replaceFileInContent(file, replaces) {
        let content = fs.readFileSync(file, 'utf8');
        replaces.forEach(([source, replace]) => {
            console.log(file , source, replace);
            content = content.replace(source, replace);
        });
        fs.writeFileSync(file, content);
    };

    replaceFileInContent('./src/api.ts', [
       [ "import { Configuration } from './configuration';", "import type { Configuration } from './configuration';"]
    ])

    replaceFileInContent('./src/base.ts', [
        [ 'import { Configuration } from "./configuration";', 'import type { Configuration } from "./configuration";']
     ])


     replaceFileInContent('./src/common.ts', [
         ["import { AxiosInstance, AxiosResponse } from 'axios';", "import type { AxiosInstance, AxiosResponse } from 'axios';"],
        [ 'import { Configuration } from "./configuration";', 'import type { Configuration } from "./configuration";']
     ])

})()