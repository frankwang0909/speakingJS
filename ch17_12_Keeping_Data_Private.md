## 12. Keeping Data Private 使数据保持私有的状态

JavaScript does not have dedicated means for managing private data for an object. This section will describe three techniques for working around that limitation:

JS 没有专门的方法为对象管理私有的数据。这一章节将会描述三种技术来绕过这个限制：

- Private data in the environment of a constructor

  在构造函数环境中的私有数据

- Private data in properties with marked keys

  在带有标记的键名的属性中的私有数据

- Private data in properties with reified keys

  在带有具体化的键名的属性中的私有数据

Additionally, I will explain how to keep global data private via IIFEs.

另外，我还将会介绍如何通过 IIFE 来保证全局变量为私有的。

### 12.1 Private Data in the Environment of a Constructor (Crockford Privacy Pattern) 在构造函数环境中的私有数据（Crockford 隐私模式）

When a constructor is invoked, two things are created: the constructor’s instance and an environment (see [Environments: Managing Variables](http://speakingjs.com/es5/ch16.html#environments)). The instance is to be initialized by the constructor. The environment holds the constructor’s parameters and local variables. Every function (which includes methods) created inside the constructor will retain a reference to the environment—the environment in which it was created. Thanks to that reference, it will always have access to the environment, even after the constructor is finished. This combination of function and environment is called a *closure* ([Closures: Functions Stay Connected to Their Birth Scopes](http://speakingjs.com/es5/ch16.html#closures)). The constructor’s environment is thus data storage that is independent of the instance and related to it only because the two are created at the same time. To properly connect them, we must have functions that live in both worlds. Using [Douglas Crockford’s terminology](http://www.crockford.com/javascript/private.html), an instance can have three kinds of values associated with it (see [Figure 17-4])

调用构造函数时，创建了两样东西：构造函数的`实例`和`环境`( 见 [环境: 管理变量 ](http://speakingjs.com/es5/ch16.html#environments)). `实例` 由构造函数初始化。`环境` 保存着构造函数的参数和局部变量。在构造函数内创建的每一个函数（包括方法）将会保留一份对于该环境（函数被创建的环境）的引用。由于有这个引用，函数总能够访问到这个环境，即使在构造函数的执行结束后。 这种`函数`和`环境`的组合被称为 `闭包` （[闭包: 函数与它的创建环境保持关联 ](http://speakingjs.com/es5/ch16.html#closures)）。构造函数的环境是数据的存储空间，它独立于实例，与实例的关联只是因为它们俩是同时创建的。正确地联结这个环境和实例，我们必须得有存在于这两个地方的函数。使用 [Douglas Crockford’s 术语 ](http://www.crockford.com/javascript/private.html)， 实例可以有三种与此有关的值 [ 见图 17-4]：

- **Public properties 公共的属性**

  Values stored in properties (either in the instance or in its prototype) are publicly accessible.

  存储在属性（无论属性是实例的还是原型的）上的值是可以公开访问的。

- **Private values 私有的属性**

  Data and functions stored in the environment are *private*—only accessible to the constructor and to the functions it created.

  存储在环境中的数据和函数是私有的--- 只有构造函数以及构造函数创建的函数才能访问到它们。

- **Privileged methods 有特权的方法**

  Private functions can access public properties, but public methods in the prototype can’t access private data. We thus need *privileged* methods—public methods in the instance. Privileged methods are public and can be called by everyone, but they also have access to private values, because they were created in the constructor.

  私有函数能够访问到公共的属性，但原型中的公共方法不能访问到私有属性。因此，我们需要有特权的方法--实例中的公共方法。有特权的方法是公共的，能够被所有人调用，但是他们也能访问到私有值，因为它们是在构造函数中创建的。

![When a constructor Constr is invoked, two data structures are created: an environment for parameters and local variables and an instance to be initialized.](http://speakingjs.com/es5/images/spjs_2104.png)
Figure 17-4. When a constructor `Constr` is invoked, two data structures are created: an environment for parameters and local variables and an instance to be initialized.

图 17-4  调用构造函数`Constr` 时，创建了两种数据结构：保存参数和局部变量的环境 、将要初始化的实例。



The following sections explain each kind of value in more detail.

接下来的章节更加详细地介绍每一种值。

#### 12.1.1 Public properties  公共属性

Remember that given a constructor `Constr`, there are two kinds of properties that are *public*, accessible to everyone. First, *prototype properties* are stored in `Constr.prototype` and shared by all instances. Prototype properties are usually methods:

记住，在构造函数`Constr` 中有两种公共的、可以被任何人访问到的属性。首先，*原型属性*存储在`Constr.prototype` ，并被所有实例共享。原型属性通常是`方法`：

```javascript
Constr.prototype.publicMethod = ...;
```

Second, *instance properties* are unique to each instance. They are added in the constructor and usually hold data (not methods):

其次，*实例属性*  是每个实例独有的。实例属性是在构造函数中被添加的，他们通常保存数据（而不是方法）

```javascript
function Constr(...) {
    this.publicData = ...;
    ...
}
```

#### 12.1.2 Private values  私有值

The constructor’s environment consists of the parameters and local variables. They are accessible only from inside the constructor and thus private to the instance:

构造函数的 环境包含参数和局部变量，只能在构造函数内部才能访问到它们。因此，它们是实例所私有的：

```javascript
function Constr(...) {
    ...
    var that = this; // make accessible to private functions

    var privateData = ...;

    function privateFunction(...) {
        // Access everything
        privateData = ...;

        that.publicData = ...;
        that.publicMethod(...);
    }
    ...
}
```

#### 12.1.3 Privileged methods  有特权的方法

Private data is so safe from outside access that prototype methods can’t access it. But then how else would you use it after leaving the constructor? The answer is *privileged methods*: functions created in the constructor are added as instance methods. That means that, on one hand, they can access private data; on the other hand, they are public and therefore seen by prototype methods. In other words, they serve as mediators between private data and the public (including prototype methods):

私有数据对于外部访问是安全的，原型方法无法访问到它们。在离开构造函数后，如何使用私有数据呢？答案是*有特权的方法* ：在构造函数内创建、作为的实例方法而添加的函数。这意味着，一方面，它们可以访问私有数据；另一方面，它们是公共的，可以被原型方法访问到。换言之，它们作为私有数据和公共数据（包括原型方法）的中间媒介。

```javascript
function Constr(...) {
    ...
    this.privilegedMethod = function (...) {
        // Access everything
        privateData = ...;
        privateFunction(...);

        this.publicData = ...;
        this.publicMethod(...);
    };
}
```

#### 12.1.4 An example 例子

The following is an implementation of a `StringBuilder`, using the Crockford privacy pattern:

以下是使用 Crockford 隐私模式，部署一个 `StringBuilder` 方法。

```javascript
function StringBuilder() {
    var buffer = [];  // private values
    this.add = function (str) {  // privileged  methods
        buffer.push(str);
    };
    this.toString = function () {  // privileged  methods
        return buffer.join('');
    };
}
// Can’t put methods in the prototype!
```

Here is the interaction:

结果如下：

```javascript
> var sb = new StringBuilder();
> sb.add('Hello');
> sb.add(' world!');
> sb.toString()
’Hello world!’
```

#### 12.1.5 The pros and cons of the Crockford privacy pattern  `Crockford 隐私模式`的优缺点

Here are some points to consider when you are using the Crockford privacy pattern:

使用 Crockford 隐私模式需要注意的几个点：

- It’s not very elegant  不够优雅

  Mediating access to private data via privileged methods introduces an unnecessary indirection. Privileged methods and private functions both destroy the separation of concerns between the constructor (setting up instance data) and the instance prototype (methods).

  通过有特权的方法间接访问私有数据，引入了不必要的间接性。有特权的方法和私有数据均破坏了关注点分离的原则：在构造函数中设置实例的数据，在实例原型上添加实例的方法。

- It’s completely secure  十分安全

  There is no way to access the environment’s data from outside, which makes this solution secure if you need that (e.g., for security-critical code). On the other hand, private data not being accessible to the outside can also be an inconvenience. Sometimes you want to unit-test private functionality. And some temporary quick fixes depend on the ability to access private data. This kind of quick fix cannot be predicted, so no matter how good your design is, the need can arise.

  从外部无法访问到环境的数据，所以这种解决方案是安全的，另一方面，私有数据无法从外部访问也可能造成不便。有些时候，你想要对私有功能进行单元测试。另外，有些临时的快速修复 依赖于访问私有数据的能力。这种快速修复不可预测，所以，无论你的设计有多好，总会有这类需求。

- It may be slower 也许速度更慢

  Accessing properties in the prototype chain is highly optimized in current JavaScript engines. Accessing values in the closure may be slower. But these things change constantly, so you’ll have to measure should this really matter for your code.

  当前的 JS 引擎对访问原型链中的属性进行了极大的优化。访问闭包中的值可能会更慢。但是这些事情经常改变，所以，你必须衡量对于你的代码来说，访问数据的速度重不重要。

- It consumes more memory 占用更多内存

  Keeping the environment around and putting privileged methods in instances costs memory. Again, be sure it really matters for your code and measure.

  保留环境以及把有特权的方法置于实例中，需要占用内存。衡量内存占用对于你的代码的重要性。

### 12.2 Private Data in Properties with Marked Keys 在带有标记的键名的属性中的私有数据

For most non-security-critical applications, privacy is more like a hint to clients of an API: “You don’t need to see this.” That’s the key benefit of encapsulation—hiding complexity. Even though more is going on under the hood, you only need to understand the public part of an API. The idea of a naming convention is to let clients know about privacy by marking the key of a property. A prefixed underscore is often used for this purpose.

对于大部分安全性要求不高的应用，隐私更多地像是对 API用户的提示：你不需要看见这个隐私数据。这就是封装的好处 --  隐藏复杂性。即便在背后有更多的操作，你只需要知道 API 公开的部分。命名习惯是通过标记属性的键名来让客户知道哪些数据是私有的。下划线的前缀经常用于这个目的。

Let’s rewrite the previous `StringBuilder` example so that the buffer is kept in a property `_buffer`, which is private, but by convention only:

让我们来重写之前的例子，buffer 置于私有属性 `_buffer` 中：

```javascript
function StringBuilder() {
    this._buffer = [];
}
StringBuilder.prototype = {
    constructor: StringBuilder,
    add: function (str) {
        this._buffer.push(str);
    },
    toString: function () {
        return this._buffer.join('');
    }
};
```

Here are some pros and cons of privacy via marked property keys:

以下是通过标记的属性键名方式的优缺点：

- It offers a more natural coding style   更自然的编码风格

  Being able to access private and public data in the same manner is more elegant than using environments for privacy.

  能够以相同的方式访问私有的数据和公共的数据，比使用`环境`更优雅。

- It pollutes the namespace of properties  污染了属性的命名空间

  Properties with marked keys can be seen everywhere. The more people use IDEs, the more it will be a nuisance that they are shown alongside public properties, in places where they should be hidden. IDEs could, in theory, adapt by recognizing naming conventions and by hiding private properties where possible.

  带有标记键名的属性在任何地方都可见。人们使用 IDE 越多，就越会觉得这些属性在原本应该隐藏的地方，却与公共属性并排显示出来是件很讨厌的事情。

- Private properties can be accessed from “outside”  可以从 ”外部“ 访问到私有属性

  That can be useful for unit tests and quick fixes. Additionally, subconstructors and helper functions (so-called “friend functions”) can profit from easier access to private data. The environment approach doesn’t offer this kind of flexibility; private data can be accessed only from within the constructor.

  对于单元测试和快速修复非常有用。另外，更加容易访问私有数据有利于子构造函数和帮助函数（所谓的“友元函数”）。`环境方法`无法提供这种灵活性，私有数据只能在构造函数中才能访问。

- It can lead to key clashes    导致键名冲突

  Keys of private properties can clash. This is already an issue for subconstructors, but it is even more problematic if you work with multiple inheritance (as enabled by some libraries). With the environment approach, there are never any clashes.

  私有属性的键名可以发生冲突。对于子构造函数，这已经是个问题了。如果你同时有多个继承（使用了多个库），问题就更严重了。使用`环境方法`则不会有任何的命名冲突。

### 12.3 Private Data in Properties with Reified Keys 在带有具体化的键名的属性中的私有数据

One problem with a naming convention for private properties is that keys might clash (e.g., a key from a constructor with a key from a subconstructor, or a key from a mixin with a key from a constructor). You can make such clashes less likely by using longer keys, that, for example, include the name of the constructor. Then, in the previous case, the private property `_buffer` would be called `_StringBuilder_buffer`. If such a key is too long for your taste, you have the option of *reifying it*, of storing it in a variable:

私有属性的命名习惯有一个问题：可能会导致键名冲突（构造函数中的键名与子构造函数的键名，或者 混合类的键名与构造函数的键名）。你可以通过使用更长的键名（比如，包含构造函数的名称）来避免命名冲突。前一个例子中的私有属性`_buffer` 可以写成 `_StringBuilder_buffer` 。 如果你觉得这个键名太长了，可以对它具体化，把它存在一个变量中。

```javascript
var KEY_BUFFER = '_StringBuilder_buffer';
```

We now access the private data via `this[KEY_BUFFER]`:

现在，我们可以通过`this[KEY_BUFFER]` 访问私有属性：

```javascript
var StringBuilder = function () {
    var KEY_BUFFER = '_StringBuilder_buffer';

    function StringBuilder() {
        this[KEY_BUFFER] = [];
    }
    StringBuilder.prototype = {
        constructor: StringBuilder,
        add: function (str) {
            this[KEY_BUFFER].push(str);
        },
        toString: function () {
            return this[KEY_BUFFER].join('');
        }
    };
    return StringBuilder;
}();
```

We have wrapped an IIFE around `StringBuilder` so that the constant `KEY_BUFFER` stays local and doesn’t pollute the global namespace.

我们用一个 IIFE 包裹 `StringBuilder` ，这样常量 `KEY_BUFFER` 是局部的，不会污染全局命名空间。

Reified property keys enable you to use UUIDs (universally unique identifiers) in keys. For example, via Robert Kieffer’s [node-uuid](https://github.com/broofa/node-uuid):

具体化的属性键名让你可以在键名中使用 UUID （通用唯一标识符）。例如，通过 Robert Kieffer 的  [node-uuid](https://github.com/broofa/node-uuid):

```javascript
var KEY_BUFFER = '_StringBuilder_buffer_' + uuid.v4();
```

`KEY_BUFFER` has a different value each time the code runs. It may, for example, look like this:

每次代码运行，`KEY_BUFFER`  会有一个不同的值。例如，它也许看起来像这样：

```javascript
_StringBuilder_buffer_110ec58a-a0f2-4ac4-8393-c866d813b8d1
```

Long keys with UUIDs make key clashes virtually impossible.

有 UUID 的长键名使得键名冲突基本不可能出现。

### 12.4 Keeping Global Data Private via IIFEs 通过IIFE 保持全局数据私有

This subsection explains how to keep global data private to singleton objects, constructors, and methods, via IIFEs (see [Introducing a New Scope via an IIFE](http://speakingjs.com/es5/ch16.html#iife)). Those IIFEs create new environments (refer back to [Environments: Managing Variables](http://speakingjs.com/es5/ch16.html#environments)), which is where you put the private data.

这一小节解释如何通过 IIFE 保持单例对象、构造函数和方法的全局数据为私有的。这些 IIFE 创建了新的环境存储私有数据。

#### 12.4.1 Attaching private global data to a singleton object 把私有的全局数据绑定到单例中

You don’t need a constructor to associate an object with private data in an environment. The following example shows how to use an IIFE for the same purpose, by wrapping it around a singleton object:

你不需要构造函数将对象与环境中的私有数据关联。下面的例子展示了如何使用 IIFE 包裹一个单例来实现相同的目的：

```javascript
var obj = function () {  // open IIFE

    // public
    var self = {
        publicMethod: function (...) {
            privateData = ...;
            privateFunction(...);
        },
        publicData: ...
    };

    // private
    var privateData = ...;
    function privateFunction(...) {
        privateData = ...;
        self.publicData = ...;
        self.publicMethod(...);
    }

    return self;
}(); // close IIFE
```

#### 12.4.2 Keeping global data private to all of a constructor 保持全局数据对整个构造函数私有

Some global data is relevant only for a constructor and the prototype methods. By wrapping an IIFE around both, you can hide it from public view. [Private Data in Properties with Reified Keys](http://speakingjs.com/es5/ch17.html#private_data_reified_keys) gave an example: the constructor `StringBuilder` and its prototype methods use the constant `KEY_BUFFER`, which contains a property key. That constant is stored in the environment of an IIFE:

一些全局数据只对构造函数和原型方法有意义。用 IIFE 包裹这两者，你能将这些数据在公众面前隐藏。带有具体化键名的属性中的私有数据。

```javascript
var StringBuilder = function () { // open IIFE
    var KEY_BUFFER = '_StringBuilder_buffer_' + uuid.v4();

    function StringBuilder() {
        this[KEY_BUFFER] = [];
    }
    StringBuilder.prototype = {
        // Omitted: methods accessing this[KEY_BUFFER]
    };
    return StringBuilder;
}(); // close IIFE
```

Note that if you are using a module system (see [Chapter 31](http://speakingjs.com/es5/ch31.html)), you can achieve the same effect with cleaner code by putting the constructor plus methods in a module.

#### 12.4.3 Attaching global data to a method

Sometimes you only need global data for a single method. You can keep it private by putting it in the environment of an IIFE that you wrap around the method. For example:

```javascript
var obj = {
    method: function () {  // open IIFE

        // method-private data
        var invocCount = 0;

        return function () {
            invocCount++;
            console.log('Invocation #'+invocCount);
            return 'result';
        };
    }()  // close IIFE
};
```

Here is the interaction:

```javascript
> obj.method()
Invocation #1
'result'
> obj.method()
Invocation #2
'result'
```