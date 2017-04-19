module.exports = {
  // This function adds the supplied component to the refs object at its ref point.
  //
  // `refs` is the refs object that the component needs adding to.
  //
  // `ref` is the string or array that defines its location in the object. This
  // input is cast into an array so it can be iterated. This allows for inputs of
  // 'refname' or ['ref', 'name'].
  //
  // `component` is the componet this ref relates to.
  build: function(refs, ref, component){
    let tree = [].concat(ref)
    let level = refs

    for(let i = 0; i < tree.length; i++){
      if(tree[i + 1] == null){
        level[tree[i]] = component
      }else{
        if(!level[tree[i]]) level[tree[i]] = {}
        level = level[tree[i]]
      }
    }

    return refs
  },

  // This function removes the ref from the refs object.
  //
  // `refs` is the refs object that the component needs removing from.
  //
  // `ref` is the string or array that defines its location in the object. This
  // input is cast into an array so it can be iterated. This allows for inputs of
  // 'refname' or ['ref', 'name'].
  clear: function(refs, ref){
    let tree = [].concat(ref)
    let level = refs

    for(let i = 0; i < tree.length; i++){
      if(tree[i + 1] == null){
        delete level[tree[i]]
      }else{
        if(!level[tree[i]]) level[tree[i]] = {}
        level = level[tree[i]]
      }
    }

    return refs
  },

  // This function returns the component at the given ref.
  //
  // `refs` is the refs object that it needs retrieving from.
  //
  // `ref` is the string or array that defines its location in the object. This
  // input is cast into an array so it can be iterated. This allows for inputs of
  // 'refname' or ['ref', 'name'].
  getFromValue: function(refs, ref){
    let tree = [].concat(ref)
    let level = refs

    for(let i = 0; i < tree.length; i++){
      if(tree[i + 1] == null){
        return level[tree[i]]
      }else{
        if(!level[tree[i]]) level[tree[i]] = {}
        level = level[tree[i]]
      }
    }
  }
}
