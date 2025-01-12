// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * @author Solution Builders
 */

const { getOptions } = require('../utils/metrics');
const { PRIMARY_USER_POOL_ID } = process.env;

const AWS = require('aws-sdk');
const cognitoISP = new AWS.CognitoIdentityServiceProvider(getOptions());

/**
 * Checks the configuration of the primary user pool to ensure it is supported by the solution
 * @param {object} event
 */
exports.handler = async (event) => {
    console.log(`Received event: ${JSON.stringify(event, null, 2)}`);
    const result = {};

    const describeUserPoolParams = { UserPoolId: PRIMARY_USER_POOL_ID };
    console.log(`Describing user pool: ${JSON.stringify(describeUserPoolParams)}`);
    const describeUserPoolResponse = await cognitoISP.describeUserPool(describeUserPoolParams).promise();
    console.log(`Describe user pool response: ${JSON.stringify(describeUserPoolResponse, null, 2)}`);

    if (describeUserPoolResponse.UserPool.UsernameAttributes) {
        if (describeUserPoolResponse.UserPool.UsernameAttributes.length > 1) {
            throw new Error(`This solution does not support user pools for which more than one username attribute is allowed. Configured username attributes: ${JSON.stringify(describeUserPoolResponse.UserPool.UsernameAttributes)}`);
        }
        result.UsernameAttributes = JSON.stringify(describeUserPoolResponse.UserPool.UsernameAttributes);
    }

    console.log(`Result: ${JSON.stringify(result)}`);
    return { result: result };
};
