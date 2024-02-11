module.exports = function() {
  return {
    // The way these are used, it may be expecting normalized '/' paths; it's not clear. TODO: test on windows
    partial : __dirname + '/partial/**/*.hbs', /* eslint-disable-line n/no-path-concat */
    helper  : __dirname + '/helpers/**/*.js' /* eslint-disable-line n/no-path-concat */
  }
}
