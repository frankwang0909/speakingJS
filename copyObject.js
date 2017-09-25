function copyObj(orgi) {
	// 1. copy has same prototype as orig
	var copy = Object.create(Object.getPrototypeOf(orgi));

	// 2. copy has all of orig’s properties
	copyOwnPropertiesFrom(copy, orgi);

	return copy;
}

function copyOwnPropertiesFrom(target, source) {
	// 1. Get an array with the keys of all own properties of `source`.
	Object.getOwnPropertyNames(source)
	.forEach(function(propKey){   // 2. Iterate over those keys.

		// 3. Retrieve a property descriptor.
		var desc = Object.getOwnPropertyDescriptor(source, propKey);

		// 4. Use that property descriptor to create an own property in `target`.
		Object.defineProperty(target, propKey, desc);
	})
}
