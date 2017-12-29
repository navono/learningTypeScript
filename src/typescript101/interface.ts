// TypeScript的一个核心原则之一就是它的类型检查主要关注对象实例（values）的外特性（shape）。
// 有时这称为 “duck typing” 或者 “structural subtyping”
// interface就充当了命名这些类型的角色


// ver: 0
function printLabel(labelledObj: { label: string }) {
  console.log(labelledObj.label);
}

// ver: 1
// 使用 interface 描述上述的约束
interface LabelledValue {
  // 属性声明的前后顺序无影响。只要求属性名与类型
  label: string;
}

function printLabel1(labelledObj: LabelledValue) {
  console.log(labelledObj.label);
}

// test code
let myObj = { size: 10, label: 'Size 10 Object' };
printLabel(myObj);
printLabel1(myObj);



// 可选属性
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSqurea(config: SquareConfig): {color: string; area: number} {
  let newSquare = { color: 'White', area: 100 };
  if (config.color) {
    newSquare.color = config.color;
  }

  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

// test code
let mySquare = createSqurea({color: 'black'});
console.log(mySquare);


// 只读属性
// 还有一个 Array<T> 的只读版本：ReadonlyArray<T>
// readonly vs const 
// readonly 用于属性，而 const 用于变量

interface Point {
  readonly x: number;
  readonly y: number;
}

let p1: Point = { x: 10, y: 20 };
// p1.x = 5;  // error


// 额外的属性检查
// 对于 createSquare 这个实例，可能也会出现手误，如：
// let mySquare1 = createSqurea({ colour: 'red', width: 100 });

// 而 TypeScript 会对上述的情况作为错误处理。但是下面的却不会做错误检查
let squareOptions = { colour: 'red', width: 100 };
let mySquare2 = createSqurea(squareOptions);

// 如果真的要让 SquareConfig 接收额外的属性，可将 SquareConfig 修改成以下格式：
interface SquareConfig2 {
  color?: string;
  width?: number;
  [propName: string]: any;
}


// 函数类型
interface SearchFunc {
  (source: string, subString: string): boolean;
}

// test code
let mySearch: SearchFunc;

// 函数的名称不要求精确匹配
mySearch = (source: string, subString: string): boolean => {
  let result = source.search(subString);
  return result > -1;
}

// 同时也可以省略参数的类型，TS会通过上下文类型自动推导参数类型和返回值类型
let mySearch2: SearchFunc;
mySearch2 = (src, sub) => {
  let result = src.search(sub);
  return result > -1;
}


// 可索引类型（Indexable Types）
// 简单理解为属性的集合

interface StringArray {
  // 索引类型是 number，值类型是 string。
  [index: number]: string;
}

let myArray: StringArray;
myArray = ['Qixing', 'Ping'];

console.log(myArray[0]);

// 索引支持两种类型：number、string。
// 但是有一个约束：
//  从数值型（number）索引返回的类型必须是从字符串（string）索引返回的类型的子类型

class Animal {
  name: string;
}

class Dog extends Animal {
  breed: string;
}

interface NotOkay {
  // [x: number]: Animal;   // error
  [x: string]: Dog;
}

// 所以字符串索引可以用来强制要求其他的属性的返回值要匹配其返回值类型
interface NumberDictionary {
  [index: string]: number;
  length: number;
  // name: string;    // error
}

// 最后可以将索引签名设置为 readonly 用来防止写入
interface ReadonlyStringArray {
  readonly [index: number]: string;
}

let myArray1: ReadonlyStringArray = ['Alice', 'Q'];
// myArray1[2] = 'Moby';    // error



// 类类型（class types）
// 简单理解就是接口实现

interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}

class Clock implements ClockInterface {
  currentTime: Date;
  constructor(h: number, m: number) { }

  setTime(d: Date): void {
    this.currentTime = d;
  }
}


// 类的静态行为与动态实例
// 如果一个类实现了一个接口，只有类的动态实例部分才会被检查
// 而因为构造函数在静态部分，所以不会进行检查

interface ClockConstructor {
  // 构造函数签名
  new (hour: number, minute: number): void;
}

// error
// class Clock1 implements ClockConstructor {
//   currentTime: Date;
//   constructor(h: number, m: number) { }
// }

interface ClockConstructor2 {
  new (hour: number, minute: number): ClockInterface2;
}
interface ClockInterface2 {
  tick(): void;
}

function createClock(ctor: ClockConstructor2, hour: number, minute: number): ClockInterface2 {
  return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface2 {
  constructor(h: number, m: number) { }
  tick() {
      console.log("beep beep");
  }
}
class AnalogClock implements ClockInterface2 {
  constructor(h: number, m: number) { }
  tick() {
      console.log("tick tock");
  }
}

let digital = createClock(DigitalClock, 12, 17);
digital.tick();
let analog = createClock(AnalogClock, 7, 32);
analog.tick();



// 接口的继承
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

let square = <Square>{}
square.color = 'blue';
square.sideLength = 10;



// 混合类型（hybrid types）
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  let counter = <Counter> function(start: number) {};
  counter.interval = 123;
  counter.reset = function () { }

  return counter;
}


// 接口继承类
// 接口可以继承类的所有成员，同时此接口也只能被该类或者该类的子类实现。
class Control {
  private state: any;
}

interface SelectableControl extends Control {
  select(): void;
}

class Button extends Control implements SelectableControl {
  select() {}
}

class TextBox extends Control {

}

// error
// class Image implements SelectableControl {
//   select() {}
// }
