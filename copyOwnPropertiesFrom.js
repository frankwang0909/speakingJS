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
