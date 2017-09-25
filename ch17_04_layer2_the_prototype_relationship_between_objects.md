## 4. Layer 2: The Prototype Relationship Between Objects 对象间的原型关系

The prototype relationship between two objects is about inheritance: every object can
have another object as its prototype. Then the former object inherits all of its prototype’s
properties. An object specifies its prototype via the internal property [[Prototype]] .
Every object has this property, but it can be null . The chain of objects connected by the
[[Prototype]] property is called the prototype chain (Figure 17-1).

两个对象之间的原型关系是关于继承的：每个对象都可以有另一个作为它的原型的对象。前一个对象继承它的原型的所有属性。对象通过内部属性 `[[Prototype]]` 来指定它的原型（prototype）。每个对象都有这个属性，但它可以是`null` 。由 `[[Prototype]]` 属性连接起来的对象链被称为`原型链（prototype chain）` 。

[				![A prototype chain.](http://speakingjs.com/es5/images/spjs_2101.png)

​				         Figure 17-1. A prototype chain.

To see how prototype-based (or *prototypal*) inheritance works, let’s look at an example
(with invented syntax for specifying the `[[Prototype]]` property):

为了明白基于原型的（原型链的）继承的工作原理，我们来看一个例子（假设有指定[[Prototype]]属性的语法）：

```javascript
var proto = {
    describe: function () {
        return 'name: '+this.name;
    }
};

var obj = {
    [[Prototype]]: proto,   // 假设可以这样指定 [[Prototype]] 这个属性的值。
    name: 'obj'
};
```

The object `obj` inherits the property `describe` from `proto` . It also has a so-called own
(noninherited, direct) property, `name` .

对象`obj` 从`proto` 中继承了属性`describe`. 它同时还有一个所谓的自己的（非继承的，直接的）属性 `name`。

### 4.1 Inheritance 继承

`obj` inherits the property `describe` ; you can access it as if the object itself had that
property:

`obj` 继承了属性 `describe` , 你可以访问到这个属性，就像对象`obj` 本身有这个属性一样。

```javascript
obj.describe
// [Function]
```

Whenever you access a property via `obj` , JavaScript starts the search for it in that object
and continues with its prototype, the prototype’s prototype, and so on. That’s why we
can access `proto.describe` via `obj.describe` . The prototype chain behaves as if it were
a single object. That illusion is maintained when you call a method: the value of `this` is
always the object where the search for the method began, not where the method was
found. That allows the method to access all of the properties of the prototype chain. For
example:

当你通过对象`obj` 来访问某个属性时，JS 从这个对象开始查找该属性，（如果没有找到，）会继续向它的原型，以及原型的原型查找该属性。这就是我们可以通过`obj.describe` 访问到`proto.describe` 的原因。原型链（prototype chain）表现得像是一个单独的对象。当你调用一个方法时，依然会有这种错觉: `this` 的值总是指向最开始搜索该方法的对象，而不是该方法所在的对象。这种机制允许`方法`访问原型链上所有`属性` 。 例如：

```javascript
obj.describe()
// 'name: obj'
```

Inside `describe()` , `this` is` obj` , which allows the method to access `obj.name`.

在`describe()` 内， `this` 指的是对象 `obj` 。对象`obj` 允许方法`describe()`   访问 ` obj.name ` 。

### 4.2 Overriding 覆盖

In a prototype chain, a property in an object overrides a property with the same key in
a “later” object: the former property is found first. It hides the latter property, which
can’t be accessed anymore. As an example, let’s override the method `proto.describe()` in `obj `:

在原型链中，某个对象的属性可以覆盖原型链靠后的对象上同名的属性：前一个（对象上的）属性先找到。后一个（对象上的）属性被隐藏了，不能再访问到了。举个例子，让我们在 `obj` 上覆盖方法 `proto.describe` :

```javascript
obj.describe = function () { 
  return 'overridden' 
};

obj.describe()
// 'overridden'
```

That is similar to how overriding of methods works in class-based languages.

这与基于类的编程语言的覆盖类似。

### 4.3 Sharing Data Between Objects via a Prototype 通过原型在对象间共享数据

Prototypes are great for sharing data between objects: several objects get the same prototype, which holds all shared properties. Let’s look at an example. The objects `jane` and
`tarzan` both contain the same method, `describe()` . That is something that we would
like to avoid by using sharing:

原型很适合用于对象间共享数据：几个对象获得相同的原型，这个原型存储着所有共用的属性。让我们来看一个例子。对象 `jane` 和 `tarzan` 都有一个`describe()`方法。这个方法是我们希望通过共享来避免的。

```javascript
var jane = {
    name: 'Jane',
    describe: function () {
        return 'Person named '+this.name;
    }
};
var tarzan = {
    name: 'Tarzan',
    describe: function () {
        return 'Person named '+this.name;
    }
};

```

Both objects are persons. Their `name` property is different, but we could have them share the method `describe`. We do that by creating a common prototype called `PersonProto` and putting `describe` into it ([Figure 17-2](http://speakingjs.com/es5/ch17.html#figoo_person_shared)).

两个对象都是人，它们的`name` 属性值是不同的，但我们可以让它们共享`describe`方法。我们可以创建一个共有的原型 `PersonProto` ，然后将`describe` 方法置于这原型中。

![The objects jane and tarzan share the prototype PersonProto and thus the property describe.](http://speakingjs.com/es5/images/spjs_2102.png) 		Figure 17-2. The objects jane and tarzan share the prototype PersonProto and thus the property describe.

The following code creates objects `jane` and `tarzan` that share the prototype `PersonProto`:

以下代码创建了两个对象`jane` 和 `tarzan` ，它们共享原型 `PersonProto`:

```javascript
var PersonProto = {
    describe: function () {
        return 'Person named '+this.name;
    }
};
var jane = {
    [[Prototype]]: PersonProto, // 伪代码，假设可以这样设置[[Prototype]]
    name: 'Jane'
};
var tarzan = {
    [[Prototype]]: PersonProto, // 伪代码，假设可以这样设置[[Prototype]]
    name: 'Tarzan'
};
```

And here is the interaction:

结果如下：

```javascript
jane.describe()
// Person named Jane
tarzan.describe()
// Person named Tarzan
```

This is a common pattern: the data resides in the first object of a prototype chain, while methods reside in later objects. JavaScript’s flavor of prototypal inheritance is designed to support this pattern: setting a property affects only the first object in a prototype chain, whereas getting a property considers the complete chain (see [Setting and Deleting Affects Only Own Properties](http://speakingjs.com/es5/ch17.html#setting_properties_proto_chain)).

这是一种常见的模式：数据位于原型链的第一个对象中，方法位于之后的对象（原型对象）中。JS 的原型继承特点就是被设计来支持这种模式的：设置属性只会影响到原型链的第一个对象，而获取属性涉及整个原型链。

### 4.4 Getting and Setting the Prototype 获取和设置原型

So far, we have pretended that you can access the internal property `[[Prototype]]` from JavaScript. But the language does not let you do that. Instead, there are functions for reading the prototype and for creating a new object with a given prototype.

到目前为止，我们一直假装你能够在 JS 中访问到内部属性`[[Prototype]]`。但 JS 不允许你这么做。相反，存在一些方法可以读取 `原型` 以及根据给定的`原型` 创建新的对象。

#### 4.4.1 Creating a new object with a given prototype 根据给定的`原型` 创建新的对象

This invocation:

 调用：

```javascript
Object.create(proto, propDescObj?)
```

creates an object whose prototype is `proto`. Optionally, properties can be added via descriptors (which are explained in [Property Descriptors](http://speakingjs.com/es5/ch17.html#property_descriptors)). In the following example, object `jane` gets the prototype `PersonProto` and a mutable property `name` whose value is `'Jane'` (as specified via a property descriptor):

创建了一个原型为`proto` 的对象。我们可以通过可选的参数 -- 描述符（descriptor）来添加属性。下面的例子中，对象`jane` 获得原型 `PersonProto` 和一个可变属性`name`,  这个`name` 属性的值是`jane` （由一个属性描述符指定）：

```javascript
var PersonProto = {
    describe: function () {
        return 'Person named '+this.name;
    }
};
var jane = Object.create(PersonProto, {
    name: { value: 'Jane', writable: true } // `属性描述符`指定了对象的属性`name`
});
```

Here is the interaction:

结果如下：

```javascript
jane.describe()
// 'Person named Jane'
```

But you frequently just create an empty object and then manually add properties, because descriptors are verbose:

但是我们通常只创建一个空的对象，然后再手动添加属性，因为描述符写起来很啰嗦：

```javascript
var jane = Object.create(PersonProto); // 创建一个空对象`jane`
jane.name = 'Jane';   // 手动添加属性`name`
```

#### 4.4.2 Reading the prototype of an object 读取一个对象的原型

This method call:

调用方法：

```javascript
Object.getPrototypeOf(obj)
```

returns the prototype of `obj`. Continuing the preceding example:

返回 `obj` 的原型。 继续用上一个例子：

```javascript
Object.getPrototypeOf(jane) === PersonProto
// true
```

#### 4.4.3 Checking whether one object a prototype of another one 检测一个对象是否是另一个对象的原型

This syntax:

语法：

```
Object.prototype.isPrototypeOf(obj)
```

checks whether the `receiver` of the method is a (direct or indirect) prototype of `obj`. In other words: are the receiver and `obj` in the same prototype chain, and does `obj` come before the receiver? For example:

检测 这个方法的接收者（receiver）是否是对象`obj` 的（直接或间接的）原型。换言之，接收者和 `obj` 是否在同一个原型链上，并且 `obj` 在 接收者 之前。

```javascript
var A = {};
var B = Object.create(A);
var C = Object.create(B);
A.isPrototypeOf(C)
// true
C.isPrototypeOf(A)
// false
```

#### 4.4.4 Finding the object where a property is defined 找到定义属性的对象

The following function iterates over the property chain of an object `obj`. It returns the first object that has an own property with the key `propKey`, or `null`if there is no such object:

下面的函数 遍历 对象`obj` 的属性链。它返回第一个自己有这个键名`propKey`属性的对象，如果没有这个对象，则返回`null`.

```javascript
function getDefiningObject(obj, propKey) { 
    obj = Object(obj); // make sure it’s an object
    while (obj && !{}.hasOwnProperty.call(obj, propKey)) {
        obj = Object.getPrototypeOf(obj);
        // obj is null if we have reached the end
    }
    return obj;
}
```

In the preceding code, we called the method `Object.prototype.hasOwnProperty`generically (see [Generic Methods: Borrowing Methods from Prototypes](http://speakingjs.com/es5/ch17.html#generic_method).

在之前的代码中，我们一般是通过`Object.prototype.hasOwnProperty`调用方法`hasOwnProperty`。



### 4.5 The Special Property `__proto__` 特殊属性`__proto__`

Some JavaScript engines have a special property for getting and setting the prototype of an object: `__proto__`. It brings direct access to `[[Prototype]]` to the language:

有些 JS 引起有一个特殊的属性`__proto__`用于获取和设置对象的原型。它使得 JS 可以直接访问 `[[Prototype]]`:

```javascript
> var obj = {};
// 读取 __proto__ 属性
> obj.__proto__ === Object.prototype
true

// 设置 __proto__ 属性
> obj.__proto__ = Array.prototype
> Object.getPrototypeOf(obj) === Array.prototype
true
```

There are several things you need to know about `__proto__`:

关于`__proto__`, 有几件事情你需要知道:

- `__proto__` is pronounced “dunder proto,” an abbreviation of “double underscore proto.” That pronunciation has been borrowed from the Python programming language (as [suggested by Ned Batchelder](http://bit.ly/1fwlzN8) in 2006). Special variables with double underscores are quite frequent in Python.

  `__proto__` 读音为 “dunder proto,” 是 “double underscore proto”的缩写。这个发音借鉴自 Python 。在 Python 中，双下划线的特殊变量很常见。

- `__proto__` is not part of the ECMAScript 5 standard. Therefore, you must not use it if you want your code to conform to that standard and run reliably across current JavaScript engines.

  `__proto__` is 不是 ECMAScript 5 标准的一部分。因此，如果你想使你的代码符合ES5 标准并且在目前的 JS 引擎中都能可靠地运行，你就不要用这个属性。

- However, more and more engines are adding support for `__proto__` and it will be part of ECMAScript 6.

  然而，越来越多的 JS 引擎增加了对  `__proto__`  的支持， 它将会是 ES6 标准的一部分。

- The following expression checks whether an engine supports `__proto__` as a special property:

  以下表达式检查 JS 引擎是否支持  `__proto__`  作为一个特殊的属性：

```javascript
  Object.getPrototypeOf({ __proto__: null }) === null
```

### 4.6 Setting and Deleting Affects Only Own Properties 设置和删除只影响对象自身的属性

Only getting a property considers the complete prototype chain of an object. Setting and deleting ignores inheritance and affects only own properties.

只有获取属性时才会考虑对象的整个原型链。设置和删除（属性的操作）会忽略继承（关系），只会影响对象自身的属性。

#### 4.6.1 Setting a property  设置属性

Setting a property creates an own property, even if there is an inherited property with that key. For example, given the following source code:

设置属性会创建一个（对象）自身的属性，即使已经有一个继承的同名属性。例如：

```javascript
var proto = { foo: 'a' };
var obj = Object.create(proto);
```

`obj` inherits `foo` from `proto`:

对象`obj`  继承了`proto` 的属性 `foo` :

```javascript
> obj.foo
'a'
> obj.hasOwnProperty('foo')
false
```

Setting `foo` has the desired result:

设置`foo` 属性，得到期望的结果：

```javascript
> obj.foo = 'b';
> obj.foo
'b'
```

However, we have created an own property and not changed `proto.foo`:

然而，我们创建了一个对象自身的属性，并没有改变`proto.foo`:

```javascript
> obj.hasOwnProperty('foo')
true
> proto.foo
'a'
```

The rationale is that prototype properties are meant to be shared by several objects. This approach allows us to nondestructively “change” them—only the current object is affected.

原因是原型属性是由多个对象共享的。这种方式允许你 “无损地” 改变属性，只影响当前对象。

#### 4.6.2 Deleting an inherited property 删除继承的属性

You can only delete own properties. Let’s again set up an object, `obj`, with a prototype, `proto`:

你只能删除对象自身的属性。让我们再次创建一个对象`obj`, 它是原型是`proto` :

```javascript
var proto = { foo: 'a' };
var obj = Object.create(proto);
```

Deleting the inherited property `foo` has no effect:

删除继承的属性`foo` 没有效果：

```javascript
> delete obj.foo
true
> obj.foo
'a'
```

For more information on the `delete` operator, consult [Deleting properties](http://speakingjs.com/es5/ch17.html#operator_delete).

关于 `delete` 运算符的更多信息，请参看[Deleting properties](http://speakingjs.com/es5/ch17.html#operator_delete).

#### 4.6.3 Changing properties anywhere in the prototype chain 在原型链上修改属性

If you want to change an inherited property, you first have to find the object that owns it (see [Finding the object where a property is defined](http://speakingjs.com/es5/ch17.html#code_getDefiningObject)) and then perform the change on that object. For example, let’s delete the property `foo` from the previous example:

如果你想要改变继承的属性，首先你需要找到哪个对象拥有这个属性，然后对该对象进行修改操作。例如，从前一个例子中，删除属性`foo`:

```javascript
> delete getDefiningObject(obj, 'foo').foo;
true
> obj.foo
undefined
```
