## 8. Property Attributes and Property Descriptors 属性特性和属性描述符

*Frank 注： 习惯上， property 和 attribute 都翻译成“属性”， 为了避免歧义，我在本文中把 attribute 翻译成 “特性”。* 

​                                                                             **TIP 提示**

Property attributes and property descriptors are an advanced topic. You normally don’t need to know how they work.

属性特性和属性描述符是一个高级话题。你通常不需要知道它们的工作原理。

In this section, we’ll look at the internal structure of properties:

在这一小节中，我们将看看属性的内部结构：

- *Property attributes* are the atomic building blocks of properties.

  *属性特性* 是属性的基本构建单元。

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

  [[Configurable]] 存放一个布尔值。如果为`false`, 你无法删除属性、不能改变属性任何特性`attributes`（除了`[[Value]]`） ，也不能把数据属性转换成存取器属性，反过来也不行。换言之， `[[Configurable]]` 控制着属性元数据的可读性。这条规则有一个例外：因为历史原因，JS 允许你将一个 `不可配置的` 属性从`可写`变成`只读` ; 数组的`length` 属性总是`可写的`并且`不可配置的`。没有这个例外，你无法`冻结( freeze)`数组


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

当你通过`属性描述符`来创建（对象的）属性时，默认值很重要（见下一节）。

### 8.2 Property Descriptors 属性描述符

A property descriptor is a data structure for working programmatically with attributes. It is an object that encodes the attributes of a property. Each of a descriptor’s properties corresponds to an attribute. For example, the following is the descriptor of a read-only property whose value is 123:

属性描述符是描述特性的数据结构。它是一个对象，编码了属性的特性。每一个描述符对应一个特性。例如，以下代码是一个只读属性，值为123 的描述符：

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

完全拷贝一个对象，你需要做对两件事：

