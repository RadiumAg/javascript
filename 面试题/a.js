class Scheduler {
  jobArray = [];
  runJobsArray = [];
  freshing = false;
  isFrshing = false;

  constructor() {}

  runJobs() {
    if (this.runJobsArray.length < 2) {
      const currentJob = this.jobArray.shift();
      if (currentJob != null) {
        this.runJobsArray.push(currentJob);
      } else if (currentJob == null) {
        this.runJobsArray[0].task().then(() => {
          this.runJobsArray[0].resolve();
        });
      }
    }

    if (this.runJobsArray.length === 2 && !this.isFrshing) {
      this.isFrshing = true;

      Promise.race(
        this.runJobsArray.map((j) => {
          return j.task().then((res) => {
            return {
              res,
              resolve: j.resolve,
            };
          });
        })
      ).then((res) => {
        res.resolve(res);
        this.isFrshing = false;
        this.runJobsArray = this.runJobsArray.filter(
          (r) => r.resolve !== res.resolve
        );

        this.runJobs();
      });
    }
  }

  add(task) {
    let resolveValue;
    const promise = new Promise((resolve) => {
      resolveValue = resolve;
    });

    this.jobArray.push({ task, resolve: resolveValue });
    this.runJobs();

    return promise;
  }
}

/* 测试代码，请勿修改 */
const timeout = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

const scheduler = new Scheduler();
const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(() => console.log(order));
};

addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');
