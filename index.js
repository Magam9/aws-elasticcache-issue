const Express = require('express');
const bodyParser = require('body-parser');

const { addNotification, removeNotification } = require('./src/queues.service');

const app = Express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const jobPayloads = [
  {
    id: 1,
    data: {
      userId: 1,
      userName: 'User 1',
      email: 'test-1@mail.com'
    }
  },
  {
    id: 2,
    data: {
      userId: 2,
      userName: 'User 1',
      email: 'test-1@mail.com'
    }
  }
];

// Adds jobs to a queue
app.get('/', async (_, res, next) => {
  try {
    await Promise.all(jobPayloads.map(payload => removeNotification(payload.id)));
    await Promise.all(jobPayloads.map(payload => addNotification(payload)));
    res.send(`There were ${jobPayloads.length} jobs`);
  } catch (error) {
    next(error);
  }
});

app.listen(3000, () => {
  console.info('Server run on the 3000 port');
});