1. The copy must have the same prototype (see [Layer 2: The Prototype Relationship Between Objects](http://speakingjs.com/es5/ch17.html#prototype_relationship)) as the original.

   副本必须有和原对象相同的原型。

2. The copy must have the same properties, with the same attributes as the original.

   副本必须有和原对象一样的属性，并且属性的特性也一样。

The following function performs such a copy:

```javascript
function copyObject(orig) {
    // 1. copy has same prototype as orig 
  	// 副本有和原对象一样的原型
    var copy = Object.create(Object.getPrototypeOf(orig));

    // 2. copy has all of orig’s properties
    //  副本拥有原对象的所有属性
    copyOwnPropertiesFrom(copy, orig);

    return copy;
}
```

The properties are copied from `orig` to `copy` via this function:

通过以下函数，可以从原对象中拷贝所有属性到副本中：

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

包含以下步骤：

1. Get an array with the keys of all own properties of `source`.

   获取原对象` source ` 上所有自身属性的键名。

2. Iterate over those keys.

   遍历这些键名。

3. Retrieve a property descriptor.

   获得`属性描述符`。

4. Use that property descriptor to create an own property in `target`.

   利用`属性描述符`在目标对象`target` 上创建自身属性。

Note that this function is very similar to the function [`_.extend()`](http://underscorejs.org/#extend) in the Underscore.js library.

注意：这个函数非常类似于 Underscore.js 库中的  [`_.extend()`](http://underscorejs.org/#extend)函数。

### 8.5 Properties: Definition Versus Assignment 属性：定义 vs  赋值

The following two operations are very similar:

以下两种操作非常类似：

- Defining a property via `defineProperty()` and `defineProperties()` (see [Getting and Defining Properties via Descriptors](http://speakingjs.com/es5/ch17.html#functions_for_property_descriptors)).

  通过` defineProperty()`  或 ` defineProperties()` 定义一个属性。

- Assigning to a property via `=`.

  通过`=` 给一个属性赋值。

There are, however, a few subtle differences:

然而，以上两种操作有一些细微的区别：

- *Defining a property* means creating a new own property or updating the attributes of an existing own property. In both cases, the prototype chain is completely ignored.

  *定义一个属性* 意味着创建一个新的自身的属性或者更新已经存在的自身属性的特性。完全忽略了原型链。

- *Assigning to a property* `prop` means changing an existing property. The process is as follows:

  给属性`prop` 赋值，意味着改变一个已存在的属性。过程如下所示：

  - If `prop` is a setter (own or inherited), call that setter.

    如果`prop` 是一个赋值器（无论它是对象自身的还是继承的属性），调用赋值器。

  - Otherwise, if `prop` is read-only (own or inherited), throw an exception (in strict mode) or do nothing (in sloppy mode). The next section explains this (slightly unexpected) phenomenon in more detail.

    如果`prop` 是只读的（无论它是对象自身的还是继承的属性）， 在严格模式下抛出异常， 在普通模式下，不做任何反应。下一小节将详细地解释这个（不希望出现的）现象。

  - Otherwise, if `prop` is own (and writable), change the value of that property.

    如果`prop` 是对象自身的并且是可读的属性，改变这个属性的值。

  - Otherwise, there either is no property `prop`, or it is inherited and writable. In both cases, define an own property `prop` that is writable, configurable, and enumerable. In the latter case, we have just overridden an inherited property (nondestructively changed it). In the former case, a missing property has been defined automatically. This kind of autodefining is problematic, because typos in assignments can be hard to detect.

    如果没有`prop` 这个属性， 或者它是继承且可读的。这两种情况，都会定义一个自身的、可读、可配置、可枚举的属性`prop` 。在后一种情况中，我们只是覆盖了一个继承的属性（无损地改变了这个属性）。在前一种情况中，自动创建了一个原本没有的属性。这种自动创建是有问题的，因为赋值时的拼写错误是很难被检测到的。

### 8.6 Inherited Read-Only Properties Can’t Be Assigned To 继承的只读属性不能被赋值

If an object, `obj`, inherits a property, `foo`, from a prototype and `foo` is not writable, then you can’t assign to `obj.foo`:

如果对象`obj` 从它的原型中继承了属性`foo`, 并且`foo` 属性不可写的，那么，你是不能对`obj.foo`赋值的。

```javascript
var proto = Object.defineProperty({}, 'foo', {
    value: 'a',
    writable: false
});
var obj = Object.create(proto);
```

`obj` inherits the read-only property `foo` from `proto`. In sloppy mode, setting the property has no effect:

`obj` 从`proto` 继承了只读属性`foo`。 在普通模式中，设置属性`foo` 没有任何效果。

```javascript
> obj.foo = 'b';
> obj.foo
'a'
```

In strict mode, you get an exception:

在严格模式中，会抛出一个异常。

```
> (function () { 
'use strict'; 
obj.foo = 'b' 
}());
TypeError: Cannot assign to read-only property 'foo'
```

This fits with the idea that assignment changes inherited properties, but nondestructively. If an inherited property is read-only, you want to forbid all changes, even nondestructive ones.

这正符合赋值语句只能无损地改变继承的属性的理念。如果继承的属性是只读的，你应该禁止所有的改变，甚至包括无损的改变。

Note that you can circumvent this protection by defining an own property (see the previous subsection for the difference between definition and assignment):

注意：你可以通过定义一个自身的属性（见前一小节关于定义和赋值的区别）来规避这种保护。

```javascript
> Object.defineProperty(obj, 'foo', { value: 'b' });
> obj.foo
'b'

// 尝试对其赋值
> obj.foo = 123
// 赋值不成功，仍然为 'b'
> obj.foo
'b'

// 查看属性`foo` 的描述符
> Object.getOwnPropertyDescriptor(obj, 'foo')
{value: 123456, writable: false, enumerable: false, configurable: false}
```

### 8.7 Enumerability: Best Practices 可枚举性：最佳实践

The general rule is that properties created by the system are nonenumerable, while properties created by users are enumerable:

通常，由系统创建的属性为不可枚举的，由用户创建的属性为可枚举的：

```javascript
> Object.keys([])
[]
> Object.getOwnPropertyNames([])
[ 'length' ]

> Object.keys(['a'])
[ '0' ]
```

This is especially true for the methods of the built-in instance prototypes:

内置的实例原型的方法是不可枚举的：

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

可枚举性的主要用途是告诉 `for-in` 循环哪些属性可以忽略。正如我们刚刚查看内置构造函数的实例所看到的那样，非用户所创建的属性都被隐藏，不暴露给`for-in`。

The only operations affected by enumerability are:

可枚举性只影响以下操作：

- The `for-in` loop      `for-in` 循环
- `Object.keys()` ([Listing Own Property Keys](http://speakingjs.com/es5/ch17.html#Object.keys))
- `JSON.stringify()` ([JSON.stringify(value, replacer?, space?)](http://speakingjs.com/es5/ch22.html#JSON.stringify))

Here are some best practices to keep in mind:

以下是需要记住的最佳实践：

- For your own code, you can usually ignore enumerability and should avoid the `for-in` loop ([Best Practices: Iterating over Arrays](http://speakingjs.com/es5/ch18.html#array_iteration)).

  对于你自己的代码，你通常可以忽略可枚举性，且应该避免使用`for-in` 循环。

- You normally shouldn’t add properties to built-in prototypes and objects. But if you do, you should make them nonenumerable to avoid breaking existing code.

  正常情况下，你不应该给内置的原型和对象添加属性。如果你需要这么做，你应该确保添加的属性是不可枚举的，以避免破坏现有的代码。
