---
title: C# 委托
published: 2024-05-01
description: ''
image: ''
tags: [C#]
category: '编程'
draft: false 
---

在 C# 中，**委托**（Delegate）是一种存储函数引用的类型。一个委托包含其可以引用的函数签名（返回类型和参数列表），它定义了方法的签名，可以用来引用具有相同参数和返回类型的方法。你可以把委托看作是方法的指针或者引用，它允许你将方法作为参数进行传递，在运行之前只要有这个变量即可，而不需要知道调用的是哪一个函数的引用。

### 基本概念

- **委托声明**：委托是一种引用类型，定义了可以引用的方法的签名（参数列表和返回类型）。
- **委托实例化**：你可以将任何符合该签名的方法分配给委托。
- **调用委托**：当你调用委托时，它会调用所引用的方法。

```c#
using System;

namespace DelegateExample
{
    // 定义一个委托类型，它可以引用任何返回类型为 void、参数为 int 的方法
    delegate void MyDelegate(int number);

    class Program
    {
        static void Main(string[] args)
        {
            // 创建委托实例，指向 PrintNumber 方法
            MyDelegate del = PrintNumber;
            Console.WriteLine("调用 PrintNumber 方法：");
            del(100); // 调用委托，这会调用 PrintNumber 方法

            // 将委托指向另一个方法 PrintSquare
            del = PrintSquare;
            Console.WriteLine("调用 PrintSquare 方法：");
            del(100); // 再次调用委托，这会调用 PrintSquare 方法
        }

        static void PrintNumber(int num)
        {
            Console.WriteLine("Number: " + num);
        }

        static void PrintSquare(int num)
        {
            Console.WriteLine("Square: " + (num * num));
        }
    }
}
```

