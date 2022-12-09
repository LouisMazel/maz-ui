/* eslint-disable no-console */
// @ts-check
const chalk = require('chalk')

module.exports = {
  /** @param {string} message */
  success: (message) => console.log(chalk.green(message)),
  /**
   * @param {string} message
   * @param {any} error
   */
  error: (message, error) => console.log(chalk.red(message, error)),
}
