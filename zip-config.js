var zip = require('bestzip');

var files = [];

zip('.zip/darwin-x64.zip', ['zip/'], function(err) {
  if (err) {
    console.error(err.stack);
    process.exit(1);
  } else {
    console.log('all done!');
  }
});

zip('.zip/linux-ia32.zip', ['zip/'], function(err) {
  if (err) {
    console.error(err.stack);
    process.exit(1);
  } else {
    console.log('all done!');
  }
});

zip('.zip/linux-x64.zip', ['zip/'], function(err) {
  if (err) {
    console.error(err.stack);
    process.exit(1);
  } else {
    console.log('all done!');
  }
});

zip('.zip/-x64.zip', ['zip/'], function(err) {
  if (err) {
    console.error(err.stack);
    process.exit(1);
  } else {
    console.log('all done!');
  }
});

zip('.zip/darwin-x64.zip', ['zip/'], function(err) {
  if (err) {
    console.error(err.stack);
    process.exit(1);
  } else {
    console.log('all done!');
  }
});
