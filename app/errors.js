exports.types = {
    fileNotFound: 'FileNotFound',
    invalidConfigFile: 'InvalidConfigFile'
}
exports.fileNotFound = function(path) {
    return { type: exports.types.fileNotFound, path: path };
}
exports.invalidConfigFile = function() {
    return { type: exports.types.invalidConfigFile };
}