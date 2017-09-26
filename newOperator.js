function newOperator(Constr, args) {
    // 1.create an object whose prototype is Constr.prototype
    var thisValue = Object.create(Constr.prototype);

    var result = Constr.apply(thisValue, args);

    if (typeof result === 'object' && result !== null) {
        return result;
    }

    return thisValue;
}