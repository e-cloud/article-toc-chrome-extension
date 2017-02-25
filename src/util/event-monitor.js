function getEvents(element) {
  return Object.keys(element)
    .reduce((events, evt) => {
      if (evt.startsWith('on')) {
        events.push(evt.slice(2))
      }

      return events
    }, [])
}

function monitorEvents(element, ...ignoreList) {
  const eventList = getEvents(element)

  const expectedEvents = eventList.reduce((acc, evt) => {
    const ignored = ignoreList.reduce((count, ignore) => {
      if (evt.includes(ignore)) {
        count += 1 // eslint-disable-line
      }
      return count
    }, 0)

    if (!ignored) {
      acc.push(evt)
    }

    return acc
  }, [])

  expectedEvents.forEach((evt) => {
    element.addEventListener(evt, (event) => {
      console.log(`capture ${evt}`, event)
    }, true)
    element.addEventListener(evt, (event) => {
      console.log(`bubble ${evt}`, event)
    })
  })
}

monitorEvents(window, 'mouse', 'pointer', 'scroll', 'wheel', 'resize', 'message');
