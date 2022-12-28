/** @jsx etch.dom */

const etch = require('../../lib/index')

describe('etch.dom', () => {
  it('defaults properties to an empty object', () => {
    let props = null

    class MyComponent {
      constructor (p) {
        props = p
      }

      render () { return <span /> }

      update () {}
    }

    let owner = {
      render () {
        return <MyComponent />
      },

      update () {}
    }

    etch.initialize(owner)
    expect(props).to.eql({})
  })

  it('normalizes camel-cased property names to dash-seperated attributes for SVG tags', function () {
    let component = {
      render () {
        return <circle colorProfile='foo' colorRendering='bar' />
      },
      update () {}
    }

    etch.initialize(component)
    expect(component.element.outerHTML).to.equal('<circle color-profile="foo" color-rendering="bar"></circle>')
  })

  it('supports assigning innerHTML to SVG tags', function () {
    let component = {
      render () {
        return <svg innerHTML="<circle></circle>"></svg>
      },
      update () {}
    }

    etch.initialize(component)
    expect(component.element.outerHTML).to.equal('<svg><circle></circle></svg>')
  })

  it('ignores nulls and false passed in the place of children, but throws an error if other invalid values are passed', () => {
    const element = etch.render(
      <div><span/>{null}{false}<p/></div>
    );

    expect(Array.from(element.children).map(c => c.tagName)).to.eql(['SPAN', 'P'])

    expect(() => etch.render(
      <div>{undefined}</div>
    )).to.throw('Invalid child node: undefined')

    expect(() => etch.render(
      <div>{() => {}}</div>
    )).to.throw('Invalid child node: () => {}')
  })

  describe('when a component constructor is used as a tag name', () => {
    describe('on initial render', () => {
      it('constructs the component with the specified properties and children, then appends its element to the DOM', () => {
        class ChildComponent {
          constructor (properties, children) {
            this.properties = properties
            this.children = children
            etch.initialize(this)
          }

          render () {
            return <div>{this.properties.greeting} {this.children}</div>
          }

          update () {}
        }

        let parentComponent = {
          render () {
            return (
              <div>
                <ChildComponent greeting='Hello'>
                  <span>World</span>
                </ChildComponent>
              </div>
            )
          },

          update () {}
        }

        etch.initialize(parentComponent)
        expect(parentComponent.element.textContent).to.equal('Hello World')
      })
    })

    describe('on update', () => {
      describe('if the child component class is the same', () => {
        describe('if the child component defines an update() method', () => {
          it('invokes the update method with the new properties and children', async () => {
            class ChildComponent {
              constructor (properties, children) {
                this.properties = properties
                this.children = children
                etch.initialize(this)
              }

              render () {
                return <div>{this.properties.greeting} {this.children}</div>
              }

              update (properties, children) {
                this.properties = properties
                this.children = children
                etch.update(this)
              }
            }

            let parentComponent = {
              greeting: 'Hello',
              greeted: 'World',
              render () {
                return (
                  <div>
                    <ChildComponent greeting={this.greeting}>
                      <span>{this.greeted}</span>
                    </ChildComponent>
                  </div>
                )
              },

              update () {}
            }

            etch.initialize(parentComponent)
            expect(parentComponent.element.textContent).to.equal('Hello World')
            let initialChildElement = parentComponent.element.firstChild

            parentComponent.greeting = 'Goodnight'
            parentComponent.greeted = 'Moon'
            await etch.update(parentComponent)

            expect(parentComponent.element.textContent).to.equal('Goodnight Moon')
            expect(parentComponent.element.firstChild).to.equal(initialChildElement)
          })
        })

        describe('if the child component does not define an update method', () => {
          it('throws an error', async () => {
            let component = {
              render () {
                return (
                  <div />
                )
              }
            }

            expect(() => etch.initialize(component)).to.throw(Error)
          })
        })
      })

      describe('if the component class changes', () => {
        it('builds a new component instance and replaces the previous element with its element', async () => {
          class ChildComponentA {
            constructor () {
              etch.initialize(this)
            }

            render () {
              return <div>A</div>
            }

            update () {}
          }

          class ChildComponentB {
            constructor () {
              etch.initialize(this)
            }

            render () {
              return <div>B</div>
            }

            update () {}
          }

          let parentComponent = {
            condition: true,

            render () {
              if (this.condition) {
                return <div><ChildComponentA /></div>
              } else {
                return <div><ChildComponentB /></div>
              }
            },

            update () {}
          }

          etch.initialize(parentComponent)
          expect(parentComponent.element.textContent).to.equal('A')
          let initialChildElement = parentComponent.element.firstChild

          parentComponent.condition = false
          await etch.update(parentComponent)

          expect(parentComponent.element.textContent).to.equal('B')
          expect(parentComponent.element.firstChild).not.to.equal(initialChildElement)
        })
      })

      describe('if components are reordered', () => {
        it('builds a new component instance and replaces the previous element with its element', async () => {
          class ChildComponentA {
            constructor () {
              this.updateCalled = false
              etch.initialize(this)
            }

            render () {
              return <div>A</div>
            }

            update () {
              this.updateCalled = true
            }
          }

          class ChildComponentB {
            constructor () {
              this.updateCalled = false
              etch.initialize(this)
            }

            render () {
              return <div>B</div>
            }

            update () {
              this.updateCalled = true
            }
          }

          let parentComponent = {
            condition: true,

            render () {
              if (this.condition) {
                return (
                  <div>
                    <ChildComponentA key='a' ref='a' />
                    <ChildComponentB key='b' ref='b' />
                  </div>
                )
              } else {
                return (
                  <div>
                    <ChildComponentB key='b' ref='b' />
                    <ChildComponentA key='a' ref='a' />
                  </div>
                )
              }
            },

            update () {}
          }

          etch.initialize(parentComponent)
          let element = parentComponent.element
          let childComponentA = parentComponent.refs.a
          let childComponentB = parentComponent.refs.b
          let childElementA = element.children[0]
          let childElementB = element.children[1]
          expect(childComponentA.updateCalled).to.be.false
          expect(childComponentB.updateCalled).to.be.false

          parentComponent.condition = false
          await etch.update(parentComponent)

          expect(element.children[0]).to.equal(childElementB)
          expect(element.children[1]).to.equal(childElementA)
          expect(parentComponent.refs.a).to.equal(childComponentA)
          expect(parentComponent.refs.a.element).to.equal(childElementA)
          expect(parentComponent.refs.b).to.equal(childComponentB)
          expect(parentComponent.refs.b.element).to.equal(childElementB)
          expect(childComponentA.updateCalled).to.be.true
          expect(childComponentB.updateCalled).to.be.true
        })
      })
    })

    describe('when the child component constructor tag has a ref property', () => {
      it('creates a reference to the child component object on the parent component', async () => {
        class ChildComponentA {
          constructor (properties) {
            this.properties = properties
            etch.initialize(this)
          }

          render () {
            return <div ref='self'>A</div>
          }

          update (properties) {
            this.properties = properties
          }
        }

        class ChildComponentB {
          constructor (properties) {
            this.properties = properties
            etch.initialize(this)
          }

          render () {
            return <div ref='self'>B</div>
          }

          update () {}
        }

        let parentComponent = {
          renderA: true,
          refName: 'child',

          render () {
            if (this.renderA) {
              return <div><ChildComponentA ref={this.refName} /></div>
            } else if (this.renderB) {
              return <div><ChildComponentB ref={this.refName} /></div>
            } else {
              return <div />
            }
          },

          update () {}
        }

        etch.initialize(parentComponent)

        expect(parentComponent.refs.child instanceof ChildComponentA).to.be.true
        expect(parentComponent.refs.child.properties.ref).to.equal('child')
        expect(parentComponent.refs.child.refs.self.textContent).to.equal('A')

        parentComponent.refName = 'kid'
        await etch.update(parentComponent)

        expect(parentComponent.refs.child).to.be.undefined
        expect(parentComponent.refs.kid instanceof ChildComponentA).to.be.true
        expect(parentComponent.refs.kid.properties.ref).to.equal('kid')
        expect(parentComponent.refs.kid.refs.self.textContent).to.equal('A')

        parentComponent.refName = 'child'
        parentComponent.renderA = false
        parentComponent.renderB = true
        await etch.update(parentComponent)

        expect(parentComponent.refs.kid).to.be.undefined
        expect(parentComponent.refs.child instanceof ChildComponentB).to.be.true
        expect(parentComponent.refs.child.properties.ref).to.equal('child')
        expect(parentComponent.refs.child.refs.self.textContent).to.equal('B')

        parentComponent.renderB = false
        await etch.update(parentComponent)
        expect('child' in parentComponent.refs).to.be.false
      })

      it('does not delete a reference to a different component when a component is destroyed', async function () {
        class ChildComponentA {
          constructor () {
            etch.initialize(this)
          }

          render () {
            return <div>A</div>
          }

          update (properties) {}
        }

        class ChildComponentB {
          constructor () {
            etch.initialize(this)
          }

          render () {
            return <div>B</div>
          }

          update () {}
        }

        let parentComponent = {
          condition: true,

          render () {
            if (this.condition) {
              return (
                <div>
                  <div />
                  <ChildComponentA ref='child' />
                </div>
              )
            } else {
              return (
                <div>
                  <ChildComponentB ref='child' />
                </div>
              )
            }
          },

          update () {}
        }

        etch.initialize(parentComponent)
        parentComponent.condition = false
        await etch.update(parentComponent)
        expect(parentComponent.refs.child).to.not.be.undefined
        expect(parentComponent.refs.child.constructor).to.equal(ChildComponentB)
      })
    })
  })
})
