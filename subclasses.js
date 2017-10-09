

function Sub(prop1, prop2, prop3, prop4) {
    Sub._super.constructor.call(this, prop1, prop2);
    this.prop3 = prop3;
    this.prop4 = prop4;
}

Sub.prototype.methodB = function(x, y) {
    var superResult = Sub._super.methodB.call(this, x, y);
    return this.prop3 + ' ' + superResult;
}


function copyOwnPropertiesFrom(target, source) {
	// 1. Get an array with the keys of all own properties of `source`.
	Object.getOwnPropertyNames(source)
	.forEach(function(propKey){   // 2. Iterate over those keys.

		// 3. Retrieve a property descriptor.
		var desc = Object.getOwnPropertyDescriptor(source, propKey);

		// 4. Use that property descriptor to create an own property in `target`.
		Object.defineProperty(target, propKey, desc);
	})
}

function subclasses(SubC, SuperC) {
    var subProto = Object.create(SuperC.prototype);
    // save `constructor` and, possibly other methods
    copyOwnPropertiesFrom(subProto, SubC.prototype);

    SubC.prototype = subProto;

    SubC._super = SuperC.prototype;
}

function Person(name) {
    this.name = name;
}

// 父类构造函数
Person.prototype.describe = function() {
    return 'Person called ' + this.name;
}

//  创建一个继承Person 的子类构造函数 Employee
// 方法一：手动创建
function Employee(name, title) {
    Person.call(this, name);

    this.title = title;
}

Employee.prototype = Object.create(Person.prototype);

Employee.prototype.constructor = Employee;

Employee.prototype.describe = function() {
    return Person.prototype.describe.call(this) + ' (' + this.title + ')';
};
// ---- 手动创建到此为止

var jane = new Employee('Jane', 'CTO');

jane.describe();
// Person called Jane (CTO)

jane instanceof Employee
// true

jane instanceof Person
// true


// 方法二：使用 工具函数 subclasses()

function Employee(name, title) {
    Employee._super.constructor.call(this, name);
    this.title = title;
}

Employee.prototype.describe = function() {
    return Employee._super.describe.call(this) + ' (' + this.title + ')';
};

subclasses(Employee, Person);

