// from https://gist.github.com/fatihacet/1290216

const pubsub = {};
const topics = new Map();
let subUid = -1;

pubsub.subscribe = function (topic, func) {
  if (!topics.get(topic)) {
    topics.set(topic, []);
  }
  const token = (++subUid).toString();
  topics.get(topic).push({
    token,
    func,
  });
  return token;
};

pubsub.publish = function (topic, args) {
  if (!topics.get(topic)) {
    return false;
  }
  setTimeout(function () {
    const subscribers = topics.get(topic);
    let len = subscribers ? subscribers.length : 0;

    while (len--) {
      subscribers[len].func(topic, args);
    }
  }, 0);
  return true;
};

pubsub.unsubscribe = function (token) {
  for (const subs of topics) {
    for (let i = 0, j = subs.length; i < j; i++) {
      if (subs[i].token === token) {
        subs.splice(i, 1);
        return token;
      }
    }
  }

  return false;
};

export default pubsub;
