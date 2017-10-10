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

无论是隐式地还是显式地转换成数值或字符串，都是基于成原始值的转换（详细内容，见[算法：ToPrimitive() -- 将值转换为原始值](http://speakingjs.com/es5/ch08.html#toprimitive) ）。这就是为什么你可以使用前面提到的两种方法来设置这些转换。转换为**数值**时，优先使用`valueOf()` ：

```javascript
3 * { valueOf: function () { return 5 } }
15
```

`toString()` is preferred by the conversion to string:

转换为**字符串**时，优先使用`toString()` :

```javascript
> String({ toString: function () { return 'ME' } })
'Result: ME'
```

The conversion to boolean is not configurable; objects are always considered to be `true` (see [Converting to Boolean](http://speakingjs.com/es5/ch10.html#toboolean)).

转换为**布尔值**是不可配置的；对象总是转换为`true` （见 [转换成布尔值](http://speakingjs.com/es5/ch10.html#toboolean)）.

### 14.2 Object.prototype.toLocaleString()

This method returns a locale-specific string representation of an object. The default implementation calls `toString()`. Most engines don’t go beyond this support for this method. However, the ECMAScript Internationalization API (see [The ECMAScript Internationalization API](http://speakingjs.com/es5/ch30.html#i18n_api)), which is supported by many modern engines, overrides it for several built-in constructors.

此方法返回一个对象的指定地区的字符串表示，默认调用`toString()` 方法。大部分的 JS 引擎对这个方法的支持仅此而已。然而，ECMAScript 国际化 API （见 [The ECMAScript Internationalization API](http://speakingjs.com/es5/ch30.html#i18n_api)）被许多现代引擎所支持，为几个内置的构造函数覆盖了这个方法。

### 14.3 Prototypal Inheritance and Properties 原型继承 和 属性

The following methods help with prototypal inheritance and properties:

以下方法是用于原型继承和属性的：

- `Object.prototype.isPrototypeOf(obj)`

  Returns `true` if the receiver is part of the prototype chain of `obj`:

  如果接收者（调用该方法的对象）在`obj` 的 原型链上，返回`true`：
```javascript
> var proto = { };
> var obj = Object.create(proto);
> proto.isPrototypeOf(obj)
true
> obj.isPrototypeOf(obj)
false
```

- `Object.prototype.hasOwnProperty(key)`

  Returns `true` if `this` owns a property whose key is `key`. “Own” means that the property exists in the object itself and not in one of its prototypes.

  如果`this`  （调用该方法的对象）自身拥有键名为`key` 的属性，返回`true` 。“Own” 意味着这个属性存在对象本身，而不是在对象的原型上。

​                                                 *WARNING*  *警告*
*You normally should invoke this method generically (not directly), especially on objects whose properties you don’t know statically. Why and how is explained in [Iteration and Detection of Properties](http://speakingjs.com/es5/ch17.html#iterate_and_detect_properties):*

*通常，你需要调用通用方法（而不要直接调用这个方法），尤其是当你不知道这个对象的静态属性时。在* [属性的遍历及检测](http://speakingjs.com/es5/ch17.html#iterate_and_detect_properties) *已解释过为什么及如何调用通用方法：*

```javascript
> var proto = { foo: 'abc' };
> var obj = Object.create(proto);
> obj.bar = 'def';
> Object.prototype.hasOwnProperty.call(obj, 'foo')
false
> Object.prototype.hasOwnProperty.call(obj, 'bar')
true
```
- `Object.prototype.propertyIsEnumerable(propKey)`

  Returns `true` if the receiver has a property with the key `propKey` that is enumerable and `false` otherwise:

  如果接收者拥有键名为`propKey` 的属性，且该属性是可枚举的，返回`true` ，否则返回 `false` ：

```javascript
> var obj = { foo: 'abc' };
> obj.propertyIsEnumerable('foo')
true
> obj.propertyIsEnumerable('toString')
false
> obj.propertyIsEnumerable('unknown')
false
```
