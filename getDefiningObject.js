function getDefiningObject(obj, propKey) { 
    obj = Object(obj); // make sure it’s an object
    while (obj && !({}).hasOwnProperty.call(obj, propKey)) {
        obj = Object.getPrototypeOf(obj);
        // obj is null if we have reached the end
    }
    return obj;
}
