## 7. Accessors (Getters and Setters) 存取器

ECMAScript 5 lets you write methods whose invocations look like you are getting or setting a property. That means that a property is virtual and not storage space. You could, for example, forbid setting a property and always compute the value returned when reading it.

ES5 让你可以编写调用方式看起来像是获取或设置某个属性的方法。这意味着属性是虚拟的，不占存储空间。例如，你可以禁止设置某个属性，当读取这个属性时，总是去计算返回的值。

### 7.1 Defining Accessors via an Object Literal 通过对象字面量来定义存取器

The following example uses an object literal to define a setter and a getter for property `foo`:

以下例子使用了一个对象字面量来定义属性`foo` 的赋值器和取值器。

```javascript
var obj = {
    get foo() {
        return 'getter';
    },
    set foo(value) {
        console.log('setter: '+value);
    }
};
```

Here’s the interaction:

结果如下：

```javascript
> obj.foo = 'bla';
setter: bla
> obj.foo
'getter'
```

### 7.2 Defining Accessors via Property Descriptors 通过属性描述符来定义存取器

An alternate way to specify getters and setters is via property descriptors (see [Property Descriptors](http://speakingjs.com/es5/ch17.html#property_descriptors)). The following code defines the same object as the preceding literal:

另一种指定取值器和赋值器的方式是使用`属性描述符（ property descriptors）`。以下代码定义了一个与上一个例子中的对象字面量一样的对象。

```javascript
var obj = Object.create(
    Object.prototype, {  // object with property descriptors
        foo: {  // property descriptor
            get: function () {
                return 'getter';
            },
            set: function (value) {
                console.log('setter: '+value);
            }
        }
    }
);
```

### 7.3 Accessors and Inheritance 存取器与继承

Getters and setters are inherited from prototypes:

取值器和赋值器继承自原型：

```javascript
> var proto = { get foo() { return 'hello' } };
> var obj = Object.create(proto);

> obj.foo
'hello'
```

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
