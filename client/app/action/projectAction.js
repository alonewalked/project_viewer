import store from '../store';

export const createproject = (doc, fn) => {
    if(fn){
        return store.createProject(doc)
    }
    else{
        return store.createProject(doc).then(fn,fn);
    }
};

export const createbranch = (doc, fn) => {
    if(fn){
        return store.createBranch(doc)
    }
    else{
        return store.createBranch(doc).then(fn,fn);
    }
};

export const openfolder = (item, fn) => {
    if(fn){
        return store.openFolder(item)
    }
    else{
        return store.openFolder(item).then(fn,fn);
    }
}