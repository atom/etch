import DefaultScheduler from '../../src/default-scheduler'

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

  describe('.prototype.updateDocumentSync(fn)', () => {
    it('performs the update request and any requests made during the update request immediately', () => {
      let events = []

      scheduler.updateDocumentSync(() => {
        events.push(1)
        scheduler.updateDocument(() => {
          events.push(2)
        })
        scheduler.updateDocumentSync(()=> {
          events.push(3)
        })
      })

      expect(events).to.eql([1, 2, 3])
    })
  })
})
