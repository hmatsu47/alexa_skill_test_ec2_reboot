/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');
const aws = require('aws-sdk');
const ec2 = new aws.EC2({region: 'ap-northeast-1'});

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const servers = { 'デービーサーバー': 'i-XXXXXXXXXXXXXXXXX' , 'ウェブサーバー': 'i-XXXXXXXXXXXXXXXXX' };

const handlers = {
    'Unhandled': function () {
        this.emit('LaunchRequest');
    },
    'LaunchRequest': function () {
        this.emit(':ask', 'サーバー名、および起動、停止、再起動を指示してください。');
    },
    'StartIntent': function () {
        const server = this.event.request.intent.slots.ServerName.value;
        const self = this;
        if (servers[server]) {
            const params = { InstanceIds: [servers[server]] };
            ec2.startInstances(params, function(err, data){
                if (err) {
                    const message = server + 'は起動できませんでした。';
                    self.emit(':tell', message);
                } else {
                    const message = server + 'を起動しました。';
                    self.emit(':tell', message);
                }
            });
        } else {
            const message = server + 'はありません。';
            self.emit(':tell', message);
        }
    },
    'StopIntent': function () {
        const server = this.event.request.intent.slots.ServerName.value;
        const self = this;
        if (servers[server]) {
            const params = { InstanceIds: [servers[server]] };
            ec2.stopInstances(params, function(err, data){
                if (err) {
                    const message = server + 'は停止できませんでした。';
                    self.emit(':tell', message);
                } else {
                    const message = server + 'を停止しました。';
                    self.emit(':tell', message);
                }
            });
        } else {
            const message = server + 'はありません。';
            self.emit(':tell', message);
        }
    },
    'RebootIntent': function () {
        const server = this.event.request.intent.slots.ServerName.value;
        const self = this;
        if (servers[server]) {
            const params = { InstanceIds: [servers[server]] };
            ec2.rebootInstances(params, function(err, data){
                if (err) {
                    const message = server + 'は再起動できませんでした。';
                    self.emit(':tell', message);
                } else {
                    const message = server + 'を再起動しました。';
                    self.emit(':tell', message);
                }
            });
        } else {
            const message = server + 'はありません。';
            self.emit(':tell', message);
        }
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = 'サーバーを起動、停止、再起動します。サーバーにはデービーサーバーとウェブサーバーの2台があります。';
        const reprompt = 'サーバー名、および起動、停止、再起動を指示してください。';
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', '中断します。');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'お疲れさまでした。');
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
//    alexa.resources = 'ja';
    alexa.registerHandlers(handlers);
    alexa.execute();
};
