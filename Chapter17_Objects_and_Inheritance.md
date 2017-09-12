# CHAPTER 17 Objects and Inheritance

There are several layers to object-oriented programming (OOP) in JavaScript:
- Layer 1: Object-orientation with single objects (covered in “Layer 1: Single Objects” on page 197)
- Layer 2: Prototype chains of objects (described in “Layer 2: The Prototype Relationship Between Objects” on page 211)
- Layer 3: Constructors as factories for instances, similar to classes in other languages (discussed in “Layer 3: Constructors—Factories for Instances” on page 231)
- Layer 4: Subclassing, creating new constructors by inheriting from existing ones (covered in “Layer 4: Inheritance Between Constructors” on page 251)

在 JavaScript 中，面向对象编程（OOP)有四个层次的：
- 第一层：单个对象的面向对象编程
- 第二层：对象的`原型链`（prototype chain)
- 第三层：`构造函数`作为实例的工厂，类似于其他语言里的`类`(Class)
- 第四层：`子类化`（Subclassing），通过继承已有的构造函数来创建新的构造函数

Each new layer only depends on prior ones, enabling you to learn JavaScript OOP incrementally. Layers 1 and 2 form a simple core that you can refer back to whenever you are getting confused by the more complicated layers 3 and 4.

每个新的层次都只依赖于前面的层次，让你能够逐渐地学会 JavaScript 的 OOP. 当你对更加复杂的第三层和第四层感到困惑的时候，你可以回顾第一层和第二层组成的简单的核心内容。

## 1.Layer 1: Single Objects 第一层：单个对象

Roughly, all objects in JavaScript are maps (dictionaries) from strings to values. A (key, value) entry in an object is called a property. The key of a property is always a text string. The value of a property can be any JavaScript value, including a function. Methods are properties whose values are functions.

大体上说，JavaScript 对象都是从字符串到值的映射（字典）。对象中的一组`键值对`被称作`属性`（property）。属性的键（key）总是文本字符串。属性的值（value）可以是任何的 JavaScrip 值，包括函数。方法（method）是值为函数的属性。

### 1.1 Kinds of Properties 属性的种类

There are three kinds of properties:

有3种属性：

*Properties (or named data properties) 属性（命名的数据属性）*

Normal properties in an object—that is, mappings from string keys to values.Named data properties include methods. This is by far the most common kind of property.

对象中的普通属性，即字符串到值的映射。命名的数据属性包括方法（method）。这是目前最常见属性类型。

*Accessors (or named accessor properties) 存取器（命名的存取器属性）*

Special methods whose invocations look like reading or writing properties. Normal properties are storage locations for property values; accessors allow you to compute the values of properties. They are virtual properties, if you will. See “Accessors (Getters and Setters)” on page 221 for details.

特殊的方法，它们的调用方式像是读取或写入属性。 普通的属性是属性值的存储位置，存取器允许你计算属性的值。如果你愿意，可以把它们看做是虚拟的属性。

*Internal properties 内部属性*

Exist only in the ECMAScript language specification. They are not directly accessible from JavaScript, but there might be indirect ways of accessing them. The specification writes the keys of internal properties in brackets. For example, [[Prototype]] holds the prototype of an object and is readable via Object.getPrototypeOf().

只存在于 ECMAScript 语言标准中。无法从 JavaScript 中直接读取它们，但有间接的方式可以访问到它们。在标准中，这些内部属性的 key 是写在方括号中的，比如 [[Prototype]] 保存着对象的原型，可以通过`Object.getPrototypeOf()`读取到它。


### 1.2 Object Literals 对象字面量

JavaScript’s object literals allow you to directly create plain objects (direct instances of `Object`). The following code uses an object literal to assign an object to the variable `jane`. The object has the two properties: `name` and `describe`. `describe` is a method:

JavaScript 的`对象字面量`允许你直接创建`普通对象`（`Object`的直接实例）。以下示例代码使用`对象字面量`将一个对象赋值给变量`jane`. 这个对象有两个属性：`name` 和 `describe`，其中属性`describe`是对象的`方法`（method）。

```javascript
var jane = {
    name: 'Jane',
    describe: function () {
        return 'Person named '+this.name; // (1)
    }, // (2)
};
```

- 1.Use `this` in methods to refer to the current object (also called the receiver of a method invocation).

在对象的方法中，使用`this`来指代当前的对象（这个当前对象也被称作方法调用的接收器 receiver）。

- 2.ECMAScript 5 allows a trailing comma (after the last property) in an object literal. Alas, not all older browsers support it. A trailing comma is useful, because you can rearrange properties without having to worry which property is last.

ECMAScript 5 允许在对象字面量的最后一个属性之后使用逗号。不是所有的老式浏览器支持这个写法。末尾逗号很有用，因为你可以调换属性的顺序，而不用担心哪个属性是最后一个。

