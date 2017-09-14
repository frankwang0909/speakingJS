# CHAPTER 17 Objects and Inheritance 对象与继承

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
## 3. `this` as an Implicit Parameter of Functions and Methods `this`作为函数和方法的隐含参数

When you call a function,  `this` is always an (implicit) parameter: 

当你调用函数时，`this` 总是作为一个（隐含的）参数：

*Normal functions in sloppy mode 宽松模式的普通函数*

Even though normal functions have no use for  `this` , it still exists as a special variable whose value is always the global object ( `window` in browsers; see “The Global Object” on page 187):

宽松模式的普通函数即使没使用`this`, 它仍然作为一个特殊的变量存在于函数的作用域内，它的值总是全局对象（在浏览器环境中，即`window`对象）。

```javascript
function returnThisSloppy() { 
	return this;
}
returnThisSloppy() === window
// true
```

*Normal functions in strict mode 严格模式的普通函数*

`this` is always  `undefined` :

严格模式普通函数中，`this` 总是返回`undefined`。

```javascript
function returnThisStrict() { 
	'use strict'; 
	return this 
}
returnThisStrict() === undefined
// true
```

*Methods 方法*

`this` refers to the object on which the method has been invoked:

在对象的方法中, `this` 指向调用该方法的对象。

```javascript
var obj = { 
	method: returnThisStrict 
};
obj.method() === obj
// true
```

In the case of methods, the value of  `this` is called the `receiver` of the method call.

在方法中，`this`的值被称为方法调用的`接收器`。


### 3.1 Calling Functions While Setting `this`: call(), apply(), and bind() 调用函数时，设置`this`的三种方法: call(), apply(), bind()

Remember that functions are also objects. Thus, each function has methods of its own. Three of them are introduced in this section and help with calling functions. These three methods are used in the following sections to work around some of the pitfalls of calling functions. The upcoming examples all refer to the following object,  `jane` :

记住，函数也是对象。因此，每个函数都有它自己的方法。本小结将介绍3个函数的方法，可用于规避函数调用时的陷阱。接下来的例子都将涉及到对象`jane`:

```javascript
var jane = {
	name: 'Jane',
	sayHelloTo: function (otherName) {
		'use strict';
		console.log(this.name+' says hello to '+otherName);
	}
};
```
#### 3.1.1 Function.prototype.call(thisValue, arg1?, arg2?, ...)

*Frank 注：call方法指定函数内部this的指向（即函数执行时所在的作用域），然后在所指定的作用域中，调用该函数。*

The first parameter is the value that  `this` will have inside the invoked function; the remaining parameters are handed over as arguments to the invoked function. The following three invocations are equivalent:

第一个参数的值是调用的函数内部的`this`所要指向的那个对象；后面的参数则作为参数传给调用的函数。以下三种调用函数的方式是等价的：

```javascript
jane.sayHelloTo('Tarzan'); 

jane.sayHelloTo.call(jane, 'Tarzan');

var func = jane.sayHelloTo;
func.call(jane, 'Tarzan');
```
For the second invocation, you need to repeat  `jane` , because  `call()` doesn’t know how you got the function that it is invoked on.

第二种调用方式中，你需要重复`jane`（把它当做第一个参数），否则`call()` 方法不知道你如何获取调用的函数。

#### 3.1.2 Function.prototype.apply(thisValue, argArray?)

*Frank 注：apply()方法指定函数内部this的指向（即函数执行时所在的作用域），然后在所指定的作用域中，调用该函数。与call()的区别在于，第二个参数是数组。*

The first parameter is the value that  `this` will have inside the invoked function; the second parameter is an array that provides the arguments for the invocation. The following three invocations are equivalent:

第一个参数的值是调用的函数内部的`this`所要指向的那个对象；第二个参数是一个数组，传给调用的函数。以下三种调用函数的方式是等价的：

```javascript

jane.sayHelloTo('Tarzan');

jane.sayHelloTo.apply(jane, ['Tarzan']);

var func = jane.sayHelloTo;
func.apply(jane, ['Tarzan']);
```

For the second invocation, you need to repeat  `jane` , because  `apply()` doesn’t know how you got the function that it is invoked on. “apply() for Constructors” on page 206 explains how to use  `apply()` with constructors.

