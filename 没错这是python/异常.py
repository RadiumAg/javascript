from warnings import filterwarnings, warn


def raise语句():
    raise Exception


def 不用提供参数():
    class MuffedCalculator:
        muffled = False

        def calc(self, expr):
            try:
                return eval(expr)

            except ZeroDivisionError:
                if self.muffled:
                    print("Division by zero is illegal")
                else:
                    raise

    calculator = MuffedCalculator()
    calculator.calc("10 / 2")


不用提供参数()


def 不那么异常的情况():
    filterwarnings("always")  # 把所有警告变成报错
    warn("This function is really old...", DeprecationWarning)  #
    filterwarnings("ignore", category=DeprecationWarning)
    warn("Another deprecation warning.", DeprecationWarning)
    warn("Somthing else.", UserWarning)


不那么异常的情况()
