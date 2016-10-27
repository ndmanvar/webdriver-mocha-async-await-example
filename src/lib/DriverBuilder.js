'use strict';

import webdriver from 'selenium-webdriver';
import SauceLabs from 'saucelabs';

export default class DriverBuilder {
  constructor() {
    const username = process.env.SAUCE_USERNAME,
          accessKey = process.env.SAUCE_ACCESS_KEY,
          saucelabs = new SauceLabs({
              username: username,
              password: accessKey
          }),
          builder = new webdriver.Builder().usingServer('https://' + username + ':' +accessKey + '@ondemand.saucelabs.com:443/wd/hub');

    builder.withCapabilities({
        'browserName': 'chrome',
        'platform': 'Windows 7',
        'version': '43.0',
        'username': username,
        'accessKey': accessKey
    });
    this._driver = builder.build();
    this.saucelabs = saucelabs;
  }

  get driver() {
    return this._driver;
  }

  async quit() {
    const sessionId = (await this._driver.getSession()).id_;

    await this.saucelabs.updateJob(sessionId, {
      passed: false,
      name: '444'
    });
    return this._driver.quit();
  }

}