第二种调用方式中，你需要重复`jane`（把它当做第一个参数），否则`apply()` 方法不知道你如何获取调用的函数。

#### 3.1.3 Function.prototype.bind(thisValue, arg1?, ..., argN?)

*Frank 注：bind()方法用于将函数体内的this绑定到某个对象，然后返回一个新函数。*

This method performs *partial function application* -- meaning it creates a new function that calls the receiver of  `bind()` in the following manner: the value of  `this` is  `thisValue` and the arguments start with  arg1 until  argN , followed by the arguments of the new
function. In other words, the new function appends its arguments to  arg1, ...,argN when it calls the original function. Let’s look at an example:

这个方法起着*偏函数应用*的作用，即它会创建一个新函数，以如下的方式调用 `bind()`的接收器: 新函数的`this`为`bind()`方法的第一个参数`thisValue`, 新函数内部的`arguments`对象从arg1开始，一直到argN，后面还跟着新函数接收到的参数。换句话说，当调用新函数时，它会把接收到的参数追加到原函数的参数arg1,...,argN之后。让我们来看一个例子：

```javascript
function func() {
	console.log('this: '+this);
	console.log('arguments: '+Array.prototype.slice.call(arguments));
}
var bound = func.bind('abc', 1, 2);
```

The array method  `slice` is used to convert  arguments to an array, which is necessary for logging it (this operation is explained in “Array-Like Objects and Generic Methods” on page 262).  `bound` is a new function. Here’s the interaction:

数组的`slice`方法用于将`arguments`对象(类似数组的对象)转换为`数组`，这样方便打印日志。`bound` 是一个新的函数。

```javascript
bound(3)
// this: abc
// arguments: 1,2,3

```
The following three invocations of  `sayHelloTo` are all equivalent:

以下三种调用`sayHelloTo`的方式是等价的：

```javascript
jane.sayHelloTo('Tarzan');

var func1 = jane.sayHelloTo.bind(jane);
func1('Tarzan');

var func2 = jane.sayHelloTo.bind(jane, 'Tarzan');
func2();
```

### 3.2 `apply()` for Constructors 构造函数中使用的`apply()`

Let’s pretend that JavaScript has a triple dot operator ( ... ) that turns arrays into actual parameters. Such an operator would allow you to use  `Math.max()` (see “Other Functions” on page 330) with arrays. In that case, the following two expressions would be equivalent:

我们假设 JavaScript 有一个三点运算符( ... )，它可以将数组转换成实际的参数。这个运算符允许你对数组使用 `Math.max()` 。在这个假定情况下，以下两个表达式将会是等价的：
（Frank 注：ES6 引入了 rest 参数，已实现该功能）。

```javascript
Math.max(...[13, 7, 30])
Math.max(13, 7, 30)
```

For functions, you can achieve the effect of the triple dot operator via  `apply()` :

对于函数来说，你可以通过`apply()`方法来实现三点运算符的效果：

```javascript
Math.max.apply(null, [13, 7, 30])
// 30
```

The triple dot operator would also make sense for constructors:

对于构造函数来说，三点运算符也同样有意义：

```javascript
new Date(...[2011, 11, 24])
```
Alas, here  `apply()` does not work, because it helps only with function or method calls, not with constructor invocations.

当然，这里使用`apply()`不起作用，因为它只能用于函数或方法的调用，不能用于构造函数的调用。

#### 3.2.1 Manually simulating an `apply()` for constructors  为构造函数手动模拟 `apply()`

We can simulate  `apply()` in two steps.

我们可以通过以下两个步骤来模拟`apply()`.

Step 1: Pass the arguments to  Date via a method call (they are not in an array—yet):

第一步：通过方法的调用传递参数给 `Date`。

```javascript
new (Date.bind(null, 2011, 11, 24))
```
The preceding code uses  `bind()` to create a constructor without parameters and invokes it via  `new` .

上述代码使用了 `bind()` 来创建一个没有参数的构造函数，并通过 `new` 来调用者构造函数。


Step 2: Use  `apply()` to hand an array to `bind()` . Because  `bind()` is a method call, we can use  `apply()` :

第二步：用 `apply()` 方法将一个数组传递给 `bind()`方法。因为  `bind()` 是一个方法，所以我们可以使用 `apply()` 

