class EventBus {
     constructor() {
          this.events = this.events || new Object();
     }
}

//发布事件,type-- 事件类型，args-- 参数集
EventBus.prototype.emit = function (type, ...args) {
     let e;
     e = this.events[type];
     if (!e) {
          return;
     }
     //依次调用
     Object.keys(e).forEach(key => {
          e[key].apply(this, args);
     })
};

//绑定监听函数
EventBus.prototype.addListener = function (type, key, fun) {
     const e = this.events[type];
     if (!e) {
          this.events[type] = new Object();
          this.events[type][key] = fun;
     } else {
          e[key] = fun;
     }
};

//解绑监听函数
EventBus.prototype.removeListener = function (type, key) {
     let e = this.events[type];
     if (!e) {
          return;
     }
     delete e[key];
};

//解绑监听函数
EventBus.prototype.removeAllListeners = function () {
     this.events = new Object();
};

const eventBus = new EventBus();
export default eventBus;
