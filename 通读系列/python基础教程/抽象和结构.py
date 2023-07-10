def combine(parameter):
    print(parameter + globals().get("parameter"))


parameter = "berry"
combine("Shrub")


x = 1


def change_global():
    global x
    x = x + 1


change_global()


def 作用域():
    x = 1
    scope = vars()  # 使用vars返回作用域
    print(scope)


作用域()


def foo():
    def bar():
        print("Hello, world!")

    bar()