```javascript
new (Function.prototype.bind.apply(Date, [null, 2011, 11, 24]))
```
The preceding array contains `null`, followed by the elements of `arr`. We can use `concat()` to create it by prepending `null` to `arr`:

上述代码中数组包含一个`null`以及`arr`数组的成员。我们可以使用`concat()`来将`null`放到`arr`数组第一个成员的位置上。

```javascript
var arr = [2011, 11, 24];
new (Function.prototype.bind.apply(Date, [null].concat(arr)))
```

#### 3.2.2 A library method 库方法

The preceding manual workaround is inspired by a library method published by Mozilla. The following is a slightly edited version of it:

前面手动处理的变通方法是受到了Mozilla 发表的一个[库方法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply#Using_apply_to_chain_constructors)的启发。以下是稍微修改后的版本：

```javascript
if (!Function.prototype.construct) {
	Function.prototype.construct = function(argArray) {
		if (! Array.isArray(argArray)) {
			throw new TypeError("Argument must be an array");
		}
		var constr = this;
		var nullaryFunc = Function.prototype.bind.apply(constr, [null].concat(argArray));
		return new nullaryFunc();
	};
}
```
Here is the method in use:

看看这个方法的使用：

```javascript
Date.construct([2011, 11, 24])
// Sat Dec 24 2011 00:00:00 GMT+0800 (中国标准时间)
```

#### 3.2.3 An alternative approach 一种替代方式

An alternative to the previous approach is to create an uninitialized instance via  `Object.create()` and then call the constructor (as a function) via  `apply()` . That means that you are effectively reimplementing the  `new` operator (some checks are omitted):

前一种方式的替代方式是通过`Object.create()`创建一个未初始化的实例，然后通过`apply()`以调用函数的方式去调用这个构造函数。这意味着你实际上重新实现了 `new `运算符（忽略了一些检查）：

```javascript
Function.prototype.construct = function(argArray) {
	var constr = this;
	var inst = Object.create(constr.prototype);
	var result = constr.apply(inst, argArray); // (1)
	// Check: did the constructor return an object
	// and prevent `this` from being the result?
	return result ? result : inst;
};
```

*Warning: The preceding code does not work for most built-in constructors, which always produce new instances when called as functions. In other words, the step in line (1) doesn’t set up  `inst` as desired.*

*警告：上述代码对于大部分内置的构造函数无效。因为内置的构造函数作为函数调用时总是会生成新的实例。换言之，line (1) 这一步 没有如期望的那样设置 `inst`。*


### 3.3 Pitfall: Losing `this` When Extracting a Method  陷阱：提取方法时丢失了 `this`

If you extract a method from an object, it becomes a true function again. Its connection with the object is severed, and it usually doesn’t work properly anymore. Take, for example, the following object, `counter`:

如果你从对象中提取出一个方法来，该方法可以作为一个真正的函数。它与对象的关联被切断了，这个方法通常无法正常工作。以下面这个`counter`对象为例：

```javascript
var counter = {
    count: 0,
    inc: function () {
        this.count++;
    }
}
```

Extracting `inc` and calling it (as a function!) fails:

把方法`inc`提取出来，作为函数来调用，结果失败了：

```javascript
var func = counter.inc;
func()
counter.count  // didn’t work
// 0
```

Here’s the explanation: we have called the value of `counter.inc` as a function. Hence, `this` is the global object and we have performed `window.count++`. `window.count` does not exist and is `undefined`. Applying the `++` operator to it sets it to `NaN`:

解释如下：我们把`counter.inc`作为函数来调用，所以`this` 是全局对象，我们执行了`window.count++`. `window.count` 并不存在，所以等于`undefined`. 对它使用`++`运算符，就把它设置为`NaN`了。

```javascript
count  // global variable
// NaN
```

#### 3.3.1 How to get a warning 如何获得错误提示

If method `inc()` is in strict mode, you get a warning:

如果方法`inc()` 是严格模式的，你将会获得一个错误提示：

```javascript
counter.inc = function () { 
	'use strict'; 
	this.count++
};

var func2 = counter.inc;

func2()
// TypeError: Cannot read property 'count' of undefined
```

The reason is that when we call the strict mode function `func2`, `this` is `undefined`, resulting in an error.

因为当我们调用一个严格模式的函数`func2`时，`this`是`undefined`, 所以会报错。

#### 3.3.2 How to properly extract a method 如何正确地提取方法

Thanks to `bind()`, we can make sure that `inc` doesn’t lose the connection with `counter`:

```javascript
var func3 = counter.inc.bind(counter);
func3()
counter.count  // it worked!
// 1
```

#### 3.3.3 Callbacks and extracted methods  回调函数 与 提取的方法

In JavaScript, there are many functions and methods that accept `callbacks`. Examples in browsers are `setTimeout()` and `event handling`. If we pass in `counter.inc` as a callback, it is also invoked as a function, resulting in the same problem just described. To illustrate this phenomenon, let’s use a simple callback-invoking function:

```javascript
function callIt(callback) {
    callback();
}
```

Executing `counter.count` via callIt triggers a warning (due to strict mode):

```javascript
> callIt(counter.inc)
TypeError: Cannot read property 'count' of undefined
As before, we fix things via bind():
> callIt(counter.inc.bind(counter))
> counter.count  // one more than before
2
```

*WARNING*
*Each call to `bind()` creates a new function. That has consequences when you’re registering and unregistering callbacks (e.g., for event handling). You need to store the value you registered somewhere and use it for unregistering, too.*


### 3.4 Pitfall: Functions Inside Methods Shadow this 陷阱：函数内部的方法覆盖了`this`。

You often nest function definitions in JavaScript, because functions can be parameters (e.g., callbacks) and because they can be created in place, via function expressions. This poses a problem when a method contains a normal function and you want to access the former’s `this` inside the latter, because the method’s `this` is shadowed by the normal function’s `this` (which doesn’t even have any use for its own `this`). In the following example, the function at (1) tries to access the method’s this at (2):

在 JavaScript 中，我们经常嵌套函数，因为函数可以作为参数（即回调函数），并且他们在需要的地方才会通过函数表达式被创建出来。这就产生了一个问题：当一个方法中包含了一个普通的函数，而我们需要在后一个函数中访问前一个方法的`this`。因为这个方法的`this`被普通函数的`this`覆盖了。以下示例代码中，（1）的函数尝试在（2）访问这个方法的`this`：

```javascript
var obj = {
    name: 'Jane',
    friends: [ 'Tarzan', 'Cheeta' ],
    loop: function () {
        'use strict';
        this.friends.forEach(
            function (friend) {  // (1)
                console.log(this.name+' knows '+friend);  // (2)
            }
        );
    }
};
```

This fails, because the function at (1) has its own `this`, which is `undefined` here:

这将执行失败，因为 （1）的函数有它自己的`this`，这里是`undefined`。

```javascript
obj.loop();
// TypeError: Cannot read property 'name' of undefined
```

There are three ways to work around this problem.

有3种方式可以解决这个问题：

#### 3.4.1 Workaround 1: that = this   变通方法1：that = this

We assign `this` to a variable `that` won’t be shadowed inside the nested function:

我们把`this`赋值一个不会再嵌套的函数内部被覆盖的变量`that`

```javascript
loop: function () {
    'use strict';
    var that = this;
    this.friends.forEach(function (friend) {
        console.log(that.name+' knows '+friend);
    });
}
```
Here’s the interaction: 

结果如下：

```javascript
obj.loop();
// Jane knows Tarzan
// Jane knows Cheeta
```

#### 3.4.2 Workaround 2: `bind()` 变通方式2：`bind()`

We can use `bind()` to give the callback a fixed value for `this` -- namely, the method’s `this` (line (1)):

我们可以使用`bind()`给回调函数的`this`一个固定的值，即方法loop的`this`。

```javascript
loop: function () {
    'use strict';
    this.friends.forEach(function (friend) {
        console.log(this.name+' knows '+friend);
    }.bind(this));  // (1)
}
```

#### 3.4.3 Workaround 3: a thisValue for forEach() 变通方式3：给 forEach() 指定 `this`

A workaround that is specific to forEach() (see Examination Methods) is to provide a second parameter after the callback that becomes the `this` of the callback:

对于forEach() 有一个特殊的变通方法，在回调函数后提供第二个参数，作为回调函数的`this`.

```javascript
loop: function () {
    'use strict';
    this.friends.forEach(function (friend) {
        console.log(this.name+' knows '+friend);
    }, this);
}
```
