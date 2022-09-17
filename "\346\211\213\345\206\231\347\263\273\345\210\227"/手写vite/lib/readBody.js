const { Readable } = require('stream');

async function readBody(stream = '') {
    if (stream instanceof Readable) {
        return new Promise((resolve, reject) => {
            let res = '';
            stream.on('data', (chunk) => res += chunk)
                .on('end', () => resolve(res))
        })
    } else {
        return stream.toString();
    }
}

exports.readBody = readBody;