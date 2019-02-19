'use strict';

const aws = require('aws-sdk');
const archiver = require('archiver');
const { PassThrough } = require('stream');

const s3 = new aws.S3();

/*
 * This nodejs module will read and archive files in AWS S3 bucket using stream, and store the archived file in S3 as well..
 * @param {sourceBucket} - the S3 bucket containing the files to archive
 * @param {sourcePath} - the S3 prefix/path containing the files to archive
 * @param {sourceFiles} - (OPTIONAL) the list of filenames in the sourcePath to archive
 *                      - If not specified, all the files in sourcePath will be included in the archive
 * @param {outputFilename} - the filename of the archive file. Default to 'archive'.
 * @param {outputFormat} - the format of the archive file (zip | tar). Default to 'zip'.
 * @return {object} - a JSON object containing the details of the archive file.
    {
        s3Bucket: 's3-bucket-name',
        fileKey: 's3-prefix-path/archive.zip',
        fileSize: 1024
    }
 */
const archive = (sourceBucket, sourcePath, sourceFiles = [], outputFilename = 'archive', outputFormat = 'zip') => {
    return new Promise(async (resolve, reject) => {
        try {
            const format = (['zip', 'tar'].includes(outputFormat.toLowerCase()) ? outputFormat : 'zip');
            const streamArchiver = archiver(format);

            const outputFilePath = `${sourcePath}/${outputFilename}.${format}`;
            const outputStream = new PassThrough();

            s3.upload({ Bucket: sourceBucket, Key: outputFilePath, Body: outputStream }, function(error, data) {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        s3Bucket: data.Bucket,
                        fileKey: data.Key,
                        fileSize: streamArchiver.pointer()
                    });
                }
            });

            streamArchiver.pipe(outputStream);

            if (sourceFiles && sourceFiles.length > 0) {
                sourceFiles = sourceFiles.map(file => `${sourcePath}/${file}`);
            } else {
                // Include all files in the S3 sourcePath in the archive if sourceFiles is empty
                let s3Objects = await s3.listObjects({ Bucket: sourceBucket, Prefix: sourcePath }).promise();
                console.log(`Found ${s3Objects.Contents.length} files in ${sourcePath}`);

                sourceFiles = s3Objects.Contents.map(content => { return content.Key; });
            }

            console.log(sourceFiles);
            for (let s3File of sourceFiles) {
                let fileReadStream = s3.getObject({ Bucket: sourceBucket, Key: s3File }).createReadStream();
                streamArchiver.append(fileReadStream, { name: s3File.substring(s3File.lastIndexOf("/") + 1) });
            }

            streamArchiver.finalize();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports.archive = archive;