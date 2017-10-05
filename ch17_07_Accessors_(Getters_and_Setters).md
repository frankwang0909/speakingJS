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