You may get the impression that objects are only maps from strings to values. But they are more than that: they are real general-purpose objects. For example, you can use inheritance between objects (see “Layer 2: The Prototype Relationship Between Objects” on page 211), and you can protect objects from being changed. The ability to directly create objects is one of JavaScript’s standout features: you can start with concrete objects (no classes needed!) and introduce abstractions later. For example, constructors, which are factories for objects (as discussed in “Layer 3: Constructors—Factories for Instances” on page 231), are roughly similar to classes in other languages.

你也许以为对象只是字符串到值的映射，但它们远非如此：它们是真的多功能的对象。例如，你可以在对象之间使用继承（见“Layer 2: The Prototype Relationship Between Objects”）， 你还可以保护对象，防止被修改。直接创建对象的能力是 JavaScript 突出的特性之一：你可以从具体的`对象`开始（不需要`类`），在之后引入抽象概念。比如，构造函数（constructor）是对象的工厂（将在“Layer 3: Constructors—Factories for Instances” 中讨论），它类似于其他语言中的`类`（class）。

### 1.3 Dot Operator（.）： Accessing Properies via Fixed Keys 点运算符(.)：通过不变的键名来获取属性

The dot operator provides a compact syntax for accessing properties. The property keys must be identifiers (consult “Legal Identifiers” on page 60). If you want to read or write properties with arbitrary names, you need to use the bracket operator (see “Bracket Operator ([]): Accessing Properties via Computed Keys” on page 202).

`点运算符`提供了一种获取属性的简洁语法。属性的值必须是`标识符`(identifiers)。如果你想要使用任意名字来读取或者写入属性，你需要使用`方括号运算符`（[]）。

The examples in this section work with the following object:

本小结的示例代码如下：

```javascript
var jane = {
    name: 'Jane',
    describe: function () {
        return 'Person named '+this.name;
    }
};
```

#### 1.3.1 Getting properties 获取属性

The dot operator lets you “get” a property (read its value). Here are some examples:

点运算符让你可以获取属性（读取它的值）。示例代码如下：
```javascript
jane.name // get property `name`
// 'Jane'
jane.describe // get property `describe`
// [Function]
```

Getting a property that doesn’t exist returns `undefined` :

读取一个不存在的属性，将返回`undefined`:
```javascript
jane.unknownProperty
// undefined
```

#### 1.3.2 Calling methods 调用方法

The dot operator is also used to call methods:

点运算符也也可以用来调用方法：
```javascript
jane.describe() // call method `describe`
// 'Person named Jane'
```

#### 1.3.3 Setting properties 设置属性

You can use the assignment operator ( = ) to set the value of a property referred to via the dot notation. For example:

你可以使用赋值运算符（=）来设置点运算符指代的属性的值，
```javascript
jane.name = 'John'; // set property `name`
jane.describe()
// 'Person named John'
```

If a property doesn’t exist yet, setting it automatically creates it. If a property already exists, setting it changes its value.

如果属性还不存在，设置属性会自动创建这个属性。如果属性已经存在，设置属性会修改它的值。

#### 1.3.4 Deleting properties 删除属性

The `delete` operator lets you completely remove a property (the whole key-value pair) from an object. For example:

`delete`运算符让你可以彻底移除一个对象的属性（该属性的整个键值对）。比如：

```javascript
var obj = { hello: 'world' };
delete obj.hello
// true
obj.hello
// undefined
```

If you merely set a property to `undefined` , the property still exists and the object still contains its key:

如果你只是把属性设置为`undefined`, 这个属性仍然存在，对象仍然包含它的 key.
```javascript
var obj = { foo: 'a', bar: 'b' };
obj.foo = undefined;
Object.keys(obj)
// [ 'foo', 'bar' ]
```

If you delete the property, its key is gone, too:

如果删除属性，它的 key 也没有了。
```javascript
delete obj.foo
// true
Object.keys(obj)
// [ 'bar' ]
```

`delete` affects only the direct (“own,” noninherited) properties of an object. Its prototypes are not touched (see “Deleting an inherited property” on page 217).

`delete` 只能影响到对象直接的（自己的，非继承的）属性。它的原型（prototypes）是无法触及到的。

*Use the delete operator sparingly. Most modern JavaScript engines optimize the performance of instances created by constructors if their “shape” doesn’t change (roughly: no properties are removed or added). Deleting a property prevents that optimization.*

*尽可能少地使用`delete` 运算符。大多数现代的 JavaScript 引擎对构造函数创建的实例做了性能优化，如果它们的 “形状” 没有发生变化的话（即没有移除或者新增属性）。 移除属性阻止了这种优化。*

#### 1.3.5 The return value of delete  `delete`的返回值

`delete` returns `false` if the property is an own property, but cannot be deleted. It returns `true` in all other cases. Following are some examples. 

如果属性是对象自己的属性且不可删除, 则 `delete` 返回`false`。其他所有情况，`delete`都返回`true`. 下面给出了一些例子。

