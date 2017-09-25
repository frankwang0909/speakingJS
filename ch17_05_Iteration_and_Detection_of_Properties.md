## 5. Iteration and Detection of Properties 遍历和检测属性

Operations for iterating over and detecting properties are influenced by:

遍历和检测属性的操作跟以下内容相关：

- **Inheritance (own properties versus inherited properties) 继承（自身的属性 vs 继承的属性**

  An own property of an object is stored directly in that object. An inherited property is stored in one of its prototypes. 

  对象自身的属性直接存储在对象上。继承的属性存储在它的（原型链上的某个）原型上。

- **Enumerability (enumerable properties versus nonenumerable properties) 可枚举性（可枚举属性 vs 不可枚举属性）**

  The enumerability of a property is an *attribute* (see [Property Attributes and Property Descriptors](http://speakingjs.com/es5/ch17.html#property_attributes)), a flag that can be `true` or `false`. Enumerability rarely matters and can normally be ignored (see [Enumerability: Best Practices](http://speakingjs.com/es5/ch17.html#enumerability_best_practices)).   

   属性的可枚举性是一个 属性（attribute），它是一个值为 `true` 或 `false` 标志。可枚举性很少有什么影响，基本可以忽略不计。

You can list own property keys, list all enumerable property keys, and check whether a property exists. The following subsections show how.

你可以列举出对象自身的属性键名，列举出所有可枚举属性的键名，并且可以检查是否存在某个属性。

### 5.1 Listing Own Property Keys 列举自身属性的键名

You can either list all own property keys, or only enumerable ones:

你可以列举出所有自身属性的键名或只列举出自身的可枚举属性的键名：

- `Object.getOwnPropertyNames(obj)` returns the keys of all own properties of `obj`.

  `Object.getOwnPropertyNames(obj)` 返回对象`obj` 都是所有自身的属性。

- `Object.keys(obj)` returns the keys of all enumerable own properties of `obj`.

  `Object.keys(obj)` 返回对象`obj` 所有自身的可枚举的属性。

Note that properties are normally enumerable (see [Enumerability: Best Practices](http://speakingjs.com/es5/ch17.html#enumerability_best_practices)), so you can use `Object.keys()`, especially for objects that you have created.

注意：属性通常都是可枚举的，所以你可以使用`Object.keys()`, 尤其是用于你自己创建的对象。

### 5.2 Listing All Property Keys 列举所有属性的键名

If you want to list all properties (both own and inherited ones) of an object, then you have two options.

如果你想要列举出一个对象的所有属性（包括自身的和继承的），你有两个选择。

Option 1 is to use the loop:

选择一是使用循环：

```javascript
for («variable» in «object»)
    «statement»
```

to iterate over the keys of all enumerable properties of `object`. See [for-in](http://speakingjs.com/es5/ch13.html#for-in) for a more thorough description.

来循环对象`object` 的所有可枚举属性的键名。更多详细描述，请查阅 [for-in](http://speakingjs.com/es5/ch13.html#for-in) 。

Option 2 is to implement a function yourself that iterates over all properties (not just enumerable ones). For example:

选择二是自己利用一个函数来遍历所有的属性（不仅仅是可枚举的）。例如：

```javascript
function getAllPropertyNames(obj) {
    var result = [];
    while (obj) {
        // Add the own property names of `obj` to `result`
        result = result.concat(Object.getOwnPropertyNames(obj));
        obj = Object.getPrototypeOf(obj);
    }
    return result;
}
```

### 5.3 Checking Whether a Property Exists 检查属性是否存在

You can check whether an object has a property, or whether a property exists directly inside an object:

 你可以检查一个对象是否有某个属性，或者检查某个属性是否对象自身的属性：

- `propKey in obj`

  Returns `true` if `obj` has a property whose key is `propKey`. Inherited properties are included in this test. 

  如果`obj` 有这个键名为`propKey` 的属性， 返回`true` 。继承的属性也包含在内。

- `Object.prototype.hasOwnProperty(propKey)`

  Returns `true` if the receiver (`this`) has an own (noninherited) property whose key is `propKey`.  如果接受者（receiver）自身有这个键名为`propKey` 的属性（而不是继承的），返回`true` 。

**WARNING 警告**

Avoid invoking `hasOwnProperty()` directly on an object, as it may be overridden (e.g., by an own property whose key is `hasOwnProperty`):

避免直接在对象上调用`hasOwnProperty()` ，因为它可能被同名的属性覆盖了。

```javascript
var obj = { hasOwnProperty: 1, foo: 2 };
obj.hasOwnProperty('foo')  // unsafe
// TypeError: Property 'hasOwnProperty' is not a function
```

Instead, it is better to call it generically (see [Generic Methods: Borrowing Methods from Prototypes](http://speakingjs.com/es5/ch17.html#generic_method)):

相反，更好的调用方式是：

```javascript
> Object.prototype.hasOwnProperty.call(obj, 'foo')  // safe
true
> ({}).hasOwnProperty.call(obj, 'foo')  // shorter
true
```


### 5.4 Examples 例子

The following examples are based on these definitions:

以下例子是基于这些定义的：

```javascript
var proto = Object.defineProperties({}, {
    protoEnumTrue: { value: 1, enumerable: true },
    protoEnumFalse: { value: 2, enumerable: false }
});
var obj = Object.create(proto, {
    objEnumTrue: { value: 1, enumerable: true },
    objEnumFalse: { value: 2, enumerable: false }
});
```

`Object.defineProperties()` is explained in [Getting and Defining Properties via Descriptors](http://speakingjs.com/es5/ch17.html#functions_for_property_descriptors),  but it should be fairly obvious how it works: `proto` has the own properties `protoEnumTrue` and `protoEnumFalse` and `obj` has the own properties `objEnumTrue` and `objEnumFalse` (and inherits all of `proto`’s properties).

`Object.defineProperties()` 在 [Getting and Defining Properties via Descriptors](http://speakingjs.com/es5/ch17.html#functions_for_property_descriptors) 有解释。它的工作原理很显而易见：对象 `proto` 有它自身的属性 `protoEnumTrue` 和 `protoEnumFalse`，对象 `obj` 有它自身的顺序 `objEnumTrue` 和 `objEnumFalse` (以及继承了 `proto` 的所有属性).

**NOTE  注意**

Note that objects (such as `proto` in the preceding example) normally have at least the prototype `Object.prototype` (where standard methods such as `toString()` and `hasOwnProperty()` are defined):

注意：对象（比如前一个例子中的`proto` ）通常至少有一个原型 `Object.prototype` , 定义了标准的方法，如 `toString()` 和 `hasOwnProperty()` 。

```javascript
> Object.getPrototypeOf({}) === Object.prototype
true
```

#### 5.4.1 The effects of enumerability 可枚举性的影响

Among property-related operations, enumberability only influences the `for-in` loop and `Object.keys()` (it also influences `JSON.stringify()`, see [JSON.stringify(value, replacer?, space?)](http://speakingjs.com/es5/ch22.html#JSON.stringify)).

在属性相关的操作中，可枚举性只影响 `for-in` 循环 和 `Object.keys()` （它同时也影响 `JSON.stringify()`  见 [JSON.stringify(value, replacer?, space?)](http://speakingjs.com/es5/ch22.html#JSON.stringify) ）.

The `for-in` loop iterates over the keys of all enumerable properties, including inherited ones (note that none of the nonenumerable properties of `Object.prototype` show up):

`for-in` 循环 遍历所有可枚举属性的键名，包括继承的属性（注意`Object.prototype` 的不可枚举属性俊不会出现）：

```javascript
> for (var x in obj) console.log(x);
objEnumTrue
protoEnumTrue
```

`Object.keys()` returns the keys of all own (noninherited) enumerable properties:

`Ojbect.keys()` 返回所有自身（非继承的）可枚举属性的键名：

```javascript
> Object.keys(obj)
[ 'objEnumTrue' ]
```

If you want the keys of all own properties, you need to use `Object.getOwnPropertyNames()`:

如果你想要自身所有属性的键名，你需要使用`Object.getOwnPropertyNames()` :

```javascript
> Object.getOwnPropertyNames(obj)
[ 'objEnumTrue', 'objEnumFalse' ]
```

#### 5.4.2 The effects of inheritance 继承的影响

Only the `for-in` loop (see the previous example) and the `in` operator consider inheritance:

只有`for-in` 循环（见上一个例子）和 `in` 运算符 需要考虑继承（的影响）：

```javascript
> 'toString' in obj
true
> obj.hasOwnProperty('toString')
false
> obj.hasOwnProperty('objEnumFalse')
true
```

#### 5.4.3 Computing the number of own properties of an object 计算对象自身属性的数量

Objects don’t have a method such as `length` or `size`, so you have to use the following workaround:

对象并没有类似于`length` 或 `size` 的方法，所以如果你不得不使用以下的变通方法：

```javascript
Object.keys(obj).length
```
