## 6. Best Practices: Iterating over Own Properties 最佳实践：遍历自身属性

To iterate over property keys:

遍历所有属性的键名：

- Combine `for-in` with `hasOwnProperty()`, in the manner described in [for-in](http://speakingjs.com/es5/ch13.html#for-in). This works even on older JavaScript engines. For example:

  组合使用`for-in` 和 `hasOwnProperty()` ，在 [for-in](http://speakingjs.com/es5/ch13.html#for-in) 一节描述过这种方式。这种方式在更老的 JS 引擎中也有效。例如：

  ```javascript
  for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
          console.log(key);
      }
  }
  ```

- Combine `Object.keys()` or `Object.getOwnPropertyNames()` with `forEach()`array iteration:

  组合使用`Object.keys()` 或 `Object.getOwnPropertyNames()` 与 `forEach()`  数组遍历：

  ```javascript
  var obj = { first: 'John', last: 'Doe' };
  // Visit non-inherited enumerable keys
  Object.keys(obj).forEach(function (key) {
      console.log(key);
  });
  ```

To iterate over property values or over (key, value) pairs: 

遍历属性的值或者键值对:

- Iterate over the keys, and use each key to retrieve the corresponding value. Other languages make this simpler, but not JavaScript.

  遍历 键名，并使用键名来获取相应的值。在其他语言中，遍历属性的值或者键值对可以更简单，但 JS 中不行。

