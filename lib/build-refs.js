module.exports = {
  buildTree: function(tree, ref){
    let pattern = /(\w+)|(\[(\w+)\])/g
    let m

    while((m = pattern.exec(ref)) !== null){
      tree.push((m[1] || m[3]))
    }

    return tree
  },

  build: function(refs, ref, component, flatRefs){
    let tree
    if(flatRefs){
      tree = [ref]
    }else{
      tree = this.buildTree([], ref)
    }
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

  clear: function(refs, ref, flatRefs){
    let tree
    if(flatRefs){
      tree = [ref]
    }else{
      tree = this.buildTree([], ref)
    }
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

  getFromValue: function(refs, ref, flatRefs){
    let tree
    if(flatRefs){
      tree = [ref]
    }else{
      tree = this.buildTree([], ref)
    }
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
