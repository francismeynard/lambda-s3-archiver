# lambda-s3-archiver
```
npm install lambda-s3-archiver --save
```

## Introduction
This nodejs module will read and archive files in AWS S3 bucket using **stream**, and store the archive file in S3 as well. It works very well archiving any files in S3 bucket. Since it is using **stream** in both reading the source files and writing the archive file, it can safely process large files without too much memory needed in the lambda.

## Description
```
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
```

## Usage

1. Archive **ALL files** in the specified s3 sourcePath prefix.
```
const s3Archiver = require('lambda-s3-archiver');

const result = await s3Archiver.archive('s3-bucket-name', 's3-prefix-path');
console.log(result);
```

Passing outputFilename and outputFormat as parameters.
```
const s3Archiver = require('lambda-s3-archiver');

const result = await s3Archiver.archive('s3-bucket-name', 's3-prefix-path', [], 'outputFile', 'zip');
console.log(result);
```

2. Archive **specified list of files** in the specified s3 sourcePath prefix.
```
const s3Archiver = require('lambda-s3-archiver');

const result = await s3Archiver.archive('s3-bucket-name', 's3-prefix-path', ['files1', 'files2'], 'outputFile', 'tar');
console.log(result);
```

**Important**

Please make sure the lambda has read and write access to specifed source S3 Bucket.

Sample Lambda using the lambda-s3-archiver, with Cloudformation, can be found [here](https://github.com/francismeynard/aws-journey/s3-archiver-service#readme).

## Test
```
npm run test
```
