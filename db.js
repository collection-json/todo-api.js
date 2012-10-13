
var _ = require("underscore");

var _data = require("./database/tasks.json");

var data = _.clone(_data)

module.exports.get = function (view, options, done) {
  if (typeof options === "function") {
    done = options;
    options = {};
  }

  switch (view) {
    case "all":
      done(null, data);
      break;
    case "open":
      var filteredTasks = _.filter(data, function(task) {
        return task.completed === false;
      });
      done(null, filteredTasks);
      break;
    case "closed":
      var filteredTasks = _.filter(data, function(task) {
        return task.completed === true;
      });
      done(null, filteredTasks);
      break;
    case "due_date":
      var filteredTasks = _.filter(data, function(task) {
        var due = new Date(task.dateDue);
        var start = due > (options.startDate?(new Date(options.startDate)):0);
        var end = due < (options.startDate?(new Date(options.startDate)):Number.MAX_VALUE);
        return start && end;
      });
      done(null, filteredTasks);
      break;
    default:
      // It's an item
      var item = _.find(data, function(task) {
        return view === task.id;
      });
      done(null, item);
      break;
  }
}

module.exports.save = function (doc, done) {
  doc.id = "task"+data.length;
  data.push(doc);
  done(null, doc);
}

module.exports.update = function (id, doc, done) {
  var item = _.find(data, function(task) {
    return id === task.id;
  });

  if (!item) {
    return done(new Error("Item not found"));
  }

  _.each(item, function(value, key) {
    item[key] = value;
  });

  done(null, item);
}

module.exports.remove = function (id, done) {
  var removed = false;
  data = _.filter(data, function(task) {
    var keep = task.id !== id;
    removed = !removed && !keep
    return keep;
  });

  if (!removed) {
    done(new Error("Item "+id+" not found"))
  };

  done(null);
}

