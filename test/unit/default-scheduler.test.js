const DefaultScheduler = require('../../lib/default-scheduler')

describe('DefaultScheduler', () => {
  let scheduler

  beforeEach(() => {
    scheduler = new DefaultScheduler()
  })

  describe('.prototype.updateDocument(fn)', () => {
    it('performs all update requests on the next animation frame', async () => {
      let events = []
      scheduler.updateDocument(() => events.push(1))
      scheduler.updateDocument(() => events.push(2))
      scheduler.updateDocument(() => events.push(3))

      expect(events).to.eql([])

      await new Promise(requestAnimationFrame)

      expect(events).to.eql([1, 2, 3])
    })

    it('performs update requests that occur during another update in the same animation frame', async () => {
      let events = []
      scheduler.updateDocument(() => {
        events.push(1)
        scheduler.updateDocument(() => {
          events.push(2)
          scheduler.updateDocument(() => {
            events.push(3)
          })
        })
      })

      expect(events).to.eql([])

      await new Promise(requestAnimationFrame)

      expect(events).to.eql([1, 2, 3])
    })
  })

  describe('.prototype.readDocument', () => {
    describe('when document updates are pending', () => {
      it('defers all requested reads until all requested updates are completed', async () => {
        let events = []

        scheduler.updateDocument(() => events.push('update 1'))
        scheduler.readDocument(() => events.push('read 1'))
        scheduler.updateDocument(() => events.push('update 2'))
        scheduler.readDocument(() => events.push('read 2'))

        expect(events).to.eql([])

        await new Promise(requestAnimationFrame)

        expect(events).to.eql(['update 1', 'update 2', 'read 1', 'read 2'])
      })
    })

    describe('when document updates are in progress', () => {
      it('defers all requested reads until all in-progress updates are completed', async () => {
        let events = []

        scheduler.updateDocument(() => {
          events.push('update 1')
          scheduler.readDocument(() => {
            events.push('read 1')
          })
        })
        scheduler.updateDocument(() => {
          events.push('update 2')
          scheduler.readDocument(() => {
            events.push('read 2')
          })
        })

        expect(events).to.eql([])

        await new Promise(requestAnimationFrame)

        expect(events).to.eql(['update 1', 'update 2', 'read 1', 'read 2'])
      })
    })

    describe('when no document updates are pending or in progress', () => {
      it('defers requested reads until the next animation frame for consistency', async () => {
        let events = []

        scheduler.readDocument(() => events.push('read 1'))
        scheduler.readDocument(() => events.push('read 2'))

        expect(events).to.eql([])

        await new Promise(requestAnimationFrame)

        expect(events).to.eql(['read 1', 'read 2'])
      })
    })
  })
})
