'use strict';

const sinon = require('sinon');
const { assert } = require('chai');
const aws = require('aws-sdk');

const s3Archiver = require('../index.js');

describe('S3Archiver', () => {

    describe('#archive()', () => {

        beforeEach(() => {
            this.callback = sinon.fake();
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should archive S3 files in sourcePath and return archived file details', async () => {
            // GIVEN
            const sourceBucket = 's3-bucket-name-test';
            const sourcePath = 's3-prefix-path-test';
            const outputFilename = 'outputFile';
            const outputFormat = 'zip';

            const s3Key = `${sourcePath}/${outputFilename}.${outputFormat}`;
            sinon.stub(aws.S3.prototype, 'upload').yields(null, { "Bucket": sourceBucket, "Key": s3Key });

            // WHEN
            const result = await s3Archiver.archive(sourceBucket, sourcePath, [], outputFilename, outputFormat);
            console.log(result);

            // THEN
            assert.isNotNull(result);
            assert.equal(result.s3Bucket, sourceBucket);
            assert.equal(result.fileKey, s3Key);
            assert.equal(result.fileSize, 0);
        });
    });

});