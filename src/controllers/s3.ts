import * as AWS from 'aws-sdk';
import { v4 } from 'uuid';

export async function createFolder() {
    AWS.config.getCredentials(function(err) {
        if (err) console.log(err.stack);
        // credentials not loaded
        else {
            console.log('Access key:', AWS.config.credentials.accessKeyId);
            console.log('Secret access key:', AWS.config.credentials.secretAccessKey);
            const folderName: string = v4();

            const objectParams = { Bucket: 'e3d-resources-development', Key: `${folderName}/test.txt`, Body: 'Hello World!' };
            const uploadPromise = new AWS.S3({ apiVersion: '2006-03-01' }).putObject(objectParams).promise();
            uploadPromise.then(
                function(data) {
                    console.log('Successfully uploaded data', data);
                });
        }
    });
}

export async function getDownloadUrl(bucketName: string, folderName: string) {
    const s3 = new AWS.S3({
        signatureVersion: 'v4',
        region: 'eu-west-2',
    });
    const url: string = s3.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: folderName,
        Expires: 60 * 2,
    });

    console.log(url);
}

export async function listObjects(bucketName: string, folderName: string) {
    const s3 = new AWS.S3({
        signatureVersion: 'v4',
        region: 'eu-west-2',
    });

    const params = {
        Bucket: bucketName,
        MaxKeys: 1000,
        Prefix: folderName,
    };
    s3.listObjectsV2(params, (error, data) => {
        console.log(error, data);
    });
}
