## 12. Keeping Data Private 使数据保持私有的状态

JavaScript does not have dedicated means for managing private data for an object. This section will describe three techniques for working around that limitation:

JS 没有专门的方法为对象管理私有的数据。这一章节将会描述三种技术来绕过这个限制：

- Private data in the environment of a constructor

  构造函数环境中的私有数据

- Private data in properties with marked keys

  带有标记的键名的属性中的私有数据

- Private data in properties with reified keys

  带有具体化的键名属性中的私有数据

Additionally, I will explain how to keep global data private via IIFEs.

另外，我还将会介绍如何通过 IIFE 来保证全局变量为私有的。

### 12.1 Private Data in the Environment of a Constructor (Crockford Privacy Pattern) 在构造函数环境中的私有数据（Crockford 隐私模式）

When a constructor is invoked, two things are created: the constructor’s instance and an environment (see [Environments: Managing Variables](http://speakingjs.com/es5/ch16.html#environments)). The instance is to be initialized by the constructor. The environment holds the constructor’s parameters and local variables. Every function (which includes methods) created inside the constructor will retain a reference to the environment—the environment in which it was created. Thanks to that reference, it will always have access to the environment, even after the constructor is finished. This combination of function and environment is called a *closure* ([Closures: Functions Stay Connected to Their Birth Scopes](http://speakingjs.com/es5/ch16.html#closures)). The constructor’s environment is thus data storage that is independent of the instance and related to it only because the two are created at the same time. To properly connect them, we must have functions that live in both worlds. Using [Douglas Crockford’s terminology](http://www.crockford.com/javascript/private.html), an instance can have three kinds of values associated with it (see [Figure 17-4])

调用构造函数时，创建了两样东西：构造函数的`实例`和`环境`( 见 [环境: 管理变量 ](http://speakingjs.com/es5/ch16.html#environments)). `实例`由构造函数初始化。`环境` 保存着构造函数的参数和局部变量。每个在构造函数内创建的函数（包括方法）将会保留一份对于该环境（函数被创建的环境）的引用。由于有这个引用，函数总能够访问到这个环境，即使在构造函数的执行结束后。 函数和环境的组合被称为 `闭包` （[闭包: 函数与它的创建环境保持联系](http://speakingjs.com/es5/ch16.html#closures)）。构造函数的环境是数据的存储空间，它独立于实例，与实例的关联只是因为它们俩是同时创建的。正确地联结这个环境和实例，我们必须得有存在于这两个地方的函数。使用 [Douglas Crockford’s 术语 ](http://www.crockford.com/javascript/private.html)， 实例可以有三种与此有关[ 见图 17-4]：

- **Public properties 公共的属性**

  Values stored in properties (either in the instance or in its prototype) are publicly accessible.

  存储在属性（无论属性是实例的还是原型的）上的值是可以公开访问的。

- **Private values 私有的属性**

  Data and functions stored in the environment are *private*—only accessible to the constructor and to the functions it created.

  存储在环境中的数据和函数是私有的--- 只有构造函数以及构造函数创建的函数还能访问到它。

- **Privileged methods 有特权的方法**

  Private functions can access public properties, but public methods in the prototype can’t access private data. We thus need *privileged* methods—public methods in the instance. Privileged methods are public and can be called by everyone, but they also have access to private values, because they were created in the constructor.

  私有函数能够访问到公共的属性，但原型中的公共方法不能访问到私有属性。因此，我们需要有特权的方法--实例中的公共方法。有特权的方法是公开的，能够被所有人调用，但是他们也能访问到私有值，因为它们是在构造函数中创建的。

![When a constructor Constr is invoked, two data structures are created: an environment for parameters and local variables and an instance to be initialized.](http://speakingjs.com/es5/images/spjs_2104.png)
Figure 17-4. When a constructor `Constr` is invoked, two data structures are created: an environment for parameters and local variables and an instance to be initialized.

图 17-4  调用构造函数`Constr` 时，创建了两种数据结构：保存参数和局部变量的环境 、将要初始化的实例。



The following sections explain each kind of value in more detail.

接下来的章节更加详细地介绍每一种值。

#### 12.1.1 Public properties  公开属性

Remember that given a constructor `Constr`, there are two kinds of properties that are *public*, accessible to everyone. First, *prototype properties* are stored in `Constr.prototype` and shared by all instances. Prototype properties are usually methods:

记住，构造函数`Constr` 中有两种公开的、可以被任何人访问到的属性。首先，*原型属性*存储在`Constr.prototype` ，并被所有实例共享。原型属性通常是`方法`：

```javascript
Constr.prototype.publicMethod = ...;
```

Second, *instance properties* are unique to each instance. They are added in the constructor and usually hold data (not methods):

其次，*实例属性* 对于每个实例独有的。实例属性是在构造函数中被添加的，他们通常保存数据（而不是方法）

```javascript
function Constr(...) {
    this.publicData = ...;
    ...
}
```

#### 12.1.2 Private values  私有值

The constructor’s environment consists of the parameters and local variables. They are accessible only from inside the constructor and thus private to the instance:

构造函数的 环境包含参数和局部变量只能在构造函数内部才能访问到它们，因此对于实例来说是私有的：

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

私有数据对于外部访问是安全的，原型方法无法访问到它们。

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

#### 12.1.4 An example

The following is an implementation of a `StringBuilder`, using the Crockford privacy pattern:

```javascript
function StringBuilder() {
    var buffer = [];
    this.add = function (str) {
        buffer.push(str);
    };
    this.toString = function () {
        return buffer.join('');
    };
}
// Can’t put methods in the prototype!
```

Here is the interaction:

```javascript
> var sb = new StringBuilder();
> sb.add('Hello');
> sb.add(' world!');
> sb.toString()
’Hello world!’
```

#### 12.1.5 The pros and cons of the Crockford privacy pattern

Here are some points to consider when you are using the Crockford privacy pattern:

- It’s not very elegant

  Mediating access to private data via privileged methods introduces an unnecessary indirection. Privileged methods and private functions both destroy the separation of concerns between the constructor (setting up instance data) and the instance prototype (methods).

- It’s completely secure

  There is no way to access the environment’s data from outside, which makes this solution secure if you need that (e.g., for security-critical code). On the other hand, private data not being accessible to the outside can also be an inconvenience. Sometimes you want to unit-test private functionality. And some temporary quick fixes depend on the ability to access private data. This kind of quick fix cannot be predicted, so no matter how good your design is, the need can arise.

- It may be slower

  Accessing properties in the prototype chain is highly optimized in current JavaScript engines. Accessing values in the closure may be slower. But these things change constantly, so you’ll have to measure should this really matter for your code.

- It consumes more memory

  Keeping the environment around and putting privileged methods in instances costs memory. Again, be sure it really matters for your code and measure.

### 12.2 Private Data in Properties with Marked Keys

For most non-security-critical applications, privacy is more like a hint to clients of an API: “You don’t need to see this.” That’s the key benefit of encapsulation—hiding complexity. Even though more is going on under the hood, you only need to understand the public part of an API. The idea of a naming convention is to let clients know about privacy by marking the key of a property. A prefixed underscore is often used for this purpose.

Let’s rewrite the previous `StringBuilder` example so that the buffer is kept in a property `_buffer`, which is private, but by convention only:

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

- It offers a more natural coding style

  Being able to access private and public data in the same manner is more elegant than using environments for privacy.

- It pollutes the namespace of properties

  Properties with marked keys can be seen everywhere. The more people use IDEs, the more it will be a nuisance that they are shown alongside public properties, in places where they should be hidden. IDEs could, in theory, adapt by recognizing naming conventions and by hiding private properties where possible.

- Private properties can be accessed from “outside”

  That can be useful for unit tests and quick fixes. Additionally, subconstructors and helper functions (so-called “friend functions”) can profit from easier access to private data. The environment approach doesn’t offer this kind of flexibility; private data can be accessed only from within the constructor.

- It can lead to key clashes

  Keys of private properties can clash. This is already an issue for subconstructors, but it is even more problematic if you work with multiple inheritance (as enabled by some libraries). With the environment approach, there are never any clashes.

### 12.3 Private Data in Properties with Reified Keys

One problem with a naming convention for private properties is that keys might clash (e.g., a key from a constructor with a key from a subconstructor, or a key from a mixin with a key from a constructor). You can make such clashes less likely by using longer keys, that, for example, include the name of the constructor. Then, in the previous case, the private property `_buffer` would be called `_StringBuilder_buffer`. If such a key is too long for your taste, you have the option of *reifying it*, of storing it in a variable:

```javascript
var KEY_BUFFER = '_StringBuilder_buffer';
```

We now access the private data via `this[KEY_BUFFER]`:

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

Reified property keys enable you to use UUIDs (universally unique identifiers) in keys. For example, via Robert Kieffer’s [node-uuid](https://github.com/broofa/node-uuid):

```javascript
var KEY_BUFFER = '_StringBuilder_buffer_' + uuid.v4();
```

`KEY_BUFFER` has a different value each time the code runs. It may, for example, look like this:

```javascript
_StringBuilder_buffer_110ec58a-a0f2-4ac4-8393-c866d813b8d1
```

Long keys with UUIDs make key clashes virtually impossible.

### 12.4 Keeping Global Data Private via IIFEs

This subsection explains how to keep global data private to singleton objects, constructors, and methods, via IIFEs (see [Introducing a New Scope via an IIFE](http://speakingjs.com/es5/ch16.html#iife)). Those IIFEs create new environments (refer back to [Environments: Managing Variables](http://speakingjs.com/es5/ch16.html#environments)), which is where you put the private data.

#### 12.4.1 Attaching private global data to a singleton object

You don’t need a constructor to associate an object with private data in an environment. The following example shows how to use an IIFE for the same purpose, by wrapping it around a singleton object:

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

#### 12.4.2 Keeping global data private to all of a constructor

Some global data is relevant only for a constructor and the prototype methods. By wrapping an IIFE around both, you can hide it from public view. [Private Data in Properties with Reified Keys](http://speakingjs.com/es5/ch17.html#private_data_reified_keys) gave an example: the constructor `StringBuilder` and its prototype methods use the constant `KEY_BUFFER`, which contains a property key. That constant is stored in the environment of an IIFE:

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