As a preparation, we create one property that can be deleted and another one that can’t be deleted (“Getting and Defining Properties via Descriptors” on page 224 explains Object.defineProperty() ):

我们先创建一个可以被删除的属性和一个不能被删除的属性。

```javascript
var obj = {};
Object.defineProperty(obj, 'canBeDeleted', {
    value: 123,
    configurable: true
});

Object.defineProperty(obj, 'cannotBeDeleted', {
    value: 456,
    configurable: false
});
```

`delete` returns `false` for own properties that can’t be deleted:

1) 对于不能删除的自身属性，`delete` 返回 `false` 

```javascript
delete obj.cannotBeDeleted
// false
```

`delete` returns `true` in all other cases:

2) 其他所有情况，`delete` 都返回`true`:
```javascript
delete obj.doesNotExist
// true
delete obj.canBeDeleted
// true
```

`delete` returns `true` even if it doesn’t change anything (inherited properties are never removed):

`delete` 返回 `true`，即便它没有改变任何东西（继承的属性不能被移除）：
```javascript
delete obj.toString
// true
obj.toString // still there
// function toString()
```

### 1.4 Unusual Property Keys 特殊的属性键名

While you can’t use reserved words (such as `var` and `function` ) as variable names, you can use them as property keys:

虽然你不能使用保留字（比如`var`、`function`）作为变量名，但你可以使用它们作为属性的键名（key）：
```javascript
var obj = { var: 'a', function: 'b' };
obj.var
// 'a'
obj.function
// 'b'
```

Numbers can be used as property keys in object literals, but they are interpreted as strings. The dot operator can only access properties whose keys are identifiers. Therefore, you need the bracket operator (shown in the following example) to access properties whose keys are numbers:

在对象字面量中，数值可以被当做属性的键名，但它们被转换成了字符串。`点运算符`只能访问键名为`标识符`的属性。因此，你需要使用`方括号运算符`（接下来的例子中有演示）来访问键名为`数值`的属性。
```javascript
var obj = { 0.7: 'abc' };
Object.keys(obj)
// [ '0.7' ]

obj['0.7']
// 'abc'
```

Object literals also allow you to use arbitrary strings (that are neither identifiers nor numbers) as property keys, but you must quote them. Again, you need the bracket operator to access the property values:

对象字面量也允许你使用任意的字符（既不是标识符，也不是数值）作为属性的键名，但你必须对它们使用`引号`。你需要使用`方括号运算符`来获取这些属性的值。
```javascript
var obj = { 'not an identifier': 123 };
Object.keys(obj)
// [ 'not an identifier' ]
obj['not an identifier']
// 123
```


### 1.5 Bracket Operator ([]): Accessing Properties via Computed Keys 方括号运算符（[ ]）: 通过计算后的键名来获取属性

While the dot operator works with fixed property keys, the bracket operator allows you to refer to a property via an expression.

`点运算符`使用固定不变的属性键名，`方括号运算符`则允许你使用`表达式`来描述属性。

#### 1.5.1 Getting properties via the bracket operator 通过方括号运算符获取属性

The bracket operator lets you compute the key of a property, via an expression:

方括号运算符允许你通过表达式来计算属性的键名：

```javascript
var obj = { someProperty: 'abc' };
obj['some' + 'Property']
// 'abc'
var propKey = 'someProperty';
obj[propKey]
// 'abc'
```

That also allows you to access properties whose keys are not identifiers:

方括号运算符也允许你访问键名不是标识符的属性：
```javascript
var obj = { 'not an identifier': 123 };
obj['not an identifier']
// 123
```

Note that the bracket operator coerces its interior to string. For example:

注意：方括号运算符强制转换它的内部运算数为字符串。比如：
```javascript
> var obj = { '6': 'bar' };
> obj[3+3] // key: the string '6'
'bar'
```

#### 1.5.2 Calling methods via the bracket operator 通过方括号运算符调用方法

Calling methods works as you would expect:

如你预期的那样调用方法
```javascript
var obj = { 
    myMethod: function () { 
        return true 
    } 
};

obj['myMethod']()
// true
```

### 1.5.3 Setting properties via the bracket operator 通过方括号运算符设置属性

Setting properties works analogously to the dot operator:

设置属性与点运算符的操作类似：
```javascript
var obj = {};
obj['anotherProperty'] = 'def';
obj.anotherProperty
// 'def'
```

#### 1.5.4 Deleting properties via the bracket operator 通过方括号运算符删除属性

Deleting properties also works similarly to the dot operator:

删除属性也与点运算符的操作类似：
```javascript
var obj = { 'not an identifier': 1, prop: 2 };
Object.keys(obj)
// [ 'not an identifier', 'prop' ]
delete obj['not an identifier']
// true
Object.keys(obj)
// [ 'prop' ]
```
