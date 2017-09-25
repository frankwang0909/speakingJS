## 2.Converting Any Value to an Object 将任意的值转换成对象

It’s not a frequent use case, but sometimes you need to convert an arbitrary value to an object. `Object()`, used as a function (not as a constructor), provides that service. It produces the following results:

虽然不是常见的使用场景，但有时你还是需要将任意的值转换成对象。`Object()` 作为函数（而不是构造函数）使用，可以提供这个服务。它的结果如下所示：

|         Value                 |        Result                       |
| ----------------------------- | ----------------------------------- |
|  (Called with no parameters)  |         {}                          |
|  undefined                    |         {}                          |
|  null                         |         {}                          |
|  A boolean bool               |  new Boolean(bool)                  |
|  A number num                 |  new Number(num)                    |
|  A string str                 |  new String(str)                    |
|  An object obj                |  obj (unchanged, nothing to convert)|

Here are some examples:

以下是一些例子：
```javascript
Object(null) instanceof Object
// true
Object(false) instanceof Boolean
// true
var obj = {};
Object(obj) === obj
// true
```

The following function checks whether value is an object:

下面的函数用于检测值是否为对象：
```javascript
function isObject(value) {
    return value === Object(value);
}
```

Note that the preceding function creates an object if value isn’t an object. You can implement the same function without doing that, via typeof (see “Pitfall: typeof null”
on page 93). 

注意这个函数的参数如果不是对象，将会创建一个对象。你可以通过 typeof（参见93页） 而实现相同功能的函数而不需要创建对象。

```javascript
// Pitfall: typeof null on page 93
function isObject(value) {
    return (value !== null && (typeof value === 'object'|| typeof value === 'function'));
}
// *Frank 注解*：Lodash.js中的检测值是否为对象的方法与上述方法基本一致。
function isObject(value) {
  const type = typeof value
  return value != null && (type == 'object' || type == 'function')
}
```

You can also invoke Object as a constructor, which produces the same results as calling it as a function:

将Object 作为构造函数调用，得到和作为函数调用时一样的结果：

```javascript
var obj = {};
new Object(obj) === obj
// true
new Object(123) instanceof Number
// true
```

Avoid the constructor; an empty object literal is almost always a better choice:

避免将`Object()`作为构造函数来使用，通常来说，空的对象字面量会是更好的选择。
```javascript
var obj = new Object(); // avoid
var obj = {}; // prefer
```
