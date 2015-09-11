exports.types = {
    fileNotFound: 'FileNotFound',
    invalidConfigFile: 'InvalidConfigFile',
    contentUnavailable: 'contentUnavailable',
    noContentToBackup: 'noContentToBackup',
    compressionFailed: 'compressionFailed',
    encryptionFailed: 'encryptionFailed',
    uploadFailed: 'uploadFailed',
    ftpCleaningFailed: 'ftpCleaningFailed'
}

exports.fileNotFound = function(path, err) {
    return { type: exports.types.fileNotFound, path: path, error: err };
}
exports.invalidConfigFile = function(err) {
    return { type: exports.types.invalidConfigFile, error: err };
}
exports.contentUnavailable = function(directory, err) {
    return { type: exports.types.contentUnavailable, directory: directory, error: err };
}
exports.noContentToBackup = function(directory, err) {
    return { type: exports.types.noContentToBackup, directory: directory, error: err };
}
exports.compressionFailed = function(directory, outputFile, err) {
    return { type: exports.types.compressionFailed, directory: directory, outputFile: outputFile, error: err };
}
exports.encryptionFailed = function(zipFile, outputFile, err) {
    return { type: exports.types.encryptionFailed, zipFile: zipFile, outputFile: outputFile, error: err };
}
exports.uploadFailed = function(err) {
    return { type: exports.types.uploadFailed, error: err };
}
exports.ftpCleaningFailed = function(err) {
    return { type: exports.types.ftpCleaningFailed, error: err };
}