## 10. Layer 3: Constructors—Factories for Instances 构造函数—— 实例的工厂

A *constructor function* (short: *constructor*) helps with producing objects that are similar in some way. It is a normal function, but it is named, set up, and invoked differently. This section explains how constructors work. They correspond to classes in other languages.

*构造函数*（简写为 *constructor*）帮助生成类似的对象。`构造函数`是标准的函数，但它的命名、创建和调用方式不同于普通函数。这一章节将解释`构造函数`的工作原理。`构造函数` 相当于其他编程语言中的`类` 。

We have already seen an example of two objects that are similar (in [Sharing Data Between Objects via a Prototype](http://speakingjs.com/es5/ch17.html#sharing_via_prototype)):

我们已经见过两个相似的对象的例子：

```javascript
var PersonProto = {
    describe: function () {
        return 'Person named '+this.name;
    }
};
var jane = {
    [[Prototype]]: PersonProto,
    name: 'Jane'
};
var tarzan = {
    [[Prototype]]: PersonProto,
    name: 'Tarzan'
};
```

The objects `jane` and `tarzan` are both considered “persons” and share the prototype object `PersonProto`. Let’s turn that prototype into a constructor `Person` that creates objects like `jane` and `tarzan`. The objects a constructor creates are called its *instances*. Such instances have the same structure as `jane`and `tarzan`, consisting of two parts:

对象`jane` 和 `tarzan` 都是“人”，共享同一个原型对象`PersonProto`。 让我们把这个原型改为构造函数`Person`， 它可创建类似于`jane` 和 `tarzan` 的 对象。 构造函数创建的对象，成为*实例*。这些实例拥有和`jane` 、`tarzan` 一样的（数据）结构，有两部分组成：

1. Data is instance-specific and stored in the own properties of the instance objects (`jane` and `tarzan` in the preceding example).

   数据是实例特有的，存储在实例对象（前一个例子中的`jane` 和`tarzan`）自身的属性上。

2. Behavior is shared by all instances—they have a common prototype object with methods (`PersonProto` in the preceding example).

   行为是被实例共享的。他们有共同的带有方法（前一个例子中的PersonProto）的原型对象。

A constructor is a function that is invoked via the `new` operator. By convention, the names of constructors start with uppercase letters, while the names of normal functions and methods start with lowercase letters. The function itself sets up part 1:

构造函数是通过`new` 运算符调用的函数。习惯上，构造函数的命名首字母大写，普通函数和方法的命名首字母小写。构造函数自身创建第一部分的数据：

```javascript
function Person(name) {
    this.name = name;
}
```

The object in `Person.prototype` becomes the prototype of all instances of `Person`. It contributes part 2:

在`Person.prototype` 对象变成了`Person` 所有实例的原型。它促成第二部分的行为：

```javascript
Person.prototype.describe = function () {
    return 'Person named '+this.name;
};
```

Let’s create and use an instance of `Person`:

让我们创建和使用一个`Person` 的实例：

```javascript
> var jane = new Person('Jane');
> jane.describe()
'Person named Jane'
```

We can see that `Person` is a normal function. It only becomes a constructor when it is invoked via `new`. The `new` operator performs the following steps:

我们知道`Person` 是一个普通函数。只有通过`new` 运算符调用时，才成为构造函数。`new` 运算符执行以下步骤：

- First the behavior is set up: a new object is created whose prototype is `Person.prototype`.

  首先，创建一个新的原型为`Person.prototype` 的对象。

- Then the data is set up: `Person` receives that object as the implicit parameter `this` and adds instance properties.

  然后，`Person` 接受这个新对象为隐式的参数`this`，并添加实例属性。

*Figure 17-3* shows what the instance `jane` looks like. The property `constructor`of `Person.prototype` points back to the constructor and is explained in [The constructor Property of Instances](http://speakingjs.com/es5/ch17.html#constructor_property).

图17-3 显示了实例对象`jane` 的结构。`Person.prototype` 的 `constructor` 属性指向构造函数，这会在[实例的 constructor 属性 章节](http://speakingjs.com/es5/ch17.html#constructor_property) 解释。

![jane is an instance of the constructor Person; its prototype is the object Person.prototype.](http://speakingjs.com/es5/images/spjs_2103.png)Figure 17-3. `jane` is an instance of the constructor `Person`; its prototype is the object `Person.prototype`.

​                图17-3. `jane` 是构造函数`Person` 的实例；它的原型是对象`Person.prototype`

The `instanceof` operator allows us to check whether an object is an instance of a given constructor:

`instanceof` 运算符检查一个对象是否是给定构造函数的实例：

```javascript
> jane instanceof Person
true
> jane instanceof Date
false
```

### 10.1 The `new` Operator Implemented in JavaScript  在 JS 中实现的 `new` 运算符

If you were to manually implement the `new` operator, it would look roughly as follows:

如果你打算手动实现`new` 运算符，它大致如下所示：

```javascript
function newOperator(Constr, args) {
    var thisValue = Object.create(Constr.prototype); // (1)
    var result = Constr.apply(thisValue, args);
    if (typeof result === 'object' && result !== null) {
        return result; // (2)
    }
    return thisValue;
}
```

In line (1), you can see that the prototype of an instance created by a constructor `Constr` is `Constr.prototype`.

在（1）行，你可以看出来由构造函数`Constr` 创建的实例的原型是`Constr.prototype`。

Line (2) reveals another feature of the `new` operator: you can return an arbitrary object from a constructor and it becomes the result of the `new`operator. This is useful if you want a constructor to return an instance of a subconstructor (an example is given in [Returning arbitrary objects from a constructor](http://speakingjs.com/es5/ch17.html#constructor_arbitrary_objects)).

（2）行 揭示了`new` 运算符的另一个特性：你可以从一个构造函数中返回任意对象，这个对象会成为`new` 运算符的结果。如果你想要一个构造函数返回一个子构造函数（ [ 从构造函数中返回任意对象](http://speakingjs.com/es5/ch17.html#constructor_arbitrary_objects) 一节中的例子）的实例，这个特性很有用处。

### 10.2 Terminology: The Two Prototypes 术语：两个原型

Unfortunately, the term *prototype* is used ambiguously in JavaScript:

很不幸地是，在JS 中使用的术语 *prototype* 容易引起歧义。

- Prototype 1: The prototype relationship

  原型1：原型关系

  An object can be the prototype of another object:

  一个对象可以是另一个对象的原型：

```javascript
> var proto = {};
> var obj = Object.create(proto);
> Object.getPrototypeOf(obj) === proto
true
```

In the preceding example, `proto` is the prototype of `obj`.

上述例子中，对象`proto` 是另一个对象`obj` 的原型。

- Prototype 2: The value of the property `prototype` 

  原型2：`prototype` 属性的值

  Each constructor `C` has a `prototype` property that refers to an object. That object becomes the prototype of all instances of `C`:

  每一个构造函数`C` 都有一个`prototype` 属性，指的是一个对象。这个对象将成为`C` 的所有实例的原型。

```javascript
> function C() {}
> Object.getPrototypeOf(new C()) === C.prototype
true
```
Usually the context makes it clear which of the two prototypes is meant. Should disambiguation be necessary, then we are stuck with *prototype* to describe the relationship between objects, because that name has made it into the standard library via `getPrototypeOf` and `isPrototypeOf`. We thus need to find a different name for the object referenced by the `prototype` property. One possibility is *constructor prototype*, but that is problematic because constructors have prototypes, too:

通常，上下文能够使得这两个原型的意义明确。如果要消除模棱两可情况，那么我们就必须用`prototype`  来描述对象间的原型关系。因为`prototype` 这个名字通过`getPrototypeof` 和`isPrototypeOf` 已经存在于标准库中。那么，我们需要为`prototype` 属性指向的对象找到一个不同的名字。*构造函数原型（constructor prototype）*是 一个可能的选项。但是这也有问题，因为构造函数也是原型。

```javascript
> function Foo() {}
> Object.getPrototypeOf(Foo) === Function.prototype
true
```

Thus, *instance prototype* is the best option.

那么，*实例原型（instance prototype）* 是最佳选择。

### 10.3 The `constructor` Property of Instances 实例的`constructor` 属性

By default, each function `C` contains an instance prototype object `C.prototype`whose property `constructor` points back to `C`:

默认情况下，每一个函数`C` 包含一个实例原型对象 `C.prototype` ，这个对象的`constructor` 属性指向`C` 。

```javascript
> function C() {}
> C.prototype.constructor === C
true
```

Because the `constructor` property is inherited from the prototype by each instance, you can use it to get the constructor of an instance:

因为每个实例都继承了原型的`constructor` 属性，你可以使用它来获取实例的构造函数：

```javascript
> var o = new C();
> o.constructor
[Function: C]
```

#### 10.3.1 Use cases for the `constructor` property  属性`constructor` 的使用场合

- Switching over an object’s constructor   *switch 循环对象的构造函数*

  In the following `catch` clause, we take different actions, depending on the constructor of the caught exception:

  在以下`catch` 语句中，我们根据捕获异常的`constructor`的不同，采取不同的行动：


```javascript
try {    
// ...
} catch (e) {  
	switch (e.constructor) {        
      case SyntaxError:            ''           
        break;        
      case CustomError:            ''            
        break;          
	}
}
```


*WARNING*  *警告*

This approach detects only direct instances of a given constructor. In contrast, `instanceof` detects both direct instances and instances of all subconstructors.

这种方法只能检测给定构造函数的直接实例。相反，`instanceof` 可以同时检测直接的实例和所有子构造函数的实例。

- Determining the name of an object’s constructor  *查明对象构造函数的名称*

  For example:
  ```javascript
  > function Foo() {}
  > var f = new Foo();
  > f.constructor.name
  'Foo'
  ```
   *WARNING*  *警告*

  Not all JavaScript engines support the property `name` for functions.

  不是所有的 JS 引擎都支持函数的`name` 属性。

- Creating similar objects   *创建相似的对象*

  This is how you create a new object, `y`, that has the same constructor as an existing object, `x`:

  创建一个新对象`y`, 这个新对象与现有的对象`x` 有相同的构造函数。
```javascript
function Constr() {}
var x = new Constr();
var y = new x.constructor();
console.log(y instanceof Constr); 
  // true
```

  This trick is handy for a method that must work for instances of subconstructors and wants to create a new instance that is similar to `this`. Then you can’t use a fixed constructor:

当一个方法必须用于子构造函数的实例，并且想要创建一个与`this` 类似的新的实例时，这个技巧就很管用。那么，你不不能使用固定的构造函数：

```javascript
SuperConstr.prototype.createCopy = function () {   
    return new this.constructor(...);
};
```

- Referring to a superconstructor   *涉及父构造函数*

  Some inheritance libraries assign the superprototype to a property of a subconstructor. For example, the YUI framework provides subclassing via [`Y.extend`](http://yuilibrary.com/yui/docs/yui/yui-extend.html):

  一些继承类库将父级原型赋值给子构造函数的属性。例如，YUI 框架提供的通过`Y.extend` 实现 子类化（继承）：
```javascript
function Super() {}
function Sub() {    
     Sub.superclass.constructor.call(this); // (1)
}
Y.extend(Sub, Super);
```
The call in line (1) works, because `extend` sets `Sub.superclass` to `Super.prototype`. Thanks to the `constructor` property, you can call the superconstructor as a method.

（1） 行的代码能运行，是因为`extend` 把`Sub.superclass` 设置为`Super.prototype` 。 多亏了`constructor` 属性，你可以将父构造函数作为方法调用。

*NOTE*  *注意*

The `instanceof` operator (see [The instanceof Operator](http://speakingjs.com/es5/ch17.html#operator_instanceof)) does not rely on the property `constructor`.

`instanceof` 运算符不依赖于`constructor` 属性。

#### 10.3.2 Best practice  最佳实践

Make sure that for each constructor `C`, the following assertion holds:

确保每个构造函数`C` 都符合以下断言：

```javascript
C.prototype.constructor === C
```

By default, every function `f` already has a property `prototype` that is set up correctly:

在默认情况下，每个函数`f` 已经有一个正确地创建的属性`prototype` 。

```javascript
> function f() {}
> f.prototype.constructor === f
true
```

You should thus avoid replacing this object and only add properties to it:

因此，你应该避免替换掉这个`prototype` 对象，只是对其添加属性：

```javascript
// Avoid:
C.prototype = {
    method1: function (...) { ... },
    ...
};

// Prefer:
C.prototype.method1 = function (...) { ... };
...
```

If you do replace it, you should manually assign the correct value to `constructor`:

如果你要替换掉这个对象，你应该手动地为`constructor` 赋上正确的值。

```javascript
C.prototype = {
    constructor: C,
    method1: function (...) { ... },
    ...
};
```

Note that nothing crucial in JavaScript depends on the `constructor` property; but it is good style to set it up, because it enables the techniques mentioned in this section.

注意： JS  中没有什么很关键的东西依赖于`constructor` 属性，但设置它（Frank 备注：这里应该指重新将`constructor` 属性指向它的构造函数本身）是一个良好的编程风格。因为这样做，可以使得本小节中提到的技术可以使用。

### 10.4 The `instanceof` Operator    `instanceof` 运算符

The `instanceof` operator:

`instanceof` 运算符：

```javascript
value instanceof Constr
```

determines whether `value` has been created by the constructor `Constr` or a subconstructor. It does so by checking whether `Constr.prototype` is in the prototype chain of `value`. Therefore, the following two expressions are equivalent:

判断`value` 是否由构造函数`Constr` 或者其子构造函数所创建。这是通过检查`Constr.prototype` 是否在`value` 的原型链上来实现的。因此，以下两个表达式是等价的：

```javascript
value instanceof Constr
Constr.prototype.isPrototypeOf(value)
```

Here are some examples:

```javascript
> {} instanceof Object
true

> [] instanceof Array  // constructor of []
true
> [] instanceof Object  // super-constructor of []
true

> new Date() instanceof Date
true
> new Date() instanceof Object
true
```

As expected, `instanceof` is always `false` for primitive values:

 对于原始类型的值， `instanceof` 总是返回`false`

```javascript
> 'abc' instanceof Object
false
> 123 instanceof Number
false
```

Finally, `instanceof` throws an exception if its right side isn’t a function: 

如果运算符`instanceof` 右侧不是函数，则抛出异常：

```javascript
> [] instanceof 123
TypeError: Expecting a function in instanceof check
```

#### 10.4.1 Pitfall: objects that are not instances of `Object`  陷阱：有些对象不是`Object` 的实例

Almost all objects are instances of `Object`, because `Object.prototype` is in their prototype chain. But there are also objects where that is not the case. Here are two examples:

 几乎所有对象都是`Object` 的实例，因为 `Object.prototype` 在它们的原型链上。但也有些对象不是这样的。例如：

```javascript
> Object.create(null) instanceof Object
false
> Object.prototype instanceof Object
false
```

The former object is explained in more detail in [The dict Pattern: Objects Without Prototypes Are Better Maps](http://speakingjs.com/es5/ch17.html#dict_pattern). The latter object is where most prototype chains end (and they must end somewhere). Neither object has a prototype:

对象`Object.create(null)`在[字典模式: 没有原型的对象是更好的maps ](http://speakingjs.com/es5/ch17.html#dict_pattern) 章节中有详细的解释。对象 `Object.prototype` 是大部分原型链的末端（原型链必须在某个地方结束）。以上两个都想都没有原型：

```javascript
> Object.getPrototypeOf(Object.create(null))
null
> Object.getPrototypeOf(Object.prototype)
null
```

But `typeof` correctly classifies them as objects:

但是`typeof` 正确地把它归类为对象：

```javascript
> typeof Object.create(null)
'object'
> typeof Object.prototype
'object'
```

This pitfall is not a deal-breaker for most use cases for `instanceof`, but you have to be aware of it.

这个陷阱不会破坏`instanceof`大部分的使用场景， 但你需要知道这个陷阱的存在。

#### 10.4.2 Pitfall: crossing realms (frames or windows) 陷阱：跨域

In web browsers, each frame and window has its own *realm* with separate global variables. That prevents `instanceof` from working for objects that cross realms. To see why, look at the following code:

在 web 浏览器，每一个`frame` 或者窗口 都有自己的域，每个域有独立的全局对象。这就阻止了`instanceof`  用于跨域的对象。想知道原因，看下面的代码：

```javascript
if (myvar instanceof Array) ...  // Doesn’t always work
```

If `myvar` is an array from a different realm, then its prototype is the `Array.prototype` from that realm. Therefore, `instanceof` will not find the `Array.prototype` of the current realm in the prototype chain of `myvar` and will return `false`. ECMAScript 5 has the function `Array.isArray()`, which always works:

如果`myvar` 是另一个域的数组，那么它的原型是那个域的`Array.prototype` 。因此，`instanceof`  在`myvar` 的原型链上找不到当前域的`Array.prototype` ，返回`false` 。 ES5 有一个可以生效的函数`Array.isArray()` 。

```javascript
<head>
    <script>
        function test(arr) {
            var iframe = frames[0];

            console.log(arr instanceof Array); // false
            console.log(arr instanceof iframe.Array); // true
            console.log(Array.isArray(arr)); // true
        }
    </script>
</head>
<body>
    <iframe srcdoc="<script>window.parent.test([])</script>">
    </iframe>
</body>
```

Obviously, this is also an issue with non-built-in constructors.

显然，内置的构造函数没有这个问题。

Apart from using `Array.isArray()`, there are several things you can do to work around this problem:

除了使用	`Array.isArray()` ，还有一些可以用于解决这个问题的东西：

- Avoid objects crossing realms. Browsers have the [`postMessage()`](http://mzl.la/1fwmNrL) method, which can copy an object to another realm instead of passing a reference.

  避免跨域的对象。浏览器有`postMessage()` 方法，可以用于拷贝一个对象到另一个域，而不是传递一份对象的引用。

- Check the name of the constructor of an instance (only works on engines that support the property `name` for functions):

  检查实例的构造函数的名称（仅在支持函数的`name` 属性的引擎中有效）：

  ```javascript
  someValue.constructor.name === 'NameOfExpectedConstructor'
  ```

- Use a prototype property to mark instances as belonging to a type `T`. There are several ways in which you can do so. The checks for whether `value` is an instance of `T` look as follows:

  使用一个原型的属性来标记实例属于类型 `T`。有许多种实现方式。检查`value` 是否是`T` 的实例：

  - `value.isT()`: The prototype of `T` instances must return `true` from this method; a common superconstructor should return the default value, `false`.

    `value.isT()` : 在这个方法中，`T` 的实例的原型返回`true` ；共同的父构造函数应该返回默认值`false` 。

  - `'T' in value`: You must tag the prototype of `T` instances with a property whose key is `'T'` (or something more unique).

    `'T' in value` : 你必须用一个键名为`'T'` （或其他的唯一的)属性标记`T` 的实例的原型

  - `value.TYPE_NAME === 'T'`: Every relevant prototype must have a `TYPE_NAME`property with an appropriate value.

    `value.TYPE_NAME === 'T'`: 每一个相关的原型必须有一个带有合适的值的`TYPE_NAME`属性 



### 10.5 Tips for Implementing Constructors 使用构造函数的技巧

This section gives a few tips for implementing constructors.

这一小节提供一些使用构造函数的技巧。

#### 10.5.1 Protection against forgetting `new`: strict mode 防范忘记使用`new`: 严格模式

If you forget `new` when you use a constructor, you are calling it as a function instead of as a constructor. In sloppy mode, you don’t get an instance and global variables are created. Unfortunately, all of this happens without a warning:

如果你使用一个构造函数时忘记了`new`，构造函数会作为函数而不是构造函数调用。在普通模式下，你不会得到一个实例，会被创建全局变量。不幸的是，这些行为的发生没有警告信息：

```javascript
function SloppyColor(name) {
    this.name = name;
}
var c = SloppyColor('green'); // no warning!

// No instance is created:
console.log(c); // undefined
// A global variable is created:
console.log(name); // green
```

In strict mode, you get an exception:

在严格模式下，报错：

```javascript
function StrictColor(name) {
    'use strict';
    this.name = name;
}
var c = StrictColor('green');
// TypeError: Cannot set property 'name' of undefined
```

#### 10.5.2 Returning arbitrary objects from a constructor 从构造函数中返回任意对象

In many object-oriented languages, constructors can produce only direct instances. For example, consider Java: let’s say you want to implement a class `Expression` that has the subclasses `Addition` and `Multiplication`. Parsing produces direct instances of the latter two classes. You can’t implement it as a constructor of `Expression`, because that constructor can produce only direct instances of `Expression`. As a workaround, static factory methods are used in Java:

在许多面向对象编程的语言中，构造函数只能产生直接的实例。例如，在 Java 中，你想要使用拥有子类`Addition` 和 `Multiplication` 的类`Expression` 。解析会产生它的两个子类的直接实例。你不能将这个 `Expression`  类 作为构造函数使用。因为这个构造函数只能产生`Expression` 的直接实例。作为变通方法，Java 中使用静态的工厂方法：

```javascript
class Expression {
    // Static factory method:
    public static Expression parse(String str) {
        if (...) {
            return new Addition(...);
        } else if (...) {
            return new Multiplication(...);
        } else {
            throw new ExpressionException(...);
        }
    }
}
...
Expression expr = Expression.parse(someStr);
```

In JavaScript, you can simply return whatever object you need from a constructor. Thus, the JavaScript version of the preceding code would look like:

在 JS 中， 你可以返回任何你需要的对象。因此，JS 的版本的代码如下所示：

```javascript
function Expression(str) {
    if (...) {
        return new Addition(..);
    } else if (...) {
        return new Multiplication(...);
    } else {
        throw new ExpressionException(...);
    }
}
...
var expr = new Expression(someStr);
```

That is good news: JavaScript constructors don’t lock you in, so you can always change your mind as to whether a constructor should return a direct instance or something else.

好消息：JS  的构造函数不会把你锁死。至于构造函数返回一个直接的实例还是其他对象，你随时都可以改变主意。