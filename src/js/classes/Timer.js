export default class Timer {
  constructor(fps = 60) {
    this.deltaTime = parseInt(1000 / fps, 10);
    this.lastTime = 0;
    this.tasks = new Set();

    this.update = (time) => {
      const deltaTime = time - this.lastTime;

      if (this.TimerID) {
        if (deltaTime >= this.deltaTime) {
          this.tasks.forEach((task) => {
            task(deltaTime);
          });

          this.lastTime = time;
        }

        this.TimerID = window.requestAnimationFrame(this.update);
      }
    };
  }

  addTask(task) {
    if (typeof task === 'function') {
      this.tasks.add(task);
    }
  }

  deleteTask(task) {
    this.tasks.delete(task);
  }

  start() {
    if (this.TimerID) {
      this.stop(this.TimerID);
    }

    this.TimerID = window.requestAnimationFrame(this.update);
  }

  stop() {
    this.TimerID = null;
    window.cancelAnimationFrame(this.TimerID);
  }

  pause() {
    this.stop();
  }
}
