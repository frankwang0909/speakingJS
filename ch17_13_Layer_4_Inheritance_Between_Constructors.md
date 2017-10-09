## 13. Layer 4: Inheritance Between Constructors 构造函数间的继承

In this section, we examine how constructors can be inherited from: given a constructor `Super`, how can we write a new constructor, `Sub`, that has all the features of `Super` plus some features of its own? Unfortunately, JavaScript does not have a built-in mechanism for performing this task. Hence, we’ll have to do some manual work.

在这一章节中，我们考察构造函数是如何被继承的：给定一个构造函数`Super`， 如何编写一个继承 `Super` 的所有特性并且有它自己的特性的新构造函数`Sub` ？ 很不幸地是， JS 没有内置的机制来实现这一任务。因此，我们不得不做些手动的工作。

Figure 17-5  illustrates the idea: the subconstructor `Sub` should have all of the properties of `Super` (both prototype properties and instance properties) in addition to its own. Thus, we have a rough idea of what `Sub` should look like, but don’t know how to get there. There are several things we need to figure out, which I’ll explain next:

图17-5 展示了这个想法：子构造函数`Sub` 应该拥有`Super` 的所有属性（包括原型属性和实例属性），以及它自己的属性。因此，我们大致知道`Sub` 是长什么样子，但是不知道如何实现。我们需要想清楚几件事情，我稍后将会解释：

- Inheriting instance properties.   继承实例属性
- Inheriting prototype properties.  继承原型属性
- Ensuring that `instanceof` works: if `sub` is an instance of `Sub`, we also want `sub instanceof Super` to be true.   确保 `instanceof` 正常工作： 如果`sub` 是`Sub` 的实例，我们同时也希望`sub insanceof Super` 也是`true` 。
- Overriding a method to adapt one of `Super`’s methods in `Sub`. 在 `Sub` 中覆盖方法，改写`Super` 中的一个方法。
- Making supercalls: if we have overridden one of `Super`’s methods, we may need to call the original method from `Sub`.  调用父构造函数的方法：如果我们覆盖了`Super` 的方法，我们也许需要在`Sub` 中 调用原始的方法。

