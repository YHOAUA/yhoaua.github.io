---
title: C# 委托和事件
published: 2024-10-08
description: ''
image: ''
tags: [C Sharp]
category: '编程'
draft: false 
---
## 委托
委托在 C# 中就像一个可以存储和调用方法的“指针”或“变量”。你可以把它想象成一个保存电话号码的联系人列表，只不过这个列表存的是方法，而不是电话号码。你可以通过这个联系人列表去打电话（调用方法）。

### 基本概念

- **委托声明**：委托是一种引用类型，定义了可以引用的方法的签名（参数列表和返回类型）。
- **委托实例化**：你可以将任何符合该签名的方法分配给委托。
- **调用委托**：当你调用委托时，它会调用所引用的方法。

**示例**


```c#
// 定义一个委托类型，它可以指向任何返回 void 并且接受一个 int 参数的方法
using System;

namespace ConsoleApp
{
    public delegate void Operation(int num);
    public class Program
    {
        static void Square(int num)
        {
            Console.WriteLine(num * num);
        }
        static void Double(int num)
        {
            Console.WriteLine(num * 2);
        }
        static void Main(string[] args)
        {
            // 创建一个委托实例，并将它指向 Square 方法
            Operation operation = Square;
            operation(89);
            // 现在将委托指向 Double 方法
            operation = Double;
            operation(64);
        }
    }
}


```
在这个例子中：

- Operation 是一个委托类型，它就像是一个遥控器。
- 我们先让它控制 Square 方法，然后让它控制 Double 方法。
- 当你调用委托时，它会执行当前绑定的方法。

## 事件
事件是一种特殊的委托，用于让对象之间进行通信。它们就像是广播电台，广播一条消息（事件），所有在收听（订阅）的人（方法）都会收到这条消息并采取行动。

想象一下，一个门铃按钮（事件）可以连接到多个人的手机上。如果有人按了门铃，所有手机都会收到通知（事件触发）。那些订阅了通知的人（方法）会根据通知采取不同的行动，比如查看监控、开门等等。

```c#
public class Doorbell
{
    // 定义一个事件
    public event Action Ring;

    public void PressButton()
    {
        Console.WriteLine("Doorbell is pressed!");
        Ring?.Invoke(); // 触发事件
    }
}

public class Program
{
    static void Main()
    {
        Doorbell doorbell = new Doorbell();

        // 订阅事件，当门铃被按下时，执行这些操作
        doorbell.Ring += () => Console.WriteLine("Person 1: Checking the door.");
        doorbell.Ring += () => Console.WriteLine("Person 2: Turning on the camera.");

        doorbell.PressButton();
    }
}

```
在这个例子中：

- doorbell 是我们的门铃对象，Ring 是它的事件。
- 我们订阅了 Ring 事件，也就是告诉门铃，当它被按下时，执行一些操作。
- 当门铃被按下（事件触发），所有订阅者都会收到通知并执行相应的动作。

### 委托与事件的区别
- 委托更像是一个多用途的工具，你可以直接用它来存储和调用方法。
- 事件是对委托的进一步封装，用来确保方法只能在特定情况下被调用（如在触发事件时），并且通常用于更安全的对象间通信。

### 使用场景
- 委托通常用于回调机制，比如按钮点击之后执行的逻辑。
- 事件则更多地用于对象之间的通知机制，例如音乐播放器播放状态的变化通知到 UI 界面。
