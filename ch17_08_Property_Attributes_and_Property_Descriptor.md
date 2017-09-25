## 8. Property Attributes and Property Descriptors 属性特性和属性描述符

**TIP 提示**

Property attributes and property descriptors are an advanced topic. You normally don’t need to know how they work.

属性特性和属性描述符是一个高级话题。你通常不需要知道它们的工作原理。

In this section, we’ll look at the internal structure of properties:

在这一小节中，我们将看看属性的内部结构：

- *Property attributes* are the atomic building blocks of properties.

  *属性特性* 是属性的最小构建单元。

- A *property descriptor* is a data structure for working programmatically with attributes.

  *属性描述符* 是用于描述属性特性的数据结构。

### 8.1 Property Attributes  属性特性

All of a property’s state, both its data and its metadata, is stored in *attributes*. They are fields that a property has, much like an object has properties. Attribute keys are often written in double brackets. Attributes matter for normal properties and for accessors (getters and setters).

属性（`property`） 的所有状态，包括它的数据和元数据，都储存在*特性（`attributes`）*上。它们是属性拥有的字段，类似于一个对象拥有的属性。特性（`attributes`） 的键名通常写在两个方括号中。特性（`attributes`） 对于普通的属性以及存储器（取值器和赋值器）都很重要。

The following attributes are specific to normal properties:

下列特性（`attributes`）是普通属性（`properties`）所特有的：

- `[[Value]]` holds the property’s value, its data.

  `[[Value]]` 存放属性的值，它的数据。

- `[[Writable]]` holds a boolean indicating whether the value of a property can be changed.

  `[[Writable]]` 存放一个布尔值，表示属性的值是否可以改变。

The following attributes are specific to accessors:

以下特性（`attributes`）是存取器（`accessors`）所特有的：

- `[[Get]]` holds the getter, a function that is called when a property is read. The function computes the result of the read access.

  `[[Get]]` 存放 `取值器` ，它是读取属性时调用的函数。这个函数计算读取访问的结果。

- `[[Set]]` holds the setter, a function that is called when a property is set to a value. The function receives that value as a parameter.

  `[[Set]]` 存放 `赋值器`, 它是设置属性值时调用的函数。这个函数把你要设置的值作为它的参数。

All properties have the following attributes:

所有的属性（`property`）都有以下特性（`attributes`）：

