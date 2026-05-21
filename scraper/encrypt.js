import javascriptObfuscator from 'javascript-obfuscator';

async function obfus(code) {
    return new Promise((resolve, reject) => {
        try {
            const obfuscated = javascriptObfuscator.obfuscate(code, {
                'compact': true,
                'controlFlowFlattening': true,
                'controlFlowFlatteningThreshold': 1,
                'numbersToExpressions': true,
                'simplify': true,
                'stringArrayShuffle': true,
                'splitStrings': true,
                'stringArrayThreshold': 1
            });
            
            const result = {
                'status': 200,
                'author': '//Encrypt By MechaBot\n//By DianaXyz\n\n',
                'result': obfuscated.getObfuscatedCode()
            };
            resolve(result);
        } catch(error) {
            reject(error);
        }
    });
}

export { obfus };