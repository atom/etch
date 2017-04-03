module.exports = {
  pattern: /([A-z]*?)\[(.*)\]/,

  build: function(refs, ref, component){
    if(this.pattern.test(ref)){
      let m = this.pattern.exec(ref)
      refs[m[1]] = this.build((refs[m[1]] || {}), m[2], component)
    }else{
      refs[ref] = component
    }

    return refs
  },

  clear: function(refs, ref){
    if(this.pattern.test(ref)){
      let m = this.pattern.exec(ref)
      refs[m[1]] = this.clear((refs[m[1]] || {}), m[2])
    }else{
      delete refs[ref]
    }

    return refs
  },

  getFromValue: function(refs, ref){
    if(this.pattern.test(ref)){
      let m = this.pattern.exec(ref)
      refs[m[1]] = this.getFromValue((refs[m[1]] || {}), m[2])
      return refs
    }else{
      let value = refs[ref]
      return value
    }
  }
}
