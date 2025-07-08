class Scheduler {
  jobArray = [];
  runJobsArray = [];
  freshing = false;
  isFrshing = false;
  seenJob = [];

  constructor() {}

  getSeenJob(j) {}

  runJobs() {
    if (this.runJobsArray.length < 2) {
      const currentJob = this.jobArray.shift();
      if (currentJob != null) {
        this.runJobsArray.push(currentJob);
      } else if (currentJob == null) {
        const j = this.runJobsArray[0];
        const senndJobObj = this.seenJob.find((s) => s.j === j);

        if (senndJobObj) {
          senndJobObj.promise.then((res) => {
            j.resolve(res);
          });
        }
      }
    }

    if (this.runJobsArray.length === 2 && !this.isFrshing) {
      this.isFrshing = true;

      Promise.race(
        this.runJobsArray.map((j) => {
          const senndJobObj = this.seenJob.find((s) => s.j === j);

          if (senndJobObj) {
            return senndJobObj.promise.then((res) => {
              return {
                res,
                resolve: j.resolve,
              };
            });
          }

          const promise = j.task();

          if (senndJobObj == null) {
            this.seenJob.push({ j, promise });
          }

          return promise.then((res) => {
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
    // console.log('执行了', time);
    setTimeout(resolve, time);
  });

const scheduler = new Scheduler();
const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(() => console.log(order));
};


