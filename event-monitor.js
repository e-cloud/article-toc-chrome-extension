function getEvents(element) {
    return Object.keys(window).reduce(function (events, evt) {

        if (evt.startsWith('on')) {
            events.push(evt.slice(2))
        }

        return events
    }, [])
}

function monitorEvents(element, ...ignoreList) {
    const eventList = getEvents(element)

    const expectedEvents = eventList.reduce(function (acc, evt) {
        if (!ignoreList.reduce((count, ignore) => {
                if (evt.includes(ignore)) count++
                return count
            }, 0))
            acc.push(evt)

        return acc
    }, [])

    expectedEvents.forEach(evt => {
        element.addEventListener(evt, event => {
            console.log('capture ' + evt, event)
        }, true)
        element.addEventListener(evt, event => {
            console.log('bubble ' + evt, event)
        })
    })
}

monitorEvents(window, 'mouse', 'pointer', 'scroll', 'wheel', 'resize', 'message');
