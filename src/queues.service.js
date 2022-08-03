const { Queue, Worker, QueueScheduler } = require('bullmq');

const { redis } = require('./env-loader.service').server;

const redisOptions = {
  connection: redis
};

const queueName = 'doorbell-status';

new QueueScheduler(queueName, redisOptions);

const queue = new Queue(queueName, redisOptions);

new Worker(
  queueName,
  async job => {
    console.warn(`job with id=${job.id} in process`);
  },
  redisOptions
);

async function cleanJobs() {
  return Promise.all([queue.clean(100, 1000, 'failed'), queue.clean(100, 1000, 'completed')]);
}

module.exports = {
  addNotification: async payload => {
    await cleanJobs();
    const job = await queue.getJob(payload.id);
    if (job) {
      console.info(`[addNotification] => remove job with id=${job.id} if it exists`);
      await job.remove();
    }
    console.info(`[addNotification]=> add job with id=${payload.id}`);
    return queue.add('*', payload, { delay: 10000, jobId: payload.id }); // delay 10 sec
  },
  removeNotification: async jobId => {
    await cleanJobs();
    const job = await queue.getJob(jobId);
    if (job) {
      console.info(`[addNotification] => remove job with id=${job.id} if it exists`);
      await job.remove();

      return;
    }
    console.info(`[removeNotification]=> job with id=${jobId} was not found`);
  }
};

