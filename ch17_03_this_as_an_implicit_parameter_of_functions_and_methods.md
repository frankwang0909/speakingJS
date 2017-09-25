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
