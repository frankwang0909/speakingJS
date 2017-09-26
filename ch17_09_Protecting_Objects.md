## 9. Protecting Objects    保护对象

There are three levels of protecting an object, listed here from weakest to strongest:

保护对象有三个等级， 从弱到强排列如下：

- Preventing extensions  阻止扩展属性（阻止添加新的属性）
- Sealing   密封（阻止添加新属性，所有属性为不可配置）
- Freezing  冻结（阻止添加新属性，所有属性为只读）

### 9.1Preventing Extensions 阻止扩展属性

Preventing extensions via:

阻止扩展属性通过：

```javascript
Object.preventExtensions(obj)
```

makes it impossible to add properties to `obj`. For example:

让对象变得不可以添加属性。例如：

```javascript
var obj = { foo: 'a' };
Object.preventExtensions(obj);
```

Now adding a property fails silently in sloppy mode:

在普通模式下，添加属性失败，不报错：

```javascript
> obj.bar = 'b';
> obj.bar
undefined
```

and throws an error in strict mode:

在严格模式下，则抛出异常：

```javascript
> (function () { 'use strict'; obj.bar = 'b' }());
TypeError: Cannot add property bar, object is not extensible
```

You can still delete properties, though:

你仍然可以删除属性：

```javascript
> delete obj.foo
true
> obj.foo
undefined
```

You check whether an object is extensible via:

检查一个对象是否可扩展，通过：

```javascript
Object.isExtensible(obj)
```

### 9.2 Sealing  密封

Sealing via:

密封：

```javascript
Object.seal(obj)
```

prevents extensions and makes all properties “unconfigurable.” The latter means that the attributes (see [Property Attributes and Property Descriptors](http://speakingjs.com/es5/ch17.html#property_attributes)) of properties can’t be changed anymore. For example, read-only properties stay read-only forever.

阻止扩展属性，并使得所有属性为“不可配置”。不可配置意味着，属性的特性不能再被改变。例如，只读属性就永远是只读的。

The following example demonstrates that sealing makes all properties unconfigurable:

以下代码演示了密封使得所有属性为不可配置的。

```javascript
> var obj = { foo: 'a' };

> Object.getOwnPropertyDescriptor(obj, 'foo')  // before sealing
{ value: 'a',
  writable: true,
  enumerable: true,
  configurable: true }

// 原来是可扩展的
> Object.isExtensible(o)
true

> Object.seal(obj)

> Object.getOwnPropertyDescriptor(obj, 'foo')  // after sealing
{ value: 'a',
  writable: true,
  enumerable: true,
  configurable: false }

// 现在变成了不可扩展
> Object.isExtensible(o)
false
```

You can still change the property `foo`:

此时仍然可以修改属性`foo` （因为它是可以写的）:

```javascript
> obj.foo = 'b';
'b'
> obj.foo
'b'
```

but you can’t change its attributes:

但不能修改属性`foo` 的特性：

```javascript
> Object.defineProperty(obj, 'foo', { enumerable: false });
TypeError: Cannot redefine property: foo
```

You check whether an object is sealed via:

检查对象是否密封：

```javascript
Object.isSealed(obj)
```

### 9.3 Freezing   冻结

Freezing is performed via:

冻结：

```javascript
Object.freeze(obj)
```

It makes all properties nonwritable and seals `obj`. In other words, `obj` is not extensible and all properties are read-only, and there is no way to change that. Let’s look at an example:

它使得所有属性都是不可写，并且密封了对象`obj` 。 换言之，`obj` 是不可扩展的，所有属性是只读的，没法改变。让我们来看一个例子：

```javascript
var point = { x: 17, y: -5 };
Object.freeze(point);
```

Once again, you get silent failures in sloppy mode:

在普通模式下，执行的操作默默地失败了。你看不到任何反应：

```javascript
> point.x = 2;  // no effect, point.x is read-only
> point.x
17

> point.z = 123;  // no effect, point is not extensible
> point
{ x: 17, y: -5 }
```

And you get errors in strict mode:

在严格模式下，报错：

```javascript
> (function () { 'use strict'; point.x = 2 }());
TypeError: Cannot assign to read-only property 'x'

> (function () { 'use strict'; point.z = 123 }());
TypeError: Cannot add property z, object is not extensible
```

You check whether an object is frozen via:

检查对象是否已冻结：

```javascript
Object.isFrozen(obj)
```

### 9.4 Pitfall: Protection Is Shallow 陷阱：保护是浅层的

Protecting an object is *shallow*: it affects the own properties, but not the values of those properties. For example, consider the following object:

保护对象是浅层的：它影响自身的属性，但不影响这些属性的值。例如：

```javascript
var obj = {
    foo: 1,
    bar: ['a', 'b']
};
Object.freeze(obj);
```

Even though you have frozen `obj`, it is not completely immutable—you can change the (mutable) value of property `bar`:

尽管，你已经冻结了`obj` ，它不是完全不可变的。你可以改变属性`bar` 的值：

```javascript
> obj.foo = 2; // no effect
> obj.bar.push('c'); // changes obj.bar

> obj
{ foo: 1, bar: [ 'a', 'b', 'c' ] }
```

Additionally, `obj` has the prototype `Object.prototype`, which is also mutable.

另外，`obj` 的原型`Object.prototype` 也是可变的。