![Sub should inherit from Super: it should have all of Super’s prototype properties and all of Super’s instance properties in addition to its own. Note that methodB overrides Super’s methodB.](http://speakingjs.com/es5/images/spjs_2105.png)*Figure 17-5. Sub should inherit from Super: it should have all of Super’s prototype properties and all of Super’s instance properties in addition to its own. Note that methodB overrides Super’s methodB.*

### 13.1 Inheriting Instance Properties 继承实例属性

Instance properties are set up in the constructor itself, so inheriting the superconstructor’s instance properties involves calling that constructor:

实例属性在构造函数内创建，所以，继承父构造函数实例属性需要调用这个构造函数：

```javascript
function Sub(prop1, prop2, prop3, prop4) {
    Super.call(this, prop1, prop2);  // (1)
    this.prop3 = prop3;  // (2)
    this.prop4 = prop4;  // (3)
}
```

When `Sub` is invoked via `new`, its implicit parameter `this` refers to a fresh instance. It first passes that instance on to `Super` (1), which adds its instance properties. Afterward, `Sub` sets up its own instance properties (2,3). The trick is not to invoke `Super` via `new`, because that would create a fresh superinstance. Instead, we call `Super` as a function and hand in the current (sub)instance as the value of `this`.

通过 `new`  调用 `Sub` 时，它的隐含参数 `this` 指向一个新的实例。它首先将这个实例传递给 `Super` 。  `Super` 添加实例属性（`prop1`, `prop2` ）。之后，`Sub` 创建它自己的实例属性（`prop3`, `prop4`）。 这个技巧不是通过 `new` 来调用  `Super` ，因为这样会创建一个全新的父实例。相反地，我们把 `Super` 当做函数来调用，并把当前的（子）实例作为 `this`  的值传入。

### 13.2 Inheriting Prototype Properties 继承原型属性

Shared properties such as methods are kept in the instance prototype. Thus, we need to find a way for `Sub.prototype` to inherit all of `Super.prototype`’s properties. The solution is to give `Sub.prototype` the prototype `Super.prototype`.

共享的属性，比如方法，保存在实例的原型上。因此，我们需要为`Sub.prototype` 找到一种方式来继承 `Super.prototype` 所有的属性。解决办法是设置 `Sub.prototype` 的prototype 为 `Super.prototype` 。



*CONFUSED BY THE TWO KINDS OF PROTOTYPES?*  *被两种原型搞糊涂了*？

*Yes, JavaScript terminology is confusing here. If you feel lost, consult [Terminology: The Two Prototypes](http://speakingjs.com/es5/ch17.html#two_prototypes), which explains how they differ.*

*JS 术语中的 prototype 有些令人迷惑。如果你分不清楚，请翻阅 [术语：两种原型](http://speakingjs.com/es5/ch17.html#two_prototypes) ，那里解释了它们的区别。*



This is the code that achieves that:

以下代码实现这个目的：

```javascript
Sub.prototype = Object.create(Super.prototype);
Sub.prototype.constructor = Sub;
Sub.prototype.methodB = ...;
Sub.prototype.methodC = ...;
```

`Object.create()` produces a fresh object whose prototype is `Super.prototype`. Afterward, we add `Sub`’s methods. As explained in [The constructor Property of Instances](http://speakingjs.com/es5/ch17.html#constructor_property), we also need to set up the property `constructor`, because we have replaced the original instance prototype where it had the correct value.

`Object.create()` 生成一个全新的对象，它的原型为`Super.prototype` 。之后，我们添加`Sub` 的方法。正如[ 实例的 constructor 属性](http://speakingjs.com/es5/ch17.html#constructor_property) 所解释的那样，我们 需要设置属性`constructor` ， 因为我们替换了原来的实例原型。而原来的实例原型 才有正确的属性`constructor` 的值。

Figure 17-6 shows how `Sub` and `Super` are related now. `Sub`’s structure does resemble what I have sketched in Figure 17-5. The diagram does not show the instance properties, which are set up by the function call mentioned in the diagram.

图17-6 显示了`Sub` 和 `Super` 是如何相关联的。`Sub` 的结构和我在 图17-5 中绘制的类似。这个图表没有显示出实例属性，这些实例属性是在图中提及的调用函数时才创建的。

![The constructor Sub inherits the constructor Super by calling it and by making Sub.prototype a prototypee of Super.prototype.](http://speakingjs.com/es5/images/spjs_2106.png)*Figure 17-6. The constructor Sub inherits the constructor Super by calling it and by making Sub.prototype a prototypee of Super.prototype.*

### 13.3 Ensuring That instanceof Works 确保 `instanceof` 有效

“Ensuring that `instanceof` works” means that every instance of `Sub` must also be an instance of `Super`. Figure 17-7 shows what the prototype chain of `subInstance`, an instance of `Sub`, looks like: its first prototype is `Sub.prototype`, and its second prototype is `Super.prototype`.

“确保 `instanceof` 有效” 意味着`Sub` 的每个实例必须同时也是`Super` 的实例。图17-7 显示了`Sub` 的实例`SubInstance` 的原型链：它的第一个原型是`Sub.prototype` ， 第二个原型是`Super.prototype` 。



![subInstance has been created by the constructor Sub. It has the two prototypes Sub.prototype and Super.prototype.](http://speakingjs.com/es5/images/spjs_2107.png)                             

*Figure 17-7. subInstance has been created by the constructor Sub. It has the two prototypes Sub.prototype and Super.prototype.*

Let’s start with an easier question: is `subInstance` an instance of `Sub`? Yes, it is, because the following two assertions are equivalent (the latter can be considered the definition of the former):

让我们以一个更简单的问题开始：`subInstance` 是 `Sub` 的实例吗？ 是的。因为以下两个断言是等价的（后一个可以认为是前一个的解释）：

```javascript
subInstance instanceof Sub
Sub.prototype.isPrototypeOf(subInstance)
```

As mentioned before, `Sub.prototype` is one of the prototypes of `subInstance`, so both assertions are true. Similarly, `subInstance` is also an instance of `Super`, because the following two assertions hold:

如上所述，`Sub.prototype` 是`subInstance` 的原型之一，所以两个断言都为真。类似地，`subInstance` 也是`Super` 的实例，因为以下两个断言成立：

```javascript
subInstance instanceof Super
Super.prototype.isPrototypeOf(subInstance)
```

### 13.4 Overriding a Method 覆盖（重写）方法

We override a method in `Super.prototype` by adding a method with the same name to `Sub.prototype`. `methodB` is an example and in Figure 17-7, we can see why it works: the search for `methodB` begins in `subInstance` and finds `Sub.prototype.methodB` before `Super.prototype.methodB`.

我们通过添加一个同名的方法到`Sub.prototype`， 覆盖了 `Super.prototype` 的方法。`methodB` 是一个例子。在图17-7 中，我们可以看出为什么这样有效：从`subInstance` 开始查找 `methodB` ，`Sub.prototype.methodB`  比`Super.prototype.methodB` 先被找到。

### 13.5 Making a Supercall 调用父类的方法

To understand supercalls, you need to know the term *home object*. The home object of a method is the object that owns the property whose value is the method. For example, the home object of `Sub.prototype.methodB` is `Sub.prototype`. Supercalling a method `foo` involves three steps:

理解调用父类方法，你需要知道术语`home object` 。一个方法的`home object` 是指自身拥有该方法的对象。例如，`Sub.prototype.methodB` 的 `home object` 是 `Sub.prototype` 。调用父类的方法`foo` 包含以下三个步骤：

1. Start your search “after” (in the prototype of) the home object of the current method.

   在当前方法的 home object 之后（在它的原型中）开始搜索。

2. Look for a method whose name is `foo`.

   查找名为`foo` 的方法。

3. Invoke that method with the current `this`. The rationale is that the supermethod must work with the same instance as the current method; it must be able to access the same instance properties.

   用当前的`this` 调用该方法。原因是父类方法必须作用于当前方法的同一个实例，它必须能够访问到同一个实例的属性。

Therefore, the code of the submethod looks as follows. It supercalls itself, it calls the method it has overridden:

因此，子方法的代码如下所示。它自己调用父类的方法，调用被它覆盖的方法：

```javascript
Sub.prototype.methodB = function (x, y) {
    var superResult = Super.prototype.methodB.call(this, x, y); // (1)
    return this.prop3 + ' ' + superResult;
}
```

One way of reading the supercall at (1) is as follows: refer to the supermethod directly and call it with the current `this`. However, if we split it into three parts, we find the aforementioned steps:

在(1) 所示的调用父类方法的一种解读方式是：直接指向父类方法，用当前的`this` 调用该方法。然而，如果我们将它分解为三个部分，我们可以找到以下步骤：

1. `Super.prototype`: Start your search in `Super.prototype`, the prototype of `Sub.prototype` (the home object of the current method `Sub.prototype.methodB`).

   `Super.prototype` : 从`Sub.prototype` （当前方法`Sub.prototype` 所在的对象的 ）的原型`Super.prototype` 开始搜索，

2. `methodB`: Look for a method with the name `methodB`.

   `methodB`: 查找名为 `methodB` 的方法。

3. `call(this, ...)`: Call the method found in the previous step, and maintain the current `this`.

   `call(this, ...)` : 调用在前一个步骤中找到的方法，保持当前的`this` 。

### 13.6 Avoiding Hardcoding the Name of the Superconstructor 避免硬编码 父类构造函数的名称

Until now, we have always referred to supermethods and superconstructors by mentioning the superconstructor name. This kind of hardcoding makes your code less flexible. You can avoid it by assigning the superprototype to a property of `Sub`:

直到现在，我们一直通过提及父类构造函数名称的方式来谈论父类方法和父类构造函数。这种硬编码让你的代码不够灵活。你可以通过把父类的原型赋值给 `Sub` 的属性来避免这种硬编码。

```javascript
Sub._super = Super.prototype;
```

Then calling the superconstructor and a supermethod looks as follows:

然后，如下所示地调用父类构造函数和父类方法：

```javascript
function Sub(prop1, prop2, prop3, prop4) {
    Sub._super.constructor.call(this, prop1, prop2);
    this.prop3 = prop3;
    this.prop4 = prop4;
}
Sub.prototype.methodB = function (x, y) {
    var superResult = Sub._super.methodB.call(this, x, y);
    return this.prop3 + ' ' + superResult;
}
```

Setting up `Sub._super` is usually handled by a utility function that also connects the subprototype to the superprototype. For example:

 通常由一个工具函数来设置`Sub._super` 以及连接子类原型和父类原型。比如：

```javascript
function subclasses(SubC, SuperC) {
    var subProto = Object.create(SuperC.prototype);
    // Save `constructor` and, possibly, other methods
    copyOwnPropertiesFrom(subProto, SubC.prototype);
    SubC.prototype = subProto;
    SubC._super = SuperC.prototype;
};
```

This code uses the helper function `copyOwnPropertiesFrom()`, which is shown and explained in [Copying an Object](http://speakingjs.com/es5/ch17.html#code_copyOwnPropertiesFrom).

以上代码用了在 [拷贝对象](http://speakingjs.com/es5/ch17.html#code_copyOwnPropertiesFrom) 章节中出现的帮助函数`copyOwnPropertiesFrom()` 。

​                                                          *TIP* *提示*

*Read “subclasses” as a verb: `SubC` **subclasses** `SuperC`. Such a utility function can take some of the pain out of creating a subconstructor: there are fewer things to do manually, and the name of the superconstructor is never mentioned redundantly. The following example demonstrates how it simplifies code.*

*把"subclasses"理解为一个动词*：`SubC` 子类化`SuperC` 。这个工具函数可以减少创建子类构造函数的痛苦：需要手动做的事情更少了，父类构造函数的名称没有重复提及。以下例子演示了它是如何简化代码的：



### 13.7 Example: Constructor Inheritance in Use 例子：实用的构造函数继承

As a concrete example, let’s assume that the constructor `Person` already exists:

作为一个实际的例子，让我们假设构造函数`Person` 已经存在：

```javascript
function Person(name) {
    this.name = name;
}
Person.prototype.describe = function () {
    return 'Person called '+this.name;
};
```

We now want to create the constructor `Employee` as a subconstructor of `Person`. We do so manually, which looks like this:

现在，我们想要创建一个`Person` 的子类构造函数`Employee`。 我们手动实现的话，代码像这样：

```javascript
function Employee(name, title) {
    Person.call(this, name);
    this.title = title;
}
Employee.prototype = Object.create(Person.prototype);
Employee.prototype.constructor = Employee;
Employee.prototype.describe = function () {
    return Person.prototype.describe.call(this)+' ('+this.title+')';
};
```

Here is the interaction:

结果如下所示：

```javascript
> var jane = new Employee('Jane', 'CTO');
> jane.describe()
Person called Jane (CTO)
> jane instanceof Employee
true
> jane instanceof Person
true
```

The utility function `subclasses()` from the previous section makes the code of `Employee` slightly simpler and avoids hardcoding the superconstructor `Person`:

前一小节的工具函数`subclasses()` 让`Employee` 代码稍微简洁些，避免硬编码父类构造函数`Person`:

```javascript
function Employee(name, title) {
    Employee._super.constructor.call(this, name);
    this.title = title;
}
Employee.prototype.describe = function () {
    return Employee._super.describe.call(this)+' ('+this.title+')';
};
subclasses(Employee, Person);
```

### 13.8 Example: The Inheritance Hierarchy of Built-in Constructors 例子：内置构造函数的继承体系

Built-in constructors use the same subclassing approach described in this section. For example, `Array` is a subconstructor of `Object`. Therefore, the prototype chain of an instance of `Array` looks like this:

内置的构造函数使用相同的子类化方法。例如， `Array` 是`Object` 的子类构造函数。因此，`Array` 的实例的原型链看起来是这样的：

```javascript
> var p = Object.getPrototypeOf

> p([]) === Array.prototype
true
> p(p([])) === Object.prototype
true
> p(p(p([]))) === null
true
```

### 13.9 Antipattern: The Prototype Is an Instance of the Superconstructor 反例：原型是父类构造函数的实例

Before ECMAScript 5 and `Object.create()`, an often-used solution was to create the subprototype by invoking the superconstructor:

在 ECMAScript 5 和 `Object.create()` 之前， 常用的解决方案是通过调用父类构造函数来创建子类原型

```javascript
Sub.prototype = new Super();  // Don’t do this
```

This is not recommended under ECMAScript 5. The prototype will have all of `Super`’s instance properties, which it has no use for. Therefore, it is better to use the aforementioned pattern (involving `Object.create()`).

在 ECMAScript 5 时代，不推荐使用这种方式了。这个原型将会有`Super` 实例的所有属性，这些属性没用。因此，最好是使用前面提到的方式（包含 `Object.create()` ）。