- `[[Enumerable]]` holds a boolean. Making a property nonenumerable hides it from some operations (see [Iteration and Detection of Properties](http://speakingjs.com/es5/ch17.html#iterate_and_detect_properties)).

  [[Enumerable]] 存放一个布尔值。将一个属性（`property`） 设置为不可枚举的，会对某些操作隐藏这个属性。

- `[[Configurable]]` holds a boolean. If it is `false`, you cannot delete a property, change any of its attributes (except `[[Value]]`), or convert it from a data property to an accessor property or vice versa. In other words, `[[Configurable]]` controls the writability of a property’s metadata. There is one exception to this rule—JavaScript allows you to change an unconfigurable property from writable to read-only, for [historic reasons](http://bit.ly/1fwlIQI); the property `length` of arrays has always been writable and unconfigurable. Without this exception, you wouldn’t be able to freeze (see [Freezing](http://speakingjs.com/es5/ch17.html#freezing_objects)) arrays.

  [[Configurable]] 存放一个布尔值。如果为`false`, 你无法删除属性、不能改变属性任何特性`attributes`（除了`[[Value]]`） ，也不能把数据属性转换成存取器属性，反过来也不行。换言之， `[[Configurable]]` 控制着一个属性的元数据的读写。这条规则有一个例外：因为历史原因，JS 允许你将一个 `不可配置的` 属性从`可写`变成`只读` ; 数组的`length` 属性总是`可写的`并且`不可配置的`。没有这个例子，你无法`冻结( freeze)`数组


#### 8.1.1 Default values  默认值

If you don’t specify attributes, the following defaults are used:

如果你没有指定`特性(attributes)`的值，将使用以下默认值：

| Attribute key      | Default value |
| ------------------ | ------------- |
| `[[Value]]`        | `undefined`   |
| `[[Get]]`          | `undefined`   |
| `[[Set]]`          | `undefined`   |
| `[[Writable]]`     | `false`       |
| `[[Enumerable]]`   | `false`       |
| `[[Configurable]]` | `false`       |

These defaults are important when you are creating properties via property descriptors (see the following section).

当你通过属性描述符来创建（对象的）属性时，默认值很重要（见下一节）。

### 8.2 Property Descriptors 属性描述符

A property descriptor is a data structure for working programmatically with attributes. It is an object that encodes the attributes of a property. Each of a descriptor’s properties corresponds to an attribute. For example, the following is the descriptor of a read-only property whose value is 123:

属性描述符是描述特性的数据结构。它是一个对象，编码了属性的特性。每一个描述符与一个特性相关。例如，以下代码是一个只读属性，值为123 的描述符：

```javascript
{
    value: 123,
    writable: false,
    enumerable: true,
    configurable: false
}
```

You can achieve the same goal, immutability, via accessors. Then the descriptor looks as follows:

你可以通过`存取器`实现同样的目标--不可修改。此时的`描述符`如下代码所示：

```javascript
{
    get: function () { return 123 },
    enumerable: true,
    configurable: false
}
```

### 8.3 Getting and Defining Properties via Descriptors 通过描述符获取和定义属性

Property descriptors are used for two kinds of operations:

属性描述符用于两种操作：

- Getting a property  获取属性

  All attributes of a property are returned as a descriptor.

  属性的所有特性作为一个描述符返回。

- Defining a property 定义属性

  Defining a property means something different depending on whether a property already exists:If a property does not exist, create a new property whose attributes are as specified by the descriptor. If an attribute has no corresponding property in the descriptor, then use the default value. The defaults are dictated by what the attribute names mean. They are the opposite of the values that are used when creating a property via assignment (then the property is writable, enumerable, and configurable). For example:

  根据属性是否存在，定义属性会有一些不同：如果该属性不存在，创建一个新的属性，它的特性由`描述符`指定。如果在`描述符`中没有指定某个特性，则使用默认值。默认值由特性的名称的含义决定。这些特性的默认值与通过赋值语句创建的属性的特性值（属性是可写的，可枚举的，可配置的）相反。例如：

  ​
```javascript
> var obj = {};
> Object.defineProperty(obj, 'foo', { 
    configurable: true 
});
> Object.getOwnPropertyDescriptor(obj, 'foo');
{ value: undefined,  writable: false,  enumerable: false,  configurable: true }
```

I usually don’t rely on the defaults and explicitly state all attributes, to be completely clear.If a property already exists, update the attributes of the property as specified by the descriptor. If an attribute has no corresponding property in the descriptor, then don’t change it. Here is an example (continued from the previous one):
通常，我不依赖于默认值，我会显式地完整地声明所有的特性。 如果一个属性已经存在，更新该属性的特性为描述符指定的值。如果在`描述符`中没有指定某个特性，则不改变这个特性。

```javascript
> Object.defineProperty(obj, 'foo', { 
    writable: true 
});
> Object.getOwnPropertyDescriptor(obj, 'foo');
{ value: undefined,  writable: true,  enumerable: false,  configurable: true }
```


The following operations allow you to get and set a property’s attributes via property descriptors:

以下操作允许你通过属性描述符来获取和设置一个属性的特性：

- `Object.getOwnPropertyDescriptor(obj, propKey)`

  Returns the descriptor of the own (noninherited) property of `obj` whose key is `propKey`. If there is no such property, `undefined` is returned:

  返回对象`obj`键名为`propKey`的自身（非继承的）属性的描述符。如果没有这属性，返回`undefined`:

```javascript
> Object.getOwnPropertyDescriptor(Object.prototype, 'toString')
{value: [Function: toString], writable: true, enumerable: false, configurable: true }
> Object.getOwnPropertyDescriptor({}, 'toString')
undefined
```

- `Object.defineProperty(obj, propKey, propDesc)`

  Create or change a property of `obj` whose key is `propKey` and whose attributes are specified via `propDesc`. Return the modified object. For example:

  创建或改变`obj` 键名为`propKey` 的属性，它的特性由`propDesc` 来指定。返回修改后的对象。例如：

```javascript
var obj = Object.defineProperty({}, 'foo', {
    value: 123, 
    enumerable: true    
    // writable: false (default value)    
    // configurable: false (default value)
});
```

- `Object.defineProperties(obj, propDescObj)`

  The batch version of `Object.defineProperty()`. Each property of `propDescObj`holds a property descriptor. The keys of the properties and their values tell `Object.defineProperties` what properties to create or change on `obj`. For example:

  `Object.defineProperty()` 的批量处理版本。`propDescObj` 的每一个属性存储了一个属性描述符。`propDescObj` 属性的键名和值告诉`Object.defineProperties` 需要在对象`obj` 上创建或改变什么属性。
```javascript
var obj = Object.defineProperties({}, { 
    foo: { value: 123, enumerable: true },
    bar: { value: 'abc', enumerable: true }
});
```

- `Object.create(proto, propDescObj?)`

  First, create an object whose prototype is `proto`. Then, if the optional parameter `propDescObj` has been specified, add properties to it—in the same manner as `Object.defineProperties`. Finally, return the result. For example, the following code snippet produces the same result as the previous snippet:

  首先，创建一个以`proto` 为原型的对象。然后，如果指定了可选参数`propDescObj` ，以`Object.defineProperties` 相同的方式给对象添加属性。
```javascript
  var obj = Object.create(Object.prototype, {
    foo: { value: 123, enumerable: true }, 
    bar: { value: 'abc', enumerable: true }
});
```


### 8.4 Copying an Object  拷贝对象

To create an identical copy of an object, you need to get two things right:

1. The copy must have the same prototype (see [Layer 2: The Prototype Relationship Between Objects](http://speakingjs.com/es5/ch17.html#prototype_relationship)) as the original.
2. The copy must have the same properties, with the same attributes as the original.

The following function performs such a copy:

```javascript
function copyObject(orig) {
    // 1. copy has same prototype as orig
    var copy = Object.create(Object.getPrototypeOf(orig));

    // 2. copy has all of orig’s properties
    copyOwnPropertiesFrom(copy, orig);

    return copy;
}
```

The properties are copied from `orig` to `copy` via this function:

```javascript
function copyOwnPropertiesFrom(target, source) {
    Object.getOwnPropertyNames(source)  // (1)
    .forEach(function(propKey) {  // (2)
        var desc = Object.getOwnPropertyDescriptor(source, propKey); // (3)
        Object.defineProperty(target, propKey, desc);  // (4)
    });
    return target;
};
```

These are the steps involved:

1. Get an array with the keys of all own properties of `source`.
2. Iterate over those keys.
3. Retrieve a property descriptor.
4. Use that property descriptor to create an own property in `target`.

Note that this function is very similar to the function [`_.extend()`](http://underscorejs.org/#extend) in the Underscore.js library.

### 8.5 Properties: Definition Versus Assignment

The following two operations are very similar:

- Defining a property via `defineProperty()` and `defineProperties()` (see [Getting and Defining Properties via Descriptors](http://speakingjs.com/es5/ch17.html#functions_for_property_descriptors)).
- Assigning to a property via `=`.

There are, however, a few subtle differences:

- *Defining a property* means creating a new own property or updating the attributes of an existing own property. In both cases, the prototype chain is completely ignored.
- *Assigning to a property* `prop` means changing an existing property. The process is as follows:
  - If `prop` is a setter (own or inherited), call that setter.
  - Otherwise, if `prop` is read-only (own or inherited), throw an exception (in strict mode) or do nothing (in sloppy mode). The next section explains this (slightly unexpected) phenomenon in more detail.
  - Otherwise, if `prop` is own (and writable), change the value of that property.
  - Otherwise, there either is no property `prop`, or it is inherited and writable. In both cases, define an own property `prop` that is writable, configurable, and enumerable. In the latter case, we have just overridden an inherited property (nondestructively changed it). In the former case, a missing property has been defined automatically. This kind of autodefining is problematic, because typos in assignments can be hard to detect.

### 8.6 Inherited Read-Only Properties Can’t Be Assigned To

If an object, `obj`, inherits a property, `foo`, from a prototype and `foo` is not writable, then you can’t assign to `obj.foo`:

```javascript
var proto = Object.defineProperty({}, 'foo', {
    value: 'a',
    writable: false
});
var obj = Object.create(proto);
```

`obj` inherits the read-only property `foo` from `proto`. In sloppy mode, setting the property has no effect:

```javascript
> obj.foo = 'b';
> obj.foo
'a'
```

In strict mode, you get an exception:

```
> (function () { 'use strict'; obj.foo = 'b' }());
TypeError: Cannot assign to read-only property 'foo'
```

This fits with the idea that assignment changes inherited properties, but nondestructively. If an inherited property is read-only, you want to forbid all changes, even nondestructive ones.

Note that you can circumvent this protection by defining an own property (see the previous subsection for the difference between definition and assignment):

```javascript
> Object.defineProperty(obj, 'foo', { value: 'b' });
> obj.foo
'b'
```

### 8.7 Enumerability: Best Practices

The general rule is that properties created by the system are nonenumerable, while properties created by users are enumerable:

```javascript
> Object.keys([])
[]
> Object.getOwnPropertyNames([])
[ 'length' ]

> Object.keys(['a'])
[ '0' ]
```

This is especially true for the methods of the built-in instance prototypes:

```javascript
> Object.keys(Object.prototype)
[]
> Object.getOwnPropertyNames(Object.prototype)
[ 
  'hasOwnProperty',
  'valueOf',
  'constructor',
  'toLocaleString',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toString' 
]
```

The main purpose of enumerability is to tell the `for-in` loop which properties it should ignore. As we have seen just now when we looked at instances of built-in constructors, everything not created by the user is hidden from `for-in`.

The only operations affected by enumerability are:
- The `for-in` loop
- `Object.keys()` ([Listing Own Property Keys](http://speakingjs.com/es5/ch17.html#Object.keys))
- `JSON.stringify()` ([JSON.stringify(value, replacer?, space?)](http://speakingjs.com/es5/ch22.html#JSON.stringify))

Here are some best practices to keep in mind:
- For your own code, you can usually ignore enumerability and should avoid the `for-in` loop ([Best Practices: Iterating over Arrays](http://speakingjs.com/es5/ch18.html#array_iteration)).
- You normally shouldn’t add properties to built-in prototypes and objects. But if you do, you should make them nonenumerable to avoid breaking existing code.
