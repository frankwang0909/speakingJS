## 14. Methods of All Objects 所有对象的方法

Almost all objects have `Object.prototype` in their prototype chain:

几乎所有对象的原型链上都有 `Object.prototype`:


```javascript
> Object.prototype.isPrototypeOf({})
true
> Object.prototype.isPrototypeOf([])
true
> Object.prototype.isPrototypeOf(/xyz/)
true
```

The following subsections describe the methods that `Object.prototype`provides for its prototypees.

以下小节将讲述`Object.prototype` 提供给它的实例的方法：

### 14.1 Conversion to Primitive 转换为原始值

The following two methods are used to convert an object to a primitive value:

以下两种方法用于将对象转换成原始值：

- `Object.prototype.toString()`

  Returns a string representation of an object:

  返回对象的字符串形式：
```javascript
> ({ first: 'John', last: 'Doe' }.toString())
'[object Object]'
> [ 'a', 'b', 'c' ].toString()
'a,b,c'`
```

- `Object.prototype.valueOf()`

  This is the preferred way of converting an object to a number. The default implementation returns `this`:

  将对象转换成数值优先使用的方法。默认返回`this`（即对象本身）:
```javascript
> var obj = {};
> obj.valueOf() === obj
> true
```

  `valueOf` is overridden by wrapper constructors to return the wrapped primitive:

包装函数覆盖了`valueOf()` 方法，返回被包装的原始值：

```javascript
> new Number(7).valueOf()
7
```
The conversion to number and string (whether implicit or explicit) builds on the conversion to primitive (for details, see [Algorithm: ToPrimitive()—Converting a Value to a Primitive](http://speakingjs.com/es5/ch08.html#toprimitive)). That is why you can use the aforementioned two methods to configure those conversions. `valueOf()` is preferred by the conversion to number:

无论是隐式地还是显式地转换成数值或字符串，都是基于成原始值的转换（详细内容，见[算法：ToPrimitive() -- 将值转换为原始值](http://speakingjs.com/es5/ch08.html#toprimitive) ）。这就是为什么你可以使用前面提到的两种方法来设置这些转换。转换为数值时，优先使用`valueOf()` ：

```javascript
3 * { valueOf: function () { return 5 } }
15
```

`toString()` is preferred by the conversion to string:

转换为字符串时，优先使用`toString()` :

```javascript
> String({ toString: function () { return 'ME' } })
'Result: ME'
```

The conversion to boolean is not configurable; objects are always considered to be `true` (see [Converting to Boolean](http://speakingjs.com/es5/ch10.html#toboolean)).

转换为布尔值是不可配置的；对象总是转换为`true` （见 [转换成布尔值](http://speakingjs.com/es5/ch10.html#toboolean)）.

### Object.prototype.toLocaleString()

This method [returns a locale-specific string representation of an object. The default implementation calls `toString()`. Most engines don’t go beyond this support for this method. However, the ECMAScript Internationalization API (see ]()[The ECMAScript Internationalization API](http://speakingjs.com/es5/ch30.html#i18n_api)), which is supported by many modern engines, overrides it for several built-in constructors.

### Prototypal Inheritance and Properties

The following methods help with prototypal inheritance [and properties:]()

- 1)`Object.prototype.isPrototypeOf(obj)`

  Returns `true` if the receiver is part of the prototype chain of `obj`:
```javascript
> var proto = { };
> var obj = Object.create(proto);
> proto.isPrototypeOf(obj)
true
> obj.isPrototypeOf(obj)
false
```

- 2)`Object.prototype.hasOwnProperty(key)`

  Returns `true` if `this` owns a property whose key is `key`. “Own” means that the property exists in the object itself and not in one of its prototypes.

 *WARNING*
*You normally should invoke this method generically (not directly), especially on objects whose properties you don’t know statically. Why and how is explained in [Iteration and Detection of Properties](http://speakingjs.com/es5/ch17.html#iterate_and_detect_properties):*
```javascript
> var proto = { foo: 'abc' };
> var obj = Object.create(proto);
> obj.bar = 'def';
> Object.prototype.hasOwnProperty.call(obj, 'foo')
false
> Object.prototype.hasOwnProperty.call(obj, 'bar')
true
```
- 3)`Object.prototype.propertyIsEnumerable(propKey)`

  Returns `true` if the receiver has a property with the key `propKey` that is enumerable and `false` otherwise:

```javascript
> var obj = { foo: 'abc' };
> obj.propertyIsEnumerable('foo')
true
> obj.propertyIsEnumerable('toString')
false
> obj.propertyIsEnumerable('unknown')
false
```
