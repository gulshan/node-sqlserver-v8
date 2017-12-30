var Mocha = require('mocha')
var sql = require('msnodesqlv8')
var path = require('path')

runTest()

function runTest () {
  var argv = require('minimist')(process.argv.slice(2))
  console.log(argv)
  var connStr = null

  var toRun
  if (argv.hasOwnProperty('t')) {
    toRun = argv['t']
  }

  if (argv.hasOwnProperty('a')) {
    connStr = 'Server=(local)\\SQL2017;Database=master;User ID=sa;Password=Password12!'
  }

  if (!Array.isArray(toRun)) {
    toRun = [toRun]
  }

  run(toRun, function (e) {
    console.log(e)
    process.exit(e)
  })

  function run (files, done) {
    var mocha = new Mocha(
      {
        ui: 'tdd'
      }
    )

    mocha.suite.on('pre-require', function (g) {
      g.native_sql = sql
      if (connStr) {
        g.conn_str = connStr
      }
    })

    mocha.suite.on('require', function (a, b, c) {
    })

    files.forEach(function (f) {
      var p = path.join('unit.tests', f)
      mocha.addFile(p)
    })

    mocha.run(function (failures) {
      process.on('uncaughtException', function (err) {
        console.log(err)
      })

      process.on('exit', function () {
        done(failures)
      })
    })
  }
}
